import { ArrowRight, Braces, Calculator, CheckCircle2, GitBranch, ListTree, Map, Radio, RefreshCw } from 'lucide-react'

const missionSteps = [
  ['Read', 'See the real JSON shape.', Braces], ['Navigate', 'Reach values nested several levels deep.', ListTree],
  ['Map', 'Turn paths into n8n expressions.', Map], ['Calculate', 'Work across arrays and line items.', Calculator],
  ['Normalize', 'Return one predictable contract.', GitBranch], ['Test', 'Let Detleng challenge the workflow.', Radio],
  ['Break', 'Experience a changed schema.', RefreshCw], ['Repair', 'Support both old and new input.', CheckCircle2],
] as const

export function Lesson02Opening({ mode, stageNumber, onPrimary, onReview, onSummary }: { mode: 'new' | 'progress' | 'completed'; stageNumber: number; onPrimary: () => void; onReview: () => void; onSummary: () => void }) {
  return <section className="lesson02-opening">
    <div className="json-opening-copy"><p className="eyebrow">Lesson 02 · Foundation Lab</p><h1>The data arrived.<br/>Everything you need is inside it.<br/><strong>Now you have to find it.</strong></h1><p>Real APIs, Webhooks and AI systems send objects inside objects, arrays of items, optional fields and structures that change. Today you learn to read that shape instead of getting lost inside it.</p><div className="opening-actions">{mode === 'completed' ? <><button className="button button--primary" onClick={onReview}>Review Lesson 02 <ArrowRight size={17}/></button><button className="button button--light" onClick={onSummary}>Engineering Summary</button></> : <button className="button button--primary" onClick={onPrimary}>{mode === 'progress' ? `Resume Stage ${String(stageNumber).padStart(2, '0')}` : 'Start the JSON mission'} <ArrowRight size={17}/></button>}</div></div>
    <div className="json-transform-visual" aria-label="Nested JSON becomes a normalized result"><div><span>Raw / nested</span><pre>{`customer\n  name\n  country\norder\n  id\n  items[]\n    name · qty · price`}</pre></div><b>↓ Normalize</b><div className="is-clean"><span>Clean / usable</span><pre>{`customerName\ncustomerCountry\norderId\nitemCount\norderTotal`}</pre></div></div>
    <div className="mission-step-grid">{missionSteps.map(([title, text, Icon]) => <article key={title}><Icon size={21}/><strong>{title}</strong><span>{text}</span></article>)}</div>
    <div className="opening-promise"><strong>Live promise</strong><span>Detleng will send a real nested order into your n8n workflow. Your workflow will return a clean, calculated result.</span></div>
  </section>
}

export function Lesson02Completion({ onReview }: { onReview: () => void }) {
  const capabilities = [
    ['Read unfamiliar JSON', 'Understand objects, arrays, keys and values.'], ['Navigate nested data', 'Reach values several levels deep.'],
    ['Work with arrays', 'Understand indexes and repeated objects.'], ['Normalize inputs', 'Turn nested data into predictable fields.'],
    ['Debug data shapes', 'Recognize when the data exists but the path is wrong.'],
  ]
  return <div className="lesson02-completion"><section className="completion-hero"><span className="completion-badge"><CheckCircle2 size={17}/> Lesson 02 complete</span><h2>You opened the JSON.<br/>You found the data.<br/><strong>You reshaped it.</strong></h2><p className="completion-lede">Nested JSON is no longer a wall of braces and brackets.</p><p>You can follow paths through objects, navigate arrays, calculate across line items, normalize missing fields and survive a changed schema.</p></section><div className="json-journey-recap">{['Received nested JSON','Read objects and arrays','Mapped nested paths','Calculated line items','Published the normalizer','Passed live payloads','Detected schema drift','Repaired old + new shapes'].map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, '0')}</span>{item}</div>)}</div><blockquote>You did not memorize JSON. You learned how to move through it.</blockquote><div className="capability-grid">{capabilities.map(([title, text]) => <article key={title}><strong>{title}</strong><p>{text}</p></article>)}</div><div className="mental-model"><span>Structure</span><b>→</b><span>Path</span><b>→</b><span>Value</span><b>→</b><span>Transform</span><b>→</b><span>Normalized output</span></div><aside className="portfolio-note"><strong>Optional portfolio evidence</strong><p>Save your workflow JSON export and a <code>sample-payloads.json</code> containing Normal, Missing Country, Schema Drift and Invalid Items Shape examples. Screenshots are not required.</p></aside><section className="next-lesson-card"><p className="eyebrow">Next · Lesson 03</p><h3>REST APIs</h3><p>You know how to read the JSON systems send. Next you learn where it comes from—and how applications ask each other for data and actions.</p><a className="button button--primary" href="/lessons/rest-apis">Continue to Lesson 03 <ArrowRight size={17}/></a><button className="button button--light" onClick={onReview}>Review Lesson 02</button></section></div>
}
