import type { Session } from '@supabase/supabase-js'
import type { LiveResult } from '../lesson-engine/types'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
export type LessonApiResponse = { passed: boolean; reached?: boolean; lessonId: string; results?: LiveResult[]; message?: string; error?: string }

export async function callLessonApi(path: string, session: Session | null, body: object): Promise<LessonApiResponse> {
  if (!apiBaseUrl) throw new Error('Live testing is not configured yet.')
  if (!session?.access_token) throw new Error('Please log in again before running a live test.')
  let response: Response
  try { response = await fetch(`${apiBaseUrl}${path}`, { method: 'POST', headers: { authorization: `Bearer ${session.access_token}`, 'content-type': 'application/json' }, body: JSON.stringify(body) }) }
  catch { throw new Error('Detleng could not reach the live-testing service. Please try again shortly.') }
  const data = await response.json().catch(() => ({})) as LessonApiResponse
  if (!response.ok) throw new Error(data.error || 'The live test could not be completed.')
  return data
}
