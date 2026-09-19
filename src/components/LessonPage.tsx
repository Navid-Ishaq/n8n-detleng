import { ArrowLeft, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { lessons } from '../data/curriculum'

export function LessonPage({ slug }: { slug: string }) {
  const { logout } = useAuth(); const lesson = lessons.find((item) => item.slug === slug)
  if (!lesson) return <main className="route-loading"><p>Lesson not found.</p></main>
  return <div className="portal-page"><header className="portal-header"><a className="back-link" href="/dashboard"><ArrowLeft size={18}/> Dashboard</a><button className="button button--ghost" onClick={() => void logout()}><LogOut size={17}/> Log out</button></header><main className="portal-main lesson-shell"><p className="eyebrow">Lesson {String(lesson.id).padStart(2,'0')}</p><h1>{lesson.title}</h1><p className="portal-lede">{lesson.summary}</p><div className="lesson-placeholder"><strong>Build project</strong><h2>{lesson.project}</h2><p>Your protected lesson workspace is ready. Full lesson content and progress persistence will be connected through the approved database migration in the next stage.</p></div></main></div>
}
