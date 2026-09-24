import { beforeEach, describe, expect, it } from 'vitest'
import { advanceLesson02Progress, lesson02CacheKey, readLesson02Cache, reconcileLesson02Progress, writeLesson02Cache } from './lesson02-cache'
import { lesson02CanComplete, lesson02InitialProgress } from './lesson02-config'
import { computeLesson02Status } from './lesson02-status'

describe('Lesson 02 progress', () => {
  beforeEach(() => window.localStorage.clear())
  it('requires the practical workflow, tests, repair and export', () => {
    expect(lesson02CanComplete(lesson02InitialProgress)).toBe(false)
    expect(lesson02CanComplete({ ...lesson02InitialProgress, workflowCreated:true, samplePayloadRun:true, normalizerBuilt:true, dynamicTestPassed:true, breakRepairCompleted:true, workflowExported:true })).toBe(true)
  })
  it('computes automatic statuses', () => {
    expect(computeLesson02Status(lesson02InitialProgress)).toBe('Learning')
    expect(computeLesson02Status({ ...lesson02InitialProgress, workflowCreated:true })).toBe('Practicing')
    expect(computeLesson02Status({ ...lesson02InitialProgress, completed:true })).toBe('Completed')
  })
  it('preserves pending local progress', () => {
    const local=advanceLesson02Progress(lesson02InitialProgress,{workflowCreated:true,currentStage:'sample-payload',viewedStage:'sample-payload'})
    writeLesson02Cache('learner',local,true)
    expect(lesson02CacheKey('learner')).toBe('detleng:lesson:2:learner')
    expect(readLesson02Cache('learner')?.progress.currentStage).toBe('sample-payload')
    expect(reconcileLesson02Progress(lesson02InitialProgress,readLesson02Cache('learner')).currentStage).toBe('sample-payload')
  })
})
