import { ArrowRight, Blocks, Braces, CircleDot, GitBranch, Globe2, Play, Rocket, Sparkles } from 'lucide-react'

export function Lesson01Opening({ onStart }: { onStart: () => void }) {
  const capabilities = [
    ['Triggers begin the work', 'Understand what starts an execution, from a manual click to a live Webhook.', CircleDot],
    ['Nodes move and shape data', 'Watch each node receive information, transform it and pass it forward.', Blocks],
    ['Branches make decisions', 'Use an IF node so one workflow can respond differently to different input.', GitBranch],
    ['Webhooks connect systems', 'Learn Test and Production URLs, publish your workflow and trigger it from Detleng.', Globe2],
    ['Debugging builds confidence', 'Introduce a field mismatch, inspect the failure, repair it and prove the fix.', Braces],
  ] as const

  return <section className="lesson-opening" aria-labelledby="lesson-opening-title">
    <div className="opening-hero">
      <div className="opening-copy">
        <p className="opening-overline">Lesson 01 · Foundation Lab</p>
        <h1 id="lesson-opening-title">From your first click to a live automation</h1>
        <p className="opening-lede">You are about to build something real.</p>
        <p>Start with a workflow that runs when you click a button. Finish with a published automation that another system can trigger live over the internet.</p>
        <p>You will build it yourself in n8n, watch data move, create branches, connect Detleng through a Webhook, deliberately break the logic—and repair it.</p>
        <p className="opening-promise"><Sparkles size={20} aria-hidden="true"/><strong>This is not a lesson where you simply read about n8n. You are going to operate it.</strong></p>
        <button className="button button--primary opening-cta" type="button" onClick={onStart}>Start Lesson 01 <ArrowRight size={19}/></button>
      </div>
      <div className="opening-journey" aria-label="Journey from a manual workflow to a live automation">
        <div className="journey-node journey-node--start"><Play aria-hidden="true"/><span>Manual click</span></div>
        <span className="journey-line" aria-hidden="true"/>
        <div className="journey-node"><Blocks aria-hidden="true"/><span>Data flows</span></div>
        <span className="journey-line" aria-hidden="true"/>
        <div className="journey-node"><GitBranch aria-hidden="true"/><span>Logic branches</span></div>
        <span className="journey-line" aria-hidden="true"/>
        <div className="journey-node journey-node--live"><Globe2 aria-hidden="true"/><span>Live Webhook</span></div>
      </div>
    </div>

    <div className="opening-section">
      <p className="section-kicker">What you will learn</p>
      <h2>See how a real n8n workflow thinks.</h2>
      <div className="opening-capabilities">
        {capabilities.map(([title, text, Icon]) => <article key={title}><Icon aria-hidden="true"/><h3>{title}</h3><p>{text}</p></article>)}
      </div>
    </div>

    <div className="opening-build-card">
      <div className="opening-build-copy"><p className="section-kicker">What you will build</p><h2>Operations Intake Workflow</h2><p>First run it manually. Then transform the same workflow into a live Webhook automation Detleng can test.</p></div>
      <div className="opening-flow" aria-label="Operations Intake Workflow">
        <span>Incoming Request</span><b>↓</b><span>Create Request</span><b>↓</b><span>Check Priority</span>
        <div><span>High → Escalated</span><span>Normal → Standard</span></div>
      </div>
    </div>

    <div className="opening-mission">
      <Rocket aria-hidden="true"/>
      <div><p className="section-kicker">Your mission</p><h2>Build → Run → Connect → Break → Fix</h2><p>And most importantly: <strong>understand why it worked.</strong></p></div>
    </div>
  </section>
}

const milestones = [
  'Created a workflow from individual nodes', 'Moved real data through it', 'Built two IF branches',
  'Changed a Manual Trigger into a Webhook', 'Received a live event from Detleng', 'Mapped incoming Webhook data',
  'Published a Production Webhook', 'Passed High and Normal live tests', 'Introduced and diagnosed a field mismatch',
  'Repaired the workflow and proved both routes again',
]

export function Lesson01CompletionStory() {
  return <div className="completion-story">
    <section className="completion-hero">
      <span className="completion-badge">✓ Lesson 01 complete</span>
      <h2>You built it. You broke it. You fixed it.</h2>
      <p>Congratulations—your first real n8n engineering lab is complete.</p>
      <p>You began with a workflow waiting for a manual click. Now you have a published automation that receives a real event, processes data, makes a decision and returns a result.</p>
    </section>

    <section className="completion-section">
      <p className="section-kicker">Look at what you just did</p>
      <div className="completion-milestones">{milestones.map((item, index) => <article key={item}><span>{index + 1}</span><p>{item}</p></article>)}</div>
    </section>

    <section className="completion-section">
      <p className="section-kicker">What you can now do</p>
      <div className="completion-capabilities">
        <article><Blocks aria-hidden="true"/><h3>Read a workflow</h3><p>Explain triggers, nodes, executions and the data moving between them.</p></article>
        <article><GitBranch aria-hidden="true"/><h3>Control its decisions</h3><p>Use conditions and branches to produce different results from different input.</p></article>
        <article><Globe2 aria-hidden="true"/><h3>Connect it live</h3><p>Let another application start a published n8n workflow through a Webhook.</p></article>
      </div>
      <div className="mental-model" aria-label="Automation mental model">{['Event', 'Trigger', 'Data', 'Decision', 'Action', 'Result'].map((item, index) => <div key={item}><span>{item}</span>{index < 5 && <ArrowRight aria-hidden="true"/>}</div>)}</div>
    </section>

    <blockquote className="completion-realization">You are no longer just looking at n8n from the outside. <strong>You have started building with it.</strong></blockquote>

    <section className="completion-next">
      <div><p className="section-kicker">Your journey continues</p><h3>Lesson 02 — JSON</h3><p>You already moved JSON through a workflow today. Next, learn exactly what it is, how to read it and how to control it.</p></div>
      <a className="button button--dark" href="/lessons/json">Continue to Lesson 02 <ArrowRight size={18}/></a>
    </section>
  </div>
}
