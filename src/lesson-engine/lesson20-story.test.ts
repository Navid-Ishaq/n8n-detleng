import { describe, expect, it } from 'vitest'
import type { CapstoneRun } from '../lib/capstone-api'
import { buildExecutionStory, buildExecutiveSummary, learningOutcome } from './lesson20-story'

const run=(patch:Partial<CapstoneRun>={}):CapstoneRun=>({id:'run-1',lessonAttemptNumber:1,scenarioKey:'E',requestType:'refund_request',input:{amount:240},classification:{risk:{aiSuggestion:'high'}},aiUsed:true,ragUsed:true,citations:['KB-REFUND-001'],riskLevel:'high',approvalRequired:true,approval:{status:'pending',reason:'Sensitive action',requestedAt:'2026-01-01',decidedAt:null},decision:null,actionState:'blocked',retryCount:0,errorCode:null,status:'pending_approval',startedAt:'2026-01-01',completedAt:null,durationMs:null,events:[
  {sequence:1,type:'request_received',actor:'learner',outcome:'recorded',message:'Authenticated request received.',details:{},at:'2026-01-01'},
  {sequence:2,type:'input_validated',actor:'system',outcome:'passed',message:'Input passed bounded server validation.',details:{},at:'2026-01-01'},
  {sequence:3,type:'ai_classified',actor:'ai',outcome:'passed',message:'AI proposed an intent, action and risk.',details:{},at:'2026-01-01'},
  {sequence:4,type:'knowledge_retrieved',actor:'tool',outcome:'passed',message:'Approved knowledge evidence retrieved.',details:{},at:'2026-01-01'},
  {sequence:5,type:'risk_evaluated',actor:'system',outcome:'blocked',message:'Deterministic rules produced the final system decision.',details:{},at:'2026-01-01'},
  {sequence:6,type:'approval_requested',actor:'system',outcome:'waiting',message:'Sensitive action stopped.',details:{},at:'2026-01-01'},
],actions:[],...patch})

describe('Lesson 20 execution story',()=>{
  it('marks unnecessary RAG and approval stages as intentionally skipped',()=>{
    const lowRisk=run({scenarioKey:'A',requestType:'support_update',input:{amount:0},ragUsed:false,citations:[],riskLevel:'low',approvalRequired:false,approval:null,status:'completed',decision:null,durationMs:900,events:[...run().events.filter((event)=>!['knowledge_retrieved','approval_requested'].includes(event.type)),{sequence:6,type:'action_executed',actor:'tool',outcome:'passed',message:'Executed.',details:{},at:'2026-01-01'},{sequence:7,type:'run_completed',actor:'system',outcome:'passed',message:'Completed.',details:{},at:'2026-01-01'}],actions:[{type:'support',status:'executed',receipt:'DEMO-1',executedAt:'2026-01-01'}]})
    const story=buildExecutionStory(lowRisk)
    expect(story.find((stage)=>stage.key==='knowledge')?.state).toBe('not_required')
    expect(story.find((stage)=>stage.key==='approval')?.state).toBe('not_required')
    expect(story.find((stage)=>stage.key==='human')?.state).toBe('not_required')
    expect(story.find((stage)=>stage.key==='action')?.state).toBe('completed')
  })

  it('shows a pending human decision and a deliberately blocked action',()=>{
    const story=buildExecutionStory(run())
    expect(story.find((stage)=>stage.key==='human')?.state).toBe('waiting')
    expect(story.find((stage)=>stage.key==='action')?.state).toBe('blocked')
  })

  it('treats Scenario D pending approval as its intended terminal evidence',()=>{
    const story=buildExecutionStory(run({scenarioKey:'D'}))
    expect(story.find((stage)=>stage.key==='human')?.state).toBe('waiting')
    expect(story.find((stage)=>stage.key==='action')?.systemEvent).toBe('Prevented by design.')
    expect(story.find((stage)=>stage.key==='completion')?.state).toBe('not_required')
  })

  it('closes a rejected run safely instead of leaving action waiting',()=>{
    const rejected=run({status:'rejected',decision:'rejected',approval:{status:'rejected',reason:null,requestedAt:'2026-01-01',decidedAt:'2026-01-01'},completedAt:'2026-01-01',durationMs:12000,events:[...run().events,{sequence:7,type:'human_rejected',actor:'learner',outcome:'rejected',message:'Rejected.',details:{},at:'2026-01-01'},{sequence:8,type:'run_rejected',actor:'system',outcome:'blocked',message:'Closed.',details:{},at:'2026-01-01'}]})
    const story=buildExecutionStory(rejected)
    expect(story.find((stage)=>stage.key==='human')?.state).toBe('rejected')
    expect(story.find((stage)=>stage.key==='action')?.state).toBe('blocked')
    expect(story.find((stage)=>stage.key==='completion')?.systemEvent).toMatch(/closed safely/i)
    expect(learningOutcome(rejected,false).title).toMatch(/Security correct/)
  })

  it('builds a deterministic report-ready summary',()=>{
    const summary=buildExecutiveSummary(run({status:'completed',decision:'approved',durationMs:46000,actions:[{type:'refund',status:'executed',receipt:'DEMO-1',executedAt:'2026-01-01'}]}))
    expect(summary).toContain('€240')
    expect(summary).toContain('authenticated learner approved')
    expect(summary).toContain('1 sandbox action executed')
    expect(summary).toContain('46 seconds')
  })

  it('explains when Scenario F was operationally valid but followed the wrong learning path',()=>{
    const approvedF=run({scenarioKey:'F',status:'completed',decision:'approved',actions:[{type:'account',status:'executed',receipt:'DEMO-2',executedAt:'2026-01-01'}]})
    expect(learningOutcome(approvedF,false).title).toMatch(/learning contract not yet satisfied/i)
  })
})
