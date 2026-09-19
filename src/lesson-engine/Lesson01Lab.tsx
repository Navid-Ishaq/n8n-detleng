import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, FileJson, Info, LogOut, Network } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Footer } from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { lesson01CanComplete, lesson01InitialProgress, lesson01Quiz, lesson01Stages } from './lesson01-config'
import { StageIndicator } from './StageIndicator'
import { computeLesson01Status } from './status'
import type { Lesson01Progress, WorkflowValidation } from './types'
import { validateExecutionOutput, validateN8nWorkflowText } from './validators'

const MAX_FILE_SIZE = 2 * 1024 * 1024
type Feedback = { passed: boolean; message: string }

function mergeProgress(value: unknown): Lesson01Progress {
  if (!value || typeof value !== 'object') return structuredClone(lesson01InitialProgress)
  const saved = value as Partial<Lesson01Progress>
  return { ...structuredClone(lesson01InitialProgress), ...saved, stageStates: { ...lesson01InitialProgress.stageStates, ...saved.stageStates } }
}

function StatusMessage({ passed, message }: Feedback) {
  return <p className={passed ? 'lab-feedback lab-feedback--pass' : 'lab-feedback lab-feedback--fail'} role="status">{passed ? <CheckCircle2 size={19}/> : <AlertCircle size={19}/>} {message}</p>
}

export function Lesson01Lab() {
  const { user, logout } = useAuth()
  const [progress, setProgress] = useState<Lesson01Progress>(() => structuredClone(lesson01InitialProgress))
  const progressRef = useRef(progress)
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState('')
  const [structureResult, setStructureResult] = useState<WorkflowValidation | null>(null)
  const [highText, setHighText] = useState(''); const [normalText, setNormalText] = useState('')
  const [highFeedback, setHighFeedback] = useState<Feedback | null>(null); const [normalFeedback, setNormalFeedback] = useState<Feedback | null>(null)
  const [repairText, setRepairText] = useState(''); const [repairFeedback, setRepairFeedback] = useState<Feedback | null>(null)
  const [diagnosis, setDiagnosis] = useState('')
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({}); const [quizFeedback, setQuizFeedback] = useState('')

  useEffect(() => { progressRef.current = progress }, [progress])

  const persist = useCallback(async (next: Lesson01Progress, complete = false) => {
    if (!user) return false
    const status = complete ? 'Completed' : computeLesson01Status(next)
    setSaveState('Saving…')
    const now = new Date().toISOString()
    const { error } = await supabase.from('lesson_progress').upsert({
      user_id: user.id, lesson_id: 1, status, progress_data: next, started_at: now,
      completed_at: complete ? now : null, last_activity_at: now,
      notes: [next.reflectionBuilt, next.reflectionFixed].filter(Boolean).join('\n\n'),
    }, { onConflict: 'user_id,lesson_id' })
    setSaveState(error ? 'Could not save. Apply the Lesson 01 database migration, then try again.' : 'Progress saved')
    return !error
  }, [user])

  const updateProgress = useCallback((patch: Partial<Lesson01Progress>, shouldPersist = true) => {
    const next = { ...progressRef.current, ...patch }
    progressRef.current = next; setProgress(next)
    if (shouldPersist) void persist(next)
    return next
  }, [persist])

  useEffect(() => {
    if (!user) return
    supabase.from('lesson_progress').select('progress_data').eq('user_id', user.id).eq('lesson_id', 1).maybeSingle().then(({ data }) => {
      const next = mergeProgress(data?.progress_data)
      void persist(next)
      progressRef.current = next; setProgress(next); setLoading(false)
    })
  }, [persist, user])

  const status = computeLesson01Status(progress)
  const currentIndex = lesson01Stages.findIndex((item) => item.id === progress.currentStage)
  const canComplete = lesson01CanComplete(progress)
  const stage = progress.currentStage

  const canOpenStage = (id: string) => {
    if (['understand', 'build', 'test', 'verify-structure', 'verify-output'].includes(id)) return true
    if (id === 'break-it') return progress.highOutputPassed && progress.normalOutputPassed
    if (id === 'debug') return progress.breakAttempted
    if (id === 'knowledge-check') return progress.diagnosisPassed && progress.repairedOutputPassed
    if (id === 'document') return progress.quizPassed
    return id === 'complete' ? canComplete : false
  }

  const goToStage = (id: string) => {
    if (!canOpenStage(id)) return
    const previous = progressRef.current.currentStage
    const states = { ...progressRef.current.stageStates, [previous]: progressRef.current.stageStates[previous] === 'needs_attention' ? 'needs_attention' : 'passed', [id]: progressRef.current.stageStates[id] === 'passed' ? 'passed' : 'in_progress' } as Lesson01Progress['stageStates']
    updateProgress({ currentStage: id, stageStates: states, lastNeedsAttention: false })
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

  function verifyOutput(kind: 'high' | 'normal') {
    const result = validateExecutionOutput(kind === 'high' ? highText : normalText, kind === 'high' ? 'escalated' : 'standard')
    if (kind === 'high') setHighFeedback(result); else setNormalFeedback(result)
    const bothPassed = kind === 'high' ? result.passed && progress.normalOutputPassed : result.passed && progress.highOutputPassed
    updateProgress({ ...(kind === 'high' ? { highOutputPassed: result.passed } : { normalOutputPassed: result.passed }), lastNeedsAttention: !result.passed, stageStates: { ...progress.stageStates, 'verify-output': bothPassed ? 'passed' : result.passed ? 'in_progress' : 'needs_attention' } })
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
    const next = { ...progressRef.current, completed: true, currentStage: 'complete', lastNeedsAttention: false, stageStates: { ...progressRef.current.stageStates, complete: 'passed' as const } }
    const saved = await persist(next, true)
    if (saved) { progressRef.current = next; setProgress(next); setSaveState('Lesson 01 completed. Your dashboard is now updated.') }
  }

  const completionItems = useMemo(() => [
    ['Workflow structure', progress.structurePassed], ['High output', progress.highOutputPassed], ['Normal output', progress.normalOutputPassed],
    ['Break It attempted', progress.breakAttempted], ['Diagnosis', progress.diagnosisPassed], ['Repair verified', progress.repairedOutputPassed], ['Knowledge check', progress.quizPassed],
  ] as const, [progress])

  if (loading) return <main className="route-loading"><p>Loading Lesson 01…</p></main>
  return <div className="portal-page">
    <header className="portal-header"><a className="back-link" href="/dashboard"><ArrowLeft size={18}/> Dashboard</a><div className="portal-header-actions"><a className="brand brand--compact" href="/"><span className="brand-mark"><Network size={19}/></span><span>n8n <strong>Detleng</strong></span></a><button className="button button--ghost" onClick={() => void logout()}><LogOut size={17}/> Log out</button></div></header>
    <main className="portal-main lab-shell">
      <div className="lab-hero"><div><p className="eyebrow">Lesson 01 · Foundation lab</p><h1>n8n Core</h1><p className="portal-lede">Build and explain an Operations Intake Workflow with real data, branching and debugging.</p></div><div className={"lab-status lab-status--" + status.toLowerCase().replaceAll(' ', '-')}><span>Automatic status</span><strong>{status}</strong><small>{saveState || 'Your progress is synced to your learner account.'}</small></div></div>
      <div className="lab-reminder"><strong>Build in your n8n. Learn in Detleng.</strong><span>Your workflow remains in your own n8n environment.</span></div>
      <StageIndicator stages={lesson01Stages} current={stage} states={progress.stageStates} onSelect={goToStage} isEnabled={canOpenStage}/>
      <section className="lab-panel">
        {stage === 'understand' && <Understand/>}
        {stage === 'build' && <Build/>}
        {stage === 'test' && <TestCases/>}
        {stage === 'verify-structure' && <div><StageHeader number="04" title="Verify your workflow" text="Export the workflow from n8n as JSON. Detleng validates it in your browser and does not permanently store the file."/><label className="file-drop"><FileJson/><strong>Upload exported n8n workflow</strong><span>.json only · maximum 2 MB</span><input type="file" accept="application/json,.json" onChange={(event) => void handleWorkflowFile(event.target.files?.[0])}/></label>{structureResult && <div className="validation-results">{structureResult.checks.map((check) => <div className={check.passed ? 'validation-check is-pass' : 'validation-check is-fail'} key={check.id}><span>{check.passed ? '✓' : '!'}</span><div><strong>{check.label}</strong>{check.detail && !check.passed && <p>{check.detail}</p>}</div></div>)}</div>}</div>}
        {stage === 'verify-output' && <div><StageHeader number="05" title="Verify execution output" text="Paste the output from each final branch. Whitespace and property order do not matter."/><div className="output-grid"><JsonVerifier title="A. High Priority Output" value={highText} onChange={setHighText} onVerify={() => verifyOutput('high')} feedback={highFeedback} button="Verify High Route"/><JsonVerifier title="B. Normal Priority Output" value={normalText} onChange={setNormalText} onVerify={() => verifyOutput('normal')} feedback={normalFeedback} button="Verify Normal Route"/></div></div>}
        {stage === 'break-it' && <div><StageHeader number="06" title="Break It" text="Create a deliberate field mismatch and observe what the IF node does."/><ol className="instruction-list"><li>In your first Edit Fields node, rename <code>priority</code> to <code>priorityLevel</code>.</li><li>Do not update the IF node.</li><li>Run the high-priority workflow again and inspect the route.</li></ol><button className="button button--dark" onClick={() => updateProgress({ breakAttempted: true, stageStates: { ...progress.stageStates, 'break-it': 'passed' } })}>{progress.breakAttempted ? '✓ Break attempt recorded' : 'I ran the broken workflow'}</button></div>}
        {stage === 'debug' && <DebugStage diagnosis={diagnosis} setDiagnosis={setDiagnosis} checkDiagnosis={checkDiagnosis} diagnosisPassed={progress.diagnosisPassed} repairText={repairText} setRepairText={setRepairText} verifyRepair={verifyRepair} repairFeedback={repairFeedback}/>}
        {stage === 'knowledge-check' && <div><StageHeader number="08" title="Knowledge Check" text="Pass all three questions. You can review and retry as often as needed."/><div className="quiz-list">{lesson01Quiz.map((question, index) => <fieldset className="quiz-question" key={question.id}><legend>{index + 1}. {question.question}</legend>{question.options.map((option, optionIndex) => <label key={option}><input type="radio" name={question.id} checked={quizAnswers[question.id] === optionIndex} onChange={() => setQuizAnswers((current) => ({ ...current, [question.id]: optionIndex }))}/>{option}</label>)}</fieldset>)}</div><button className="button button--dark" onClick={submitQuiz}>Check answers</button>{quizFeedback && <StatusMessage passed={progress.quizPassed} message={quizFeedback}/>}</div>}
        {stage === 'document' && <div><StageHeader number="09" title="Document what you learned" text="No screenshot is needed. Write two short engineering reflections."/><div className="reflection-grid"><label>What did you build?<textarea value={progress.reflectionBuilt} onChange={(event) => updateProgress({ reflectionBuilt: event.target.value }, false)} onBlur={() => void persist(progressRef.current)} placeholder="I built…"/></label><label>What did you break and fix?<textarea value={progress.reflectionFixed} onChange={(event) => updateProgress({ reflectionFixed: event.target.value }, false)} onBlur={() => void persist(progressRef.current)} placeholder="I changed… and fixed…"/></label></div></div>}
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

function JsonVerifier({ title, value, onChange, onVerify, feedback, button }: { title: string; value: string; onChange: (value: string) => void; onVerify: () => void; feedback: Feedback | null; button: string }) {
  return <article className="json-verifier"><h3>{title}</h3><textarea value={value} onChange={(event) => onChange(event.target.value)} spellCheck={false} placeholder={'{\n  "route": "…",\n  "status": "ready"\n}'}/><button className="button button--dark" onClick={onVerify}>{button}</button>{feedback && <StatusMessage {...feedback}/>}</article>
}
