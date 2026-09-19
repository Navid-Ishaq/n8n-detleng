import type { LessonStatus } from '../components/Dashboard'

export type StageState = 'not_started' | 'in_progress' | 'passed' | 'needs_attention'
export type ValidationCheck = { id: string; label: string; passed: boolean; detail?: string }
export type WorkflowValidation = { passed: boolean; checks: ValidationCheck[] }

export type Lesson01Progress = {
  currentStage: string
  viewedStage: string
  stageStates: Record<string, StageState>
  understandCompleted: boolean
  buildCompleted: boolean
  testCompleted: boolean
  structurePassed: boolean
  highOutputPassed: boolean
  normalOutputPassed: boolean
  breakAttempted: boolean
  diagnosisPassed: boolean
  repairedOutputPassed: boolean
  quizPassed: boolean
  documentCompleted: boolean
  completed: boolean
  reflectionBuilt: string
  reflectionFixed: string
  lastNeedsAttention: boolean
  revision: number
  clientUpdatedAt: string
}

export type PersistedLessonProgress = {
  status: LessonStatus
  started_at: string | null
  completed_at: string | null
  progress_data: Lesson01Progress
}
