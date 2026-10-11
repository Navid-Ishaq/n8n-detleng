import type { Lesson02Progress } from './lesson02-types'

export const lesson02Stages = [
  { id: 'read-shape', label: 'Read Shape' },
  { id: 'capture-payload', label: 'Capture' },
  { id: 'nested-fields', label: 'Paths' },
  { id: 'arrays', label: 'Arrays' },
  { id: 'build-normalizer', label: 'Transform' },
  { id: 'publish-connect', label: 'Publish' },
  { id: 'live-challenge', label: 'Prove & Repair' },
  { id: 'complete', label: 'Complete' },
] as const

export const lesson02InitialProgress: Lesson02Progress = {
  currentStage: 'read-shape', viewedStage: 'read-shape', stageStates: { 'read-shape': 'in_progress' },
  shapeRead: false, payloadCaptured: false, nestedFieldsBuilt: false, arraysExplored: false,
  normalizerBuilt: false, publishUnderstood: false, liveChallengePracticed: false,
  productionConnected: false, normalLivePassed: false, variableLivePassed: false,
  missingCountryLivePassed: false, breakObserved: false, repairPassed: false,
  completed: false, lastNeedsAttention: false,
  revision: 0, clientUpdatedAt: '',
}

export function lesson02CanComplete(progress: Lesson02Progress) {
  return progress.shapeRead && progress.payloadCaptured && progress.nestedFieldsBuilt && progress.arraysExplored && progress.normalizerBuilt && progress.publishUnderstood && progress.liveChallengePracticed
}
