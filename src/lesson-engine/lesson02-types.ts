import type { StageState } from './types'

export type Lesson02Progress = {
  currentStage: string
  viewedStage: string
  stageStates: Record<string, StageState>
  jsonAnatomyCompleted: boolean
  testEventPassed: boolean
  nestedFieldsCompleted: boolean
  arraysCompleted: boolean
  normalizerCompleted: boolean
  productionConnected: boolean
  normalCasePassed: boolean
  variableItemsPassed: boolean
  missingCountryPassed: boolean
  schemaDriftObserved: boolean
  repairPassed: boolean
  completed: boolean
  lastNeedsAttention: boolean
  revision: number
  clientUpdatedAt: string
}
