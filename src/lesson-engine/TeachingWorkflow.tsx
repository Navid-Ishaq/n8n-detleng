import { CheckCircle2, ChevronDown, Circle, Play, Radio, RotateCcw, Wrench } from 'lucide-react'
import { useState, type ReactNode } from 'react'

export function TeachingWorkflow({ children, label }: { children: ReactNode; label: string }) {
  return <section className="teaching-workflow" aria-label={label}><div className="teaching-workflow-label"><span>Detleng teaching twin</span><b>Complete the learning here. Mirror it in n8n when you are ready.</b></div>{children}</section>
}

export function TeachingConnector({ label = 'data moves down' }: { label?: string }) { return <div className="teaching-connector" aria-label={label}><span>↓</span></div> }

export function TeachingNode({ title, type, purpose, state = 'ready', children, footer }: { title: string; type: string; purpose: string; state?: 'ready'|'active'|'passed'|'error'; children?: ReactNode; footer?: ReactNode }) {
  return <article className={`teaching-node teaching-node--${state}`}><header><span className="teaching-node-state">{state === 'passed' ? <CheckCircle2/> : state === 'error' ? <Wrench/> : <Circle/>}</span><div><small>{type}</small><h3>{title}</h3><p>{purpose}</p></div></header>{children&&<div className="teaching-node-body">{children}</div>}{footer&&<footer>{footer}</footer>}</article>
}

export function TeachingField({ name, type, value, onChange, readOnly = false }: { name: string; type: 'String'|'Number'; value: string|number; onChange?: (value:string)=>void; readOnly?: boolean }) {
  return <label className="teaching-field"><span><b>{name}</b><small>{type}</small></span><input aria-label={`${name} value`} type={type === 'Number' ? 'number' : 'text'} value={value} readOnly={readOnly} onChange={(event)=>onChange?.(event.target.value)}/></label>
}

export function TeachingJson({ label, value }: { label: string; value: unknown }) { return <div className="teaching-json"><span>{label}</span><pre>{JSON.stringify(value, null, 2)}</pre></div> }

export function TeachingExecution({ trace, result }: { trace: string[]; result: unknown }) { return <div className="teaching-execution"><div><Radio/><strong>Teaching simulation</strong><span>{trace.join(' → ')}</span></div><TeachingJson label="Output" value={result}/><small>Practice complete — this is a local teaching result, not live verification.</small></div> }

export function WhyThisWorked({ children }: { children: ReactNode }) { return <aside className="why-worked"><strong>Why this worked</strong><p>{children}</p></aside> }

export function MirrorInN8nPanel({ title = 'Now mirror this in your n8n', steps, expected }: { title?: string; steps: string[]; expected?: ReactNode }) {
  const [open,setOpen]=useState(true)
  return <section className="mirror-panel"><button type="button" onClick={()=>setOpen((value)=>!value)} aria-expanded={open}><span><small>Real n8n practice</small><strong>{title}</strong></span><ChevronDown/></button>{open&&<div><ol>{steps.map((step)=><li key={step}>{step}</li>)}</ol>{expected&&<p className="mirror-expected"><b>Expected:</b> {expected}</p>}</div>}</section>
}

export function TeachingRunButton({ children, onClick, disabled = false, kind = 'run' }: { children: ReactNode; onClick:()=>void; disabled?:boolean; kind?:'run'|'reset' }) { return <button className="button button--dark teaching-run" type="button" disabled={disabled} onClick={onClick}>{kind === 'reset' ? <RotateCcw size={17}/> : <Play size={17}/>} {children}</button> }
