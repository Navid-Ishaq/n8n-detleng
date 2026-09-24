import { ArrowLeft, ArrowRight, LogOut, Network, ShieldCheck } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Footer } from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Lesson02Completion, Lesson02Opening } from './Lesson02Story'
import { Lesson02Stage01, Lesson02Stage02, Lesson02Stage03, Lesson02Stage04, Lesson02Stage05, Lesson02Stage06, StageHeader } from './Lesson02Guidance'
import { advanceLesson02Progress, readLesson02Cache, reconcileLesson02Progress, writeLesson02Cache } from './lesson02-cache'
import { lesson02CanComplete, lesson02InitialProgress, lesson02Stages } from './lesson02-config'
import { computeLesson02Status } from './lesson02-status'
import type { Lesson02Progress } from './lesson02-types'
import { StageIndicator } from './StageIndicator'

const missionRequested=()=>new URLSearchParams(window.location.search).get('view')==='mission'
const passed=(progress:Lesson02Progress,id:string)=>({...progress.stageStates,[id]:'passed' as const})

export function Lesson02Lab(){
  const {user,logout}=useAuth()
  const [prerequisite,setPrerequisite]=useState<'loading'|'blocked'|'ready'>('loading')
  const [progress,setProgress]=useState<Lesson02Progress>(()=>user?readLesson02Cache(user.id)?.progress??structuredClone(lesson02InitialProgress):structuredClone(lesson02InitialProgress))
  const ref=useRef(progress); const sequence=useRef(0); const startedAt=useRef<string|null>(null); const completedAt=useRef<string|null>(null)
  const [loading,setLoading]=useState(true); const [saveState,setSaveState]=useState(''); const [syncPending,setSyncPending]=useState(false); const [showIntro,setShowIntro]=useState(missionRequested)
  useEffect(()=>{ref.current=progress},[progress])

  const persist=useCallback(async(next:Lesson02Progress,complete=false)=>{
    if(!user)return false
    const request=++sequence.current,now=new Date().toISOString(),doneAt=complete||next.completed?completedAt.current??now:null
    writeLesson02Cache(user.id,next,true); setSyncPending(true); setSaveState('Saving…')
    const {error}=await supabase.from('lesson_progress').upsert({user_id:user.id,lesson_id:2,status:complete?'Completed':computeLesson02Status(next),progress_data:next,current_stage:next.currentStage,started_at:startedAt.current??now,last_activity_at:now,completed_at:doneAt,updated_at:now},{onConflict:'user_id,lesson_id'})
    if(error){console.error('Lesson 02 sync failed',error);if(request===sequence.current)setSaveState('Your progress is saved locally and will sync when the connection is restored.');return false}
    startedAt.current??=now;completedAt.current=doneAt
    if(request===sequence.current&&ref.current.revision===next.revision){writeLesson02Cache(user.id,next,false);setSyncPending(false);setSaveState('Progress saved')}
    return true
  },[user])
  const update=useCallback((patch:Partial<Lesson02Progress>)=>{const next=advanceLesson02Progress(ref.current,patch);ref.current=next;setProgress(next);if(user){writeLesson02Cache(user.id,next,true);setSyncPending(true)}void persist(next);return next},[persist,user])

  useEffect(()=>{if(!user)return;const cached=readLesson02Cache(user.id);Promise.all([
    supabase.from('lesson_progress').select('status').eq('user_id',user.id).eq('lesson_id',1).maybeSingle(),
    supabase.from('lesson_progress').select('progress_data,current_stage,started_at,completed_at,updated_at').eq('user_id',user.id).eq('lesson_id',2).maybeSingle(),
  ]).then(([lesson01,current])=>{if(lesson01.error||lesson01.data?.status!=='Completed'){setPrerequisite('blocked');setLoading(false);return}setPrerequisite('ready')
    if(current.error){const fallback=cached?.progress??structuredClone(lesson02InitialProgress);ref.current=fallback;setProgress(fallback);setSyncPending(true);setSaveState('Your progress is saved locally and will sync when the connection is restored.');setLoading(false);return}
    startedAt.current=current.data?.started_at??null;completedAt.current=current.data?.completed_at??null
    const server=current.data?{...(current.data.progress_data as object),currentStage:current.data.current_stage,clientUpdatedAt:(current.data.progress_data as {clientUpdatedAt?:string})?.clientUpdatedAt||current.data.updated_at}:null
    const next=current.data?reconcileLesson02Progress(server,cached):cached?.progress??structuredClone(lesson02InitialProgress);ref.current=next;setProgress(next);setShowIntro(missionRequested()||(next.revision===0&&!next.completed));setLoading(false)
  })},[user])
  useEffect(()=>{const sync=()=>setShowIntro(missionRequested());window.addEventListener('popstate',sync);return()=>window.removeEventListener('popstate',sync)},[])
  useEffect(()=>{const retry=()=>void persist(ref.current,ref.current.completed);window.addEventListener('online',retry);return()=>window.removeEventListener('online',retry)},[persist])

  const navigateMission=(open:boolean)=>{const url=new URL(window.location.href);if(open){url.searchParams.set('view','mission')}else{url.searchParams.delete('view')}window.history.pushState({},'',url.pathname+url.search+url.hash);setShowIntro(open)}
  const stage=progress.viewedStage,status=computeLesson02Status(progress),index=lesson02Stages.findIndex(item=>item.id===stage),canComplete=lesson02CanComplete(progress)
  const completedByStage:Record<string,boolean>={'create-workflow':progress.workflowCreated,'sample-payload':progress.samplePayloadRun,normalize:progress.normalizerBuilt,'dynamic-test':progress.dynamicTestPassed,'break-repair':progress.breakRepairCompleted,export:progress.workflowExported}
  const canOpen=(id:string)=>{const target=lesson02Stages.findIndex(item=>item.id===id);const furthest=lesson02Stages.findIndex(item=>item.id===progress.currentStage);return target<=furthest||id==='create-workflow'||(id==='complete'&&canComplete)}
  const go=(id:string)=>{if(!canOpen(id))return;const target=lesson02Stages.findIndex(item=>item.id===id),furthest=lesson02Stages.findIndex(item=>item.id===ref.current.currentStage);update({viewedStage:id,currentStage:target>furthest?id:ref.current.currentStage,stageStates:{...ref.current.stageStates,[id]:ref.current.stageStates[id]==='passed'?'passed':'in_progress'}});window.scrollTo({top:0,behavior:'smooth'})}
  const finish=(id:string,field:keyof Lesson02Progress,nextId:string)=>update({[field]:true,viewedStage:nextId,currentStage:nextId,stageStates:{...passed(ref.current,id),[nextId]:'in_progress'}})
  const complete=async()=>{if(!lesson02CanComplete(ref.current))return;const next=advanceLesson02Progress(ref.current,{completed:true,currentStage:'complete',viewedStage:'complete',stageStates:passed(ref.current,'complete')});if(await persist(next,true)){ref.current=next;setProgress(next);setSaveState('Lesson 02 completed. Your dashboard is updated.')}}
  const checks=lesson02Stages.slice(0,-1).map(item=>[item.label,completedByStage[item.id]] as const)

  if(loading||prerequisite==='loading')return <main className="route-loading"><p>Loading Lesson 02…</p></main>
  if(prerequisite==='blocked')return <div className="portal-page"><header className="portal-header"><a className="back-link" href="/dashboard"><ArrowLeft size={18}/> Dashboard</a></header><main className="portal-main prerequisite-shell"><div className="prerequisite-card"><ShieldCheck size={42}/><p className="eyebrow">Lesson 02 prerequisite</p><h1>Complete Lesson 01 first.</h1><a className="button button--primary" href="/lessons/n8n-core">Open Lesson 01 <ArrowRight size={17}/></a></div></main><Footer/></div>
  const openingMode=progress.completed?'completed':progress.revision>0?'progress':'new'
  const content=stage==='create-workflow'?<Lesson02Stage01 onContinue={()=>finish('create-workflow','workflowCreated','sample-payload')}/>:stage==='sample-payload'?<Lesson02Stage02 onContinue={()=>finish('sample-payload','samplePayloadRun','normalize')}/>:stage==='normalize'?<Lesson02Stage03 onContinue={()=>finish('normalize','normalizerBuilt','dynamic-test')}/>:stage==='dynamic-test'?<Lesson02Stage04 onContinue={()=>finish('dynamic-test','dynamicTestPassed','break-repair')}/>:stage==='break-repair'?<Lesson02Stage05 onContinue={()=>finish('break-repair','breakRepairCompleted','export')}/>:stage==='export'?<Lesson02Stage06 onContinue={()=>finish('export','workflowExported','complete')}/>:progress.completed?<Lesson02Completion onReview={()=>go('create-workflow')}/>:<><StageHeader number="07" title="Complete Lesson 02" text="Confirm the practical work you completed directly inside n8n."/><div className="completion-grid">{checks.map(([label,ok])=><div className={ok?'completion-item is-pass':'completion-item'} key={label}><span>{ok?'✓':'○'}</span>{label}</div>)}</div><button className="button button--primary complete-button" disabled={!canComplete} onClick={()=>void complete()}>Complete Lesson 02</button></>
  return <div className="portal-page"><header className="portal-header"><a className="back-link" href="/dashboard"><ArrowLeft size={18}/> Dashboard</a><div className="portal-header-actions"><a className="brand brand--compact" href="/"><span className="brand-mark"><Network size={19}/></span><span>n8n <strong>Detleng</strong></span></a><button className="button button--ghost" onClick={()=>void logout()}><LogOut size={17}/> Log out</button></div></header><main className="portal-main lab-shell lesson02-shell">{showIntro?<Lesson02Opening mode={openingMode} stageNumber={Math.max(1,lesson02Stages.findIndex(item=>item.id===progress.currentStage)+1)} onPrimary={()=>navigateMission(false)} onReview={()=>{navigateMission(false);go('create-workflow')}} onSummary={()=>{navigateMission(false);go('complete')}}/>:<><div className="lab-hero"><div><p className="eyebrow">Lesson 02 · Practical Foundation Lab</p><h1>JSON</h1><p className="portal-lede">Build one small workflow. Read the shape. Normalize the order. Fix what breaks.</p></div><div className="lab-hero-side"><div className={`lab-status lab-status--${status.toLowerCase().replaceAll(' ','-')}`}><span>Automatic status</span><strong>{status}</strong><small>{saveState||'Progress syncs to your learner account.'}</small>{syncPending&&<button className="sync-retry" onClick={()=>void persist(ref.current,ref.current.completed)}>Retry sync</button>}</div><button className="button button--light" onClick={()=>navigateMission(true)}>View lesson mission</button></div></div><div className="lab-reminder"><strong>Build in your n8n. Learn in Detleng.</strong><span>No Webhook URL or external credential is required.</span></div><StageIndicator stages={lesson02Stages} current={stage} states={progress.stageStates} onSelect={go} isEnabled={canOpen}/><section className="lab-panel lesson02-panel">{content}</section><div className="lab-controls"><button className="button button--light" disabled={index<=0} onClick={()=>go(lesson02Stages[index-1]?.id)}>Previous</button><span>Stage {index+1} of {lesson02Stages.length}</span><button className="button button--light" disabled={index>=lesson02Stages.length-1||!canOpen(lesson02Stages[index+1]?.id)} onClick={()=>go(lesson02Stages[index+1]?.id)}>Next</button></div></>}</main><Footer/></div>
}
