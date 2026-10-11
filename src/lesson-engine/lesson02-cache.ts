import { lesson02InitialProgress } from './lesson02-config'
import type { Lesson02Progress } from './lesson02-types'

export type CachedLesson02Progress = { progress: Lesson02Progress; syncPending: boolean }
export function lesson02CacheKey(userId: string) { return `detleng:lesson:2:${userId}` }
export function normalizeLesson02Progress(value: unknown): Lesson02Progress {
  if (!value || typeof value !== 'object') return structuredClone(lesson02InitialProgress)
  const saved = value as Partial<Lesson02Progress>
  const knownStages = new Set(['read-shape','capture-payload','nested-fields','arrays','build-normalizer','publish-connect','live-challenge','complete'])
  const legacyStage: Record<string,string> = { 'create-workflow':'read-shape', 'sample-payload':'capture-payload', normalize:'nested-fields', 'dynamic-test':'build-normalizer', 'break-repair':'live-challenge', export:'publish-connect' }
  const mappedCurrent = legacyStage[saved.currentStage || ''] || saved.currentStage
  const mappedViewed = legacyStage[saved.viewedStage || ''] || saved.viewedStage
  const currentStage = knownStages.has(mappedCurrent || '') ? mappedCurrent! : saved.completed ? 'complete' : 'read-shape'
  const viewedStage = knownStages.has(mappedViewed || '') ? mappedViewed! : currentStage
  const migrated = { ...structuredClone(lesson02InitialProgress), ...saved, currentStage, viewedStage } as Lesson02Progress
  if ('workflowCreated' in saved) migrated.shapeRead ||= Boolean((saved as Record<string,unknown>).workflowCreated)
  if ('samplePayloadRun' in saved) migrated.payloadCaptured ||= Boolean((saved as Record<string,unknown>).samplePayloadRun)
  if ('dynamicTestPassed' in saved) migrated.arraysExplored ||= Boolean((saved as Record<string,unknown>).dynamicTestPassed)
  if ('breakRepairCompleted' in saved) migrated.liveChallengePracticed ||= Boolean((saved as Record<string,unknown>).breakRepairCompleted)
  migrated.stageStates = { ...lesson02InitialProgress.stageStates, ...saved.stageStates }
  return migrated
}

export function lesson02AttemptCacheKey(userId: string, attemptNumber: number) { return `${lesson02CacheKey(userId)}:attempt:${attemptNumber}` }
export function readLesson02AttemptCache(userId: string, attemptNumber: number): CachedLesson02Progress | null {
  try { const raw = window.localStorage.getItem(lesson02AttemptCacheKey(userId, attemptNumber)); if (!raw) return null; const parsed = JSON.parse(raw) as Partial<CachedLesson02Progress>; return { progress: normalizeLesson02Progress(parsed.progress), syncPending: parsed.syncPending === true } } catch { return null }
}
export function writeLesson02AttemptCache(userId: string, attemptNumber: number, progress: Lesson02Progress, syncPending: boolean) {
  try { window.localStorage.setItem(lesson02AttemptCacheKey(userId, attemptNumber), JSON.stringify({ progress, syncPending })) } catch { /* Supabase remains authoritative. */ }
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
