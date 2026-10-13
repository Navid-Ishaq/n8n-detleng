const SCENARIO_TITLES = {
  A: 'Normal low-risk request',
  B: 'Knowledge / RAG request',
  C: 'External-service failure',
  D: 'Sensitive request',
  E: 'Approval granted',
  F: 'Rejected',
}

const escapeHtml = (value) => String(value ?? '—')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')

function deliveryRecipients(learnerEmail, archiveEmail) {
  return [...new Set([learnerEmail, archiveEmail].filter(Boolean).map((email) => email.trim().toLowerCase()))]
}

function reportRows(run) {
  return [
    ['Scenario', `${run.scenarioKey} — ${SCENARIO_TITLES[run.scenarioKey] ?? 'Capstone scenario'}`],
    ['Run status', run.status?.replaceAll('_', ' ')],
    ['Request', run.requestType?.replaceAll('_', ' ')],
    ['Final risk', run.riskLevel],
    ['Approval', run.approval?.status ?? (run.approvalRequired ? 'required' : 'not required')],
    ['Action', `${run.actions.length} executed action${run.actions.length === 1 ? '' : 's'}`],
    ['Retries', run.retryCount],
    ['Evidence', run.citations?.join(', ') || 'No RAG citation required'],
    ['Run ID', run.id],
  ]
}

function emailShell(title, intro, body) {
  return `<!doctype html><html><body style="margin:0;background:#f8f4ee;color:#17213a;font-family:Arial,sans-serif"><div style="max-width:680px;margin:0 auto;padding:32px 20px"><div style="background:#17213a;color:#fff;border-radius:18px;padding:28px"><div style="color:#ff604d;font-size:12px;font-weight:700;letter-spacing:1.4px">DETLENG · LESSON 20</div><h1 style="font-size:28px;margin:12px 0">${escapeHtml(title)}</h1><p style="color:#d8e1ee;line-height:1.6;margin:0">${escapeHtml(intro)}</p></div>${body}<p style="font-size:12px;color:#68738a;line-height:1.5;margin:22px 4px">This report was generated from stored deterministic execution evidence. AI did not decide whether the scenario passed.</p></div></body></html>`
}

function rowsHtml(rows) {
  return `<div style="background:#fff;border:1px solid #e5ded4;border-radius:16px;margin-top:18px;padding:20px">${rows.map(([label, value]) => `<div style="display:flex;gap:16px;border-bottom:1px solid #eee;padding:10px 0"><strong style="width:130px">${escapeHtml(label)}</strong><span>${escapeHtml(value)}</span></div>`).join('')}</div>`
}

export function createReportEmailService({ apiKey, fromEmail, archiveEmail = 'info@detleng.com', fetchImpl = globalThis.fetch, repository }) {
  const configured = Boolean(apiKey && fromEmail && repository)

  async function deliver({ userId, attempt, reportType, scenarioKey = null, runId = null, learnerEmail, subject, html }) {
    if (!configured) return { status: 'not_configured' }
    if (!learnerEmail) return { status: 'no_recipient' }

    const existing = await repository.getReportDelivery(userId, attempt, reportType, scenarioKey)
    if (existing?.status === 'sent') return { status: 'already_sent', messageId: existing.provider_message_id }

    const delivery = existing ?? await repository.claimReportDelivery({ userId, attempt, reportType, scenarioKey, runId, recipientEmail: learnerEmail })
    if (delivery?.status === 'sent') return { status: 'already_sent', messageId: delivery.provider_message_id }

    try {
      const response = await fetchImpl('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${apiKey}`,
          'content-type': 'application/json',
          'idempotency-key': `lesson20-${reportType}-${userId}-${attempt}-${scenarioKey ?? 'final'}`,
        },
        body: JSON.stringify({ from: fromEmail, to: deliveryRecipients(learnerEmail, archiveEmail), subject, html }),
        signal: AbortSignal.timeout(10_000),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(`Email provider returned HTTP ${response.status}.`)
      await repository.completeReportDelivery(delivery.id, payload.id ?? null)
      return { status: 'sent', messageId: payload.id ?? null }
    } catch (error) {
      await repository.failReportDelivery(delivery.id, error instanceof Error ? error.message : 'Email delivery failed.')
      return { status: 'failed' }
    }
  }

  return {
    async sendScenario({ user, run }) {
      const title = `Scenario ${run.scenarioKey} verified`
      return deliver({
        userId: user.id,
        attempt: run.lessonAttemptNumber,
        reportType: 'scenario',
        scenarioKey: run.scenarioKey,
        runId: run.id,
        learnerEmail: user.email,
        subject: `DeTLeng Lesson 20 · ${title}`,
        html: emailShell(title, 'Your evidence passed the deterministic learning contract.', rowsHtml(reportRows(run))),
      })
    },
    async sendFinal({ user, attempt, runs }) {
      const body = `<div style="background:#fff;border:1px solid #e5ded4;border-radius:16px;margin-top:18px;padding:20px"><h2 style="margin-top:0">Six scenarios completed</h2>${runs.map((run) => `<p><strong>${escapeHtml(run.scenarioKey)} — ${escapeHtml(SCENARIO_TITLES[run.scenarioKey])}</strong><br><span style="color:#59657a">${escapeHtml(run.status?.replaceAll('_', ' '))} · ${escapeHtml(run.riskLevel)} risk · ${escapeHtml(run.actions.length)} action(s)</span></p>`).join('')}</div>`
      return deliver({
        userId: user.id,
        attempt,
        reportType: 'final',
        learnerEmail: user.email,
        subject: 'DeTLeng Lesson 20 · Final execution report',
        html: emailShell('Lesson 20 completed', 'You operated and verified all six production-style AI scenarios.', body),
      })
    },
  }
}
