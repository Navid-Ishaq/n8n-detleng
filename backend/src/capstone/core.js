import crypto from 'node:crypto'

export const CAPSTONE_SCENARIOS = Object.freeze({
  A: { requestType: 'support_update', priority: 'normal', amount: 0, question: '', failureCount: 0 },
  B: { requestType: 'knowledge_question', priority: 'normal', amount: 0, question: 'Can a customer receive a refund after 45 days?', failureCount: 0 },
  C: { requestType: 'support_update', priority: 'normal', amount: 0, question: '', failureCount: 2 },
  D: { requestType: 'refund_request', priority: 'high', amount: 240, question: '', failureCount: 0 },
  E: { requestType: 'refund_request', priority: 'high', amount: 240, question: '', failureCount: 0 },
  F: { requestType: 'account_change', priority: 'high', amount: 0, question: '', failureCount: 0 },
})

export const KNOWLEDGE_CASES = Object.freeze({
  refund: { question: 'Can a customer receive a refund after 45 days?', expectedSource: 'KB-REFUND-001', title: 'Refund policy' },
  security: { question: 'Which account changes require human approval?', expectedSource: 'KB-SECURITY-001', title: 'Account security' },
  retry: { question: 'How many times may a 503 failure be retried?', expectedSource: 'KB-RETRY-001', title: 'Retry policy' },
  unsupported: { question: 'What is the office dress code?', expectedSource: null, title: 'Safe refusal' },
})

export function knowledgeCaseForQuestion(question = '') {
  const normalized = String(question).trim().toLowerCase()
  const entry = Object.entries(KNOWLEDGE_CASES).find(([, value]) => value.question.toLowerCase() === normalized)
  return entry ? { key: entry[0], ...entry[1] } : null
}

const REQUEST_TYPES = new Set(['support_update', 'knowledge_question', 'refund_request', 'account_change'])
const PRIORITIES = new Set(['normal', 'high'])

export function validateRunInput(value = {}) {
  const scenarioKey = typeof value.scenarioKey === 'string' && CAPSTONE_SCENARIOS[value.scenarioKey] ? value.scenarioKey : 'custom'
  const base = CAPSTONE_SCENARIOS[scenarioKey] ?? {}
  const requestType = value.requestType ?? base.requestType
  const priority = value.priority ?? base.priority ?? 'normal'
  const amount = Number(value.amount ?? base.amount ?? 0)
  const question = String(value.question ?? base.question ?? '').trim()
  const failureCount = Number(value.failureCount ?? base.failureCount ?? 0)
  if (!REQUEST_TYPES.has(requestType)) throw new Error('Choose a supported request type.')
  if (!PRIORITIES.has(priority)) throw new Error('Choose normal or high priority.')
  if (!Number.isFinite(amount) || amount < 0 || amount > 500) throw new Error('Amount must be between EUR 0 and EUR 500.')
  if (!Number.isInteger(failureCount) || failureCount < 0 || failureCount > 2) throw new Error('Failure mode must be zero, one or two failed attempts.')
  if (question.length > 300) throw new Error('Knowledge questions must be 300 characters or fewer.')
  if (requestType === 'knowledge_question' && !question) throw new Error('Choose or enter a knowledge question.')
  return { scenarioKey, requestType, priority, amount, question, failureCount }
}

export function deterministicRisk(input, aiProposal = {}) {
  const sensitive = input.requestType === 'refund_request' || input.requestType === 'account_change' || input.amount > 100
  const ambiguous = !['low', 'high'].includes(aiProposal.suggestedRisk)
  const aiEscalated = aiProposal.suggestedRisk === 'high'
  const approvalRequired = sensitive || ambiguous || aiEscalated
  return {
    aiSuggestion: aiProposal.suggestedRisk ?? 'ambiguous',
    ruleDecision: sensitive ? 'Sensitive financial/account action requires approval.' : ambiguous ? 'Ambiguous AI output fails closed.' : aiEscalated ? 'AI escalation is preserved; rules never downgrade it.' : 'No sensitive rule matched.',
    finalRisk: approvalRequired ? (ambiguous && !sensitive && !aiEscalated ? 'ambiguous' : 'high') : 'low',
    approvalRequired,
  }
}

export function parseClassification(raw) {
  if (!raw || typeof raw !== 'object') throw new Error('AI classification could not be parsed. No action was taken.')
  const classification = String(raw.classification ?? '')
  const intent = String(raw.intent ?? '')
  const suggestedAction = String(raw.suggestedAction ?? '')
  const suggestedRisk = String(raw.suggestedRisk ?? '')
  const needsKnowledge = raw.needsKnowledge
  if (!classification || !intent || !suggestedAction || !['low', 'high', 'ambiguous'].includes(suggestedRisk) || typeof needsKnowledge !== 'boolean') {
    throw new Error('AI classification could not be parsed. No action was taken.')
  }
  return { classification, intent, suggestedAction, suggestedRisk, needsKnowledge }
}

export function safeRunView(run, events = [], approval = null, actions = []) {
  return {
    id: run.id,
    lessonAttemptNumber: run.lesson_attempt_number,
    scenarioKey: run.scenario_key,
    requestType: run.request_type,
    input: run.input_summary,
    classification: run.classification,
    aiUsed: run.ai_used,
    ragUsed: run.rag_used,
    citations: run.citations ?? [],
    riskLevel: run.risk_level,
    approvalRequired: run.approval_required,
    approval: approval ? { status: approval.status, reason: approval.reason, requestedAt: approval.requested_at, decidedAt: approval.decided_at } : null,
    decision: run.decision,
    actionState: run.action_state,
    retryCount: run.retry_count,
    errorCode: run.error_code,
    status: run.status,
    startedAt: run.started_at,
    completedAt: run.completed_at,
    durationMs: run.duration_ms,
    events: events.map((event) => ({ sequence: event.sequence_number, type: event.event_type, actor: event.actor_type, outcome: event.outcome, message: event.message, details: event.details, at: event.created_at })),
    actions: actions.map((action) => ({ type: action.action_type, status: action.status, receipt: action.receipt, executedAt: action.executed_at })),
  }
}

export function makeReceipt(runId) {
  return `DEMO-${runId.slice(0, 8).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
}

export function verifyScenario(runView) {
  const actions = runView.actions?.filter((item) => item.status === 'executed') ?? []
  const events = runView.events ?? []
  const contracts = {
    A: runView.status === 'completed' && runView.riskLevel === 'low' && !runView.approvalRequired && actions.length === 1,
    B: verifyKnowledgeRun(runView).passed,
    C: ['completed', 'handled_failure'].includes(runView.status) && runView.retryCount >= Number(runView.input?.failureCount ?? 0) && events.some((event) => event.type === 'service_retry'),
    D: runView.status === 'pending_approval' && runView.approvalRequired && actions.length === 0,
    E: runView.status === 'completed' && runView.decision === 'approved' && actions.length === 1,
    F: runView.status === 'rejected' && runView.decision === 'rejected' && actions.length === 0,
  }
  return { passed: contracts[runView.scenarioKey] === true, scenarioKey: runView.scenarioKey, checks: contracts }
}

export function verifyKnowledgeRun(runView) {
  const knowledgeCase = knowledgeCaseForQuestion(runView.input?.question)
  if (!knowledgeCase) return { passed: false, caseKey: 'unknown', title: 'Unknown knowledge test', expectedSource: null }
  const events = runView.events ?? []
  const actions = runView.actions?.filter((item) => item.status === 'executed') ?? []
  if (knowledgeCase.key === 'unsupported') {
    const refusal = actions.length === 0
      && events.some((event) => (event.type === 'knowledge_retrieved' || event.type === 'knowledge_insufficient') && event.outcome === 'blocked')
    return { passed: runView.status === 'completed' && refusal, caseKey: knowledgeCase.key, title: knowledgeCase.title, expectedSource: null }
  }
  const grounded = events.some((event) => event.type === 'knowledge_retrieved' && event.outcome === 'passed')
  return { passed: runView.status === 'completed' && runView.ragUsed && grounded && runView.citations?.includes(knowledgeCase.expectedSource), caseKey: knowledgeCase.key, title: knowledgeCase.title, expectedSource: knowledgeCase.expectedSource }
}

