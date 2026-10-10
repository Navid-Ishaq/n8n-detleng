export type TeachingRequest = { customerName: string; department: string; priority: string; budget: number }
export type TeachingRoute = 'escalated' | 'standard'
export type TeachingRun = { route: TeachingRoute; status: 'ready'; branch: boolean; inspectedField: string; inspectedValue: unknown; trace: string[] }

export const highTeachingRequest: TeachingRequest = { customerName: 'Ali Khan', department: 'Support', priority: 'high', budget: 1500 }
export const normalTeachingRequest: TeachingRequest = { customerName: 'Sara Ahmed', department: 'Support', priority: 'normal', budget: 300 }

export function simulateLesson01(request: TeachingRequest, producerField = 'priority'): TeachingRun {
  const produced: Record<string, unknown> = { customerName: request.customerName, department: request.department, budget: request.budget, [producerField]: request.priority }
  const inspectedValue = produced.priority
  const branch = inspectedValue === 'high'
  const route: TeachingRoute = branch ? 'escalated' : 'standard'
  return { route, status: 'ready', branch, inspectedField: 'priority', inspectedValue, trace: ['Trigger', 'Create Request', 'Check Priority', branch ? 'TRUE' : 'FALSE', branch ? 'Escalated' : 'Standard'] }
}

const buildOrder = ['manual-trigger', 'create-request', 'check-priority', 'escalated', 'standard'] as const
export type TeachingNodeId = typeof buildOrder[number]

export function completeTeachingNode(completed: TeachingNodeId[], node: TeachingNodeId) {
  const expected = buildOrder[completed.length]
  if (node !== expected) return completed
  return [...completed, node]
}

export function teachingBuildComplete(completed: TeachingNodeId[]) { return buildOrder.every((node) => completed.includes(node)) }
