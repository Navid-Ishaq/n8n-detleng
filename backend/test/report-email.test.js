import assert from 'node:assert/strict'
import test from 'node:test'
import { createReportEmailService } from '../src/capstone/report-email.js'

function repositoryDouble() {
  const rows = new Map()
  return {
    async getReportDelivery(userId, attempt, type, scenario) { return rows.get(`${userId}:${attempt}:${type}:${scenario}`) ?? null },
    async claimReportDelivery({ userId, attempt, reportType, scenarioKey, runId, recipientEmail }) {
      const row = { id: `delivery-${rows.size + 1}`, status: 'pending', run_id: runId, recipient_email: recipientEmail }
      rows.set(`${userId}:${attempt}:${reportType}:${scenarioKey}`, row); return row
    },
    async completeReportDelivery(id, messageId) { for (const row of rows.values()) if (row.id === id) Object.assign(row, { status: 'sent', provider_message_id: messageId }) },
    async failReportDelivery(id) { for (const row of rows.values()) if (row.id === id) row.status = 'failed' },
  }
}

const run = { id:'run-1', lessonAttemptNumber:1, scenarioKey:'A', status:'completed', requestType:'support_update', riskLevel:'low', approvalRequired:false, approval:null, actions:[{status:'executed'}], retryCount:0, citations:[] }

test('scenario report goes to learner and DeTLeng copy only once', async () => {
  const calls = []; const repository = repositoryDouble()
  const service = createReportEmailService({ apiKey:'secret', fromEmail:'DeTLeng <reports@detleng.com>', repository, fetchImpl:async (_url, options) => { calls.push(JSON.parse(options.body)); return new Response(JSON.stringify({ id:'email-1' }), { status:200, headers:{'content-type':'application/json'} }) } })
  const first = await service.sendScenario({ user:{ id:'learner-1', email:'learner@example.com' }, run })
  const second = await service.sendScenario({ user:{ id:'learner-1', email:'learner@example.com' }, run })
  assert.equal(first.status, 'sent'); assert.equal(second.status, 'already_sent'); assert.equal(calls.length, 1)
  assert.deepEqual(calls[0].to, ['learner@example.com', 'info@detleng.com'])
})

test('an unconfigured provider reports status without blocking verification', async () => {
  const service = createReportEmailService({ repository:repositoryDouble() })
  assert.deepEqual(await service.sendScenario({ user:{ id:'learner-1', email:'learner@example.com' }, run }), { status:'not_configured' })
})
