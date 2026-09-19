import { ArrowRight, Check, Circle, LogOut, Network } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { lessons, levels, type Lesson } from '../data/curriculum'
import { supabase } from '../lib/supabase'
import { Footer } from './Footer'

export type LessonStatus = 'Not Started' | 'Learning' | 'Practicing' | 'Needs Review' | 'Completed'
const storageKey = 'detleng:n8n-readiness'

function LessonCard({ lesson, status }: { lesson: Lesson; status: LessonStatus }) {
  return <a className="lesson-card lesson-card--portal" href={`/lessons/${lesson.slug}`}><div className="lesson-meta"><span className="lesson-number lesson-number--indigo">{String(lesson.id).padStart(2, '0')}</span><span className={`status-pill status-pill--${status.toLowerCase().replaceAll(' ', '-')}`}>{status}</span></div><h3>{lesson.title}</h3><p>{lesson.summary}</p><div className="lesson-project"><span>Build</span>{lesson.project}</div><div className="lesson-action">Open lesson <ArrowRight size={17}/></div></a>
}

export function Dashboard() {
  const { user, logout } = useAuth()
  const [statuses, setStatuses] = useState<Record<number, LessonStatus>>({})
  const [readiness, setReadiness] = useState<boolean[]>(() => { const saved = window.localStorage.getItem(storageKey); return saved ? JSON.parse(saved) as boolean[] : [false, false, false, false] })
  const [syncMessage, setSyncMessage] = useState('')
  const name = String(user?.user_metadata.full_name || user?.email?.split('@')[0] || 'Learner')

  useEffect(() => {
    supabase.from('lesson_progress').select('lesson_id,status').eq('user_id', user?.id).then(({ data, error }) => {
      if (error) { setSyncMessage('Progress sync will begin after the learning migration is applied.'); return }
      const next: Record<number, LessonStatus> = {}
      data?.forEach((row) => { next[row.lesson_id] = row.status as LessonStatus })
      setStatuses(next)
    })
  }, [user?.id])

  const completed = lessons.filter((lesson) => (statuses[lesson.id] ?? 'Not Started') === 'Completed').length
  const currentLevel = useMemo(() => levels.find((level) => lessons.filter((lesson) => lesson.level === level.id).some((lesson) => (statuses[lesson.id] ?? 'Not Started') !== 'Completed')) ?? levels.at(-1)!, [statuses])
  const recommended = lessons.filter((lesson) => ['Learning', 'Practicing'].includes(statuses[lesson.id])).slice(0, 4)
  const continueLessons = recommended.length ? recommended : lessons.filter((lesson) => (statuses[lesson.id] ?? 'Not Started') !== 'Completed').slice(0, 4)
  const toggleReadiness = (index: number) => setReadiness((current) => { const next = [...current]; next[index] = !next[index]; window.localStorage.setItem(storageKey, JSON.stringify(next)); return next })

  return <div className="portal-page"><header className="portal-header"><a className="brand" href="/"><span className="brand-mark"><Network size={21}/></span><span>n8n <strong>Detleng</strong></span></a><button className="button button--ghost" onClick={() => void logout()}><LogOut size={17}/> Log out</button></header><main className="portal-main"><p className="eyebrow">Learner dashboard</p><h1>Welcome, {name}.</h1><p className="portal-lede">Your practical automation workspace. Build deliberately, test honestly and keep your progress visible.</p>{syncMessage && <p className="portal-notice" role="status">{syncMessage}</p>}<div className="dashboard-summary"><div><strong>{completed} / 20</strong><span>Lessons completed</span></div><div><strong>{currentLevel.title}</strong><span>Current level</span></div></div><section className="readiness-card"><div><p className="eyebrow">My n8n environment</p><h2>Ready to build safely?</h2><p>Educational readiness only. Keep all external credentials inside your own n8n Credentials store.</p></div><div className="readiness-list">{['I have access to an n8n instance','I can create and edit workflows','I know where n8n Credentials are configured','My learning environment is ready'].map((item,index)=><button className={readiness[index] ? 'readiness-item is-done' : 'readiness-item'} key={item} onClick={() => toggleReadiness(index)}><span>{readiness[index] ? <Check size={17}/> : <Circle size={17}/>}</span>{item}</button>)}</div></section><section><div className="portal-section-heading"><div><p className="eyebrow">Your next steps</p><h2>Continue learning</h2></div><span>{completed} of 20 complete</span></div><div className="lesson-grid portal-lesson-grid">{continueLessons.map((lesson) => <LessonCard key={lesson.slug} lesson={lesson} status={statuses[lesson.id] ?? 'Not Started'}/>)}</div></section><section className="curriculum-workspace"><p className="eyebrow">Complete curriculum</p><h2>All 20 lessons</h2>{levels.map((level) => <div className="curriculum-level" key={level.id}><div className="curriculum-level-heading"><div><span>{level.number}</span><div><h3>{level.title}</h3><p>{level.description}</p></div></div><strong>{lessons.filter((lesson) => lesson.level === level.id && statuses[lesson.id] === 'Completed').length} / {lessons.filter((lesson) => lesson.level === level.id).length}</strong></div><div className="lesson-grid portal-lesson-grid">{lessons.filter((lesson) => lesson.level === level.id).map((lesson) => <LessonCard key={lesson.slug} lesson={lesson} status={statuses[lesson.id] ?? 'Not Started'}/>)}</div></div>)}</section></main><Footer/></div>
}
