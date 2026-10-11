import { beforeEach, describe, expect, it } from 'vitest'
import { advanceLesson02Progress, lesson02AttemptCacheKey, lesson02CacheKey, normalizeLesson02Progress, readLesson02AttemptCache, readLesson02Cache, reconcileLesson02Progress, writeLesson02AttemptCache, writeLesson02Cache } from './lesson02-cache'
import { lesson02CanComplete, lesson02InitialProgress } from './lesson02-config'
import { computeLesson02Status } from './lesson02-status'

describe('Lesson 02 progress', () => {
  beforeEach(() => window.localStorage.clear())
  it('requires the practical workflow, tests, repair and export', () => {
    expect(lesson02CanComplete(lesson02InitialProgress)).toBe(false)
    expect(lesson02CanComplete({ ...lesson02InitialProgress, shapeRead:true, payloadCaptured:true, nestedFieldsBuilt:true, arraysExplored:true, normalizerBuilt:true, publishUnderstood:true, liveChallengePracticed:true })).toBe(true)
  })
  it('computes automatic statuses', () => {
    expect(computeLesson02Status(lesson02InitialProgress)).toBe('Learning')
    expect(computeLesson02Status({ ...lesson02InitialProgress, shapeRead:true })).toBe('Practicing')
    expect(computeLesson02Status({ ...lesson02InitialProgress, completed:true })).toBe('Completed')
  })
  it('preserves pending local progress', () => {
    const local=advanceLesson02Progress(lesson02InitialProgress,{shapeRead:true,currentStage:'capture-payload',viewedStage:'capture-payload'})
    writeLesson02Cache('learner',local,true)
    expect(lesson02CacheKey('learner')).toBe('detleng:lesson:2:learner')
    expect(readLesson02Cache('learner')?.progress.currentStage).toBe('capture-payload')
    expect(reconcileLesson02Progress(lesson02InitialProgress,readLesson02Cache('learner')).currentStage).toBe('capture-payload')
  })
  it('keeps practice attempts isolated and migrates legacy stage names', () => {
    const attempt=advanceLesson02Progress(lesson02InitialProgress,{shapeRead:true,currentStage:'capture-payload',viewedStage:'capture-payload'})
    writeLesson02AttemptCache('learner',2,attempt,false)
    expect(lesson02AttemptCacheKey('learner',2)).toContain(':attempt:2')
    expect(readLesson02AttemptCache('learner',2)?.progress.shapeRead).toBe(true)
    expect(readLesson02Cache('learner')).toBeNull()
    expect(normalizeLesson02Progress({currentStage:'sample-payload',viewedStage:'sample-payload',workflowCreated:true}).currentStage).toBe('capture-payload')
  })
  it('preserves a completed canonical lesson during hydration', () => {
    const completed={...lesson02InitialProgress,completed:true,currentStage:'complete',viewedStage:'complete'}
    expect(normalizeLesson02Progress(completed).completed).toBe(true)
    expect(normalizeLesson02Progress(completed).currentStage).toBe('complete')
  })
})
