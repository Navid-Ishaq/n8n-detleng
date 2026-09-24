import type { StageState } from './types'

export type Lesson02Progress = {
  currentStage: string
  viewedStage: string
  stageStates: Record<string, StageState>
  workflowCreated: boolean
  samplePayloadRun: boolean
  normalizerBuilt: boolean
  dynamicTestPassed: boolean
  breakRepairCompleted: boolean
  workflowExported: boolean
  completed: boolean
  lastNeedsAttention: boolean
  revision: number
  clientUpdatedAt: string
}
