import { describe, expect, it } from 'vitest'
import { lesson01CanComplete, lesson01InitialProgress } from './lesson01-config'
import { computeLesson01Status } from './status'
import { advanceLesson01Progress, normalizeLesson01Progress, readLesson01Cache, reconcileLesson01Progress, writeLesson01Cache } from './progress-cache'
import { validateExecutionOutput, validateN8nWorkflowText } from './validators'

const validWorkflow = JSON.stringify({
  nodes: [
    { name: 'Manual Trigger', type: 'n8n-nodes-base.manualTrigger', parameters: {} },
    { name: 'Create Request', type: 'n8n-nodes-base.set', parameters: { fields: ['customerName', 'department', 'priority', 'budget'] } },
    { name: 'Check Priority', type: 'n8n-nodes-base.if', parameters: { condition: 'priority equals high' } },
    { name: 'Escalated', type: 'n8n-nodes-base.set', parameters: { assignments: [{ name: 'route', value: 'escalated' }, { name: 'status', value: 'ready' }] } },
    { name: 'Standard', type: 'n8n-nodes-base.set', parameters: { assignments: [{ name: 'route', value: 'standard' }, { name: 'status', value: 'ready' }] } },
  ],
  connections: { 'Check Priority': { main: [[{ node: 'Escalated' }], [{ node: 'Standard' }]] } },
})

describe('Lesson 01 deterministic validation', () => {
  it('accepts the required workflow structure', () => {
    const result = validateN8nWorkflowText(validWorkflow)
    expect(result.passed).toBe(true)
    expect(result.checks.every((check) => check.passed)).toBe(true)
  })

  it('checks the true/false branch destinations and configured route values', () => {
    const reversed = JSON.parse(validWorkflow) as { connections: Record<string, { main: unknown[][] }> }
    reversed.connections['Check Priority'].main.reverse()
    const result = validateN8nWorkflowText(JSON.stringify(reversed))
    expect(result.passed).toBe(false)
    expect(result.checks.find((check) => check.id === 'true-branch')?.passed).toBe(false)
    expect(result.checks.find((check) => check.id === 'false-branch')?.passed).toBe(false)
  })

  it('fails invalid JSON cleanly and identifies a missing IF node', () => {
    expect(validateN8nWorkflowText('{bad').checks[0].detail).toMatch(/Could not parse/i)
    const missingIf = validateN8nWorkflowText(JSON.stringify({ nodes: [{ name: 'Manual', type: 'manualTrigger' }], connections: {} }))
    expect(missingIf.checks.find((check) => check.id === 'if')?.passed).toBe(false)
  })

  it('validates high and normal output without depending on property order', () => {
    expect(validateExecutionOutput('{"status":"ready","route":"escalated"}', 'escalated').passed).toBe(true)
    expect(validateExecutionOutput('[{"json":{"route":"standard","status":"ready"}}]', 'standard').passed).toBe(true)
    expect(validateExecutionOutput('{"route":"standard","status":"ready"}', 'escalated').message).toMatch(/expected 'escalated'/)
    expect(validateExecutionOutput('not json', 'standard').message).toMatch(/Could not parse/i)
  })

  it('cannot complete early and computes automatic statuses', () => {
    expect(lesson01CanComplete(lesson01InitialProgress)).toBe(false)
    expect(computeLesson01Status(lesson01InitialProgress)).toBe('Learning')
    expect(computeLesson01Status({ ...lesson01InitialProgress, currentStage: 'build' })).toBe('Practicing')
    expect(computeLesson01Status({ ...lesson01InitialProgress, lastNeedsAttention: true })).toBe('Needs Review')
    const eligible = { ...lesson01InitialProgress, currentStage: 'complete', structurePassed: true, highRouteTestPassed: true, normalRouteTestPassed: true, breakAttempted: true, diagnosisPassed: true, repairedOutputPassed: true, quizPassed: true }
    expect(computeLesson01Status(eligible)).toBe('Practicing')
    const complete = { ...eligible, completed: true }
    expect(computeLesson01Status(complete)).toBe('Completed')
  })

  it('keeps the furthest stage separate from an earlier reviewed stage', () => {
    const atVerify = advanceLesson01Progress(lesson01InitialProgress, {
      currentStage: 'verify-structure', viewedStage: 'verify-structure',
      understandCompleted: true, buildCompleted: true, testCompleted: true,
      stageStates: { understand: 'passed', build: 'passed', test: 'passed', 'verify-structure': 'in_progress' },
    })
    const reviewing = advanceLesson01Progress(atVerify, { viewedStage: 'understand' })
    expect(reviewing.currentStage).toBe('verify-structure')
    expect(reviewing.viewedStage).toBe('understand')
    expect(reviewing.stageStates.test).toBe('passed')
    expect(computeLesson01Status(reviewing)).toBe('Practicing')
  })

  it('restores pending local progress instead of replacing it with server defaults', () => {
    const userId = 'cache-test-user'
    const local = advanceLesson01Progress(lesson01InitialProgress, { currentStage: 'verify-structure', viewedStage: 'verify-structure', understandCompleted: true, buildCompleted: true, testCompleted: true })
    writeLesson01Cache(userId, local, true)
    const cached = readLesson01Cache(userId)
    const reconciled = reconcileLesson01Progress({}, cached)
    expect(reconciled.currentStage).toBe('verify-structure')
    expect(reconciled.testCompleted).toBe(true)
    window.localStorage.removeItem('detleng:lesson:1:' + userId)
  })

  it('preserves previously passed output checks as the new beginner route checks', () => {
    const restored = normalizeLesson01Progress({
      currentStage: 'verify-output',
      viewedStage: 'verify-output',
      highOutputPassed: true,
      normalOutputPassed: true,
    })
    expect(restored.highRouteTestPassed).toBe(true)
    expect(restored.normalRouteTestPassed).toBe(true)
  })
})
