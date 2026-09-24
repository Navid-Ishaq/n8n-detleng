import type { Lesson02Progress } from './lesson02-types'

export const lesson02Stages = [
  { id: 'create-workflow', label: 'Create' },
  { id: 'sample-payload', label: 'Sample JSON' },
  { id: 'normalize', label: 'Normalize' },
  { id: 'dynamic-test', label: 'Test' },
  { id: 'break-repair', label: 'Break & Repair' },
  { id: 'export', label: 'Export' },
  { id: 'complete', label: 'Complete' },
] as const

export const lesson02InitialProgress: Lesson02Progress = {
  currentStage: 'create-workflow', viewedStage: 'create-workflow', stageStates: { 'create-workflow': 'in_progress' },
  workflowCreated: false, samplePayloadRun: false, normalizerBuilt: false, dynamicTestPassed: false,
  breakRepairCompleted: false, workflowExported: false, completed: false, lastNeedsAttention: false,
  revision: 0, clientUpdatedAt: '',
}

export function lesson02CanComplete(progress: Lesson02Progress) {
  return progress.workflowCreated && progress.samplePayloadRun && progress.normalizerBuilt && progress.dynamicTestPassed && progress.breakRepairCompleted && progress.workflowExported
}
