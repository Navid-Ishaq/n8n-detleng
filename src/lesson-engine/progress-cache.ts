import { lesson01InitialProgress } from './lesson01-config'
import type { Lesson01Progress } from './types'

export type CachedLessonProgress = { progress: Lesson01Progress; syncPending: boolean }

export function lesson01CacheKey(userId: string) { return `detleng:lesson:1:${userId}` }

export function normalizeLesson01Progress(value: unknown): Lesson01Progress {
  if (!value || typeof value !== 'object') return structuredClone(lesson01InitialProgress)
  const saved = value as Partial<Lesson01Progress>
  const legacy = value as { highOutputPassed?: boolean; normalOutputPassed?: boolean }
  return {
    ...structuredClone(lesson01InitialProgress),
    ...saved,
    viewedStage: saved.viewedStage || saved.currentStage || 'understand',
    highRouteTestPassed: saved.highRouteTestPassed ?? legacy.highOutputPassed ?? false,
    normalRouteTestPassed: saved.normalRouteTestPassed ?? legacy.normalOutputPassed ?? false,
    stageStates: { ...lesson01InitialProgress.stageStates, ...saved.stageStates },
  }
}

export function readLesson01Cache(userId: string): CachedLessonProgress | null {
  try {
    const raw = window.localStorage.getItem(lesson01CacheKey(userId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<CachedLessonProgress>
    return { progress: normalizeLesson01Progress(parsed.progress), syncPending: parsed.syncPending === true }
  } catch { return null }
}

export function writeLesson01Cache(userId: string, progress: Lesson01Progress, syncPending: boolean) {
  try { window.localStorage.setItem(lesson01CacheKey(userId), JSON.stringify({ progress, syncPending })) } catch { /* Supabase remains authoritative when storage is unavailable. */ }
}

export function advanceLesson01Progress(current: Lesson01Progress, patch: Partial<Lesson01Progress>) {
  return { ...current, ...patch, revision: current.revision + 1, clientUpdatedAt: new Date().toISOString() }
}

export function reconcileLesson01Progress(serverValue: unknown, cached: CachedLessonProgress | null) {
  const server = normalizeLesson01Progress(serverValue)
  if (!cached) return server
  if (cached.syncPending) return cached.progress
  const serverTime = Date.parse(server.clientUpdatedAt || '') || 0
  const cacheTime = Date.parse(cached.progress.clientUpdatedAt || '') || 0
  return cacheTime > serverTime ? cached.progress : server
}
