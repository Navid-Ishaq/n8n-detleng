import { deterministicRisk, makeReceipt, safeRunView, validateRunInput, verifyScenario } from './core.js'

const safeSummary = (input) => ({ requestType: input.requestType, priority: input.priority, amount: input.amount, question: input.question, failureCount: input.failureCount })

export function createCapstoneService({ repository, ai, tools, now = () => new Date() }) {
  async function event(runId, type, message, details = {}, actor = 'system', actorId = null, outcome = 'recorded') {
    return repository.addEvent(runId, { type, message, details, actor, actorId, outcome })
  }
  async function executeAction(run, actionType) {
    const receipt = makeReceipt(run.id)
    const actionId = await repository.claimAction(run.id, actionType, { requestType: run.request_type, amount: run.input_summary.amount })
    await event(run.id, 'action_claimed', 'Safe sandbox action claimed exactly once.', { actionType }, 'tool')
    const result = await tools.simulate_action({ actionType, receipt })
    await repository.finishAction(actionId, result.receipt, result.executedAt)
    await event(run.id, 'action_executed', 'Safe sandbox action executed.', { actionType, receipt: result.receipt }, 'tool', null, 'passed')
    return result
  }
  async function executeRun(run, input) {
    const started = now()
    try {
      await repository.updateRun(run.id, { status: 'processing' })
      await event(run.id, 'request_received', 'Authenticated request received.', { scenarioKey: input.scenarioKey }, 'learner', run.user_id)
      await event(run.id, 'input_validated', 'Input passed bounded server validation.', safeSummary(input), 'system', null, 'passed')
      const classification = await ai.classify(safeSummary(input))
      await event(run.id, 'ai_classified', 'AI proposed an intent, action and risk.', { classification }, 'ai', null, 'passed')
      let citations = []; let ragAnswer = null; let ragUsed = false
      if (input.requestType === 'knowledge_question' || classification.needsKnowledge) {
        const queryEmbedding = await ai.embed(input.question || `${input.requestType} policy`)
        const matches = await repository.matchKnowledge(queryEmbedding)
        const evidence = matches.map(({ source_id, title, content, similarity }) => ({ sourceId: source_id, title, content, similarity }))
        if (evidence.length) {
          ragAnswer = await ai.answer(input.question, evidence)
          citations = ragAnswer.sourceIds.filter((id) => evidence.some((item) => item.sourceId === id))
          ragUsed = true
          await event(run.id, 'knowledge_retrieved', 'Approved knowledge evidence retrieved.', { sources: citations, answer: ragAnswer.answer, grounded: ragAnswer.grounded }, 'tool', null, ragAnswer.grounded ? 'passed' : 'blocked')
        } else {
          await event(run.id, 'knowledge_insufficient', 'Knowledge retrieval found insufficient evidence. No grounded answer was generated.', {}, 'tool', null, 'blocked')
        }
      }
      const risk = deterministicRisk(input, classification)
      await event(run.id, 'risk_evaluated', 'Deterministic rules produced the final system decision.', risk, 'system', null, risk.approvalRequired ? 'blocked' : 'passed')
      run = await repository.updateRun(run.id, { classification: { ...classification, ragAnswer, risk }, ai_used: true, rag_used: ragUsed, citations, risk_level: risk.finalRisk, approval_required: risk.approvalRequired })

      if (input.failureCount > 0) {
        for (let attempt = 1; attempt <= input.failureCount + 1; attempt += 1) {
          const health = await tools.check_service_health({ attempt, failCount: input.failureCount })
          await event(run.id, health.ok ? 'service_recovered' : 'service_retry', health.ok ? `External service recovered on attempt ${attempt}.` : `External service returned 503. Retry ${attempt} of ${input.failureCount + 1} is starting.`, { attempt, status: health.status }, 'tool', null, health.ok ? 'passed' : 'failed')
          await repository.updateRun(run.id, { retry_count: health.ok ? attempt - 1 : attempt, error_code: health.ok ? null : 'UPSTREAM_503' })
        }
      }

      if (risk.approvalRequired) {
        await repository.createApproval(run.id, run.user_id, risk.ruleDecision)
        await repository.updateRun(run.id, { status: 'pending_approval', action_state: 'blocked' })
        await event(run.id, 'approval_requested', 'Sensitive action stopped and is waiting for a human decision.', { proposedAction: classification.suggestedAction }, 'system', null, 'waiting')
        return
      }
      await executeAction(run, classification.suggestedAction || 'record_support_note')
      const finished = now(); const duration = Math.max(0, finished.getTime() - started.getTime())
      await repository.updateRun(run.id, { status: 'completed', action_state: 'executed', completed_at: finished.toISOString(), duration_ms: duration })
      await event(run.id, 'run_completed', 'Run completed with stored audit and monitoring evidence.', { durationMs: duration }, 'system', null, 'passed')
    } catch (error) {
      const finished = now(); const message = error instanceof Error ? error.message : 'The run failed safely.'
      await repository.updateRun(run.id, { status: 'failed', action_state: 'blocked', error_code: 'CAPSTONE_EXECUTION_FAILED', completed_at: finished.toISOString(), duration_ms: Math.max(0, finished.getTime() - started.getTime()) })
      await event(run.id, 'run_failed', message.includes('AI classification') ? message : 'The run failed safely. No sensitive action was taken.', {}, 'system', null, 'failed')
    }
  }
  return {
    async seedKnowledge() {
      const chunks = await repository.knowledgeWithoutEmbeddings()
      for (const chunk of chunks) await repository.saveEmbedding(chunk.id, await ai.embed(chunk.content))
      return chunks.length
    },
    async start(userId, attempt, rawInput) {
      const input = validateRunInput(rawInput); const run = await repository.createRun(userId, attempt, input)
      void executeRun(run, input)
      return { runId: run.id, status: 'queued' }
    },
    async get(userId, runId) {
      const bundle = await repository.bundle(runId, userId); return bundle ? safeRunView(bundle.run, bundle.events, bundle.approval, bundle.actions) : null
    },
    async list(userId, attempt) {
      const rows = await repository.listAttemptRuns(userId, attempt)
      return Promise.all(rows.map(async (row) => this.get(userId, row.id)))
    },
    async decide(userId, runId, decision, reason) {
      const bundle = await repository.bundle(runId, userId)
      if (!bundle) return null
      if (bundle.run.status !== 'pending_approval') throw new Error('This run is not waiting for approval.')
      await repository.decide(runId, userId, decision, reason)
      await event(runId, `human_${decision}`, `Authenticated learner ${decision} the proposed action.`, { reason: reason ?? null }, 'learner', userId, decision)
      if (decision === 'rejected') {
        const finished = now(); await repository.updateRun(runId, { status: 'rejected', action_state: 'blocked', completed_at: finished.toISOString(), duration_ms: Math.max(0, finished.getTime() - new Date(bundle.run.started_at).getTime()) })
        await event(runId, 'run_rejected', 'Rejected action was not executed and can no longer run.', {}, 'system', null, 'blocked')
      } else {
        const refreshed = await repository.getRun(runId, userId)
        await executeAction(refreshed, refreshed.classification?.suggestedAction || 'demo_refund')
        const finished = now(); await repository.updateRun(runId, { status: 'completed', action_state: 'executed', completed_at: finished.toISOString(), duration_ms: Math.max(0, finished.getTime() - new Date(bundle.run.started_at).getTime()) })
        await event(runId, 'run_completed', 'Approved run completed with exactly one action receipt.', {}, 'system', null, 'passed')
      }
      return this.get(userId, runId)
    },
    async verify(userId, runId) { const view = await this.get(userId, runId); return view ? verifyScenario(view) : null },
    async monitoring(userId) { return repository.monitoring(userId) },
    _executeRun: executeRun,
  }
}
