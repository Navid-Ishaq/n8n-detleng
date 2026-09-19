import { describe, expect, it } from 'vitest'
import { lesson01CanComplete, lesson01InitialProgress } from './lesson01-config'
import { computeLesson01Status } from './status'
import { validateExecutionOutput, validateN8nWorkflowText } from './validators'

const validWorkflow = JSON.stringify({
  nodes: [
    { name: 'Manual Trigger', type: 'n8n-nodes-base.manualTrigger', parameters: {} },
    { name: 'Create Request', type: 'n8n-nodes-base.set', parameters: { fields: ['customerName', 'department', 'priority', 'budget'] } },
    { name: 'Check Priority', type: 'n8n-nodes-base.if', parameters: { condition: 'priority equals high' } },
    { name: 'Escalated', type: 'n8n-nodes-base.set', parameters: { fields: ['route', 'status'] } },
    { name: 'Standard', type: 'n8n-nodes-base.set', parameters: { fields: ['route', 'status'] } },
  ],
  connections: { 'Check Priority': { main: [[{ node: 'Escalated' }], [{ node: 'Standard' }]] } },
})

describe('Lesson 01 deterministic validation', () => {
  it('accepts the required workflow structure', () => {
    const result = validateN8nWorkflowText(validWorkflow)
    expect(result.passed).toBe(true)
    expect(result.checks.every((check) => check.passed)).toBe(true)
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
    const eligible = { ...lesson01InitialProgress, currentStage: 'complete', structurePassed: true, highOutputPassed: true, normalOutputPassed: true, breakAttempted: true, diagnosisPassed: true, repairedOutputPassed: true, quizPassed: true }
    expect(computeLesson01Status(eligible)).toBe('Practicing')
    const complete = { ...eligible, completed: true }
    expect(computeLesson01Status(complete)).toBe('Completed')
  })
})
