import type { Lesson02Progress } from './lesson02-types'

export const lesson02Stages = [
  { id: 'read-shape', label: 'Read the Shape' },
  { id: 'capture-payload', label: 'Capture Payload' },
  { id: 'nested-fields', label: 'Nested Fields' },
  { id: 'arrays', label: 'Arrays' },
  { id: 'normalizer', label: 'Build Normalizer' },
  { id: 'publish-connect', label: 'Publish & Connect' },
  { id: 'live-challenge', label: 'Live Challenge' },
  { id: 'complete', label: 'Complete' },
] as const

export const lesson02InitialProgress: Lesson02Progress = {
  currentStage: 'read-shape', viewedStage: 'read-shape', stageStates: { 'read-shape': 'in_progress' },
  jsonAnatomyCompleted: false, testEventPassed: false, nestedFieldsCompleted: false, arraysCompleted: false,
  normalizerCompleted: false, productionConnected: false, normalCasePassed: false, variableItemsPassed: false,
  missingCountryPassed: false, schemaDriftObserved: false, repairPassed: false, completed: false,
  lastNeedsAttention: false, revision: 0, clientUpdatedAt: '',
}

export function lesson02CanComplete(progress: Lesson02Progress) {
  return progress.jsonAnatomyCompleted && progress.testEventPassed && progress.nestedFieldsCompleted && progress.arraysCompleted &&
    progress.normalizerCompleted && progress.productionConnected && progress.normalCasePassed && progress.variableItemsPassed &&
    progress.missingCountryPassed && progress.schemaDriftObserved && progress.repairPassed
}
