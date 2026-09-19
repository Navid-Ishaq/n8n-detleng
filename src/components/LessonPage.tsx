import { ArrowLeft, LogOut, Network } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { lessons } from '../data/curriculum'
import { Lesson01Lab } from '../lesson-engine/Lesson01Lab'
import { Footer } from './Footer'

export function LessonPage({ slug }: { slug: string }) {
  const { logout } = useAuth()
  const lesson = lessons.find((item) => item.slug === slug)
  if (!lesson) return <main className="route-loading"><p>Lesson not found.</p></main>
  if (slug === 'n8n-core') return <Lesson01Lab />
  return <div className="portal-page"><header className="portal-header"><a className="back-link" href="/dashboard"><ArrowLeft size={18}/> Dashboard</a><div className="portal-header-actions"><a className="brand brand--compact" href="/"><span className="brand-mark"><Network size={19}/></span><span>n8n <strong>Detleng</strong></span></a><button className="button button--ghost" onClick={() => void logout()}><LogOut size={17}/> Log out</button></div></header><main className="portal-main lesson-shell"><p className="eyebrow">Lesson {String(lesson.id).padStart(2,'0')} · {lesson.interaction.replace('_',' ')}</p><h1>{lesson.title}</h1><p className="portal-lede">{lesson.summary}</p><div className="lesson-workspace"><p className="eyebrow">Coming next</p><h2>{lesson.project}</h2><p>This lesson will use the reusable Detleng lab engine introduced in Lesson 01. Status is determined automatically; learners cannot select completion manually.</p></div></main><Footer/></div>
}
