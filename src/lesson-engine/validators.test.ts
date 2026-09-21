import { describe, expect, it } from 'vitest'
import { lesson01CanComplete, lesson01InitialProgress } from './lesson01-config'
import { advanceLesson01Progress, lesson01AttemptCacheKey, lesson01CacheKey, readLesson01AttemptCache, readLesson01Cache, reconcileLesson01Progress, writeLesson01AttemptCache, writeLesson01Cache } from './progress-cache'
import { computeLesson01Status } from './status'

describe('Lesson 01 V2 state model', () => {
  it('cannot complete before every live requirement passes', () => {
    expect(lesson01CanComplete(lesson01InitialProgress)).toBe(false)
    const eligible = { ...lesson01InitialProgress, understandCompleted: true, manualBuildCompleted: true, manualRunsCompleted: true, webhookUpgradeCompleted: true, testEventPassed: true, productionConnected: true, highLivePassed: true, normalLivePassed: true, breakObserved: true, repairPassed: true }
    expect(lesson01CanComplete(eligible)).toBe(true)
  })

  it('computes status automatically and treats an expected break as practice', () => {
    expect(computeLesson01Status(lesson01InitialProgress)).toBe('Learning')
    expect(computeLesson01Status({ ...lesson01InitialProgress, understandCompleted: true, currentStage: 'test-event' })).toBe('Practicing')
    expect(computeLesson01Status({ ...lesson01InitialProgress, lastNeedsAttention: true })).toBe('Needs Review')
    expect(computeLesson01Status({ ...lesson01InitialProgress, understandCompleted: true, breakObserved: true, currentStage: 'live-break-fix' })).toBe('Practicing')
    expect(computeLesson01Status({ ...lesson01InitialProgress, completed: true })).toBe('Completed')
  })

  it('keeps furthest progress while reviewing an earlier stage', () => {
    const atConnect = advanceLesson01Progress(lesson01InitialProgress, { currentStage: 'publish-connect', viewedStage: 'publish-connect', understandCompleted: true, manualBuildCompleted: true, manualRunsCompleted: true, webhookUpgradeCompleted: true, testEventPassed: true })
    const reviewing = advanceLesson01Progress(atConnect, { viewedStage: 'understand' })
    expect(reviewing.currentStage).toBe('publish-connect')
    expect(reviewing.viewedStage).toBe('understand')
  })

  it('restores pending V2 local progress instead of server defaults', () => {
    const userId = 'v2-cache-user'
    const local = advanceLesson01Progress(lesson01InitialProgress, { currentStage: 'test-event', viewedStage: 'test-event', understandCompleted: true, manualBuildCompleted: true, manualRunsCompleted: true, webhookUpgradeCompleted: true })
    writeLesson01Cache(userId, local, true)
    const reconciled = reconcileLesson01Progress({}, readLesson01Cache(userId))
    expect(reconciled.currentStage).toBe('test-event')
    expect(reconciled.webhookUpgradeCompleted).toBe(true)
    window.localStorage.removeItem(`detleng:lesson:1:v2:${userId}`)
  })

  it('keeps repeat attempt cache separate from canonical Lesson 01 progress', () => {
    const userId = 'repeat-cache-user'
    const canonical = { ...lesson01InitialProgress, completed: true, currentStage: 'complete', viewedStage: 'complete' }
    const attempt = advanceLesson01Progress(lesson01InitialProgress, { understandCompleted: true, currentStage: 'build-manually', viewedStage: 'build-manually' })
    writeLesson01Cache(userId, canonical, false)
    writeLesson01AttemptCache(userId, 2, attempt, true)
    expect(readLesson01Cache(userId)?.progress.completed).toBe(true)
    expect(readLesson01AttemptCache(userId, 2)?.progress.currentStage).toBe('build-manually')
    expect(lesson01AttemptCacheKey(userId, 2)).not.toBe(lesson01CacheKey(userId))
    window.localStorage.removeItem(lesson01CacheKey(userId))
    window.localStorage.removeItem(lesson01AttemptCacheKey(userId, 2))
  })
})
