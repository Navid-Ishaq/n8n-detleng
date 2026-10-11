import { ArrowLeft, ArrowRight, LogOut, Network, ShieldCheck } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Footer } from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { callLessonApi } from '../lib/lesson-api'
import { supabase } from '../lib/supabase'
import { Lesson02Opening } from './Lesson02Story'
import { ArraysStage, CaptureStage, ChallengeStage, CompletionStage, NestedFieldsStage, NormalizerStage, PublishStage, ReadShapeStage } from './Lesson02InteractiveStages'
import { advanceLesson02Progress, readLesson02AttemptCache, readLesson02Cache, reconcileLesson02Progress, writeLesson02AttemptCache, writeLesson02Cache } from './lesson02-cache'
import { lesson02CanComplete, lesson02InitialProgress, lesson02Stages } from './lesson02-config'
import { computeLesson02Status } from './lesson02-status'
import type { Lesson02Progress } from './lesson02-types'
import { StageIndicator } from './StageIndicator'
import type { LiveResult } from './types'

type Feedback = { passed: boolean; message: string }
type AttemptSummary = { attempt_number: number; status: string; completed_at: string | null }
const missionRequested = () => new URLSearchParams(window.location.search).get('view') === 'mission'
const attemptFromUrl = () => { const value = Number(new URLSearchParams(window.location.search).get('attempt')); return Number.isInteger(value) && value >= 2 ? value : null }
const passed = (progress: Lesson02Progress, id: string) => ({ ...progress.stageStates, [id]: 'passed' as const })

export function Lesson02Lab() {
  const { user, session, logout } = useAuth()
  const [attemptNumber, setAttemptNumber] = useState<number | null>(attemptFromUrl)
  const [progress, setProgress] = useState<Lesson02Progress>(() => user ? (attemptFromUrl() ? readLesson02AttemptCache(user.id, attemptFromUrl()!) : readLesson02Cache(user.id))?.progress ?? structuredClone(lesson02InitialProgress) : structuredClone(lesson02InitialProgress))
  const progressRef = useRef(progress); const saveSequence = useRef(0); const startedAt = useRef<string | null>(null); const completedAt = useRef<string | null>(null)
  const [prerequisite, setPrerequisite] = useState<'loading'|'blocked'|'ready'>('loading')
  const [loading, setLoading] = useState(true); const [saveState, setSaveState] = useState(''); const [syncPending, setSyncPending] = useState(false); const [showIntro, setShowIntro] = useState(missionRequested)
  const [testUrl, setTestUrl] = useState(''); const [productionUrl, setProductionUrl] = useState(''); const [busy, setBusy] = useState('')
  const [feedback, setFeedback] = useState<Feedback | null>(null); const [liveResults, setLiveResults] = useState<LiveResult[]>([])
  const [canonicalCompleted, setCanonicalCompleted] = useState(false); const [attempts, setAttempts] = useState<AttemptSummary[]>([])
  const [creatingAttempt, setCreatingAttempt] = useState(false); const [repeatError, setRepeatError] = useState(''); const creatingAttemptRef = useRef(false)
  useEffect(() => { progressRef.current = progress }, [progress])

  const persist = useCallback(async (next: Lesson02Progress, complete = false) => {
    if (!user) return false
    const request = ++saveSequence.current; const now = new Date().toISOString(); const doneAt = complete || next.completed ? completedAt.current ?? now : null
    if (attemptNumber) writeLesson02AttemptCache(user.id, attemptNumber, next, true); else writeLesson02Cache(user.id, next, true)
    setSyncPending(true); setSaveState('Saving…')
    const payload = { status: complete ? 'Completed' : computeLesson02Status(next), progress_data: next, current_stage: next.currentStage, completed_at: doneAt, updated_at: now }
    const { error } = attemptNumber
      ? await supabase.from('lesson_attempts').update(payload).eq('user_id', user.id).eq('lesson_id', 2).eq('attempt_number', attemptNumber)
      : await supabase.from('lesson_progress').upsert({ user_id: user.id, lesson_id: 2, started_at: startedAt.current ?? now, last_activity_at: now, ...payload }, { onConflict: 'user_id,lesson_id' })
    if (error) { console.error('Lesson 02 sync failed', error); if (request === saveSequence.current) setSaveState('Saved locally. Detleng will retry when the connection returns.'); return false }
    startedAt.current ??= now; completedAt.current = doneAt
    if (request === saveSequence.current && progressRef.current.revision === next.revision) {
      if (attemptNumber) writeLesson02AttemptCache(user.id, attemptNumber, next, false); else writeLesson02Cache(user.id, next, false)
      setSyncPending(false); setSaveState('Progress saved')
    }
    return true
  }, [attemptNumber, user])

  const update = useCallback((patch: Partial<Lesson02Progress>) => {
    const next = advanceLesson02Progress(progressRef.current, patch); progressRef.current = next; setProgress(next)
    if (user) { if (attemptNumber) writeLesson02AttemptCache(user.id, attemptNumber, next, true); else writeLesson02Cache(user.id, next, true); setSyncPending(true) }
    void persist(next); return next
  }, [attemptNumber, persist, user])

  const navigateAttempt = useCallback((number: number | null, mission = false) => {
    const url = new URL(window.location.href); if (number) url.searchParams.set('attempt', String(number)); else url.searchParams.delete('attempt')
    if (mission) url.searchParams.set('view', 'mission'); else url.searchParams.delete('view')
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`); startedAt.current = null; completedAt.current = null; saveSequence.current += 1
    setAttemptNumber(number); setShowIntro(mission); setProductionUrl(''); setFeedback(null); setLiveResults([]); setLoading(true)
  }, [])

  useEffect(() => {
    if (!user) return
    const cached = attemptNumber ? readLesson02AttemptCache(user.id, attemptNumber) : readLesson02Cache(user.id)
    const currentQuery = attemptNumber
      ? supabase.from('lesson_attempts').select('progress_data,current_stage,started_at,completed_at,updated_at').eq('user_id', user.id).eq('lesson_id', 2).eq('attempt_number', attemptNumber).maybeSingle()
      : supabase.from('lesson_progress').select('progress_data,current_stage,started_at,completed_at,updated_at').eq('user_id', user.id).eq('lesson_id', 2).maybeSingle()
    Promise.all([
      supabase.from('lesson_progress').select('status').eq('user_id', user.id).eq('lesson_id', 1).maybeSingle(), currentQuery,
      supabase.from('lesson_connections').select('webhook_url,connection_status').eq('user_id', user.id).eq('lesson_id', 2).maybeSingle(),
      supabase.from('lesson_progress').select('status').eq('user_id', user.id).eq('lesson_id', 2).maybeSingle(),
      supabase.from('lesson_attempts').select('attempt_number,status,completed_at').eq('user_id', user.id).eq('lesson_id', 2).order('attempt_number', { ascending: false }),
    ]).then(([lesson01, current, connection, canonical, attemptList]) => {
      if (lesson01.error || lesson01.data?.status !== 'Completed') { setPrerequisite('blocked'); setLoading(false); return }
      setPrerequisite('ready'); const isCanonicalComplete = canonical.data?.status === 'Completed'; setCanonicalCompleted(isCanonicalComplete); setAttempts((attemptList.data as AttemptSummary[] | null) ?? [])
      if (!attemptNumber && connection.data?.webhook_url) setProductionUrl(connection.data.webhook_url)
      if (attemptNumber && !isCanonicalComplete) { navigateAttempt(null); return }
      if (current.error) { const fallback = cached?.progress ?? structuredClone(lesson02InitialProgress); progressRef.current = fallback; setProgress(fallback); setSyncPending(true); setSaveState('Saved locally. Detleng will retry when the connection returns.'); setLoading(false); return }
      if (attemptNumber && !current.data) { navigateAttempt(null); return }
      startedAt.current = current.data?.started_at ?? null; completedAt.current = current.data?.completed_at ?? null
      const server = current.data ? { ...(current.data.progress_data as object), currentStage: current.data.current_stage, clientUpdatedAt: (current.data.progress_data as {clientUpdatedAt?:string})?.clientUpdatedAt || current.data.updated_at } : null
      const next = current.data ? reconcileLesson02Progress(server, cached) : cached?.progress ?? structuredClone(lesson02InitialProgress)
      if (attemptNumber && next.productionConnected && connection.data?.webhook_url) setProductionUrl(connection.data.webhook_url)
      progressRef.current = next; setProgress(next); setShowIntro(missionRequested() || next.revision === 0 && !next.completed); setLoading(false)
      if (!current.data || cached?.syncPending) void persist(next)
    })
  }, [attemptNumber, navigateAttempt, persist, user])

  useEffect(() => { const retry = () => { if (user) void persist(progressRef.current, progressRef.current.completed) }; window.addEventListener('online', retry); return () => window.removeEventListener('online', retry) }, [persist, user])
  useEffect(() => { const sync = () => { const nextAttempt = attemptFromUrl(); setShowIntro(missionRequested()); if (nextAttempt !== attemptNumber) { startedAt.current = null; completedAt.current = null; setAttemptNumber(nextAttempt); setProductionUrl(''); setLoading(true) } }; window.addEventListener('popstate', sync); return () => window.removeEventListener('popstate', sync) }, [attemptNumber])

  const navigateMission = (open: boolean) => { const url = new URL(window.location.href); if (open) url.searchParams.set('view','mission'); else url.searchParams.delete('view'); window.history.pushState({},'',url.pathname+url.search+url.hash); setShowIntro(open) }
  const stage = progress.viewedStage; const status = computeLesson02Status(progress); const index = lesson02Stages.findIndex((item) => item.id === stage); const canComplete = lesson02CanComplete(progress)
  const canOpen = (id: string) => { const target = lesson02Stages.findIndex((item) => item.id === id); const furthest = lesson02Stages.findIndex((item) => item.id === progress.currentStage); return target <= furthest || id === 'read-shape' || id === 'complete' && canComplete }
  const go = (id: string) => { if (!canOpen(id)) return; const target = lesson02Stages.findIndex((item) => item.id === id); const furthest = lesson02Stages.findIndex((item) => item.id === progressRef.current.currentStage); update({ viewedStage:id, currentStage:target>furthest?id:progressRef.current.currentStage, stageStates:{...progressRef.current.stageStates,[id]:progressRef.current.stageStates[id]==='passed'?'passed':'in_progress'} }); window.scrollTo({top:0,behavior:'smooth'}) }
  const finish = (id: string, field: keyof Lesson02Progress, nextId: string) => update({ [field]:true, viewedStage:nextId, currentStage:nextId, stageStates:{...passed(progressRef.current,id),[nextId]:'in_progress'} })

  async function runApi(action: string, path: string, webhookUrl: string) { setBusy(action); setFeedback(null); try { return await callLessonApi(path, session, { webhookUrl }) } catch (error) { setFeedback({ passed:false, message:error instanceof Error?error.message:'The live test could not be completed.' }); return null } finally { setBusy('') } }
  async function sendTestEvent() { const result = await runApi('test-event','/api/lessons/json/test-event',testUrl); if (result) setFeedback({passed:result.passed,message:result.message||'Nested JSON reached n8n.'}) }
  async function connectProduction() {
    const result = await runApi('connect','/api/lessons/json/connect',productionUrl); if (!result) return
    if (!result.passed) { setFeedback({passed:false,message:result.message||'The production JSON contract needs attention.'}); return }
    const now = new Date().toISOString(); const { error } = await supabase.from('lesson_connections').upsert({user_id:user!.id,lesson_id:2,webhook_url:productionUrl,connection_status:'valid',last_tested_at:now,updated_at:now},{onConflict:'user_id,lesson_id'})
    if (error) { setFeedback({passed:false,message:'The workflow passed, but Detleng could not save the private connection.'}); return }
    update({productionConnected:true}); setFeedback({passed:true,message:'PRODUCTION WORKFLOW CONNECTED ✓ Detleng saved only its public webhook address, not your n8n credentials.'})
  }
  async function runLive(mode: 'live'|'break'|'repair') {
    const path = mode==='live'?'/api/lessons/json/live-test':mode==='break'?'/api/lessons/json/break-test':'/api/lessons/json/repair-test'
    const result = await runApi(mode,path,productionUrl); if (!result) return; setLiveResults(result.results??[])
    if (mode==='live'&&result.passed) update({normalLivePassed:true,variableLivePassed:true,missingCountryLivePassed:true})
    if (mode==='break'&&result.passed) update({breakObserved:true}); if (mode==='repair'&&result.passed) update({repairPassed:true})
    setFeedback({passed:result.passed,message:result.message||(result.passed?'Live verification passed.':'The real workflow contract needs attention.')})
  }
  async function complete() { if (!lesson02CanComplete(progressRef.current)) return; const next=advanceLesson02Progress(progressRef.current,{completed:true,currentStage:'complete',viewedStage:'complete',stageStates:passed(progressRef.current,'complete')}); if(await persist(next,true)){progressRef.current=next;setProgress(next);setCanonicalCompleted(true);setSaveState(attemptNumber?`Practice attempt ${attemptNumber} completed.`:'Lesson 02 completed. Your dashboard is updated.')} }
  async function startRepeatAttempt() {
    if (!user || !(canonicalCompleted || progressRef.current.completed) || creatingAttemptRef.current) return
    creatingAttemptRef.current=true;setCreatingAttempt(true);setRepeatError('')
    try { const {data,error}=await supabase.from('lesson_attempts').select('attempt_number,status').eq('user_id',user.id).eq('lesson_id',2).order('attempt_number',{ascending:false});if(error)throw error
      const unfinished=data?.find((item)=>item.status!=='Completed');if(unfinished){navigateAttempt(unfinished.attempt_number,true);return}
      const nextNumber=data?.length?data[0].attempt_number+1:2;const fresh={...structuredClone(lesson02InitialProgress),clientUpdatedAt:new Date().toISOString()}
      const {error:insertError}=await supabase.from('lesson_attempts').insert({user_id:user.id,lesson_id:2,attempt_number:nextNumber,status:'Learning',current_stage:'read-shape',progress_data:fresh});if(insertError)throw insertError
      writeLesson02AttemptCache(user.id,nextNumber,fresh,false);setAttempts((current)=>[{attempt_number:nextNumber,status:'Learning',completed_at:null},...current]);navigateAttempt(nextNumber,true)
    } catch (error) { console.error('Could not create Lesson 02 attempt',error);setRepeatError('A fresh attempt could not be started. Check your connection, then try again.') }
    finally {creatingAttemptRef.current=false;setCreatingAttempt(false)}
  }

  if (loading || prerequisite==='loading') return <main className="route-loading"><p>Loading Lesson 02…</p></main>
  if (prerequisite==='blocked') return <div className="portal-page"><header className="portal-header"><a className="back-link" href="/dashboard"><ArrowLeft size={18}/> Dashboard</a></header><main className="portal-main prerequisite-shell"><div className="prerequisite-card"><ShieldCheck size={42}/><p className="eyebrow">Lesson 02 prerequisite</p><h1>Complete Lesson 01 first.</h1><a className="button button--primary" href="/lessons/n8n-core">Open Lesson 01 <ArrowRight size={17}/></a></div></main><Footer/></div>
  const content = stage==='read-shape'?<ReadShapeStage onContinue={()=>finish('read-shape','shapeRead','capture-payload')}/>:
    stage==='capture-payload'?<CaptureStage testUrl={testUrl} setTestUrl={setTestUrl} busy={busy==='test-event'} feedback={feedback} onSend={()=>void sendTestEvent()} onContinue={()=>finish('capture-payload','payloadCaptured','nested-fields')}/>:
    stage==='nested-fields'?<NestedFieldsStage onContinue={()=>finish('nested-fields','nestedFieldsBuilt','arrays')}/>:
    stage==='arrays'?<ArraysStage onContinue={()=>finish('arrays','arraysExplored','build-normalizer')}/>:
    stage==='build-normalizer'?<NormalizerStage onContinue={()=>finish('build-normalizer','normalizerBuilt','publish-connect')}/>:
    stage==='publish-connect'?<PublishStage productionUrl={productionUrl} setProductionUrl={setProductionUrl} busy={busy==='connect'} feedback={feedback} onConnect={()=>void connectProduction()} onContinue={()=>finish('publish-connect','publishUnderstood','live-challenge')}/>:
    stage==='live-challenge'?<ChallengeStage busy={busy} results={liveResults} feedback={feedback} onLive={()=>void runLive('live')} onBreak={()=>void runLive('break')} onRepair={()=>void runLive('repair')} onContinue={()=>finish('live-challenge','liveChallengePracticed','complete')}/>:
    <CompletionStage canComplete={canComplete} completed={progress.completed} onComplete={()=>void complete()} onPracticeAgain={()=>void startRepeatAttempt()} creatingAttempt={creatingAttempt} repeatError={repeatError}/>
  const openingMode=progress.completed?'completed':progress.revision>0?'progress':'new'; const practiceCount=(canonicalCompleted?1:0)+attempts.filter((item)=>item.status==='Completed').length
  return <div className="portal-page"><header className="portal-header"><a className="back-link" href="/dashboard"><ArrowLeft size={18}/> Dashboard</a><div className="portal-header-actions"><a className="brand brand--compact" href="/"><span className="brand-mark"><Network size={19}/></span><span>n8n <strong>Detleng</strong></span></a><button className="button button--ghost" onClick={()=>void logout()}><LogOut size={17}/> Log out</button></div></header><main className="portal-main lab-shell lesson02-shell">{showIntro?<Lesson02Opening mode={openingMode} stageNumber={Math.max(1,lesson02Stages.findIndex((item)=>item.id===progress.currentStage)+1)} onPrimary={()=>navigateMission(false)} onReview={()=>{navigateMission(false);go('read-shape')}} onSummary={()=>{navigateMission(false);go('complete')}}/>:<><div className="lab-hero"><div><p className="eyebrow">Lesson 02 · {attemptNumber?`Practice Attempt ${attemptNumber}`:'Interactive JSON Lab'}</p><h1>Learn the Language<br/>Your Automations Speak</h1><p className="portal-lede">See the shape. Follow the path. Transform it in n8n. Prove the contract live.</p>{canonicalCompleted&&<p className="practice-stat">Practiced {practiceCount} {practiceCount===1?'time':'times'}</p>}</div><div className="lab-hero-side"><div className={`lab-status lab-status--${status.toLowerCase().replaceAll(' ','-')}`}><span>Automatic status</span><strong>{status}</strong><small>{saveState||'Meaningful milestones sync to your learner account.'}</small>{syncPending&&<button className="sync-retry" onClick={()=>void persist(progressRef.current,progressRef.current.completed)}>Retry sync</button>}</div><button className="button button--light" onClick={()=>navigateMission(true)}>View lesson mission</button></div></div><div className="lesson02-signature"><span>MESSY REAL-WORLD JSON</span><b>→</b><span>SHAPE</span><b>→</b><span>PATH</span><b>→</b><span>TRANSFORM</span><b>→</b><span>CLEAN CONTRACT</span></div><StageIndicator stages={lesson02Stages} current={stage} states={progress.stageStates} onSelect={go} isEnabled={canOpen}/><section className="lab-panel lesson02-panel">{content}</section><div className="lab-controls"><button className="button button--light" disabled={index<=0} onClick={()=>go(lesson02Stages[index-1]?.id)}>Previous</button><span>Stage {index+1} of {lesson02Stages.length}</span><button className="button button--light" disabled={index>=lesson02Stages.length-1||!canOpen(lesson02Stages[index+1]?.id)} onClick={()=>go(lesson02Stages[index+1]?.id)}>Next</button></div></>}</main><Footer/></div>
}
