import { ArrowLeft, ArrowRight, CheckCircle2, LockKeyhole, Network, ShieldCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { friendlyAuthError } from '../lib/auth-errors'
import { supabase } from '../lib/supabase'

type AuthPageProps = { mode: 'login' | 'signup'; returnTo: string }

export function AuthPage({ mode, returnTo }: AuthPageProps) {
  const isLogin = mode === 'login'
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)
  const switchHref = `${isLogin ? '/signup' : '/login'}${returnTo !== '/dashboard' ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setMessage(null)
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')
    const name = String(form.get('name') ?? '').trim()
    try {
      if (!email || !password || (!isLogin && !name)) throw new Error('Please complete every field.')
      if (password.length < 8) throw new Error('Password must contain at least 8 characters.')
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        window.location.assign(returnTo)
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/login?returnTo=${encodeURIComponent(returnTo)}` } })
        if (error) throw error
        if (data.session) {
          setMessage({ kind: 'success', text: 'Account created successfully. Taking you to your learning workspace…' })
          window.setTimeout(() => window.location.assign(returnTo), 700)
        } else setMessage({ kind: 'success', text: 'Account created. Check your email to confirm your address, then log in.' })
      }
    } catch (error) {
      const raw = error instanceof Error ? error.message : ''
      setMessage({ kind: 'error', text: raw.startsWith('Please complete') ? raw : friendlyAuthError(raw) })
    } finally { setLoading(false) }
  }

  return <main className="auth-page" id="main">
    <section className="auth-panel auth-panel--story"><a className="brand brand--auth" href="/" aria-label="n8n Detleng home"><span className="brand-mark"><Network size={21} /></span><span>n8n <strong>Detleng</strong></span></a><div className="auth-story-copy"><p className="eyebrow eyebrow--light">Your engineering workspace</p><h1>Build skills that work outside the classroom.</h1><p>Learn, connect, test, debug and document real n8n automation using your own environment.</p><div className="ownership-note"><ShieldCheck /><div><strong>Your credentials stay yours.</strong><span>External service keys belong in your own n8n credential store.</span></div></div></div><p className="auth-disclaimer">Independent learning project. Not affiliated with or endorsed by n8n GmbH.</p></section>
    <section className="auth-panel auth-panel--form"><div className="auth-form-wrap"><a className="back-link" href="/"><ArrowLeft size={18} /> Back to curriculum</a><div className="auth-icon"><LockKeyhole /></div><p className="eyebrow">{isLogin ? 'Welcome back' : 'Start your journey'}</p><h2>{isLogin ? 'Log in to continue learning.' : 'Create your learning account.'}</h2><p className="auth-intro">{isLogin ? 'Continue from the lesson or project you last selected.' : 'Your progress, workflow connections and portfolio evidence will live in one place.'}</p>{returnTo !== '/dashboard' && <div className="return-notice">After {isLogin ? 'login' : 'signup'}, you’ll continue to <strong>{returnTo}</strong>.</div>}{message && <div className={`auth-message auth-message--${message.kind}`} role={message.kind === 'error' ? 'alert' : 'status'}>{message.kind === 'success' && <CheckCircle2 size={19} />}{message.text}</div>}<form className="auth-form" onSubmit={handleSubmit}>{!isLogin && <label>Full name<input name="name" type="text" autoComplete="name" placeholder="Your name" required /></label>}<label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label><label>Password<input name="password" type="password" minLength={8} autoComplete={isLogin ? 'current-password' : 'new-password'} placeholder="At least 8 characters" required /></label><button className="button button--primary auth-submit" type="submit" disabled={loading}>{loading ? 'Please wait…' : isLogin ? 'Log in' : 'Create account'} {!loading && <ArrowRight size={18} />}</button></form><p className="auth-switch">{isLogin ? 'New to n8n Detleng?' : 'Already have an account?'} <a href={switchHref}>{isLogin ? 'Create account' : 'Log in'}</a></p></div></section>
  </main>
}
