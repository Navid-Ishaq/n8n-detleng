import { parseClassification } from './core.js'

function responseText(payload) {
  if (typeof payload?.output_text === 'string') return payload.output_text
  for (const item of payload?.output ?? []) for (const content of item?.content ?? []) if (typeof content?.text === 'string') return content.text
  return ''
}

export function createOpenAIService({ apiKey, fetchImpl = globalThis.fetch, model = 'gpt-5-mini', embeddingModel = 'text-embedding-3-small' }) {
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured.')
  async function post(path, body) {
    const response = await fetchImpl(`https://api.openai.com/v1/${path}`, { method: 'POST', headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(45_000) })
    if (!response.ok) throw new Error(`OpenAI request failed with HTTP ${response.status}.`)
    return response.json()
  }
  return {
    model,
    embeddingModel,
    async classify(input) {
      const payload = await post('responses', {
        model,
        input: [{ role: 'system', content: 'Classify an operations request. You propose; deterministic rules remain authoritative.' }, { role: 'user', content: JSON.stringify(input) }],
        text: { format: { type: 'json_schema', name: 'operations_classification', strict: true, schema: { type: 'object', additionalProperties: false, required: ['classification','intent','suggestedAction','suggestedRisk','needsKnowledge'], properties: { classification: { type: 'string' }, intent: { type: 'string' }, suggestedAction: { type: 'string' }, suggestedRisk: { type: 'string', enum: ['low','high','ambiguous'] }, needsKnowledge: { type: 'boolean' } } } } },
      })
      let parsed
      try { parsed = JSON.parse(responseText(payload)) } catch { throw new Error('AI classification could not be parsed. No action was taken.') }
      return parseClassification(parsed)
    },
    async embed(text) {
      const payload = await post('embeddings', { model: embeddingModel, input: text, dimensions: 1536 })
      const vector = payload?.data?.[0]?.embedding
      if (!Array.isArray(vector) || vector.length !== 1536) throw new Error('Embedding generation returned an unexpected result.')
      return vector
    },
    async answer(question, evidence) {
      const payload = await post('responses', {
        model,
        input: [{ role: 'system', content: 'Answer only from the supplied evidence. If insufficient, say evidence is insufficient. Cite source IDs.' }, { role: 'user', content: JSON.stringify({ question, evidence }) }],
        text: { format: { type: 'json_schema', name: 'grounded_answer', strict: true, schema: { type: 'object', additionalProperties: false, required: ['answer','sourceIds','grounded'], properties: { answer: { type: 'string' }, sourceIds: { type: 'array', items: { type: 'string' } }, grounded: { type: 'boolean' } } } } },
      })
      let result
      try { result = JSON.parse(responseText(payload)) } catch { throw new Error('Grounded answer could not be parsed.') }
      if (!result.grounded || !Array.isArray(result.sourceIds)) return { answer: 'Available evidence is insufficient.', sourceIds: [], grounded: false }
      return result
    },
  }
}

