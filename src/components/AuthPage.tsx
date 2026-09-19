import { ArrowLeft, ArrowRight, LockKeyhole, Network, ShieldCheck } from 'lucide-react'

type AuthPageProps = { mode: 'login' | 'signup'; returnTo: string }

export function AuthPage({ mode, returnTo }: AuthPageProps) {
  const isLogin = mode === 'login'
  const switchHref = `${isLogin ? '/signup' : '/login'}${returnTo !== '/dashboard' ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`

  return (
    <main className="auth-page" id="main">
      <section className="auth-panel auth-panel--story">
        <a className="brand brand--auth" href="/" aria-label="n8n Detleng home"><span className="brand-mark"><Network size={21} /></span><span>n8n <strong>Detleng</strong></span></a>
        <div className="auth-story-copy">
          <p className="eyebrow eyebrow--light">Your engineering workspace</p>
          <h1>Build skills that work outside the classroom.</h1>
          <p>Learn, connect, test, debug and document real n8n automation using your own environment.</p>
          <div className="ownership-note"><ShieldCheck /><div><strong>Your credentials stay yours.</strong><span>External service keys belong in your own n8n credential store.</span></div></div>
        </div>
        <p className="auth-disclaimer">Independent learning project. Not affiliated with or endorsed by n8n GmbH.</p>
      </section>
      <section className="auth-panel auth-panel--form">
        <div className="auth-form-wrap">
          <a className="back-link" href="/"><ArrowLeft size={18} /> Back to curriculum</a>
          <div className="auth-icon"><LockKeyhole /></div>
          <p className="eyebrow">{isLogin ? 'Welcome back' : 'Start your journey'}</p>
          <h2>{isLogin ? 'Log in to continue learning.' : 'Create your learning account.'}</h2>
          <p className="auth-intro">{isLogin ? 'Continue from the lesson or project you last selected.' : 'Your progress, workflow connections and portfolio evidence will live in one place.'}</p>
          {returnTo !== '/dashboard' && <div className="return-notice">After {isLogin ? 'login' : 'signup'}, you’ll continue to <strong>{returnTo}</strong>.</div>}
          <form className="auth-form" onSubmit={(event) => event.preventDefault()}>
            {!isLogin && <label>Full name<input name="name" type="text" autoComplete="name" placeholder="Your name" /></label>}
            <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" /></label>
            <label>Password<input name="password" type="password" autoComplete={isLogin ? 'current-password' : 'new-password'} placeholder="At least 8 characters" /></label>
            <button className="button button--primary auth-submit" type="submit" disabled>{isLogin ? 'Log in' : 'Create account'} <ArrowRight size={18} /></button>
          </form>
          <p className="auth-pending" role="status">Secure account connection will be enabled in the next authentication stage.</p>
          <p className="auth-switch">{isLogin ? 'New to n8n Detleng?' : 'Already have an account?'} <a href={switchHref}>{isLogin ? 'Create account' : 'Log in'}</a></p>
        </div>
      </section>
    </main>
  )
}
