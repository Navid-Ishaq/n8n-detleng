import assert from 'node:assert/strict'
import test from 'node:test'
import { createApp, validateN8nCloudWebhookUrl } from '../src/app.js'

const env = {
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test',
  FRONTEND_ORIGIN: 'https://n8n.detleng.com',
  N8N_WEBHOOK_TIMEOUT_MS: '1000',
}

async function withServer(app, run) {
  const server = app.listen(0, '127.0.0.1')
  await new Promise((resolve) => server.once('listening', resolve))
  try {
    const { port } = server.address()
    await run(`http://127.0.0.1:${port}`)
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  }
}

test('accepts only HTTPS n8n Cloud production webhook URLs', () => {
  assert.equal(validateN8nCloudWebhookUrl('https://learner.app.n8n.cloud/webhook/lesson-01').valid, true)
  assert.equal(validateN8nCloudWebhookUrl('https://learner.app.n8n.cloud/webhook-test/lesson-01').valid, false)
  assert.equal(validateN8nCloudWebhookUrl('http://learner.app.n8n.cloud/webhook/lesson-01').valid, false)
  assert.equal(validateN8nCloudWebhookUrl('https://example.com/webhook/lesson-01').valid, false)
  assert.equal(validateN8nCloudWebhookUrl('https://learner.app.n8n.cloud.evil.example/webhook/lesson-01').valid, false)
})

test('health endpoint is public', async () => {
  const app = createApp({ env, supabase: { auth: { getUser: async () => ({ data: {}, error: null }) } } })
  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/health`)
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), { ok: true, service: 'n8n-detleng-backend' })
  })
})

test('live test requires a valid authenticated user', async () => {
  const app = createApp({ env, supabase: { auth: { getUser: async () => ({ data: {}, error: new Error('invalid') }) } } })
  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/lessons/n8n-core/live-test`, { method: 'POST', headers: { authorization: 'Bearer invalid', 'content-type': 'application/json' }, body: JSON.stringify({ webhookUrl: 'https://learner.app.n8n.cloud/webhook/lesson-01' }) })
    assert.equal(response.status, 401)
  })
})

test('runs high and normal tests and returns structured results', async () => {
  const received = []
  const fetchImpl = async (_url, options) => {
    const input = JSON.parse(options.body)
    received.push(input)
    const route = input.priority === 'high' ? 'escalated' : 'standard'
    return new Response(JSON.stringify({ route, status: 'ready' }), { status: 200, headers: { 'content-type': 'application/json' } })
  }
  const supabase = { auth: { getUser: async (token) => ({ data: { user: token === 'valid-token' ? { id: 'learner-1' } : null }, error: null }) } }
  const app = createApp({ env, fetchImpl, supabase })

  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/lessons/n8n-core/live-test`, { method: 'POST', headers: { authorization: 'Bearer valid-token', 'content-type': 'application/json' }, body: JSON.stringify({ webhookUrl: 'https://learner.app.n8n.cloud/webhook/lesson-01' }) })
    const body = await response.json()
    assert.equal(response.status, 200)
    assert.equal(body.passed, true)
    assert.equal(body.results.length, 2)
    assert.equal(body.results.every((result) => result.passed), true)
    assert.deepEqual(received.map(({ priority, budget }) => ({ priority, budget })), [{ priority: 'high', budget: 1500 }, { priority: 'normal', budget: 300 }])
  })
})

test('reports a deterministic route mismatch without leaking internals', async () => {
  const fetchImpl = async () => new Response(JSON.stringify({ route: 'standard', status: 'ready' }), { status: 200, headers: { 'content-type': 'application/json' } })
  const supabase = { auth: { getUser: async () => ({ data: { user: { id: 'learner-1' } }, error: null }) } }
  const app = createApp({ env, fetchImpl, supabase })

  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/lessons/n8n-core/live-test`, { method: 'POST', headers: { authorization: 'Bearer valid-token', 'content-type': 'application/json' }, body: JSON.stringify({ webhookUrl: 'https://learner.app.n8n.cloud/webhook/lesson-01' }) })
    const body = await response.json()
    assert.equal(body.passed, false)
    assert.equal(body.results[0].passed, false)
    assert.match(body.results[0].message, /Expected route/)
  })
})
