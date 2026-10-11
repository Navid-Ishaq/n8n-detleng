import assert from 'node:assert/strict'
import test from 'node:test'
import { deterministicRisk, parseClassification, safeRunView, validateRunInput, verifyScenario } from '../src/capstone/core.js'

test('bounds learner-controlled capstone options', () => {
  assert.equal(validateRunInput({ scenarioKey: 'A' }).requestType, 'support_update')
  assert.throws(() => validateRunInput({ requestType: 'shell_command' }), /supported request type/)
  assert.throws(() => validateRunInput({ requestType: 'refund_request', amount: 501 }), /between EUR 0 and EUR 500/)
  assert.throws(() => validateRunInput({ requestType: 'knowledge_question', question: '' }), /knowledge question/)
})

test('structured AI parser fails closed on malformed output', () => {
  assert.throws(() => parseClassification({ suggestedRisk: 'low' }), /No action was taken/)
  assert.deepEqual(parseClassification({ classification: 'support', intent: 'record', suggestedAction: 'record_support_note', suggestedRisk: 'low', needsKnowledge: false }), { classification: 'support', intent: 'record', suggestedAction: 'record_support_note', suggestedRisk: 'low', needsKnowledge: false })
})

test('deterministic rules override an AI low-risk financial proposal', () => {
  const decision = deterministicRisk({ requestType: 'refund_request', amount: 240 }, { suggestedRisk: 'low' })
  assert.equal(decision.approvalRequired, true)
  assert.equal(decision.finalRisk, 'high')
  assert.match(decision.ruleDecision, /requires approval/)
})

test('ambiguous AI output cannot authorize an action', () => {
  const decision = deterministicRisk({ requestType: 'support_update', amount: 0 }, { suggestedRisk: 'unknown' })
  assert.equal(decision.approvalRequired, true)
  assert.equal(decision.finalRisk, 'ambiguous')
})

test('deterministic rules never downgrade an AI high-risk proposal', () => {
  const decision = deterministicRisk({ requestType: 'support_update', amount: 0 }, { suggestedRisk: 'high' })
  assert.equal(decision.approvalRequired, true)
  assert.equal(decision.finalRisk, 'high')
})

test('safe run view never includes user identity or raw vectors', () => {
  const view = safeRunView({ id:'run-1', user_id:'secret-user', lesson_attempt_number:1, scenario_key:'B', request_type:'knowledge_question', input_summary:{question:'policy?'}, classification:null, ai_used:true, rag_used:true, citations:['KB-REFUND-001'], risk_level:'low', approval_required:false, decision:null, action_state:'not_requested', retry_count:0, error_code:null, status:'completed', started_at:'2026-01-01', completed_at:'2026-01-01', duration_ms:10 }, [{ sequence_number:1,event_type:'knowledge_retrieved',actor_type:'tool',outcome:'passed',message:'Retrieved.',details:{source:'KB-REFUND-001'},created_at:'2026-01-01',embedding:[1,2,3] }], null, [])
  assert.equal('user_id' in view, false)
  assert.equal(JSON.stringify(view).includes('embedding'), false)
})

test('scenario verification uses stored evidence rather than prose', () => {
  const base={status:'completed',riskLevel:'low',approvalRequired:false,actions:[{status:'executed'}],events:[]}
  assert.equal(verifyScenario({...base,scenarioKey:'A'}).passed,true)
  assert.equal(verifyScenario({...base,scenarioKey:'B',ragUsed:true,citations:['KB-REFUND-001']}).passed,true)
  assert.equal(verifyScenario({...base,scenarioKey:'D',status:'pending_approval',approvalRequired:true,actions:[]}).passed,true)
  assert.equal(verifyScenario({...base,scenarioKey:'F',status:'rejected',decision:'rejected',actions:[]}).passed,true)
})
