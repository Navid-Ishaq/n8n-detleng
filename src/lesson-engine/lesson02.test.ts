import { beforeEach, describe, expect, it } from 'vitest'
import { advanceLesson02Progress, lesson02CacheKey, readLesson02Cache, reconcileLesson02Progress, writeLesson02Cache } from './lesson02-cache'
import { lesson02CanComplete, lesson02InitialProgress } from './lesson02-config'
import { computeLesson02Status } from './lesson02-status'

describe('Lesson 02 progress', () => {
  beforeEach(() => window.localStorage.clear())

  it('requires every live JSON and repair proof before completion', () => {
    expect(lesson02CanComplete(lesson02InitialProgress)).toBe(false)
    expect(lesson02CanComplete({ ...lesson02InitialProgress, jsonAnatomyCompleted: true, testEventPassed: true, nestedFieldsCompleted: true, arraysCompleted: true, normalizerCompleted: true, productionConnected: true, normalCasePassed: true, variableItemsPassed: true, missingCountryPassed: true, schemaDriftObserved: true, repairPassed: true })).toBe(true)
  })

  it('computes automatic statuses without a manual selector', () => {
    expect(computeLesson02Status(lesson02InitialProgress)).toBe('Learning')
    expect(computeLesson02Status({ ...lesson02InitialProgress, jsonAnatomyCompleted: true, currentStage: 'arrays' })).toBe('Practicing')
    expect(computeLesson02Status({ ...lesson02InitialProgress, lastNeedsAttention: true })).toBe('Needs Review')
    expect(computeLesson02Status({ ...lesson02InitialProgress, completed: true })).toBe('Completed')
  })

  it('uses a Lesson 02 scoped cache and preserves pending local progress', () => {
    const userId = 'learner-02'
    const local = advanceLesson02Progress(lesson02InitialProgress, { jsonAnatomyCompleted: true, currentStage: 'capture-payload', viewedStage: 'capture-payload' })
    writeLesson02Cache(userId, local, true)
    expect(lesson02CacheKey(userId)).toBe('detleng:lesson:2:v1:learner-02')
    expect(readLesson02Cache(userId)?.progress.currentStage).toBe('capture-payload')
    expect(reconcileLesson02Progress(lesson02InitialProgress, readLesson02Cache(userId)).currentStage).toBe('capture-payload')
  })

  it('keeps viewed stage separate from furthest current stage', () => {
    const practicing = advanceLesson02Progress(lesson02InitialProgress, { currentStage: 'normalizer', viewedStage: 'normalizer', jsonAnatomyCompleted: true })
    const reviewing = advanceLesson02Progress(practicing, { viewedStage: 'read-shape' })
    expect(reviewing.currentStage).toBe('normalizer')
    expect(reviewing.viewedStage).toBe('read-shape')
  })
})
