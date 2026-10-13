import { ArrowLeft, ArrowRight, BookOpenCheck, Check, CheckCircle2, ChevronRight, Circle, Eye, Lightbulb, Network, RotateCcw, ShieldCheck, Sparkles, Workflow } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Footer } from '../components/Footer'
import { lesson20GuideModules, lesson20GuideSteps } from './lesson20-guide-data'

type SavedGuide = { step: number; completed: string[] }

export function Lesson20OperatorGuide() {
  const { user, logout } = useAuth()
  const storageKey = `detleng:l20-operator-guide:${user?.id ?? 'learner'}`
  const savedGuide=(()=>{try{return JSON.parse(localStorage.getItem(storageKey)??'null') as SavedGuide|null}catch{return null}})()
  const [mode,setMode] = useState<'overview'|'journey'>('overview')
  const [stepIndex,setStepIndex] = useState(()=>Math.min(savedGuide?.step??0,lesson20GuideSteps.length-1))
  const [completed,setCompleted] = useState<string[]>(()=>savedGuide?.completed??[])
  const [answers,setAnswers] = useState<Record<string,number>>({})

  useEffect(()=>{localStorage.setItem(storageKey,JSON.stringify({step:stepIndex,completed} satisfies SavedGuide))},[completed,stepIndex,storageKey])

  const step=lesson20GuideSteps[stepIndex]
  const currentModule=lesson20GuideModules.find((item)=>item.id===step.moduleId)!
  const answerIndex=answers[step.id]
  const selected=answerIndex===undefined?undefined:step.interaction?.options[answerIndex]
  const canContinue=!step.interaction||selected?.correct
  const progress=Math.round((completed.length/lesson20GuideSteps.length)*100)
  const isFinal=stepIndex===lesson20GuideSteps.length-1

  const moduleProgress=useMemo(()=>Object.fromEntries(lesson20GuideModules.map((module)=>[module.id,module.steps.filter((item)=>completed.includes(item.id)).length])),[completed])
  const begin=()=>{setMode('journey');window.scrollTo({top:0,behavior:'smooth'})}
  const go=(index:number)=>{setStepIndex(Math.max(0,Math.min(index,lesson20GuideSteps.length-1)));setMode('journey');window.scrollTo({top:0,behavior:'smooth'})}
  const next=()=>{if(!canContinue)return;setCompleted((items)=>items.includes(step.id)?items:[...items,step.id]);if(!isFinal)go(stepIndex+1)}
  const chooseAnswer=(index:number)=>{setAnswers((current)=>({...current,[step.id]:index}));if(isFinal&&step.interaction?.options[index]?.correct)setCompleted((items)=>items.includes(step.id)?items:[...items,step.id])}
  const reset=()=>{setStepIndex(0);setCompleted([]);setAnswers({});localStorage.removeItem(storageKey)}

  return <div className="portal-page guide-page"><header className="portal-header guide-header"><a className="brand" href="/"><span className="brand-mark"><Network size={21}/></span><span>n8n <strong>Detleng</strong></span></a><div className="guide-header-actions"><a href="/dashboard">Dashboard</a><a href="/lessons/monitoring-security-approval">Live Lesson 20</a><button className="button button--ghost" onClick={()=>void logout()}>Log out</button></div></header>
    {mode==='overview'?<main className="guide-overview">
      <section className="guide-hero shell"><div className="guide-hero-copy"><div className="guide-kicker"><Sparkles size={17}/> Lesson 20 · Operator preparation</div><h1 aria-label="Lesson 20 Operator Guide">Lesson 20<br/><span>Operator Guide</span></h1><p className="guide-hero-lede">Learn the system. Practise the decisions. Then operate the live lab.</p><p>Follow an authenticated request through AI interpretation, knowledge retrieval, deterministic rules, human approval, bounded action, permanent evidence, monitoring, verification and report delivery.</p><div className="guide-actions"><button className="button button--primary button--large" onClick={begin}>{completed.length?'Resume the interactive journey':'Start the interactive learning journey'} <ArrowRight size={19}/></button><a className="button button--light" href="/lessons/monitoring-security-approval">Go directly to Lesson 20</a></div><div className="guide-simulation-note"><ShieldCheck/><div><strong>Interactive learning environment</strong><span>This guide uses deterministic teaching simulations. No live action is executed here.</span></div></div></div>
      <div className="guide-hero-system" aria-label="Lesson 20 system journey"><div className="system-card"><span>AUTHENTICATED REQUEST</span><strong>Refund €240 to C-501</strong></div><div className="system-flow">{['Validate','Interpret','Retrieve','Constrain','Approve','Act','Record','Verify'].map((item,index)=><div key={item}><span>{String(index+1).padStart(2,'0')}</span><b>{item}</b></div>)}</div><div className="system-proof"><CheckCircle2/><div><strong>Evidence, not decoration</strong><span>Every concept leads to a decision you can explain.</span></div></div></div></section>

      <section className="guide-promise shell"><div><p className="eyebrow">The complete learning map</p><h2>Eight connected modules. One request. Complete operator understanding.</h2></div><p>This is not a glossary or a wall of text. You will predict, simulate, inspect, retry and connect every concept to the live system.</p></section>

      <section className="guide-module-grid shell">{lesson20GuideModules.map((module,index)=><article className="guide-module-card" key={module.id}><div className="module-card-top"><span>{module.number}</span><small>{module.steps.length} learning steps</small></div><h3>{module.title}</h3><p>{module.promise}</p><div className="module-outcome"><Check/><span>{module.outcome}</span></div><button aria-label={`Explore ${module.title}`} onClick={()=>go(lesson20GuideSteps.findIndex((item)=>item.moduleId===module.id))}>Explore module <ChevronRight/></button>{index<lesson20GuideModules.length-1&&<i/>}</article>)}</section>

      <section className="guide-method"><div className="shell"><p className="eyebrow eyebrow--light">From understanding to engineering evidence</p><h2>You will not memorise a diagram.<br/>You will learn to reason through the system.</h2><div className="guide-method-grid">{[['Understand','Build the mental model.'],['Predict','Decide what should happen.'],['Simulate','Practise without live consequences.'],['Inspect','Read the evidence.'],['Operate','Enter the authenticated lab.'],['Prove','Verify outcomes and receive the report.']].map(([title,copy],index)=><div key={title}><span>{String(index+1).padStart(2,'0')}</span><strong>{title}</strong><p>{copy}</p></div>)}</div></div></section>

      <section className="guide-start shell"><div><p className="eyebrow">Ready to understand the system?</p><h2>Start with the first request.</h2><p>{lesson20GuideSteps.length} focused steps · {lesson20GuideSteps.filter((item)=>item.interaction).length} meaningful decision labs · progress saved in this browser</p></div><button className="button button--primary button--large" onClick={begin}>Start the Operator Guide <ArrowRight/></button></section>
    </main>:<main className="guide-learning-shell">
      <aside className="guide-sidebar"><button className="guide-back-overview" onClick={()=>setMode('overview')}><ArrowLeft/> Guide overview</button><div className="guide-progress"><div><span>Operator journey</span><strong>{progress}%</strong></div><div className="progress-bar"><span style={{width:`${progress}%`}}/></div><small>{completed.length} of {lesson20GuideSteps.length} steps understood</small></div><nav aria-label="Operator guide modules">{lesson20GuideModules.map((module)=><div className={module.id===currentModule.id?'guide-nav-module is-current':'guide-nav-module'} key={module.id}><button onClick={()=>go(lesson20GuideSteps.findIndex((item)=>item.moduleId===module.id))}><span>{module.number}</span><div><strong>{module.title}</strong><small>{moduleProgress[module.id]} / {module.steps.length}</small></div></button>{module.id===currentModule.id&&<ol>{module.steps.map((item)=>{const index=lesson20GuideSteps.findIndex((candidate)=>candidate.id===item.id);return <li key={item.id}><button className={index===stepIndex?'is-active':''} onClick={()=>go(index)}>{completed.includes(item.id)?<CheckCircle2/>:<Circle/>}{item.title}</button></li>})}</ol>}</div>)}</nav></aside>

      <section className="guide-learning-main"><div className="simulation-ribbon"><ShieldCheck/> Teaching simulation · No live action is being executed</div><div className="guide-step-meta"><span>Module {currentModule.number}</span><b>Step {currentModule.steps.findIndex((item)=>item.id===step.id)+1} of {currentModule.steps.length}</b></div><p className="eyebrow">{step.eyebrow}</p><h1>{step.title}</h1><p className="guide-step-intro">{step.humanMeaning}</p>
        <div className="guide-explanation-grid"><article><div className="explanation-icon"><BookOpenCheck/></div><span>Exact technical meaning</span><p>{step.technicalMeaning}</p></article><article><div className="explanation-icon"><Eye/></div><span>See it in this system</span><p>{step.example}</p></article><article><div className="explanation-icon"><Lightbulb/></div><span>Why it matters</span><p>{step.whyItMatters}</p></article></div>
        <div className="guide-memory"><Sparkles/><div><span>Remember it like this</span><strong>{step.memory}</strong></div></div>
        {step.interaction&&<section className="guide-interaction"><div className="interaction-label">{step.interaction.label} · Try it yourself</div><h2>{step.interaction.prompt}</h2><p>{step.interaction.hint}</p><div className="interaction-options">{step.interaction.options.map((item,index)=><button className={answerIndex===index?(item.correct?'is-correct':'is-incorrect'):''} onClick={()=>chooseAnswer(index)} key={item.label}><span>{answerIndex===index?(item.correct?<Check/>:<RotateCcw/>):<Circle/>}</span>{item.label}</button>)}</div>{selected&&<div className={selected.correct?'interaction-feedback is-correct':'interaction-feedback is-incorrect'} role="status"><strong>{selected.correct?'That reasoning is sound.':'Not yet—inspect the control boundary.'}</strong><p>{selected.feedback}</p>{!selected.correct&&<span>Choose again when you are ready.</span>}</div>}</section>}
        {!step.interaction&&<div className="guide-connection"><Workflow/><div><span>Connection to the live lab</span><p>You will see this responsibility as stored system state—not as a simulated claim—when you operate Lesson 20.</p></div></div>}
        {isFinal&&canContinue?<section className="operator-ready"><div><CheckCircle2/><p className="eyebrow">Operator readiness achieved</p><h2>You understand the system.</h2><p>You can now explain its authority boundaries, predict its important paths and read the evidence it creates.</p></div><div className="readiness-proof">{lesson20GuideModules.map((module)=><span key={module.id}><Check/> {module.outcome.replace(/^I can /,'')}</span>)}</div><a className="button button--primary button--large" href="/lessons/monitoring-security-approval">Enter the Live Control Room <ArrowRight/></a></section>:<div className="guide-step-controls"><button className="button button--light" disabled={stepIndex===0} onClick={()=>go(stepIndex-1)}><ArrowLeft/> Previous</button><span>Step {stepIndex+1} of {lesson20GuideSteps.length}</span><button className="button button--dark" disabled={!canContinue} onClick={next}>{canContinue?'Continue':'Complete the decision above'} {canContinue&&<ArrowRight/>}</button></div>}
        <button className="guide-reset" onClick={reset}><RotateCcw/> Restart guide progress</button>
      </section>
    </main>}
    <Footer/></div>
}
