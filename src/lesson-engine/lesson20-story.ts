import type { CapstoneEvent, CapstoneRun } from '../lib/capstone-api'

export type StoryState = 'completed' | 'processing' | 'waiting' | 'failed' | 'not_required' | 'blocked' | 'rejected'

export type StoryStage = {
  key:string
  label:string
  state:StoryState
  systemEvent:string
  commentary:string
  businessMeaning:string
  event?:CapstoneEvent
}

type StageDefinition = Omit<StoryStage,'state'|'event'> & { eventTypes:string[] }

const stageDefinitions:StageDefinition[] = [
  {key:'request',label:'Request Received',eventTypes:['request_received'],systemEvent:'Authenticated request received.',commentary:'Your request reached the protected backend. The system attached your learner identity and created a unique run record before any AI processing began.',businessMeaning:'Every operation starts with an accountable requester and a traceable record.'},
  {key:'validation',label:'Input Validated',eventTypes:['input_validated'],systemEvent:'Input passed bounded server validation.',commentary:'The backend checked the request type, amount, priority and allowed values. Invalid or oversized input would stop here.',businessMeaning:'Untrusted input was checked before it could influence AI, tools or business actions.'},
  {key:'classification',label:'AI Classified',eventTypes:['ai_classified'],systemEvent:'AI proposed an intent, action and risk.',commentary:'AI suggested the request’s intent, proposed action and risk. This is advice—not final authority.',businessMeaning:'AI helps interpret the request, while policy and execution controls remain independent.'},
  {key:'knowledge',label:'Knowledge Retrieved',eventTypes:['knowledge_retrieved','knowledge_insufficient'],systemEvent:'Approved knowledge evidence retrieved.',commentary:'The system searched approved company knowledge and attached the most relevant source to the decision.',businessMeaning:'The answer can be traced to approved evidence instead of relying only on model memory.'},
  {key:'risk',label:'Risk Evaluated',eventTypes:['risk_evaluated'],systemEvent:'Deterministic rules produced the final system decision.',commentary:'Deterministic business rules checked the AI proposal. These rules can override an unsafe AI recommendation.',businessMeaning:'The organisation—not the model—retains final authority over risk and permission.'},
  {key:'approval',label:'Approval Requested',eventTypes:['approval_requested'],systemEvent:'Sensitive action stopped for a human decision.',commentary:'The request could affect money or an account, so execution stopped before any action occurred.',businessMeaning:'A sensitive operation cannot cross the execution boundary without explicit human responsibility.'},
  {key:'human',label:'Human Decision',eventTypes:['human_approved','human_rejected'],systemEvent:'An authenticated human recorded a decision.',commentary:'The authorised learner reviewed the proposal and accepted or rejected responsibility for the next step.',businessMeaning:'The decision is attributable, timestamped and available for later review.'},
  {key:'action',label:'Action Executed',eventTypes:['action_executed'],systemEvent:'Safe sandbox action executed.',commentary:'After all required controls passed, the sandbox action was claimed and executed exactly once.',businessMeaning:'The system prevented duplicate execution and produced a receipt for the authorised action.'},
  {key:'completion',label:'Run Closed',eventTypes:['run_completed','run_rejected','run_failed'],systemEvent:'The final outcome and evidence were stored.',commentary:'The system stored the final status, action receipt, duration and complete audit evidence.',businessMeaning:'The business can reconstruct what happened without relying on memory or screenshots.'},
]

const eventFor=(run:CapstoneRun,definition:StageDefinition)=>run.events.find((event)=>definition.eventTypes.includes(event.type))
const isActive=(run:CapstoneRun)=>['queued','processing'].includes(run.status)

function stageState(run:CapstoneRun,definition:StageDefinition,event?:CapstoneEvent):StoryState {
  if(event){
    if(event.type==='human_rejected')return 'rejected'
    if(event.type==='run_rejected')return 'rejected'
    if(event.type==='run_failed'||event.outcome==='failed'&&definition.key!=='knowledge')return 'failed'
    if(event.type==='knowledge_insufficient'||event.outcome==='blocked'&&definition.key==='knowledge')return 'blocked'
    return 'completed'
  }
  if(definition.key==='knowledge'&&!run.ragUsed&&!run.events.some((item)=>item.type==='knowledge_insufficient'))return isActive(run)&&!run.events.some((item)=>item.type==='risk_evaluated')?'processing':'not_required'
  if(definition.key==='approval'&&!run.approvalRequired&&run.events.some((item)=>item.type==='risk_evaluated'))return 'not_required'
  if(definition.key==='human'){
    if(!run.approvalRequired&&run.events.some((item)=>item.type==='risk_evaluated'))return 'not_required'
    if(run.status==='pending_approval')return 'waiting'
  }
  if(definition.key==='action'){
    if(run.status==='rejected'||run.status==='pending_approval')return 'blocked'
    if(run.status==='failed')return 'blocked'
  }
  if(definition.key==='completion'){
    if(run.status==='pending_approval'&&run.scenarioKey==='D')return 'not_required'
    if(run.status==='pending_approval')return 'waiting'
  }
  if(run.status==='failed')return 'not_required'
  if(isActive(run)){
    const completedCount=stageDefinitions.filter((item)=>eventFor(run,item)).length
    return stageDefinitions.indexOf(definition)===completedCount?'processing':'not_required'
  }
  return 'not_required'
}

function stageCopy(run:CapstoneRun,definition:StageDefinition,state:StoryState,event?:CapstoneEvent):Pick<StoryStage,'systemEvent'|'commentary'|'businessMeaning'> {
  if(definition.key==='knowledge'&&event?.outcome==='blocked')return {systemEvent:event.message,commentary:'The search did not find sufficiently strong approved evidence, so the system refused to invent a grounded answer.',businessMeaning:'Missing evidence produced a safe stop instead of an unsupported business answer.'}
  if(event?.type==='human_approved')return {systemEvent:'Authenticated learner approved the proposed action.',commentary:'A signed-in human accepted the proposal. The system may now attempt the one authorised sandbox action.',businessMeaning:'A named human accepted responsibility, and the approval remains part of the permanent evidence trail.'}
  if(event?.type==='human_rejected')return {systemEvent:'Authenticated learner rejected the proposed action.',commentary:'A signed-in human rejected the proposal. The execution permission is now closed and the action cannot run.',businessMeaning:'Human authority stopped the sensitive operation, while preserving proof of the decision.'}
  if(event?.type==='run_rejected')return {systemEvent:'Run closed safely after human rejection.',commentary:'The run is complete. No action executed, and the rejected proposal can no longer be resumed.',businessMeaning:'This is an operationally correct security outcome even when an approval-path learning contract is not satisfied.'}
  if(event?.type==='run_failed')return {systemEvent:event.message,commentary:'The run encountered an unexpected technical failure and stopped without allowing a sensitive action to proceed.',businessMeaning:'The failure is visible and recorded; it was not silently treated as success.'}
  if(definition.key==='knowledge'&&state==='not_required')return {systemEvent:'Not required for this scenario.',commentary:'This request did not need company knowledge, so the system correctly skipped retrieval instead of performing unnecessary AI work.',businessMeaning:'Skipping an unnecessary dependency reduces cost, latency and failure surface.'}
  if(definition.key==='approval'&&state==='not_required')return {systemEvent:'Human approval was not required.',commentary:'The final rules classified this operation as low risk, so no approval queue was created.',businessMeaning:'Low-risk work can continue without unnecessary delay while sensitive work remains gated.'}
  if(definition.key==='human'&&state==='not_required')return {systemEvent:'No human decision was required.',commentary:'This path was authorised by the low-risk rules and did not need a person to intervene.',businessMeaning:'Human attention is reserved for decisions where responsibility genuinely matters.'}
  if(definition.key==='human'&&state==='waiting')return {systemEvent:'Waiting for an authenticated human decision.',commentary:'The system has paused safely. Nothing will execute until the learner explicitly approves or rejects the proposal.',businessMeaning:'The business remains in control at the exact point where risk becomes action.'}
  if(definition.key==='action'&&state==='blocked')return {systemEvent:'Prevented by design.',commentary:run.status==='rejected'?'Human rejection permanently prevented this action from executing.':'The execution boundary remains locked until the required condition is satisfied.',businessMeaning:'Zero actions is the expected security result—not an incomplete workflow.'}
  if(definition.key==='completion'&&state==='not_required'&&run.scenarioKey==='D')return {systemEvent:'Not required for this scenario.',commentary:'Scenario D intentionally proves that a sensitive request can remain safely paused at the approval boundary.',businessMeaning:'The pending approval record is the required final evidence for this learning contract.'}
  if(state==='processing')return {systemEvent:'Currently processing.',commentary:'The protected backend is working on this stage and will publish the stored result when it is ready.',businessMeaning:'The interface is following real persisted state rather than pretending the step has completed.'}
  return {systemEvent:event?.message??definition.systemEvent,commentary:definition.commentary,businessMeaning:definition.businessMeaning}
}

export function buildExecutionStory(run:CapstoneRun):StoryStage[] {
  return stageDefinitions.map((definition)=>{
    const event=eventFor(run,definition)
    const state=stageState(run,definition,event)
    return {...definition,...stageCopy(run,definition,state,event),state,event}
  })
}

const requestLabel=(value:string)=>value.replaceAll('_',' ')

export function buildExecutiveSummary(run:CapstoneRun):string {
  const input=run.input??{}
  const amount=Number(input.amount??0)
  const request=`${amount>0?`A €${amount} `:'A '}${requestLabel(run.requestType)} request`
  const aiRisk=String((run.classification?.risk as Record<string,unknown>|undefined)?.aiSuggestion??run.riskLevel??'unavailable')
  const knowledge=run.ragUsed?` Approved knowledge was retrieved${run.citations.length?` from ${run.citations.join(', ')}`:''}.`:''
  const rules=run.approvalRequired?' Business rules required human approval.':' Business rules confirmed that human approval was not required.'
  const human=run.decision==='approved'?' An authenticated learner approved the proposal.':run.decision==='rejected'?' An authenticated learner rejected the proposal.':''
  const actions=run.actions.filter((action)=>action.status==='executed').length
  const outcome=run.decision==='knowledge_insufficient'?' Approved evidence was insufficient, so the system refused to invent an answer and executed zero actions.':run.status==='rejected'?` No action executed, and the run closed safely.`:run.status==='failed'?' The run failed safely and recorded the failure evidence.':run.status==='pending_approval'?' The action remains blocked at the human approval boundary.':` ${actions} sandbox action${actions===1?'':'s'} executed and ${actions} receipt${actions===1?' was':'s were'} recorded.`
  const duration=run.durationMs==null?'':` The recorded process took ${(run.durationMs/1000).toFixed(run.durationMs<10000?1:0)} seconds.`
  return `${request} was received from an authenticated learner. AI suggested ${aiRisk} risk.${knowledge}${rules}${human}${outcome}${duration}`
}

const proofByScenario:Record<string,string>={
  A:'You proved that a low-risk request can pass independent rules and execute once without unnecessary human approval.',
  B:'You proved correct retrieval across three approved policies and a safe refusal when the requested knowledge did not exist.',
  C:'You proved that temporary external-service failures can be retried, recovered and preserved as operational evidence.',
  D:'You proved that a sensitive request stops before execution and remains safely pending for human authority.',
  E:'You proved that explicit human approval can unlock exactly one sandbox action and one receipt.',
  F:'You proved that human rejection permanently prevents a sensitive action while preserving an accountable record.',
}

export function learningOutcome(run:CapstoneRun,verified:boolean){
  if(verified)return {tone:'passed',title:`Scenario ${run.scenarioKey} learning contract verified`,body:proofByScenario[run.scenarioKey]??'You produced verified operational evidence.'}
  if(run.scenarioKey==='B')return run.decision==='knowledge_insufficient'
    ?{tone:'correct',title:'Safe refusal ready for verification',body:'Approved evidence was unavailable, so the system refused to invent a dress-code answer and executed zero actions. Verify this test, then complete the remaining knowledge contracts.'}
    :{tone:'pending',title:'Knowledge source ready for verification',body:'Confirm that this answer cites the expected approved source, verify this test, then continue until all four knowledge contracts are complete.'}
  if(run.scenarioKey==='E'&&run.status==='rejected')return {tone:'correct',title:'Security correct · learning contract not yet satisfied',body:'Rejection correctly prevented the action and closed the run safely. Scenario E specifically tests the approval path, so run E again and approve it to prove exactly-once execution.'}
  if(run.scenarioKey==='F'&&run.status==='completed')return {tone:'correct',title:'Operation authorised · learning contract not yet satisfied',body:'The approved action completed correctly, but Scenario F tests the rejection path. Run F again and reject it to prove that execution remains impossible.'}
  if(run.status==='failed')return {tone:'failed',title:'Unexpected failure recorded safely',body:'The system preserved failure evidence and prevented unsafe execution. Review the audit story before starting a fresh run.'}
  return {tone:'pending',title:`Scenario ${run.scenarioKey} evidence is ready for review`,body:proofByScenario[run.scenarioKey]??'Review the recorded outcome, then verify the scenario contract.'}
}

const auditMeanings:Record<string,string>={
  request_received:'The system established who initiated the operation and opened a traceable run before processing it.',
  input_validated:'Only bounded, permitted input was allowed to continue into the AI and tool layers.',
  ai_classified:'AI supplied a recommendation, but it did not receive authority to make the final business decision.',
  knowledge_retrieved:'The decision now includes approved source evidence that can be reviewed later.',
  knowledge_insufficient:'The system refused to present an unsupported answer as grounded knowledge.',
  risk_evaluated:'Independent business rules checked the proposal and retained final control over risk.',
  service_retry:'A temporary dependency failure was visible, counted and retried instead of being hidden.',
  service_recovered:'The dependency became healthy and the run continued with its failure history preserved.',
  approval_requested:'The sensitive action stopped before execution and now requires named human responsibility.',
  human_approved:'A named human accepted responsibility for this sensitive action; the approval is timestamped and reviewable.',
  human_rejected:'A named human refused the proposal, permanently withholding execution permission.',
  action_claimed:'The action slot was reserved exactly once, protecting the business from duplicate side effects.',
  action_executed:'The authorised sandbox action completed and produced a traceable receipt.',
  run_completed:'The final outcome, duration and execution evidence were stored for monitoring and review.',
  run_rejected:'The run closed safely with zero actions after the human rejection.',
  run_failed:'The technical failure was recorded and the system failed closed instead of silently continuing.',
}

export function auditBusinessMeaning(event:CapstoneEvent){
  if(event.type==='knowledge_retrieved'&&event.outcome==='blocked')return 'Approved evidence was unavailable, so the system refused to invent an answer and closed this knowledge path safely.'
  return auditMeanings[event.type]??'This event is part of the permanent evidence trail for the run.'
}
