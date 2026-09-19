import { ArrowLeft, Check, LogOut, Network } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { lessons } from '../data/curriculum'
import { supabase } from '../lib/supabase'
import { Footer } from './Footer'
import type { LessonStatus } from './Dashboard'

const statuses: LessonStatus[] = ['Not Started', 'Learning', 'Practicing', 'Needs Review', 'Completed']

export function LessonPage({ slug }: { slug: string }) {
  const { user, logout } = useAuth(); const lesson = lessons.find((item) => item.slug === slug)
  const [status, setStatus] = useState<LessonStatus>('Not Started'); const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false)
  useEffect(() => { if (!user || !lesson) return; supabase.from('lesson_progress').select('status').eq('user_id', user.id).eq('lesson_id', lesson.id).maybeSingle().then(({ data }) => { if (data?.status) setStatus(data.status as LessonStatus) }) }, [user, lesson])
  if (!lesson) return <main className="route-loading"><p>Lesson not found.</p></main>
  const currentLesson = lesson
  async function updateStatus(next: LessonStatus) { setStatus(next); setSaving(true); setSaved(false); const { error } = await supabase.from('lesson_progress').upsert({ user_id: user?.id, lesson_id: currentLesson.id, status: next, started_at: next === 'Not Started' ? null : new Date().toISOString(), completed_at: next === 'Completed' ? new Date().toISOString() : null, last_activity_at: new Date().toISOString() }, { onConflict: 'user_id,lesson_id' }); setSaving(false); setSaved(!error) }
  return <div className="portal-page"><header className="portal-header"><a className="back-link" href="/dashboard"><ArrowLeft size={18}/> Dashboard</a><div className="portal-header-actions"><a className="brand brand--compact" href="/"><span className="brand-mark"><Network size={19}/></span><span>n8n <strong>Detleng</strong></span></a><button className="button button--ghost" onClick={() => void logout()}><LogOut size={17}/> Log out</button></div></header><main className="portal-main lesson-shell"><p className="eyebrow">Lesson {String(currentLesson.id).padStart(2,'0')} · {currentLesson.interaction.replace('_',' ')}</p><h1>{currentLesson.title}</h1><p className="portal-lede">{currentLesson.summary}</p><div className="lesson-stage-row">{['Understand','Build','Connect','Test','Break','Debug','Verify','Document'].map((stage,index)=><span className={index < (status === 'Completed' ? 8 : status === 'Not Started' ? 1 : 2) ? 'is-active' : ''} key={stage}>{stage}</span>)}</div><div className="lesson-workspace"><p className="eyebrow">Build project</p><h2>{currentLesson.project}</h2><p>Use your own n8n environment and keep external credentials inside n8n Credentials. Opening this lesson does not mark it complete.</p><label className="status-label">My lesson status<select value={status} onChange={(event) => void updateStatus(event.target.value as LessonStatus)} disabled={saving}>{statuses.map((option)=><option key={option}>{option}</option>)}</select></label>{saving && <p className="save-state">Saving progress…</p>}{saved && <p className="save-state save-state--success"><Check size={17}/> Progress saved.</p>}</div></main><Footer/></div>
}
