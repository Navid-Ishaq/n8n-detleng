import type { Lesson01Progress } from './types'

export const lesson01Stages = [
  { id: 'understand', label: 'Understand' },
  { id: 'build', label: 'Build' },
  { id: 'test', label: 'Test' },
  { id: 'verify-structure', label: 'Verify Structure' },
  { id: 'verify-output', label: 'Run Tests' },
  { id: 'break-it', label: 'Break It' },
  { id: 'debug', label: 'Debug' },
  { id: 'knowledge-check', label: 'Knowledge Check' },
  { id: 'document', label: 'Document' },
  { id: 'complete', label: 'Complete' },
] as const

export const lesson01InitialProgress: Lesson01Progress = {
  currentStage: 'understand', viewedStage: 'understand', stageStates: { understand: 'in_progress' },
  understandCompleted: false, buildCompleted: false, testCompleted: false,
  structurePassed: false, highRouteTestPassed: false, normalRouteTestPassed: false,
  breakAttempted: false, diagnosisPassed: false, repairedOutputPassed: false,
  quizPassed: false, documentCompleted: false, completed: false, reflectionBuilt: '', reflectionFixed: '', lastNeedsAttention: false,
  revision: 0, clientUpdatedAt: '',
}

export const lesson01Quiz = [
  { id: 'trigger', question: 'What does a Trigger do?', options: ['Starts a workflow when its event occurs', 'Stores every credential', 'Changes the n8n theme'], answer: 0 },
  { id: 'node', question: 'What is a Node?', options: ['A single step that receives, processes or sends data', 'A complete n8n account', 'Only an error message'], answer: 0 },
  { id: 'if', question: 'Why is an IF node used?', options: ['To permanently store passwords', 'To route data according to a condition', 'To delete executions'], answer: 1 },
] as const

export function lesson01CanComplete(progress: Lesson01Progress) {
  return progress.structurePassed && progress.highRouteTestPassed && progress.normalRouteTestPassed && progress.breakAttempted && progress.diagnosisPassed && progress.repairedOutputPassed && progress.quizPassed
}
