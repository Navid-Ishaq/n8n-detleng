import { ArrowRight, BookOpen, LogOut, Network } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { lessons } from '../data/curriculum'

export function Dashboard() {
  const { user, logout } = useAuth()
  const name = String(user?.user_metadata.full_name || user?.email?.split('@')[0] || 'Learner')
  return <div className="portal-page"><header className="portal-header"><a className="brand" href="/"><span className="brand-mark"><Network size={21} /></span><span>n8n <strong>Detleng</strong></span></a><button className="button button--ghost" onClick={() => void logout()}><LogOut size={17} /> Log out</button></header><main className="portal-main"><p className="eyebrow">Learner dashboard</p><h1>Welcome, {name}.</h1><p className="portal-lede">Your practical automation journey starts here. Progress tracking will activate after the learning database migration is approved.</p><div className="dashboard-summary"><div><strong>0 / 20</strong><span>Lessons completed</span></div><div><strong>Foundation</strong><span>Current level</span></div></div><section><h2>Continue learning</h2><div className="lesson-grid">{lessons.slice(0,4).map((lesson)=><a className="lesson-card" href={`/lessons/${lesson.slug}`} key={lesson.slug}><BookOpen /><h3>{lesson.title}</h3><p>{lesson.summary}</p><div className="lesson-action">Open lesson <ArrowRight size={17}/></div></a>)}</div></section></main></div>
}
