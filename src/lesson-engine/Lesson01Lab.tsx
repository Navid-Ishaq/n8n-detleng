import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, FileJson, Info, LogOut, Network } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Footer } from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { lesson01CanComplete, lesson01InitialProgress, lesson01Quiz, lesson01Stages } from './lesson01-config'
import { advanceLesson01Progress, readLesson01Cache, reconcileLesson01Progress, writeLesson01Cache } from './progress-cache'
import { StageIndicator } from './StageIndicator'
import { computeLesson01Status } from './status'
import type { Lesson01Progress, WorkflowValidation } from './types'
import { validateExecutionOutput, validateN8nWorkflowText } from './validators'

const MAX_FILE_SIZE = 2 * 1024 * 1024
type Feedback = { passed: boolean; message: string }

function StatusMessage({ passed, message }: Feedback) {
  return <p className={passed ? 'lab-feedback lab-feedback--pass' : 'lab-feedback lab-feedback--fail'} role="status">{passed ? <CheckCircle2 size={19}/> : <AlertCircle size={19}/>} {message}</p>
}

export function Lesson01Lab() {
  const { user, logout } = useAuth()
  const [progress, setProgress] = useState<Lesson01Progress>(() => user ? readLesson01Cache(user.id)?.progress ?? structuredClone(lesson01InitialProgress) : structuredClone(lesson01InitialProgress))
  const progressRef = useRef(progress)
  const saveSequenceRef = useRef(0)
  const startedAtRef = useRef<string | null>(null)
  const completedAtRef = useRef<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState('')
  const [syncPending, setSyncPending] = useState(false)
  const [structureResult, setStructureResult] = useState<WorkflowValidation | null>(null)
  const [highRouteChoice, setHighRouteChoice] = useState(''); const [normalRouteChoice, setNormalRouteChoice] = useState('')
  const [highFeedback, setHighFeedback] = useState<Feedback | null>(null); const [normalFeedback, setNormalFeedback] = useState<Feedback | null>(null)
  const [repairText, setRepairText] = useState(''); const [repairFeedback, setRepairFeedback] = useState<Feedback | null>(null)
  const [diagnosis, setDiagnosis] = useState('')
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({}); const [quizFeedback, setQuizFeedback] = useState('')

  useEffect(() => { progressRef.current = progress }, [progress])

  const persist = useCallback(async (next: Lesson01Progress, complete = false) => {
    if (!user) return false
    const status = complete ? 'Completed' : computeLesson01Status(next)
    const sequence = ++saveSequenceRef.current
    writeLesson01Cache(user.id, next, true)
    setSyncPending(true)
    setSaveState('Saving…')
    const now = new Date().toISOString()
    const completedAt = complete || next.completed ? completedAtRef.current ?? now : null
    const { error } = await supabase.from('lesson_progress').upsert({
      user_id: user.id, lesson_id: 1, status, progress_data: next, started_at: startedAtRef.current ?? now,
      current_stage: next.currentStage, completed_at: completedAt, last_activity_at: now, updated_at: now,
      notes: [next.reflectionBuilt, next.reflectionFixed].filter(Boolean).join('\n\n'),
    }, { onConflict: 'user_id,lesson_id' })
    if (error) {
      console.error('Lesson 01 progress sync failed', { code: error.code, message: error.message, details: error.details, hint: error.hint })
      if (sequence === saveSequenceRef.current) setSaveState('Your progress is saved locally and will sync when the connection is restored.')
      return false
    }
    startedAtRef.current ??= now
    completedAtRef.current = completedAt
    if (sequence === saveSequenceRef.current && progressRef.current.revision === next.revision) {
      writeLesson01Cache(user.id, next, false)
      setSyncPending(false)
      setSaveState('Progress saved')
    }
    return !error
  }, [user])

  const updateProgress = useCallback((patch: Partial<Lesson01Progress>, shouldPersist = true) => {
    const next = advanceLesson01Progress(progressRef.current, patch)
    progressRef.current = next; setProgress(next)
    if (user) { writeLesson01Cache(user.id, next, true); setSyncPending(true) }
    if (shouldPersist) void persist(next)
    return next
  }, [persist, user])

  useEffect(() => {
    if (!user) return
    const cached = readLesson01Cache(user.id)
    supabase.from('lesson_progress').select('progress_data,current_stage,started_at,completed_at,updated_at').eq('user_id', user.id).eq('lesson_id', 1).maybeSingle().then(({ data, error }) => {
      if (error) {
        console.error('Lesson 01 progress hydration failed', { code: error.code, message: error.message, details: error.details, hint: error.hint })
        const fallback = cached?.progress ?? structuredClone(lesson01InitialProgress)
        progressRef.current = fallback; setProgress(fallback); setSyncPending(true); setSaveState('Your progress is saved locally and will sync when the connection is restored.'); setLoading(false)
        return
      }
      startedAtRef.current = data?.started_at ?? null
      completedAtRef.current = data?.completed_at ?? null
      const serverValue = data ? { ...(data.progress_data && typeof data.progress_data === 'object' ? data.progress_data : {}), currentStage: data.current_stage || 'understand', clientUpdatedAt: (data.progress_data as { clientUpdatedAt?: string } | null)?.clientUpdatedAt || data.updated_at || '' } : null
      const next = data ? reconcileLesson01Progress(serverValue, cached) : cached?.progress ?? advanceLesson01Progress(structuredClone(lesson01InitialProgress), {})
      progressRef.current = next; setProgress(next); setLoading(false)
      if (!data || cached?.syncPending) void persist(next)
    })
  }, [persist, user])

  useEffect(() => {
    const retry = () => { if (progressRef.current && user) void persist(progressRef.current, progressRef.current.completed) }
    window.addEventListener('online', retry)
    return () => window.removeEventListener('online', retry)
  }, [persist, user])

  const status = computeLesson01Status(progress)
  const currentIndex = lesson01Stages.findIndex((item) => item.id === progress.viewedStage)
  const canComplete = lesson01CanComplete(progress)
  const stage = progress.viewedStage

  const canOpenStage = (id: string) => {
    if (['understand', 'build', 'test', 'verify-structure'].includes(id)) return true
    if (id === 'verify-output') return progress.structurePassed
    if (id === 'break-it') return progress.highRouteTestPassed && progress.normalRouteTestPassed
    if (id === 'debug') return progress.breakAttempted
    if (id === 'knowledge-check') return progress.diagnosisPassed && progress.repairedOutputPassed
    if (id === 'document') return progress.quizPassed
    return id === 'complete' ? canComplete : false
  }

  const goToStage = (id: string) => {
    if (!canOpenStage(id)) return
    const previousViewed = progressRef.current.viewedStage
    const previousIsIntro = ['understand', 'build', 'test'].includes(previousViewed)
    const states = { ...progressRef.current.stageStates, [id]: progressRef.current.stageStates[id] === 'passed' ? 'passed' : 'in_progress' } as Lesson01Progress['stageStates']
    if (previousIsIntro) states[previousViewed] = 'passed'
    const currentProgressIndex = lesson01Stages.findIndex((item) => item.id === progressRef.current.currentStage)
    const targetIndex = lesson01Stages.findIndex((item) => item.id === id)
    updateProgress({
      viewedStage: id,
      currentStage: targetIndex > currentProgressIndex ? id : progressRef.current.currentStage,
      understandCompleted: progressRef.current.understandCompleted || previousViewed === 'understand',
      buildCompleted: progressRef.current.buildCompleted || previousViewed === 'build',
      testCompleted: progressRef.current.testCompleted || previousViewed === 'test',
      stageStates: states,
      lastNeedsAttention: false,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleWorkflowFile(file?: File) {
    if (!file) return
    if (file.size > MAX_FILE_SIZE || !file.name.toLowerCase().endsWith('.json')) {
      const sizeProblem = file.size > MAX_FILE_SIZE
      const result: WorkflowValidation = { passed: false, checks: [{ id: sizeProblem ? 'size' : 'type', label: sizeProblem ? 'File size is safe' : 'JSON workflow file', passed: false, detail: sizeProblem ? 'Choose a workflow JSON file smaller than 2 MB.' : 'Choose an exported .json file.' }] }
      setStructureResult(result)
      updateProgress({ structurePassed: false, lastNeedsAttention: true, stageStates: { ...progress.stageStates, 'verify-structure': 'needs_attention' } })
      return
    }
    const result = validateN8nWorkflowText(await file.text())
    setStructureResult(result)
    updateProgress({ structurePassed: result.passed, lastNeedsAttention: !result.passed, stageStates: { ...progress.stageStates, 'verify-structure': result.passed ? 'passed' : 'needs_attention' } })
  }

  function verifyRoute(kind: 'high' | 'normal') {
    const choice = kind === 'high' ? highRouteChoice : normalRouteChoice
    const expected = kind === 'high' ? 'escalated' : 'standard'
    const passed = progress.structurePassed && choice === expected
    const result = {
      passed,
      message: passed
        ? kind === 'high' ? 'High priority routed to Escalated.' : 'Normal priority routed to Standard.'
        : kind === 'high'
          ? 'Your High Priority test should follow the TRUE output to Escalated. Check the IF condition in n8n and run it again.'
          : 'Your Normal Priority test should follow the FALSE output to Standard. Check the IF condition in n8n and run it again.',
    }
    if (kind === 'high') setHighFeedback(result); else setNormalFeedback(result)
    const bothPassed = kind === 'high' ? passed && progress.normalRouteTestPassed : passed && progress.highRouteTestPassed
    updateProgress({ ...(kind === 'high' ? { highRouteTestPassed: passed } : { normalRouteTestPassed: passed }), lastNeedsAttention: !passed, stageStates: { ...progress.stageStates, 'verify-output': bothPassed ? 'passed' : passed ? 'in_progress' : 'needs_attention' } })
  }

  function checkDiagnosis() {
    const passed = diagnosis === 'a'
    updateProgress({ diagnosisPassed: passed, lastNeedsAttention: !passed, stageStates: { ...progress.stageStates, 'break-it': 'passed', debug: passed && progress.repairedOutputPassed ? 'passed' : passed ? 'in_progress' : 'needs_attention' } })
  }

  function verifyRepair() {
    const result = validateExecutionOutput(repairText, 'escalated')
    setRepairFeedback(result)
    updateProgress({ repairedOutputPassed: result.passed, lastNeedsAttention: !result.passed, stageStates: { ...progress.stageStates, debug: result.passed && progress.diagnosisPassed ? 'passed' : result.passed ? 'in_progress' : 'needs_attention' } })
  }

  function submitQuiz() {
    const passed = lesson01Quiz.every((question) => quizAnswers[question.id] === question.answer)
    setQuizFeedback(passed ? 'Knowledge check passed.' : 'Not quite yet. Review the concepts and retry.')
    updateProgress({ quizPassed: passed, lastNeedsAttention: !passed, stageStates: { ...progress.stageStates, 'knowledge-check': passed ? 'passed' : 'needs_attention' } })
  }

  async function completeLesson() {
    if (!lesson01CanComplete(progressRef.current)) return
    const next = advanceLesson01Progress(progressRef.current, { completed: true, currentStage: 'complete', viewedStage: 'complete', lastNeedsAttention: false, stageStates: { ...progressRef.current.stageStates, complete: 'passed' as const } })
    const saved = await persist(next, true)
    if (saved) { progressRef.current = next; setProgress(next); setSaveState('Lesson 01 completed. Your dashboard is now updated.') }
  }

  function saveDocumentation() {
    const documentCompleted = Boolean(progressRef.current.reflectionBuilt.trim() && progressRef.current.reflectionFixed.trim())
    updateProgress({ documentCompleted, stageStates: { ...progressRef.current.stageStates, document: documentCompleted ? 'passed' : 'in_progress' } })
  }

  const completionItems = useMemo(() => [
    ['Workflow structure', progress.structurePassed], ['High route test', progress.highRouteTestPassed], ['Normal route test', progress.normalRouteTestPassed],
    ['Break It attempted', progress.breakAttempted], ['Diagnosis', progress.diagnosisPassed], ['Repair verified', progress.repairedOutputPassed], ['Knowledge check', progress.quizPassed],
  ] as const, [progress])

  if (loading) return <main className="route-loading"><p>Loading Lesson 01…</p></main>
  return <div className="portal-page">
    <header className="portal-header"><a className="back-link" href="/dashboard"><ArrowLeft size={18}/> Dashboard</a><div className="portal-header-actions"><a className="brand brand--compact" href="/"><span className="brand-mark"><Network size={19}/></span><span>n8n <strong>Detleng</strong></span></a><button className="button button--ghost" onClick={() => void logout()}><LogOut size={17}/> Log out</button></div></header>
    <main className="portal-main lab-shell">
      <div className="lab-hero"><div><p className="eyebrow">Lesson 01 · Foundation lab</p><h1>n8n Core</h1><p className="portal-lede">Build and explain an Operations Intake Workflow with real data, branching and debugging.</p></div><div className={"lab-status lab-status--" + status.toLowerCase().replaceAll(' ', '-')}><span>Automatic status</span><strong>{status}</strong><small>{saveState || 'Your progress is synced to your learner account.'}</small>{syncPending && <button type="button" className="sync-retry" onClick={() => void persist(progressRef.current, progressRef.current.completed)}>Retry sync</button>}</div></div>
      <div className="lab-reminder"><strong>Build in your n8n. Learn in Detleng.</strong><span>Your workflow remains in your own n8n environment.</span></div>
      <StageIndicator stages={lesson01Stages} current={stage} states={progress.stageStates} onSelect={goToStage} isEnabled={canOpenStage}/>
      <section className="lab-panel">
        {stage === 'understand' && <Understand/>}
        {stage === 'build' && <Build/>}
        {stage === 'test' && <TestCases/>}
        {stage === 'verify-structure' && <div><StageHeader number="04" title="Verify your workflow" text="Export the workflow from n8n as JSON. Detleng validates it in your browser and does not permanently store the file."/><label className="file-drop"><FileJson/><strong>Upload exported n8n workflow</strong><span>.json only · maximum 2 MB</span><input type="file" accept="application/json,.json" onChange={(event) => void handleWorkflowFile(event.target.files?.[0])}/></label>{structureResult && <div className="validation-results">{structureResult.checks.map((check) => <div className={check.passed ? 'validation-check is-pass' : 'validation-check is-fail'} key={check.id}><span>{check.passed ? '✓' : '!'}</span><div><strong>{check.label}</strong>{check.detail && !check.passed && <p>{check.detail}</p>}</div></div>)}</div>}</div>}
        {stage === 'verify-output' && <div><StageHeader number="05" title="Run your workflow tests" text="Run both cases in n8n, observe which branch executes, then record what you saw."/><div className="route-test-grid"><RouteTest title="Test A — High Priority" values={[['priority','high'],['budget','1500']]} choice={highRouteChoice} onChoice={setHighRouteChoice} onVerify={() => verifyRoute('high')} feedback={highFeedback} passed={progress.highRouteTestPassed}/><RouteTest title="Test B — Normal Priority" values={[['priority','normal'],['budget','300']]} choice={normalRouteChoice} onChoice={setNormalRouteChoice} onVerify={() => verifyRoute('normal')} feedback={normalFeedback} passed={progress.normalRouteTestPassed}/></div>{progress.highRouteTestPassed && progress.normalRouteTestPassed && <p className="route-tests-complete"><CheckCircle2 size={20}/> Both workflow tests passed. Next is now unlocked.</p>}</div>}
        {stage === 'break-it' && <div><StageHeader number="06" title="Break It" text="Create a deliberate field mismatch and observe what the IF node does."/><ol className="instruction-list"><li>In your first Edit Fields node, rename <code>priority</code> to <code>priorityLevel</code>.</li><li>Do not update the IF node.</li><li>Run the high-priority workflow again and inspect the route.</li></ol><button className="button button--dark" onClick={() => updateProgress({ breakAttempted: true, stageStates: { ...progress.stageStates, 'break-it': 'passed' } })}>{progress.breakAttempted ? '✓ Break attempt recorded' : 'I ran the broken workflow'}</button></div>}
        {stage === 'debug' && <DebugStage diagnosis={diagnosis} setDiagnosis={setDiagnosis} checkDiagnosis={checkDiagnosis} diagnosisPassed={progress.diagnosisPassed} repairText={repairText} setRepairText={setRepairText} verifyRepair={verifyRepair} repairFeedback={repairFeedback}/>}
        {stage === 'knowledge-check' && <div><StageHeader number="08" title="Knowledge Check" text="Pass all three questions. You can review and retry as often as needed."/><div className="quiz-list">{lesson01Quiz.map((question, index) => <fieldset className="quiz-question" key={question.id}><legend>{index + 1}. {question.question}</legend>{question.options.map((option, optionIndex) => <label key={option}><input type="radio" name={question.id} checked={quizAnswers[question.id] === optionIndex} onChange={() => setQuizAnswers((current) => ({ ...current, [question.id]: optionIndex }))}/>{option}</label>)}</fieldset>)}</div><button className="button button--dark" onClick={submitQuiz}>Check answers</button>{quizFeedback && <StatusMessage passed={progress.quizPassed} message={quizFeedback}/>}</div>}
        {stage === 'document' && <div><StageHeader number="09" title="Document what you learned" text="No screenshot is needed. Write two short engineering reflections."/><div className="reflection-grid"><label>What did you build?<textarea value={progress.reflectionBuilt} onChange={(event) => updateProgress({ reflectionBuilt: event.target.value }, false)} onBlur={saveDocumentation} placeholder="I built…"/></label><label>What did you break and fix?<textarea value={progress.reflectionFixed} onChange={(event) => updateProgress({ reflectionFixed: event.target.value }, false)} onBlur={saveDocumentation} placeholder="I changed… and fixed…"/></label></div></div>}
        {stage === 'complete' && <div><StageHeader number="10" title="Complete Lesson 01" text="Completion is unlocked by evidence from the lab—not by opening the page or selecting a status."/><div className="completion-grid">{completionItems.map(([label, passed]) => <div className={passed ? 'completion-item is-pass' : 'completion-item'} key={label}><span>{passed ? '✓' : '○'}</span>{label}</div>)}</div><button className="button button--primary complete-button" disabled={!canComplete || status === 'Completed'} onClick={() => void completeLesson()}>{status === 'Completed' ? '✓ Lesson 01 Completed' : canComplete ? 'Complete Lesson 01' : 'Complete all required checks first'}</button></div>}
        <div className="lab-controls"><button className="button button--light" disabled={currentIndex <= 0} onClick={() => goToStage(lesson01Stages[currentIndex - 1].id)}><ArrowLeft size={17}/> Previous</button><span>Stage {currentIndex + 1} of {lesson01Stages.length}</span><button className="button button--dark" disabled={currentIndex >= lesson01Stages.length - 1 || !canOpenStage(lesson01Stages[currentIndex + 1].id)} onClick={() => goToStage(lesson01Stages[currentIndex + 1].id)}>Next <ArrowRight size={17}/></button></div>
      </section>
    </main><Footer/>
  </div>
}

function StageHeader({ number, title, text }: { number: string; title: string; text: string }) { return <header className="stage-header"><span>{number}</span><div><h2>{title}</h2><p>{text}</p></div></header> }

function Understand() {
  return <div><StageHeader number="01" title="Understand the workflow mental model" text="Each execution moves data through small, inspectable steps."/><div className="concept-grid">{[['Workflow','The complete sequence of connected steps.'],['Node','One step that receives, changes or sends data.'],['Trigger','The node that starts an execution.'],['Execution','One run of the workflow with its own data and result.'],['Data','The JSON items moving from node to node.'],['IF / Branch','A condition that sends data down one of two paths.']].map(([title,text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div><div className="flow-diagram"><span>Trigger</span><b>→</b><span>Data</span><b>→</b><span>IF</span><b>→</b><div><span>Route A</span><span>Route B</span></div></div></div>
}

function Build() {
  const request = '{\n  "customerName": "Ali Khan",\n  "department": "Support",\n  "priority": "high",\n  "budget": 1500\n}'
  return <div><StageHeader number="02" title="Build the Operations Intake Workflow" text="Create every node manually in your own n8n. Do not import a finished template."/><div className="required-flow"><span>Manual Trigger</span><b>↓</b><span>Edit Fields — Create Request</span><b>↓</b><span>IF — Check Priority</span><div><span>High → Edit Fields — Escalated</span><span>Normal → Edit Fields — Standard</span></div></div><ol className="build-steps"><li><strong>Add Manual Trigger.</strong><p>This starts each practice execution.</p></li><li><strong>Add Edit Fields and name it “Create Request”.</strong><pre>{request}</pre></li><li><strong>Add IF and name it “Check Priority”.</strong><p>Configure: <code>priority</code> equals <code>high</code>.</p></li><li><strong>Connect the true/high output.</strong><p>Add Edit Fields “Escalated”: <code>route = escalated</code>, <code>status = ready</code>.</p></li><li><strong>Connect the false/normal output.</strong><p>Add Edit Fields “Standard”: <code>route = standard</code>, <code>status = ready</code>.</p></li><li><strong>Inspect each node.</strong><p>Run once and compare each node’s Input and Output panels.</p></li></ol></div>
}

function TestCases() {
  const high = '{\n  "route": "escalated",\n  "status": "ready"\n}'; const normal = '{\n  "route": "standard",\n  "status": "ready"\n}'
  return <div><StageHeader number="03" title="Run both required tests" text="Change the request values in n8n and inspect the final node on the branch that executes."/><div className="test-grid"><article><span>Test A</span><h3>High Priority</h3><p><code>priority = high</code><br/><code>budget = 1500</code></p><pre>{high}</pre></article><article><span>Test B</span><h3>Normal Priority</h3><p><code>priority = normal</code><br/><code>budget = 300</code></p><pre>{normal}</pre></article></div><p className="lab-tip"><Info size={19}/> Execute both tests inside your own n8n. The next stages verify structure and output separately.</p></div>
}

function DebugStage({ diagnosis, setDiagnosis, checkDiagnosis, diagnosisPassed, repairText, setRepairText, verifyRepair, repairFeedback }: { diagnosis: string; setDiagnosis: (value: string) => void; checkDiagnosis: () => void; diagnosisPassed: boolean; repairText: string; setRepairText: (value: string) => void; verifyRepair: () => void; repairFeedback: Feedback | null }) {
  return <div><StageHeader number="07" title="Debug the mismatch" text="Inspect the data leaving Edit Fields, compare it with the IF condition, then repair the workflow."/><fieldset className="quiz-question"><legend>What caused the workflow behavior to change?</legend>{[['a','The downstream IF condition still expected priority.'],['b','The Manual Trigger was deleted.'],['c','Authentication failed.'],['d','n8n lost internet access.']].map(([value,label]) => <label key={value}><input type="radio" name="diagnosis" value={value} checked={diagnosis === value} onChange={(event) => setDiagnosis(event.target.value)}/>{label}</label>)}</fieldset><button className="button button--light" disabled={!diagnosis} onClick={checkDiagnosis}>Check diagnosis</button>{diagnosisPassed && <StatusMessage passed message="Correct. The IF node still looked for the original priority field."/>}<div className="repair-box"><h3>Repair and verify again</h3><p>Restore <code>priority</code>, run the high path, then paste its repaired final output.</p><textarea value={repairText} onChange={(event) => setRepairText(event.target.value)} placeholder={'{\n  "route": "escalated",\n  "status": "ready"\n}'}/><button className="button button--dark" onClick={verifyRepair}>Verify repaired output</button>{repairFeedback && <StatusMessage {...repairFeedback}/>}</div></div>
}

function RouteTest({ title, values, choice, onChoice, onVerify, feedback, passed }: { title: string; values: string[][]; choice: string; onChoice: (value: string) => void; onVerify: () => void; feedback: Feedback | null; passed: boolean }) {
  return <article className={passed ? 'route-test-card is-passed' : 'route-test-card'}><span className="route-test-state">{passed ? '✓ Passed' : 'Run in n8n'}</span><h3>{title}</h3><p>In your first Edit Fields node set:</p><dl>{values.map(([name,value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl><fieldset className="route-choice"><legend>Which branch ran?</legend><label><input type="radio" name={title} checked={choice === 'escalated'} onChange={() => onChoice('escalated')}/> Escalated</label><label><input type="radio" name={title} checked={choice === 'standard'} onChange={() => onChoice('standard')}/> Standard</label></fieldset><button className="button button--dark" disabled={!choice} onClick={onVerify}>Check my observation</button>{feedback && <StatusMessage {...feedback}/>}</article>
}
