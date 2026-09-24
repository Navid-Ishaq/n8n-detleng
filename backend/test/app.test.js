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
  assert.equal(validateN8nCloudWebhookUrl('https://learner.app.n8n.cloud/webhook-test/lesson-01', 'test').valid, true)
  assert.equal(validateN8nCloudWebhookUrl('https://learner.app.n8n.cloud/webhook/lesson-01', 'test').valid, false)
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
    assert.equal(options.redirect, 'error')
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

test('reports a wrong Normal route and a timeout as learner-safe failures', async () => {
  const supabase = { auth: { getUser: async () => ({ data: { user: { id: 'learner-1' } }, error: null }) } }
  const wrongNormal = createApp({ env, supabase, fetchImpl: async (_url, options) => {
    const input = JSON.parse(options.body)
    return new Response(JSON.stringify({ route: input.priority === 'high' ? 'escalated' : 'escalated', status: 'ready' }), { status: 200, headers: { 'content-type': 'application/json' } })
  } })
  await withServer(wrongNormal, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/lessons/n8n-core/live-test`, { method: 'POST', headers: { authorization: 'Bearer valid-token', 'content-type': 'application/json' }, body: JSON.stringify({ webhookUrl: 'https://learner.app.n8n.cloud/webhook/lesson-01' }) })
    const body = await response.json()
    assert.equal(body.results.find((item) => item.id === 'high').passed, true)
    assert.equal(body.results.find((item) => item.id === 'normal').passed, false)
  })
  const timeout = createApp({ env, supabase, fetchImpl: async () => { const error = new Error('timed out'); error.name = 'TimeoutError'; throw error } })
  await withServer(timeout, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/lessons/n8n-core/live-test`, { method: 'POST', headers: { authorization: 'Bearer valid-token', 'content-type': 'application/json' }, body: JSON.stringify({ webhookUrl: 'https://learner.app.n8n.cloud/webhook/lesson-01' }) })
    const body = await response.json()
    assert.match(body.results[0].message, /did not respond before the timeout/i)
    assert.equal(body.results[0].reached, false)
  })
})

test('temporary endpoint accepts only a test URL and sends the controlled event', async () => {
  let received
  const fetchImpl = async (_url, options) => { received = JSON.parse(options.body); return new Response('', { status: 200 }) }
  const supabase = { auth: { getUser: async () => ({ data: { user: { id: 'learner-1' } }, error: null }) } }
  const app = createApp({ env, fetchImpl, supabase })
  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/lessons/n8n-core/test-event`, { method: 'POST', headers: { authorization: 'Bearer valid-token', 'content-type': 'application/json' }, body: JSON.stringify({ webhookUrl: 'https://learner.app.n8n.cloud/webhook-test/lesson-01' }) })
    assert.equal(response.status, 200)
    assert.equal((await response.json()).passed, true)
    assert.deepEqual(received, { customerName: 'Ali Khan', department: 'Support', priority: 'high', budget: 1500 })
  })
})

test('break test counts logical failure but never counts an unreachable webhook', async () => {
  const supabase = { auth: { getUser: async () => ({ data: { user: { id: 'learner-1' } }, error: null }) } }
  const logicalFailure = createApp({ env, supabase, fetchImpl: async () => new Response(JSON.stringify({ route: 'standard', status: 'ready' }), { status: 200, headers: { 'content-type': 'application/json' } }) })
  await withServer(logicalFailure, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/lessons/n8n-core/break-test`, { method: 'POST', headers: { authorization: 'Bearer valid-token', 'content-type': 'application/json' }, body: JSON.stringify({ webhookUrl: 'https://learner.app.n8n.cloud/webhook/lesson-01' }) })
    assert.equal((await response.json()).passed, true)
  })
  const unreachable = createApp({ env, supabase, fetchImpl: async () => { throw new Error('network') } })
  await withServer(unreachable, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/lessons/n8n-core/break-test`, { method: 'POST', headers: { authorization: 'Bearer valid-token', 'content-type': 'application/json' }, body: JSON.stringify({ webhookUrl: 'https://learner.app.n8n.cloud/webhook/lesson-01' }) })
    const body = await response.json()
    assert.equal(body.passed, false)
    assert.equal(body.reached, false)
  })
  const serverError = createApp({ env, supabase, fetchImpl: async () => new Response('failed', { status: 500 }) })
  await withServer(serverError, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/lessons/n8n-core/break-test`, { method: 'POST', headers: { authorization: 'Bearer valid-token', 'content-type': 'application/json' }, body: JSON.stringify({ webhookUrl: 'https://learner.app.n8n.cloud/webhook/lesson-01' }) })
    assert.equal((await response.json()).passed, false)
  })
})

test('JSON test event sends the canonical nested order and requires a Test URL', async () => {
  let received
  const fetchImpl = async (_url, options) => { received = JSON.parse(options.body); return new Response('', { status: 200 }) }
  const supabase = { auth: { getUser: async () => ({ data: { user: { id: 'learner-1' } }, error: null }) } }
  const app = createApp({ env, fetchImpl, supabase })
  await withServer(app, async (baseUrl) => {
    const headers = { authorization: 'Bearer valid-token', 'content-type': 'application/json' }
    const response = await fetch(`${baseUrl}/api/lessons/json/test-event`, { method: 'POST', headers, body: JSON.stringify({ webhookUrl: 'https://learner.app.n8n.cloud/webhook-test/lesson-02' }) })
    assert.equal(response.status, 200)
    assert.equal((await response.json()).passed, true)
    assert.equal(received.customer.name, 'Ali Khan')
    assert.equal(received.order.items.length, 2)
    const wrongUrl = await fetch(`${baseUrl}/api/lessons/json/test-event`, { method: 'POST', headers, body: JSON.stringify({ webhookUrl: 'https://learner.app.n8n.cloud/webhook/lesson-02' }) })
    assert.equal(wrongUrl.status, 400)
  })
})

test('JSON live tests verify normal, variable length and missing-country contracts', async () => {
  const received = []
  const fetchImpl = async (_url, options) => {
    const input = JSON.parse(options.body); received.push(input)
    const items = input.order.items
    const output = { customerName: input.customer.name, customerCountry: input.customer.country ?? null, orderId: input.order.id, itemCount: items.length, orderTotal: items.reduce((sum, item) => sum + item.qty * item.price, 0) }
    return new Response(JSON.stringify([output]), { status: 200, headers: { 'content-type': 'application/json' } })
  }
  const supabase = { auth: { getUser: async () => ({ data: { user: { id: 'learner-1' } }, error: null }) } }
  const app = createApp({ env, fetchImpl, supabase })
  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/lessons/json/live-test`, { method: 'POST', headers: { authorization: 'Bearer valid-token', 'content-type': 'application/json' }, body: JSON.stringify({ webhookUrl: 'https://learner.app.n8n.cloud/webhook/lesson-02' }) })
    const body = await response.json()
    assert.equal(body.passed, true)
    assert.deepEqual(body.results.map((item) => item.id), ['normal', 'variable-items', 'missing-country'])
    assert.equal(body.results.every((item) => item.passed), true)
    assert.deepEqual(received.map((item) => item.order.items.length), [2, 3, 1])
  })
})

test('JSON validation rejects hard-coded item counts and non-null missing country', async () => {
  const fetchImpl = async (_url, options) => {
    const input = JSON.parse(options.body); const items = input.order.items
    return new Response(JSON.stringify({ customerName: input.customer.name, customerCountry: input.customer.country ?? 'Unknown', orderId: input.order.id, itemCount: 2, orderTotal: items.reduce((sum, item) => sum + item.qty * item.price, 0) }), { status: 200, headers: { 'content-type': 'application/json' } })
  }
  const supabase = { auth: { getUser: async () => ({ data: { user: { id: 'learner-1' } }, error: null }) } }
  const app = createApp({ env, fetchImpl, supabase })
  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/lessons/json/live-test`, { method: 'POST', headers: { authorization: 'Bearer valid-token', 'content-type': 'application/json' }, body: JSON.stringify({ webhookUrl: 'https://learner.app.n8n.cloud/webhook/lesson-02' }) })
    const body = await response.json()
    assert.equal(body.passed, false)
    assert.equal(body.results.find((item) => item.id === 'normal').passed, true)
    assert.equal(body.results.find((item) => item.id === 'variable-items').passed, false)
    assert.equal(body.results.find((item) => item.id === 'missing-country').passed, false)
  })
})

test('JSON schema drift counts only a reached logical mismatch', async () => {
  const supabase = { auth: { getUser: async () => ({ data: { user: { id: 'learner-1' } }, error: null }) } }
  const oldPath = createApp({ env, supabase, fetchImpl: async () => new Response(JSON.stringify({ customerCountry: 'PT', orderId: 'ORD-404', itemCount: 1, orderTotal: 120 }), { status: 200, headers: { 'content-type': 'application/json' } }) })
  await withServer(oldPath, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/lessons/json/break-test`, { method: 'POST', headers: { authorization: 'Bearer valid-token', 'content-type': 'application/json' }, body: JSON.stringify({ webhookUrl: 'https://learner.app.n8n.cloud/webhook/lesson-02' }) })
    const body = await response.json(); assert.equal(body.passed, true); assert.equal(body.reached, true)
  })
  const unreachable = createApp({ env, supabase, fetchImpl: async () => { throw new Error('network') } })
  await withServer(unreachable, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/lessons/json/break-test`, { method: 'POST', headers: { authorization: 'Bearer valid-token', 'content-type': 'application/json' }, body: JSON.stringify({ webhookUrl: 'https://learner.app.n8n.cloud/webhook/lesson-02' }) })
    const body = await response.json(); assert.equal(body.passed, false); assert.equal(body.reached, false)
  })
})

test('JSON repair requires both original and renamed customer shapes', async () => {
  const supabase = { auth: { getUser: async () => ({ data: { user: { id: 'learner-1' } }, error: null }) } }
  const fetchImpl = async (_url, options) => { const input = JSON.parse(options.body); const items = input.order.items; return new Response(JSON.stringify({ customerName: input.customer.name || input.customer.fullName, customerCountry: input.customer.country ?? null, orderId: input.order.id, itemCount: items.length, orderTotal: items.reduce((sum, item) => sum + item.qty * item.price, 0) }), { status: 200, headers: { 'content-type': 'application/json' } }) }
  const app = createApp({ env, fetchImpl, supabase })
  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/lessons/json/repair-test`, { method: 'POST', headers: { authorization: 'Bearer valid-token', 'content-type': 'application/json' }, body: JSON.stringify({ webhookUrl: 'https://learner.app.n8n.cloud/webhook/lesson-02' }) })
    const body = await response.json(); assert.equal(body.passed, true); assert.deepEqual(body.results.map((item) => item.id), ['original-shape', 'renamed-shape'])
  })
})
