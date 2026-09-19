import { ArrowRight, Braces, Check, ChevronRight, CirclePlay, Menu, Network, ShieldCheck, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { capstones, lessons, levels } from './data/curriculum'
import { Footer } from './components/Footer'

const interactionLabels = { webhook_lab: 'Live lab', self_run: 'Build lab', external_trigger: 'Field test', checklist: 'Ops lab', quiz_project: 'Project lab' }

function lessonHref(slug: string) {
  return `/login?returnTo=${encodeURIComponent(`/lessons/${slug}`)}`
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div id="top">
      <header className="site-header">
        <div className="shell nav-wrap">
          <a className="brand" href="#top" aria-label="n8n Detleng home"><span className="brand-mark"><Network size={21} /></span><span>n8n <strong>Detleng</strong></span></a>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
          <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Main navigation">
            <a href="#curriculum">Curriculum</a><a href="#method">How it works</a><a href="#capstones">Capstones</a>
            <a className="button button--ghost" href="/login">Log in</a><a className="button button--dark" href="/signup">Start learning <ArrowRight size={17} /></a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero shell">
          <div className="hero-copy">
            <div className="kicker"><Sparkles size={16} /> Project-first learning for automation engineers</div>
            <h1>Become an <span>n8n AI Automation Engineer.</span></h1>
            <p className="hero-lede">Go from first workflow to production systems by building, testing and debugging real automation in your own n8n environment.</p>
            <div className="hero-actions"><a className="button button--primary" href="/signup">Start learning free <ArrowRight size={18} /></a><a className="button button--light" href="#curriculum"><CirclePlay size={19} /> Explore 20 lessons</a></div>
            <div className="trust-row"><span><Check /> Practical labs</span><span><Check /> Your own credentials</span><span><Check /> Portfolio evidence</span></div>
          </div>
          <div className="hero-visual" aria-label="Learning workflow illustration">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="visual-card visual-card--main"><div className="visual-icon"><Braces /></div><span>LEARNING LOOP</span><strong>Build what runs.</strong><p>Understand → Build → Test → Debug</p><div className="progress-bar"><span /></div><small>Engineering confidence · 68%</small></div>
            <div className="float-card float-card--top"><span className="status-dot" /> Workflow active</div>
            <div className="float-card float-card--bottom"><ShieldCheck /><div><strong>Credentials stay yours</strong><span>Stored inside your n8n</span></div></div>
          </div>
        </section>

        <section className="proof-strip"><div className="shell proof-grid"><div><strong>20</strong><span>Focused lessons</span></div><div><strong>4</strong><span>Engineering levels</span></div><div><strong>4</strong><span>Portfolio capstones</span></div><div><strong>1</strong><span>Job-ready learning path</span></div></div></section>

        <section className="section shell" id="curriculum">
          <div className="section-heading"><div><p className="eyebrow">The learning path</p><h2>Four levels. One complete engineering journey.</h2></div><p>Move from reliable workflow fundamentals to AI systems you can deploy, monitor and explain.</p></div>
          <div className="level-grid">{levels.map((level) => <article className={`level-card level-card--${level.color}`} key={level.id}><div className="level-top"><span>{level.number}</span><p>{level.eyebrow}</p></div><h3>{level.title}</h3><p>{level.description}</p><div className="level-outcome"><Check /> {level.outcome}</div></article>)}</div>

          <div className="lesson-heading"><div><p className="eyebrow">Complete curriculum</p><h2>Every skill is visible from day one.</h2></div><p>Choose any lesson to begin. We’ll ask you to sign in, then bring you straight back to it.</p></div>
          <div className="lesson-grid">{lessons.map((lesson) => { const level = levels.find((item) => item.id === lesson.level)!; return <a className="lesson-card" href={lessonHref(lesson.slug)} key={lesson.slug}><div className="lesson-meta"><span className={`lesson-number lesson-number--${level.color}`}>{String(lesson.id).padStart(2, '0')}</span><span className="lab-type">{interactionLabels[lesson.interaction]}</span></div><h3>{lesson.title}</h3><p>{lesson.summary}</p><div className="lesson-project"><span>Build</span>{lesson.project}</div><div className="lesson-action">Open lesson <ChevronRight size={18} /></div></a> })}</div>
        </section>

        <section className="method-section" id="method"><div className="shell method-grid"><div className="method-copy"><p className="eyebrow eyebrow--light">How it works</p><h2>Learn like an engineer, not a spectator.</h2><p>Each lesson turns one technical idea into a working system. You keep ownership of your n8n environment and service credentials; Detleng supplies the instruction, tests and evidence trail.</p><div className="ownership-note"><ShieldCheck /><div><strong>Your automation. Your credentials.</strong><span>External API keys stay inside your own n8n credential store.</span></div></div></div><ol className="method-list"><li><span>01</span><div><strong>Understand & build</strong><p>Learn the mental model, then assemble a real workflow.</p></div></li><li><span>02</span><div><strong>Connect & test</strong><p>Run realistic inputs and inspect structured output.</p></div></li><li><span>03</span><div><strong>Break & debug</strong><p>Investigate failure modes instead of hiding them.</p></div></li><li><span>04</span><div><strong>Verify & document</strong><p>Prove mastery with reusable portfolio evidence.</p></div></li></ol></div></section>

        <section className="section shell" id="capstones"><div className="section-heading"><div><p className="eyebrow">Portfolio capstones</p><h2>Finish with proof that you can ship.</h2></div><p>Four connected projects show employers and clients how you solve complete automation problems.</p></div><div className="capstone-grid">{capstones.map((capstone) => <article className="capstone-card" key={capstone.number}><span className="capstone-number">PROJECT {capstone.number}</span><p className="capstone-combines">{capstone.combines}</p><h3>{capstone.title}</h3><div className="flow-line">{capstone.flow}</div><a href="/signup">Build this capstone <ArrowRight size={17} /></a></article>)}</div></section>

        <section className="cta-section shell"><div><p className="eyebrow">Ready to build?</p><h2>Start with one workflow. Grow into an automation engineer.</h2><p>Explore the complete curriculum for free and keep your learning connected to real work.</p></div><a className="button button--dark button--large" href="/signup">Start learning <ArrowRight size={19} /></a></section>
      </main>
      <Footer />
    </div>
  )
}
