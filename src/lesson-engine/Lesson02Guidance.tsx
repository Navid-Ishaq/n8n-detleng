import { ArrowRight, CheckCircle2, Copy } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { lesson02Expressions, lesson02NormalPayload, lesson02VariablePayload } from './lesson02-expressions'

export function StageHeader({ number, title, text }: { number: string; title: string; text: string }) {
  return <header className="stage-header"><span>{number}</span><div><h2>{title}</h2><p>{text}</p></div></header>
}

export function CopyBlock({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)
  return <div className="expression-card"><strong>{label}</strong><code>{value}</code><button className="copy-expression" type="button" onClick={() => { void navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500) }}>{copied ? <CheckCircle2 size={16}/> : <Copy size={16}/>} {copied ? 'Copied' : 'Copy'}</button></div>
}

function Loop({ children }: { children: ReactNode }) { return <div className="teaching-loop">{children}</div> }
function Continue({ children, onClick }: { children: ReactNode; onClick: () => void }) { return <button className="button button--primary lab-primary-action" onClick={onClick}>{children} <ArrowRight size={17}/></button> }

export function Lesson02Stage01({ onContinue }: { onContinue: () => void }) {
  return <><StageHeader number="01" title="Create the workflow" text="Build the exact three-node path we tested in the current n8n UI."/><Loop>
    <div className="workflow-strip"><span>Start Manually</span><b>→</b><span>Create Sample Order</span><b>→</b><span>Normalize Order</span></div>
    <ol className="guided-actions"><li>In n8n, click <strong>Create Workflow</strong>.</li><li>Name it <strong>Detleng Lesson 02 — Order Payload Normalizer</strong>.</li><li>Click <strong>Add first step...</strong>, search <strong>Manual Trigger</strong>, and select it.</li><li>Right-click it, choose <strong>Rename</strong>, enter <strong>Start Manually</strong>, and press Enter.</li><li>Click its right-side <strong>+</strong>, search <strong>Edit Fields</strong>, and select <strong>Edit Fields (Set)</strong>.</li><li>Rename that node <strong>Create Sample Order</strong>.</li></ol>
    <p className="action-callout"><strong>Verify:</strong> the first two nodes are connected. No URL, account connection or credential is required.</p>
    <Continue onClick={onContinue}>My first two nodes are ready</Continue>
  </Loop></>
}

export function Lesson02Stage02({ onContinue }: { onContinue: () => void }) {
  return <><StageHeader number="02" title="Create the nested order" text="Paste one known payload, run it, and inspect the real n8n output."/><Loop>
    <ol className="guided-actions"><li>Open <strong>Create Sample Order</strong>.</li><li>Under <strong>Parameters</strong>, open <strong>Mode</strong> and select <strong>JSON</strong>.</li><li>Delete the example and paste the payload below.</li><li>Click <strong>Execute step</strong>.</li><li>In OUTPUT, open <strong>JSON</strong>.</li></ol>
    <CopyBlock label="Sample order JSON" value={lesson02NormalPayload}/>
    <div className="json-tree"><div><span className="type-badge object">Object</span><b>customer</b><div><code>name: "Ali Khan"</code></div><div><code>country: "ES"</code></div></div><div><span className="type-badge object">Object</span><b>order</b><div><code>id: "ORD-101"</code></div><div><span className="type-badge array">Array · 2 items</span><code>items[0] → Keyboard</code><code>items[1] → Mouse</code></div></div></div>
    <p className="term-callout"><strong>Why:</strong> objects group named values; arrays hold an ordered list. Array position 0 is the first item.</p>
    <Continue onClick={onContinue}>I can see the nested JSON</Continue>
  </Loop></>
}

export function Lesson02Stage03({ onContinue }: { onContinue: () => void }) {
  const rows = [['customerName','String',lesson02Expressions.name],['customerCountry','String',lesson02Expressions.country],['orderId','String',lesson02Expressions.id],['itemCount','Number',lesson02Expressions.count],['orderTotal','Number',lesson02Expressions.total]]
  return <><StageHeader number="03" title="Normalize the order" text="Turn nested data into five clean, predictable fields."/><Loop>
    <ol className="guided-actions"><li>Close the panel and click the <strong>+</strong> after Create Sample Order.</li><li>Add <strong>Edit Fields (Set)</strong> and rename it <strong>Normalize Order</strong>.</li><li>Keep <strong>Mode</strong> as <strong>Manual Mapping</strong>.</li><li>For every row below, click <strong>Add Field</strong>, enter the field name, select its type, and paste its value.</li></ol>
    <div className="field-setup-list">{rows.map(([name,type,value]) => <article className="field-setup" key={name}><div><span>Field name</span><strong>{name}</strong></div><div><span>Type</span><strong>{type}</strong></div><CopyBlock label="Value" value={value}/></article>)}</div>
    <div className="calculation-story"><article><strong>Keyboard</strong><span>2 × 50 = 100</span></article><article><strong>Mouse</strong><span>1 × 25 = 25</span></article><b>100 + 25 = 125</b></div>
    <pre>{'{\n  "customerName": "Ali Khan",\n  "customerCountry": "ES",\n  "orderId": "ORD-101",\n  "itemCount": 2,\n  "orderTotal": 125\n}'}</pre>
    <p className="action-callout"><strong>Run:</strong> click <strong>Execute step</strong>. Compare all five values before continuing.</p>
    <Continue onClick={onContinue}>My five-field output is correct</Continue>
  </Loop></>
}

export function Lesson02Stage04({ onContinue }: { onContinue: () => void }) {
  return <><StageHeader number="04" title="Prove it is dynamic" text="Use a different order and let the same expressions calculate the answer."/><Loop>
    <ol className="guided-actions"><li>Open <strong>Create Sample Order</strong>.</li><li>Replace its entire JSON with the payload below.</li><li>Close the panel and click <strong>Execute workflow</strong>.</li><li>Open <strong>Normalize Order</strong> → OUTPUT → <strong>JSON</strong>.</li></ol>
    <CopyBlock label="Three-item test payload" value={lesson02VariablePayload}/>
    <pre>{'{\n  "customerName": "Sara Noor",\n  "customerCountry": "DE",\n  "orderId": "ORD-202",\n  "itemCount": 3,\n  "orderTotal": 260\n}'}</pre>
    <p className="term-callout"><strong>Why:</strong> 200 + (2 × 15) + (3 × 10) = 260. The workflow reads the array; it does not assume two items.</p>
    <Continue onClick={onContinue}>My result is 3 items and 260</Continue>
  </Loop></>
}

export function Lesson02Stage05({ onContinue }: { onContinue: () => void }) {
  return <><StageHeader number="05" title="Break the shape, then repair it" text="Experience three real JSON shape problems directly inside n8n."/><Loop>
    <section className="challenge-phase is-break"><span>A</span><div><h3>Missing country</h3><p>Remove <code>customer.country</code> and run. The old expression previews <code>undefined</code> and final JSON contains <code>null</code>. Use this safe value:</p><CopyBlock label="customerCountry" value={lesson02Expressions.country}/><p>Expected after repair: <code>customerCountry: "Unknown"</code>.</p></div></section>
    <section className="challenge-phase is-break"><span>B</span><div><h3>Renamed field</h3><p>Change <code>customer.name</code> to <code>customer.fullName</code>. The old path becomes undefined. Use this fallback:</p><CopyBlock label="customerName" value={lesson02Expressions.name}/><p>Expected after repair: <code>customerName: "Ali Khan"</code>.</p></div></section>
    <section className="challenge-phase is-repair"><span>C</span><div><h3>Valid JSON, wrong shape</h3><p>Change <code>order.items</code> from array <code>[]</code> to object <code>{'{}'}</code>. Without guards, itemCount and orderTotal become null. The guarded expressions already used in Stage 03 return 0.</p></div></section>
    <p className="action-callout"><strong>Restore:</strong> paste the original Ali Khan payload back, click <strong>Execute workflow</strong>, and confirm 2 items and 125.</p>
    <Continue onClick={onContinue}>I broke, repaired and restored it</Continue>
  </Loop></>
}

export function Lesson02Stage06({ onContinue }: { onContinue: () => void }) {
  return <><StageHeader number="06" title="Export the working workflow" text="Keep the real workflow artifact as your evidence."/><Loop>
    <ol className="guided-actions"><li>Confirm the canvas reads <strong>Start Manually → Create Sample Order → Normalize Order</strong>.</li><li>Run the original payload one final time and confirm <strong>itemCount 2</strong> and <strong>orderTotal 125</strong>.</li><li>Click the workflow-name <strong>...</strong> menu.</li><li>Click <strong>Export JSON</strong>.</li><li>Keep the downloaded file. No screenshot upload is required.</li></ol>
    <p className="term-callout"><strong>You proved:</strong> nested paths, arrays, calculated totals, fallbacks and data-shape debugging—all inside n8n.</p>
    <Continue onClick={onContinue}>My workflow is exported</Continue>
  </Loop></>
}
