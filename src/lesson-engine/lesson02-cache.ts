import { lesson02InitialProgress } from './lesson02-config'
import type { Lesson02Progress } from './lesson02-types'

export type CachedLesson02Progress = { progress: Lesson02Progress; syncPending: boolean }
export function lesson02CacheKey(userId: string) { return `detleng:lesson:2:${userId}` }
export function normalizeLesson02Progress(value: unknown): Lesson02Progress {
  if (!value || typeof value !== 'object') return structuredClone(lesson02InitialProgress)
  const saved = value as Partial<Lesson02Progress>
  const knownStages = new Set(['create-workflow','sample-payload','normalize','dynamic-test','break-repair','export','complete'])
  const currentStage = knownStages.has(saved.currentStage || '') ? saved.currentStage! : saved.completed ? 'complete' : 'create-workflow'
  const viewedStage = knownStages.has(saved.viewedStage || '') ? saved.viewedStage! : currentStage
  return { ...structuredClone(lesson02InitialProgress), ...saved, currentStage, viewedStage, stageStates: { ...lesson02InitialProgress.stageStates, ...saved.stageStates } }
}
export function readLesson02Cache(userId: string): CachedLesson02Progress | null {
  try { const raw = window.localStorage.getItem(lesson02CacheKey(userId)); if (!raw) return null; const parsed = JSON.parse(raw) as Partial<CachedLesson02Progress>; return { progress: normalizeLesson02Progress(parsed.progress), syncPending: parsed.syncPending === true } } catch { return null }
}
export function writeLesson02Cache(userId: string, progress: Lesson02Progress, syncPending: boolean) {
  try { window.localStorage.setItem(lesson02CacheKey(userId), JSON.stringify({ progress, syncPending })) } catch { /* Supabase remains authoritative. */ }
}
export function advanceLesson02Progress(current: Lesson02Progress, patch: Partial<Lesson02Progress>) { return { ...current, ...patch, revision: current.revision + 1, clientUpdatedAt: new Date().toISOString() } }
export function reconcileLesson02Progress(serverValue: unknown, cached: CachedLesson02Progress | null) {
  const server = normalizeLesson02Progress(serverValue); if (!cached) return server; if (cached.syncPending) return cached.progress
  return (Date.parse(cached.progress.clientUpdatedAt || '') || 0) > (Date.parse(server.clientUpdatedAt || '') || 0) ? cached.progress : server
}
