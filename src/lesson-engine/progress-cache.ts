import { lesson01InitialProgress } from './lesson01-config'
import type { Lesson01Progress } from './types'

export type CachedLessonProgress = { progress: Lesson01Progress; syncPending: boolean }
export function lesson01CacheKey(userId: string) { return `detleng:lesson:1:v2:${userId}` }
export function lesson01AttemptCacheKey(userId: string, attemptNumber: number) { return `${lesson01CacheKey(userId)}:attempt:${attemptNumber}` }
export function normalizeLesson01Progress(value: unknown): Lesson01Progress {
  if (!value || typeof value !== 'object') return structuredClone(lesson01InitialProgress)
  const saved = value as Partial<Lesson01Progress>
  return { ...structuredClone(lesson01InitialProgress), ...saved, lessonVersion: 2, viewedStage: saved.viewedStage || saved.currentStage || 'understand', stageStates: { ...lesson01InitialProgress.stageStates, ...saved.stageStates } }
}
export function readLesson01Cache(userId: string): CachedLessonProgress | null {
  try { const raw = window.localStorage.getItem(lesson01CacheKey(userId)); if (!raw) return null; const parsed = JSON.parse(raw) as Partial<CachedLessonProgress>; return { progress: normalizeLesson01Progress(parsed.progress), syncPending: parsed.syncPending === true } } catch { return null }
}
export function writeLesson01Cache(userId: string, progress: Lesson01Progress, syncPending: boolean) {
  try { window.localStorage.setItem(lesson01CacheKey(userId), JSON.stringify({ progress, syncPending })) } catch { /* Supabase remains authoritative. */ }
}
export function readLesson01AttemptCache(userId: string, attemptNumber: number): CachedLessonProgress | null {
  try { const raw = window.localStorage.getItem(lesson01AttemptCacheKey(userId, attemptNumber)); if (!raw) return null; const parsed = JSON.parse(raw) as Partial<CachedLessonProgress>; return { progress: normalizeLesson01Progress(parsed.progress), syncPending: parsed.syncPending === true } } catch { return null }
}
export function writeLesson01AttemptCache(userId: string, attemptNumber: number, progress: Lesson01Progress, syncPending: boolean) {
  try { window.localStorage.setItem(lesson01AttemptCacheKey(userId, attemptNumber), JSON.stringify({ progress, syncPending })) } catch { /* Supabase remains authoritative. */ }
}
export function advanceLesson01Progress(current: Lesson01Progress, patch: Partial<Lesson01Progress>) { return { ...current, ...patch, lessonVersion: 2 as const, revision: current.revision + 1, clientUpdatedAt: new Date().toISOString() } }
export function reconcileLesson01Progress(serverValue: unknown, cached: CachedLessonProgress | null) {
  const server = normalizeLesson01Progress(serverValue); if (!cached) return server; if (cached.syncPending) return cached.progress
  return (Date.parse(cached.progress.clientUpdatedAt || '') || 0) > (Date.parse(server.clientUpdatedAt || '') || 0) ? cached.progress : server
}
