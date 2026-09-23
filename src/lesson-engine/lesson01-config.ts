import type { Lesson01Progress } from './types'

export const lesson01Stages = [
  { id: 'understand', label: 'Understand' }, { id: 'build-manually', label: 'Build Manually' },
  { id: 'run-yourself', label: 'Run It Yourself' }, { id: 'upgrade-webhook', label: 'Upgrade to Webhook' },
  { id: 'test-event', label: 'First Live Event' }, { id: 'publish-connect', label: 'Publish & Connect' },
  { id: 'live-break-fix', label: 'Live Tests + Break/Fix' }, { id: 'complete', label: 'Complete' },
] as const

export const lesson01InitialProgress: Lesson01Progress = {
  currentStage: 'understand', viewedStage: 'understand', stageStates: { understand: 'in_progress' },
  understandCompleted: false, manualBuildCompleted: false, manualRunsCompleted: false, webhookUpgradeCompleted: false,
  testEventPassed: false, productionConnected: false, highLivePassed: false, normalLivePassed: false,
  breakObserved: false, repairPassed: false, completed: false, lastNeedsAttention: false, revision: 0, clientUpdatedAt: '',
}

export function lesson01CanComplete(progress: Lesson01Progress) {
  return progress.understandCompleted && progress.manualBuildCompleted && progress.manualRunsCompleted && progress.webhookUpgradeCompleted && progress.testEventPassed && progress.productionConnected && progress.highLivePassed && progress.normalLivePassed && progress.breakObserved && progress.repairPassed
}
