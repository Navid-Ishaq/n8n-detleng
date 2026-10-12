import assert from 'node:assert/strict'
import test from 'node:test'
import { deterministicRisk, knowledgeCaseForQuestion, parseClassification, safeRunView, validateRunInput, verifyKnowledgeRun, verifyScenario } from '../src/capstone/core.js'

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
  assert.equal(verifyScenario({...base,scenarioKey:'B',input:{question:'Can a customer receive a refund after 45 days?'},ragUsed:true,citations:['KB-REFUND-001'],events:[{type:'knowledge_retrieved',outcome:'passed'}]}).passed,true)
  assert.equal(verifyScenario({...base,scenarioKey:'D',status:'pending_approval',approvalRequired:true,actions:[]}).passed,true)
  assert.equal(verifyScenario({...base,scenarioKey:'F',status:'rejected',decision:'rejected',actions:[]}).passed,true)
})

test('all supported knowledge questions verify against their own source', () => {
  const cases = [
    ['Can a customer receive a refund after 45 days?','KB-REFUND-001'],
    ['Which account changes require human approval?','KB-SECURITY-001'],
    ['How many times may a 503 failure be retried?','KB-RETRY-001'],
  ]
  for (const [question, source] of cases) {
    const result = verifyKnowledgeRun({status:'completed',input:{question},ragUsed:true,citations:[source],actions:[{status:'executed'}],events:[{type:'knowledge_retrieved',outcome:'passed'}]})
    assert.equal(result.passed,true)
    assert.equal(result.expectedSource,source)
  }
})

test('unsupported dress-code question passes only through a stored safe refusal', () => {
  assert.equal(knowledgeCaseForQuestion('What is the office dress code?').key,'unsupported')
  const safe = {status:'completed',decision:null,input:{question:'What is the office dress code?'},actions:[],events:[{type:'knowledge_retrieved',outcome:'blocked'}]}
  assert.equal(verifyKnowledgeRun(safe).passed,true)
  assert.equal(verifyKnowledgeRun({...safe,status:'failed'}).passed,false)
  assert.equal(verifyKnowledgeRun({...safe,actions:[{status:'executed'}]}).passed,false)
})
