function throwIf(error) { if (error) throw error }

export function createCapstoneRepository(supabase) {
  return {
    async createRun(userId, attempt, input) {
      const { data, error } = await supabase.from('capstone_runs').insert({ user_id: userId, lesson_attempt_number: attempt, scenario_key: input.scenarioKey, request_type: input.requestType, input_summary: input }).select('*').single()
      throwIf(error); return data
    },
    async getRun(runId, userId) {
      const { data, error } = await supabase.from('capstone_runs').select('*').eq('id', runId).eq('user_id', userId).maybeSingle()
      throwIf(error); return data
    },
    async updateRun(runId, patch) {
      const { data, error } = await supabase.from('capstone_runs').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', runId).select('*').single()
      throwIf(error); return data
    },
    async addEvent(runId, event) {
      const { data: latest, error: readError } = await supabase.from('capstone_events').select('sequence_number').eq('run_id', runId).order('sequence_number', { ascending: false }).limit(1)
      throwIf(readError)
      const sequence = (latest?.[0]?.sequence_number ?? 0) + 1
      const { data, error } = await supabase.from('capstone_events').insert({ run_id: runId, sequence_number: sequence, event_type: event.type, actor_type: event.actor ?? 'system', actor_id: event.actorId ?? null, outcome: event.outcome ?? 'recorded', message: event.message, details: event.details ?? {} }).select('*').single()
      throwIf(error); return data
    },
    async bundle(runId, userId) {
      const run = await this.getRun(runId, userId)
      if (!run) return null
      const [eventResult, approvalResult, actionResult] = await Promise.all([
        supabase.from('capstone_events').select('*').eq('run_id', runId).order('sequence_number'),
        supabase.from('capstone_approvals').select('*').eq('run_id', runId).maybeSingle(),
        supabase.from('capstone_actions').select('*').eq('run_id', runId),
      ])
      throwIf(eventResult.error); throwIf(approvalResult.error); throwIf(actionResult.error)
      return { run, events: eventResult.data ?? [], approval: approvalResult.data, actions: actionResult.data ?? [] }
    },
    async listAttemptRuns(userId, attempt) {
      const { data, error } = await supabase.from('capstone_runs').select('*').eq('user_id', userId).eq('lesson_attempt_number', attempt).order('created_at', { ascending: false })
      throwIf(error); return data ?? []
    },
    async createApproval(runId, userId, reason) {
      const { data, error } = await supabase.from('capstone_approvals').insert({ run_id: runId, user_id: userId, reason }).select('*').single()
      throwIf(error); return data
    },
    async decide(runId, userId, decision, reason) {
      const { data, error } = await supabase.rpc('decide_capstone_approval', { p_run_id: runId, p_user_id: userId, p_decision: decision, p_reason: reason ?? null })
      throwIf(error); return data
    },
    async claimAction(runId, actionType, payloadSummary) {
      const { data, error } = await supabase.rpc('claim_capstone_action', { p_run_id: runId, p_action_type: actionType, p_payload_summary: payloadSummary })
      throwIf(error); return data
    },
    async finishAction(actionId, receipt, executedAt) {
      const { data, error } = await supabase.from('capstone_actions').update({ status: 'executed', receipt, executed_at: executedAt }).eq('id', actionId).select('*').single()
      throwIf(error); return data
    },
    async knowledgeWithoutEmbeddings() {
      const { data, error } = await supabase.from('knowledge_chunks').select('id,content').is('embedding', null)
      throwIf(error); return data ?? []
    },
    async saveEmbedding(id, embedding) {
      const { error } = await supabase.from('knowledge_chunks').update({ embedding }).eq('id', id); throwIf(error)
    },
    async matchKnowledge(embedding) {
      const { data, error } = await supabase.rpc('match_capstone_knowledge', { query_embedding: embedding, match_threshold: 0.45, match_count: 4 })
      throwIf(error); return data ?? []
    },
    async monitoring(userId) {
      const { data, error } = await supabase.from('capstone_runs').select('status,duration_ms,retry_count,action_state,approval_required').eq('user_id', userId)
      throwIf(error)
      const rows = data ?? []; const completed = rows.filter((r) => r.status === 'completed')
      return { totalRuns: rows.length, successful: completed.length, pendingApprovals: rows.filter((r) => r.status === 'pending_approval').length, rejected: rows.filter((r) => r.status === 'rejected').length, handledFailures: rows.filter((r) => r.status === 'handled_failure' || r.retry_count > 0).length, averageDurationMs: completed.length ? Math.round(completed.reduce((sum, row) => sum + (row.duration_ms ?? 0), 0) / completed.length) : 0 }
    },
    async getReportDelivery(userId, attempt, reportType, scenarioKey) {
      let query = supabase.from('capstone_report_deliveries').select('*').eq('user_id', userId).eq('lesson_attempt_number', attempt).eq('report_type', reportType)
      query = scenarioKey ? query.eq('scenario_key', scenarioKey) : query.is('scenario_key', null)
      const { data, error } = await query.maybeSingle(); throwIf(error); return data
    },
    async claimReportDelivery({ userId, attempt, reportType, scenarioKey, runId, recipientEmail }) {
      const { data, error } = await supabase.from('capstone_report_deliveries').upsert({ user_id: userId, lesson_attempt_number: attempt, report_type: reportType, scenario_key: scenarioKey, run_id: runId, recipient_email: recipientEmail, status: 'pending', error_message: null, updated_at: new Date().toISOString() }, { onConflict: 'user_id,lesson_attempt_number,report_type,scenario_key', ignoreDuplicates: true }).select('*').maybeSingle()
      throwIf(error); return data ?? this.getReportDelivery(userId, attempt, reportType, scenarioKey)
    },
    async completeReportDelivery(id, providerMessageId) {
      const { error } = await supabase.from('capstone_report_deliveries').update({ status: 'sent', provider_message_id: providerMessageId, sent_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', id); throwIf(error)
    },
    async failReportDelivery(id, message) {
      const { error } = await supabase.from('capstone_report_deliveries').update({ status: 'failed', error_message: String(message).slice(0, 500), updated_at: new Date().toISOString() }).eq('id', id); throwIf(error)
    },
  }
}

