import type { StageState } from './types'

export type Lesson02Progress = {
  currentStage: string
  viewedStage: string
  stageStates: Record<string, StageState>
  shapeRead: boolean
  payloadCaptured: boolean
  nestedFieldsBuilt: boolean
  arraysExplored: boolean
  normalizerBuilt: boolean
  publishUnderstood: boolean
  liveChallengePracticed: boolean
  productionConnected: boolean
  normalLivePassed: boolean
  variableLivePassed: boolean
  missingCountryLivePassed: boolean
  breakObserved: boolean
  repairPassed: boolean
  completed: boolean
  lastNeedsAttention: boolean
  revision: number
  clientUpdatedAt: string
}
