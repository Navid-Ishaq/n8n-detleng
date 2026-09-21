import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, ChevronDown, Link2, LoaderCircle, LogOut, Network, Radio, Send, Wrench } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Footer } from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { callLessonApi } from '../lib/lesson-api'
import { supabase } from '../lib/supabase'
import { LESSON_01_VERSION, lesson01CanComplete, lesson01InitialProgress, lesson01Stages } from './lesson01-config'
import { advanceLesson01Progress, readLesson01AttemptCache, readLesson01Cache, reconcileLesson01Progress, writeLesson01AttemptCache, writeLesson01Cache } from './progress-cache'
import { StageIndicator } from './StageIndicator'
import { computeLesson01Status } from './status'
import { Lesson01CompletionStory, Lesson01Opening } from './Lesson01Story'
import type { Lesson01Progress, LiveResult } from './types'

type Feedback = { passed: boolean; message: string }
type AttemptSummary = { attempt_number: number; status: string; completed_at: string | null }
const markPassed = (progress: Lesson01Progress, stage: string) => ({ ...progress.stageStates, [stage]: 'passed' as const })
const missionViewRequested = () => new URLSearchParams(window.location.search).get('view') === 'mission'
const attemptFromUrl = () => { const value = Number(new URLSearchParams(window.location.search).get('attempt')); return Number.isInteger(value) && value >= 2 ? value : null }

function FeedbackMessage({ passed, message }: Feedback) {
  return <p className={passed ? 'lab-feedback lab-feedback--pass' : 'lab-feedback lab-feedback--fail'} role="status">{passed ? <CheckCircle2 size={20}/> : <AlertCircle size={20}/>} {message}</p>
}

export function Lesson01Lab() {
  const { user, session, logout } = useAuth()
  const [attemptNumber, setAttemptNumber] = useState<number | null>(attemptFromUrl)
  const [progress, setProgress] = useState<Lesson01Progress>(() => user ? (attemptFromUrl() ? readLesson01AttemptCache(user.id, attemptFromUrl()!) : readLesson01Cache(user.id))?.progress ?? structuredClone(lesson01InitialProgress) : structuredClone(lesson01InitialProgress))
  const progressRef = useRef(progress); const saveSequenceRef = useRef(0); const startedAtRef = useRef<string | null>(null); const completedAtRef = useRef<string | null>(null)
  const [loading, setLoading] = useState(true); const [saveState, setSaveState] = useState(''); const [syncPending, setSyncPending] = useState(false)
  const [legacyCompleted, setLegacyCompleted] = useState(false); const [testUrl, setTestUrl] = useState(''); const [productionUrl, setProductionUrl] = useState('')
  const [busy, setBusy] = useState(''); const [feedback, setFeedback] = useState<Feedback | null>(null); const [liveResults, setLiveResults] = useState<LiveResult[]>([])
  const [showIntro, setShowIntro] = useState(missionViewRequested)
  const [canonicalCompleted, setCanonicalCompleted] = useState(false); const [attempts, setAttempts] = useState<AttemptSummary[]>([])
  const [repeatDialog, setRepeatDialog] = useState(false); const [creatingAttempt, setCreatingAttempt] = useState(false)
  const creatingAttemptRef = useRef(false)

  const navigateMission = (open: boolean) => {
    const url = new URL(window.location.href)
    if (open) url.searchParams.set('view', 'mission'); else url.searchParams.delete('view')
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
    setShowIntro(open)
  }

  const navigateAttempt = (number: number | null, mission = false) => {
    const url = new URL(window.location.href)
    if (number) url.searchParams.set('attempt', String(number)); else url.searchParams.delete('attempt')
    if (mission) url.searchParams.set('view', 'mission'); else url.searchParams.delete('view')
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
    startedAtRef.current = null; completedAtRef.current = null; saveSequenceRef.current += 1
    setAttemptNumber(number); setShowIntro(mission); setProductionUrl(''); setFeedback(null); setLiveResults([]); setLoading(true)
  }

  useEffect(() => { progressRef.current = progress }, [progress])
  const persist = useCallback(async (next: Lesson01Progress, complete = false) => {
    if (!user) return false
    const sequence = ++saveSequenceRef.current; const now = new Date().toISOString(); const completedAt = complete || next.completed ? completedAtRef.current ?? now : null
    if (attemptNumber) writeLesson01AttemptCache(user.id, attemptNumber, next, true); else writeLesson01Cache(user.id, next, true)
    setSyncPending(true); setSaveState('Saving…')
    const payload = { status: complete ? 'Completed' : computeLesson01Status(next), progress_data: next, current_stage: next.currentStage, completed_at: completedAt, updated_at: now }
    const { error } = attemptNumber
      ? await supabase.from('lesson_attempts').update(payload).eq('user_id', user.id).eq('lesson_id', 1).eq('lesson_version', LESSON_01_VERSION).eq('attempt_number', attemptNumber)
      : await supabase.from('lesson_progress').upsert({ user_id: user.id, lesson_id: 1, lesson_version: LESSON_01_VERSION, started_at: startedAtRef.current ?? now, last_activity_at: now, ...payload }, { onConflict: 'user_id,lesson_id,lesson_version' })
    if (error) { console.error('Lesson 01 V2 sync failed', error); if (sequence === saveSequenceRef.current) setSaveState('Your progress is saved locally and will sync when the connection is restored.'); return false }
    startedAtRef.current ??= now; completedAtRef.current = completedAt
    if (sequence === saveSequenceRef.current && progressRef.current.revision === next.revision) { if (attemptNumber) writeLesson01AttemptCache(user.id, attemptNumber, next, false); else writeLesson01Cache(user.id, next, false); setSyncPending(false); setSaveState('Progress saved') }
    return true
  }, [attemptNumber, user])

  const updateProgress = useCallback((patch: Partial<Lesson01Progress>) => {
    const next = advanceLesson01Progress(progressRef.current, patch); progressRef.current = next; setProgress(next)
    if (user) { if (attemptNumber) writeLesson01AttemptCache(user.id, attemptNumber, next, true); else writeLesson01Cache(user.id, next, true); setSyncPending(true) }
    void persist(next); return next
  }, [attemptNumber, persist, user])

  useEffect(() => {
    if (!user) return
    const cached = attemptNumber ? readLesson01AttemptCache(user.id, attemptNumber) : readLesson01Cache(user.id)
    const currentQuery = attemptNumber
      ? supabase.from('lesson_attempts').select('progress_data,current_stage,started_at,completed_at,updated_at').eq('user_id', user.id).eq('lesson_id', 1).eq('lesson_version', LESSON_01_VERSION).eq('attempt_number', attemptNumber).maybeSingle()
      : supabase.from('lesson_progress').select('progress_data,current_stage,started_at,completed_at,updated_at').eq('user_id', user.id).eq('lesson_id', 1).eq('lesson_version', LESSON_01_VERSION).maybeSingle()
    Promise.all([
      currentQuery,
      supabase.from('lesson_progress').select('status').eq('user_id', user.id).eq('lesson_id', 1).eq('lesson_version', 1).eq('status', 'Completed').maybeSingle(),
      supabase.from('lesson_connections').select('webhook_url,connection_status').eq('user_id', user.id).eq('lesson_id', 1).eq('lesson_version', LESSON_01_VERSION).maybeSingle(),
      supabase.from('lesson_progress').select('status').eq('user_id', user.id).eq('lesson_id', 1).eq('lesson_version', LESSON_01_VERSION).maybeSingle(),
      supabase.from('lesson_attempts').select('attempt_number,status,completed_at').eq('user_id', user.id).eq('lesson_id', 1).eq('lesson_version', LESSON_01_VERSION).order('attempt_number', { ascending: false }),
    ]).then(([current, legacy, connection, canonical, attemptList]) => {
      const isCanonicalComplete = canonical.data?.status === 'Completed'
      setCanonicalCompleted(isCanonicalComplete); setAttempts((attemptList.data as AttemptSummary[] | null) ?? []); setLegacyCompleted(Boolean(legacy.data))
      if (!attemptNumber && connection.data?.webhook_url) setProductionUrl(connection.data.webhook_url)
      if (attemptNumber && !isCanonicalComplete) { const url = new URL(window.location.href); url.searchParams.delete('attempt'); url.searchParams.delete('view'); window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`); setAttemptNumber(null); setShowIntro(false); setLoading(true); return }
      if (current.error) { console.error('Lesson 01 V2 hydration failed', current.error); const fallback = cached?.progress ?? structuredClone(lesson01InitialProgress); progressRef.current = fallback; setProgress(fallback); setShowIntro(missionViewRequested() || fallback.revision === 0 && !fallback.understandCompleted && !fallback.completed); setSyncPending(true); setSaveState('Your progress is saved locally and will sync when the connection is restored.'); setLoading(false); return }
      if (attemptNumber && !current.data) { const url = new URL(window.location.href); url.searchParams.delete('attempt'); url.searchParams.delete('view'); window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`); setAttemptNumber(null); setShowIntro(false); setLoading(true); return }
      startedAtRef.current = current.data?.started_at ?? null; completedAtRef.current = current.data?.completed_at ?? null
      const server = current.data ? { ...(current.data.progress_data as object), currentStage: current.data.current_stage, clientUpdatedAt: (current.data.progress_data as { clientUpdatedAt?: string })?.clientUpdatedAt || current.data.updated_at } : null
      const next = current.data ? reconcileLesson01Progress(server, cached) : cached?.progress ?? structuredClone(lesson01InitialProgress)
      if (attemptNumber && next.productionConnected && connection.data?.webhook_url) setProductionUrl(connection.data.webhook_url)
      progressRef.current = next; setProgress(next); setShowIntro(missionViewRequested() || next.revision === 0 && !next.understandCompleted && !next.completed); setLoading(false); if (!current.data || cached?.syncPending) void persist(next)
    })
  }, [attemptNumber, persist, user])

  useEffect(() => { const retry = () => { if (user) void persist(progressRef.current, progressRef.current.completed) }; window.addEventListener('online', retry); return () => window.removeEventListener('online', retry) }, [persist, user])
  useEffect(() => { const syncRouteState = () => { const nextAttempt = attemptFromUrl(); setShowIntro(missionViewRequested()); if (nextAttempt !== attemptNumber) { startedAtRef.current = null; completedAtRef.current = null; setAttemptNumber(nextAttempt); setProductionUrl(''); setLoading(true) } }; window.addEventListener('popstate', syncRouteState); return () => window.removeEventListener('popstate', syncRouteState) }, [attemptNumber])

  const stage = progress.viewedStage; const currentIndex = lesson01Stages.findIndex((item) => item.id === stage); const canComplete = lesson01CanComplete(progress); const status = computeLesson01Status(progress)
  const openingMode = progress.completed ? 'completed' : progress.revision > 0 || progress.understandCompleted ? 'progress' : 'new'
  const canOpenStage = (id: string) => {
    if (id === 'understand') return true; if (id === 'build-manually') return progress.understandCompleted; if (id === 'run-yourself') return progress.manualBuildCompleted
    if (id === 'upgrade-webhook') return progress.manualRunsCompleted; if (id === 'test-event') return progress.webhookUpgradeCompleted; if (id === 'publish-connect') return progress.testEventPassed
    if (id === 'live-break-fix') return progress.productionConnected; return id === 'complete' && canComplete
  }
  const goToStage = (id: string) => {
    if (!canOpenStage(id)) return
    const target = lesson01Stages.findIndex((item) => item.id === id); const furthest = lesson01Stages.findIndex((item) => item.id === progressRef.current.currentStage)
    updateProgress({ viewedStage: id, currentStage: target > furthest ? id : progressRef.current.currentStage, lastNeedsAttention: false, stageStates: { ...progressRef.current.stageStates, [id]: progressRef.current.stageStates[id] === 'passed' ? 'passed' : 'in_progress' } })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const finishStage = (stageId: string, patch: Partial<Lesson01Progress>, nextId: string) => updateProgress({ ...patch, viewedStage: nextId, currentStage: nextId, stageStates: { ...markPassed(progressRef.current, stageId), [nextId]: 'in_progress' } })

  async function startRepeatAttempt() {
    if (!user || !canonicalCompleted || creatingAttemptRef.current) return
    creatingAttemptRef.current = true; setCreatingAttempt(true)
    try {
      const { data: latest, error: readError } = await supabase.from('lesson_attempts').select('attempt_number,status').eq('user_id', user.id).eq('lesson_id', 1).eq('lesson_version', LESSON_01_VERSION).order('attempt_number', { ascending: false })
      if (readError) throw readError
      const unfinished = latest?.find((item) => item.status !== 'Completed')
      if (unfinished) { setRepeatDialog(false); navigateAttempt(unfinished.attempt_number, true); return }
      const nextNumber = latest?.length ? latest[0].attempt_number + 1 : 2
      const fresh = { ...structuredClone(lesson01InitialProgress), clientUpdatedAt: new Date().toISOString() }
      const { error } = await supabase.from('lesson_attempts').insert({ user_id: user.id, lesson_id: 1, lesson_version: LESSON_01_VERSION, attempt_number: nextNumber, status: 'Learning', current_stage: 'understand', progress_data: fresh })
      if (error) throw error
      writeLesson01AttemptCache(user.id, nextNumber, fresh, false)
      setAttempts((current) => [{ attempt_number: nextNumber, status: 'Learning', completed_at: null }, ...current])
      setRepeatDialog(false); navigateAttempt(nextNumber, true)
    } catch (error) {
      console.error('Could not create repeat attempt', error)
      setSaveState('A new practice attempt could not be started. Please try again after the lesson attempts migration is available.')
    } finally { creatingAttemptRef.current = false; setCreatingAttempt(false) }
  }

  async function runApi(action: string, path: string, webhookUrl: string) {
    setBusy(action); setFeedback(null)
    try { const result = await callLessonApi(path, session, { webhookUrl }); return result }
    catch (error) { setFeedback({ passed: false, message: error instanceof Error ? error.message : 'The live test could not be completed.' }); return null }
    finally { setBusy('') }
  }
  async function sendTestEvent() {
    const result = await runApi('test-event', '/api/lessons/n8n-core/test-event', testUrl); if (!result) return
    setFeedback({ passed: result.passed, message: result.message || (result.passed ? 'Test event reached your n8n workflow.' : 'Detleng could not reach this webhook. Make sure n8n is listening for a test event.') })
    updateProgress({ testEventPassed: result.passed, lastNeedsAttention: !result.passed, stageStates: { ...progress.stageStates, 'test-event': result.passed ? 'passed' : 'needs_attention' } })
  }
  async function connectProduction() {
    const result = await runApi('connect', '/api/lessons/n8n-core/connect', productionUrl); if (!result) return
    if (!result.reached) { setFeedback({ passed: false, message: result.message || 'Your production webhook did not respond. Confirm the workflow is published and use the Production URL.' }); updateProgress({ lastNeedsAttention: true }); return }
    const now = new Date().toISOString(); const { error } = await supabase.from('lesson_connections').upsert({ user_id: user!.id, lesson_id: 1, lesson_version: LESSON_01_VERSION, webhook_url: productionUrl, connection_status: 'valid', last_tested_at: now, updated_at: now }, { onConflict: 'user_id,lesson_id,lesson_version' })
    if (error) { console.error('Connection save failed', error); setFeedback({ passed: false, message: 'The workflow responded, but Detleng could not save the connection. Please try again.' }); return }
    setFeedback(null); updateProgress({ productionConnected: true, lastNeedsAttention: false, stageStates: markPassed(progress, 'publish-connect') })
  }
  async function runLiveTests(mode: 'live' | 'break' | 'repair') {
    const path = mode === 'break' ? '/api/lessons/n8n-core/break-test' : '/api/lessons/n8n-core/live-test'; const result = await runApi(mode, path, productionUrl); if (!result) return
    setLiveResults(result.results ?? [])
    if (mode === 'break') { const observed = result.passed; setFeedback({ passed: observed, message: observed ? '✓ Intended failure observed. Detleng detected the field mismatch exactly as expected.' : result.message || 'The workflow still behaves correctly. Check that you changed priority without changing the IF condition.' }); updateProgress({ breakObserved: observed, lastNeedsAttention: false, stageStates: { ...progress.stageStates, 'live-break-fix': observed ? 'in_progress' : 'in_progress' } }); return }
    const high = result.results?.find((item) => item.id === 'high')?.passed === true; const normal = result.results?.find((item) => item.id === 'normal')?.passed === true
    const repaired = mode === 'repair' && result.passed
    setFeedback({ passed: result.passed, message: result.passed ? (repaired ? 'Repair verified. Both routes are healthy.' : 'Both live routes passed.') : 'Detleng reached your workflow, but one route needs attention. Check the IF condition and response fields.' })
    updateProgress({ highLivePassed: high, normalLivePassed: normal, repairPassed: progress.repairPassed || repaired, lastNeedsAttention: !result.passed, stageStates: { ...progress.stageStates, 'live-break-fix': repaired ? 'passed' : result.passed ? 'in_progress' : 'needs_attention' } })
  }
  async function completeLesson() {
    if (!lesson01CanComplete(progressRef.current)) return
    const next = advanceLesson01Progress(progressRef.current, { completed: true, currentStage: 'complete', viewedStage: 'complete', lastNeedsAttention: false, stageStates: markPassed(progressRef.current, 'complete') })
    if (await persist(next, true)) { progressRef.current = next; setProgress(next); if (attemptNumber) { setAttempts((current) => current.map((item) => item.attempt_number === attemptNumber ? { ...item, status: 'Completed', completed_at: new Date().toISOString() } : item)); setSaveState(`Practice attempt ${attemptNumber} completed. Your original completion is preserved.`) } else setSaveState('Lesson 01 V2 completed. Your dashboard is updated.') }
  }

  const completionItems = useMemo(() => [['Manual workflow built', progress.manualBuildCompleted], ['Manual branching practiced', progress.manualRunsCompleted], ['First live event received', progress.testEventPassed], ['Production connection established', progress.productionConnected], ['High Priority route passed', progress.highLivePassed], ['Normal Priority route passed', progress.normalLivePassed], ['Intended failure observed', progress.breakObserved], ['Repair verified', progress.repairPassed]] as const, [progress])
  const activeRepeat = attempts.find((item) => item.status !== 'Completed')
  const practiceCount = (canonicalCompleted ? 1 : 0) + attempts.filter((item) => item.status === 'Completed').length
  if (loading) return <main className="route-loading"><p>Loading Lesson 01 V2…</p></main>

  return <div className="portal-page"><header className="portal-header"><a className="back-link" href="/dashboard"><ArrowLeft size={18}/> Dashboard</a><div className="portal-header-actions"><a className="brand brand--compact" href="/"><span className="brand-mark"><Network size={19}/></span><span>n8n <strong>Detleng</strong></span></a><button className="button button--ghost" onClick={() => void logout()}><LogOut size={17}/> Log out</button></div></header>
    <main className="portal-main lab-shell">{showIntro ? <Lesson01Opening mode={openingMode} stageNumber={Math.max(1, lesson01Stages.findIndex((item) => item.id === progress.currentStage) + 1)} onPrimary={() => { navigateMission(false); if (progress.completed) goToStage('understand') }} onReview={() => { navigateMission(false); goToStage('understand') }} onSummary={() => { navigateMission(false); goToStage('complete') }}/> : <><div className="lab-hero"><div><p className="eyebrow">Lesson 01 · {attemptNumber ? `Practice attempt ${attemptNumber}` : 'Live foundation lab · V2'}</p><h1>n8n Core</h1><p className="portal-lede">Build, publish and debug an Operations Intake Workflow while Detleng tests your real n8n.</p>{!attemptNumber&&canonicalCompleted&&<p className="practice-stat">{activeRepeat ? `Practice attempt ${activeRepeat.attempt_number} in progress` : `Practiced ${practiceCount} ${practiceCount===1?'time':'times'}`}</p>}{attemptNumber&&<p className="practice-stat">Practice attempt {attemptNumber} · Your original Lesson 01 completion remains preserved.</p>}</div><div className="lab-hero-side"><div className={`lab-status lab-status--${status.toLowerCase().replaceAll(' ', '-')}`}><span>{attemptNumber ? `Practice attempt ${attemptNumber}` : 'Automatic status'}</span><strong>{status}</strong><small>{saveState || 'Progress syncs to your learner account.'}</small>{syncPending && <button className="sync-retry" onClick={() => void persist(progressRef.current, progressRef.current.completed)}>Retry sync</button>}</div><div className="lesson-action-stack"><button className="button button--light lesson-opening-link" type="button" onClick={() => navigateMission(true)}>View lesson mission</button>{!attemptNumber&&canonicalCompleted&&(activeRepeat?<button className="button button--primary" type="button" onClick={() => navigateAttempt(activeRepeat.attempt_number, true)}>Resume Practice</button>:<button className="button button--primary" type="button" onClick={() => setRepeatDialog(true)}>Repeat Lesson</button>)}{attemptNumber&&<button className="button button--light" type="button" onClick={() => navigateAttempt(null)}>Return to completed lesson</button>}</div></div></div>
      {legacyCompleted && <p className="legacy-notice"><CheckCircle2 size={19}/> Lesson 01 has been upgraded. Your previous completion is preserved as V1 history; this live V2 experience tracks separately.</p>}
      <div className="lab-reminder"><strong>Build in your n8n. Learn in Detleng.</strong><span>Your workflow and credentials remain yours.</span></div>
      <StageIndicator stages={lesson01Stages} current={stage} states={progress.stageStates} onSelect={goToStage} isEnabled={canOpenStage}/>
      <section className="lab-panel">
        {stage === 'understand' && <Understand onDone={() => finishStage('understand', { understandCompleted: true }, 'build-manually')}/>} 
        {stage === 'build-manually' && <BuildManual onDone={() => finishStage('build-manually', { manualBuildCompleted: true }, 'run-yourself')}/>} 
        {stage === 'run-yourself' && <RunYourself onDone={() => finishStage('run-yourself', { manualRunsCompleted: true }, 'upgrade-webhook')}/>} 
        {stage === 'upgrade-webhook' && <UpgradeWebhook onDone={() => finishStage('upgrade-webhook', { webhookUpgradeCompleted: true }, 'test-event')}/>} 
        {stage === 'test-event' && <UrlStage kind="test" value={testUrl} setValue={setTestUrl} busy={busy === 'test-event'} feedback={feedback} passed={progress.testEventPassed} onAction={() => void sendTestEvent()}/>} 
        {stage === 'publish-connect' && <UrlStage kind="production" value={productionUrl} setValue={setProductionUrl} busy={busy === 'connect'} feedback={feedback} passed={progress.productionConnected} onAction={() => void connectProduction()}/>} 
        {stage === 'live-break-fix' && <LiveBreakFix progress={progress} busy={busy} feedback={feedback} results={liveResults} run={runLiveTests}/>} 
        {stage === 'complete' && <Complete items={completionItems} completed={progress.completed} enabled={canComplete} onComplete={() => void completeLesson()} onReview={() => goToStage('understand')} attemptNumber={attemptNumber}/>}
        <div className="lab-controls"><button className="button button--light" disabled={currentIndex <= 0} onClick={() => goToStage(lesson01Stages[currentIndex - 1].id)}><ArrowLeft size={17}/> Previous</button><span>Stage {currentIndex + 1} of 8</span><button className="button button--dark" disabled={currentIndex >= 7 || !canOpenStage(lesson01Stages[currentIndex + 1].id)} onClick={() => goToStage(lesson01Stages[currentIndex + 1].id)}>Next <ArrowRight size={17}/></button></div>
      </section></>}{repeatDialog&&<div className="repeat-dialog-backdrop" role="presentation" onMouseDown={(event)=>{if(event.target===event.currentTarget&&!creatingAttempt)setRepeatDialog(false)}}><section className="repeat-dialog" role="dialog" aria-modal="true" aria-labelledby="repeat-dialog-title"><span className="repeat-dialog-icon"><Wrench/></span><h2 id="repeat-dialog-title">Ready for another run?</h2><p>Your existing Lesson 01 completion will stay محفوظ. A fresh practice attempt will start from the beginning.</p><div><button className="button button--light" disabled={creatingAttempt} onClick={()=>setRepeatDialog(false)}>Cancel</button><button className="button button--primary" disabled={creatingAttempt} onClick={()=>void startRepeatAttempt()}>{creatingAttempt?<><LoaderCircle className="spin" size={18}/> Creating attempt…</>:<>Start New Attempt <ArrowRight size={18}/></>}</button></div></section></div>}</main><Footer/></div>
}

function StageHeader({ number, title, text }: { number: string; title: string; text: string }) { return <header className="stage-header"><span>{number}</span><div><h2>{title}</h2><p>{text}</p></div></header> }
function DoneButton({ children, onClick }: { children: ReactNode; onClick: () => void }) { return <button className="button button--primary lab-primary-action" onClick={onClick}><CheckCircle2 size={19}/>{children}</button> }
function Understand({ onDone }: { onDone: () => void }) { return <div><StageHeader number="01" title="Understand the automation mental model" text="Only six ideas are needed before you start building."/><div className="concept-grid">{[['Workflow','Connected steps that perform a job.'],['Node','One step that receives, changes or sends data.'],['Trigger','The event that starts a workflow.'],['Execution','One complete run of a workflow.'],['Data','Information moving from node to node.'],['IF / Branch','A decision that selects one of two paths.']].map(([title,text])=><article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div><div className="flow-diagram"><span>Trigger</span><b>→</b><span>Data</span><b>→</b><span>Decision</span><b>→</b><span>Action</span></div><DoneButton onClick={onDone}>I understand the flow</DoneButton></div> }
function BuildManual({ onDone }: { onDone: () => void }) { const steps=[['Manual Trigger','Start the practice workflow manually.'],['Create Request','Add customerName = Ali Khan, department = Support, priority = high and budget = 1500.'],['Check Priority','Use IF: priority equals high.'],['Escalated — TRUE','Set route = escalated and status = ready.'],['Standard — FALSE','Set route = standard and status = ready.']]; return <div><StageHeader number="02" title="Build the workflow manually" text="Create each node yourself in your own n8n. No finished import is provided."/><div className="workflow-map"><span>Manual Trigger</span><b>↓</b><span>Create Request</span><b>↓</b><span>Check Priority</span><div><span>TRUE → Escalated</span><span>FALSE → Standard</span></div></div><div className="accordion-list">{steps.map(([title,text],index)=><details key={title} open={index===0}><summary><span>{index+1}</span>{title}<ChevronDown size={19}/></summary><p>{text}</p></details>)}</div><DoneButton onClick={onDone}>I built this workflow</DoneButton></div> }
function RunYourself({ onDone }: { onDone: () => void }) { return <div><StageHeader number="03" title="Run it yourself" text="Practice both branches in n8n before connecting Detleng."/><div className="test-grid"><article><span>High run</span><h3>TRUE → Escalated</h3><p><strong>priority</strong> = high<br/><strong>budget</strong> = 1500</p></article><article><span>Normal run</span><h3>FALSE → Standard</h3><p><strong>priority</strong> = normal<br/><strong>budget</strong> = 300</p></article></div><p className="lab-tip"><Radio size={20}/> Inspect which nodes turn green during each execution.</p><DoneButton onClick={onDone}>I ran both routes successfully</DoneButton></div> }
function UpgradeWebhook({ onDone }: { onDone: () => void }) { return <div><StageHeader number="04" title="Turn it into a real automation" text="Replace the manual start with a Webhook that an external system can trigger."/><div className="upgrade-callout"><Network size={28}/><div><strong>Manual Trigger → Webhook Trigger</strong><p>Use POST. Keep the IF and both result branches.</p></div></div><ol className="instruction-list"><li>Replace Manual Trigger with a <strong>Webhook</strong> node and choose <strong>POST</strong>.</li><li>Inspect incoming webhook data in the node output.</li><li>In Create Request, drag/map <strong>customerName, department, priority</strong> and <strong>budget</strong> from the incoming body.</li><li>Keep Check Priority and both output branches unchanged.</li></ol><div className="url-compare"><article><strong>Test URL</strong><p>Temporary; works while n8n listens for a test event.</p></article><article><strong>Production URL</strong><p>Permanent endpoint for a published workflow.</p></article></div><DoneButton onClick={onDone}>My Webhook node is ready</DoneButton></div> }
function UrlStage({ kind, value, setValue, busy, feedback, passed, onAction }: { kind:'test'|'production'; value:string; setValue:(v:string)=>void; busy:boolean; feedback:Feedback|null; passed:boolean; onAction:()=>void }) { const test=kind==='test'; return <div><StageHeader number={test?'05':'06'} title={test?'Send your first live event':'Publish and connect'} text={test?'Put n8n into listening mode, then let Detleng send the sample event.':'Publish your workflow and connect its Production URL once.'}/>{test?<ol className="instruction-list"><li>Open the Webhook node and select <strong>Test URL</strong>.</li><li>Click <strong>Listen for test event</strong> in n8n.</li><li>Paste the temporary URL below and send the event.</li></ol>:<ol className="instruction-list"><li>Finish the mapping and publish/activate your workflow.</li><li>Select the <strong>Production URL</strong> in the Webhook node.</li><li>Paste it below. Detleng will verify reachability and save it to your learner connection.</li></ol>}<label className="webhook-field"><span>{test?'Temporary Test Webhook URL':'Production Webhook URL'}</span><small>{test?'Temporary — used only for your first test event. It is never saved.':'Saved privately for your authenticated account and Lesson 01 V2.'}</small><input type="url" value={value} onChange={(event)=>setValue(event.target.value)} placeholder={test?'https://….app.n8n.cloud/webhook-test/…':'https://….app.n8n.cloud/webhook/…'}/></label><button className="button button--primary" disabled={!value||busy} onClick={onAction}>{busy?<LoaderCircle className="spin" size={19}/>:test?<Send size={19}/>:<Link2 size={19}/>} {busy?'Waiting for n8n…':test?'Send my first test event':'Connect my workflow'}</button>{passed&&<div className="connection-card"><CheckCircle2/><div><strong>{test?'Test event reached your n8n workflow':'n8n Workflow · Connected'}</strong><p>{test?'Now map the incoming fields visually in Create Request.':'This Production URL will be reused for live verification.'}</p></div></div>}{feedback&&<FeedbackMessage {...feedback}/>}</div> }
function LiveBreakFix({ progress,busy,feedback,results,run }: { progress:Lesson01Progress; busy:string; feedback:Feedback|null; results:LiveResult[]; run:(mode:'live'|'break'|'repair')=>Promise<void> }) { return <div><StageHeader number="07" title="Live tests, break and repair" text="Detleng now operates your published workflow and checks real responses."/><LabPhase title="A · Automatic live tests" state={progress.highLivePassed&&progress.normalLivePassed?'passed':'active'}><p>Detleng sends High and Normal requests. You type nothing.</p><button className="button button--primary" disabled={Boolean(busy)} onClick={()=>void run('live')}>{busy==='live'?<LoaderCircle className="spin"/>:<Send/>} Run both live tests</button><ResultList results={results}/></LabPhase><LabPhase title="B · Break it deliberately" state={progress.breakObserved?'passed':progress.highLivePassed&&progress.normalLivePassed?'active':'locked'}><p>In Create Request, temporarily rename/map <code>priority</code> as <code>priorityLevel</code>. Do not change the IF node.</p><button className="button button--dark" disabled={!progress.highLivePassed||!progress.normalLivePassed||Boolean(busy)} onClick={()=>void run('break')}>{busy==='break'?<LoaderCircle className="spin"/>:<Wrench/>} Run Break Test</button></LabPhase><LabPhase title="C · Fix and verify" state={progress.repairPassed?'passed':progress.breakObserved?'active':'locked'}><p>Restore <code>priorityLevel</code> to <code>priority</code>, publish the fix, then verify both routes again.</p><button className="button button--primary" disabled={!progress.breakObserved||Boolean(busy)} onClick={()=>void run('repair')}>{busy==='repair'?<LoaderCircle className="spin"/>:<CheckCircle2/>} Verify Repair</button></LabPhase>{feedback&&<FeedbackMessage {...feedback}/>}</div> }
function LabPhase({ title,state,children }: { title:string; state:'passed'|'active'|'locked'; children:ReactNode }) { return <article className={`live-phase live-phase--${state}`}><div className="live-phase-title"><span>{state==='passed'?'✓':state==='active'?'•':'○'}</span><h3>{title}</h3></div>{children}</article> }
function ResultList({ results }: { results:LiveResult[] }) { if(!results.length)return null; return <div className="live-results">{results.map((item)=><div className={item.passed?'is-pass':'is-fail'} key={item.id}><span>{item.passed?'✓':'!'}</span><div><strong>{item.label}</strong><p>{item.message}</p></div></div>)}</div> }
function Complete({ items,completed,enabled,onComplete,onReview,attemptNumber }: { items:readonly (readonly [string,boolean])[]; completed:boolean; enabled:boolean; onComplete:()=>void; onReview:()=>void; attemptNumber:number|null }) { return <div><StageHeader number="08" title="Your engineering summary" text="Completion unlocks only after the real workflow has passed the full build, break and repair cycle."/>{completed?<Lesson01CompletionStory evidence={items} onReview={onReview} attemptNumber={attemptNumber}/>:<><div className="completion-grid">{items.map(([label,passed])=><div className={passed?'completion-item is-pass':'completion-item'} key={label}><span>{passed?'✓':'○'}</span>{label}</div>)}</div><button className="button button--primary complete-button" disabled={!enabled} onClick={onComplete}>{enabled?(attemptNumber?'Complete Practice Attempt':'Complete Lesson 01'):'Complete the live lab first'}</button></>}</div> }
