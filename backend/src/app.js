import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import { createClient } from '@supabase/supabase-js'

const TEST_CASES = [
  { id: 'high', label: 'High Priority', input: { customerName: 'Ali Khan', department: 'Support', priority: 'high', budget: 1500 }, expected: { route: 'escalated', status: 'ready' } },
  { id: 'normal', label: 'Normal Priority', input: { customerName: 'Ali Khan', department: 'Support', priority: 'normal', budget: 300 }, expected: { route: 'standard', status: 'ready' } },
]

function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value ?? '', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export function validateN8nCloudWebhookUrl(value, mode = 'production') {
  if (typeof value !== 'string' || value.length > 2048) return { valid: false, reason: `Enter a valid n8n ${mode === 'test' ? 'Test' : 'Production'} Webhook URL.` }

  let url
  try { url = new URL(value) } catch { return { valid: false, reason: 'Enter a valid n8n Production Webhook URL.' } }

  const hostname = url.hostname.toLowerCase()
  if (url.protocol !== 'https:') return { valid: false, reason: 'The webhook URL must use HTTPS.' }
  if (url.username || url.password || url.port) return { valid: false, reason: 'The webhook URL contains unsupported connection details.' }
  if (!(hostname === 'app.n8n.cloud' || hostname.endsWith('.app.n8n.cloud'))) return { valid: false, reason: 'For this version, use an n8n Cloud webhook URL.' }
  if (mode === 'test' && !url.pathname.includes('/webhook-test/')) return { valid: false, reason: 'Use the temporary n8n Test URL for this first event.' }
  if (mode === 'production' && url.pathname.includes('/webhook-test/')) return { valid: false, reason: 'Use the Production URL, not the n8n Test URL.' }
  if (mode === 'production' && !url.pathname.includes('/webhook/')) return { valid: false, reason: 'The URL must be an n8n Production Webhook URL.' }
  if (url.hash) return { valid: false, reason: 'Remove the fragment from the webhook URL.' }

  return { valid: true, url: url.toString() }
}

function normalizeWebhookOutput(value) {
  const first = Array.isArray(value) ? value[0] : value
  if (!first || typeof first !== 'object') return null
  const candidate = first.json && typeof first.json === 'object' ? first.json : first
  return { route: candidate.route, status: candidate.status }
}

async function runWebhookTest(fetchImpl, webhookUrl, testCase, timeoutMs) {
  try {
    const response = await fetchImpl(webhookUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(testCase.input),
      redirect: 'error',
      signal: AbortSignal.timeout(timeoutMs),
    })

    if (!response.ok) {
      return { id: testCase.id, label: testCase.label, reached: true, passed: false, expected: testCase.expected, message: `The webhook returned HTTP ${response.status}.` }
    }

    const contentType = response.headers.get('content-type') ?? ''
    if (!contentType.toLowerCase().includes('application/json')) {
      return { id: testCase.id, label: testCase.label, reached: true, passed: false, expected: testCase.expected, message: 'The webhook response was not JSON.' }
    }

    let body
    try { body = await response.json() } catch {
      return { id: testCase.id, label: testCase.label, reached: true, passed: false, expected: testCase.expected, message: 'The webhook returned invalid JSON.' }
    }

    const actual = normalizeWebhookOutput(body)
    const passed = actual?.route === testCase.expected.route && actual?.status === testCase.expected.status
    return {
      id: testCase.id,
      label: testCase.label,
      reached: true,
      passed,
      expected: testCase.expected,
      actual,
      message: passed ? `${testCase.label} followed the expected route.` : `Expected route “${testCase.expected.route}” with status “ready”.`,
    }
  } catch (error) {
    const timedOut = error?.name === 'TimeoutError' || error?.name === 'AbortError'
    return { id: testCase.id, label: testCase.label, reached: false, passed: false, expected: testCase.expected, message: timedOut ? 'The n8n webhook did not respond before the timeout.' : 'The n8n webhook could not be reached safely.' }
  }
}

async function sendControlledEvent(fetchImpl, webhookUrl, timeoutMs) {
  try {
    const response = await fetchImpl(webhookUrl, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(TEST_CASES[0].input), redirect: 'error', signal: AbortSignal.timeout(timeoutMs) })
    return { reached: response.ok, status: response.status }
  } catch (error) {
    return { reached: false, timedOut: error?.name === 'TimeoutError' || error?.name === 'AbortError' }
  }
}

export function createApp(options = {}) {
  const env = options.env ?? process.env
  const fetchImpl = options.fetchImpl ?? globalThis.fetch
  const frontendOrigin = env.FRONTEND_ORIGIN || 'https://n8n.detleng.com'
  const timeoutMs = parsePositiveInteger(env.N8N_WEBHOOK_TIMEOUT_MS, 10_000)
  const supabase = options.supabase ?? createClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  })
  const app = express()

  app.disable('x-powered-by')
  app.set('trust proxy', 1)
  app.use(helmet())
  app.use(cors({ origin: frontendOrigin, methods: ['GET', 'POST'], allowedHeaders: ['authorization', 'content-type'], maxAge: 86400 }))
  app.use(express.json({ limit: '8kb', strict: true }))

  app.get('/api/health', (_request, response) => response.json({ ok: true, service: 'n8n-detleng-backend' }))

  const liveTestLimiter = rateLimit({
    windowMs: 60_000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Too many live-test requests. Please wait a minute and try again.' },
  })

  async function authenticate(request, response) {
    const match = (request.get('authorization') ?? '').match(/^Bearer\s+(.+)$/i)
    if (!match) { response.status(401).json({ error: 'Please log in to run a live test.' }); return false }
    const { data, error } = await supabase.auth.getUser(match[1])
    if (error || !data?.user) { response.status(401).json({ error: 'Your session is no longer valid. Please log in again.' }); return false }
    return true
  }

  app.post('/api/lessons/n8n-core/test-event', liveTestLimiter, async (request, response) => {
    if (!await authenticate(request, response)) return
    const validation = validateN8nCloudWebhookUrl(request.body?.webhookUrl, 'test')
    if (!validation.valid) return response.status(400).json({ error: validation.reason })
    const result = await sendControlledEvent(fetchImpl, validation.url, timeoutMs)
    return response.json({ passed: result.reached, reached: result.reached, lessonId: 'n8n-core', message: result.reached ? 'Test event reached your n8n workflow.' : result.timedOut ? 'Detleng could not reach this webhook. Make sure n8n is listening for a test event.' : 'The Test URL did not accept the event. Start listening in n8n and try again.' })
  })

  app.post('/api/lessons/n8n-core/connect', liveTestLimiter, async (request, response) => {
    if (!await authenticate(request, response)) return
    const validation = validateN8nCloudWebhookUrl(request.body?.webhookUrl)
    if (!validation.valid) return response.status(400).json({ error: validation.reason })
    const result = await sendControlledEvent(fetchImpl, validation.url, timeoutMs)
    return response.json({ passed: result.reached, reached: result.reached, lessonId: 'n8n-core', message: result.reached ? 'Production workflow connected.' : 'Your production webhook did not respond. Confirm the workflow is published and use the Production URL.' })
  })

  app.post('/api/lessons/n8n-core/live-test', liveTestLimiter, async (request, response) => {
    if (!await authenticate(request, response)) return

    const validation = validateN8nCloudWebhookUrl(request.body?.webhookUrl)
    if (!validation.valid) return response.status(400).json({ error: validation.reason })

    const results = []
    for (const testCase of TEST_CASES) results.push(await runWebhookTest(fetchImpl, validation.url, testCase, timeoutMs))

    return response.json({ passed: results.every((result) => result.passed), lessonId: 'n8n-core', results })
  })

  app.post('/api/lessons/n8n-core/break-test', liveTestLimiter, async (request, response) => {
    if (!await authenticate(request, response)) return
    const validation = validateN8nCloudWebhookUrl(request.body?.webhookUrl)
    if (!validation.valid) return response.status(400).json({ error: validation.reason })
    const result = await runWebhookTest(fetchImpl, validation.url, TEST_CASES[0], timeoutMs)
    const intendedFailure = result.reached === true && result.passed === false && result.actual != null
    return response.json({ passed: intendedFailure, reached: result.reached, lessonId: 'n8n-core', results: [result], message: intendedFailure ? 'Intended failure observed.' : result.reached ? 'The workflow still behaves correctly. Change priority without updating the IF condition, then try again.' : 'Detleng could not reach the workflow. Network failures do not count as the break exercise.' })
  })

  app.use((_request, response) => response.status(404).json({ error: 'Endpoint not found.' }))
  app.use((error, _request, response, _next) => {
    if (error?.type === 'entity.too.large') return response.status(413).json({ error: 'Request is too large.' })
    if (error instanceof SyntaxError) return response.status(400).json({ error: 'Request body must be valid JSON.' })
    console.error('Unhandled API error', error)
    return response.status(500).json({ error: 'The service could not complete this request.' })
  })

  return app
}
