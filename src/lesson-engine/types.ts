import type { LessonStatus } from '../components/Dashboard'

export type StageState = 'not_started' | 'in_progress' | 'passed' | 'needs_attention'
export type LiveResult = { id: string; label: string; passed: boolean; reached?: boolean; message: string; expected?: Record<string, unknown>; actual?: Record<string, unknown> | null }

export type Lesson01Progress = {
  currentStage: string; viewedStage: string; stageStates: Record<string, StageState>
  understandCompleted: boolean; manualBuildCompleted: boolean; manualRunsCompleted: boolean; webhookUpgradeCompleted: boolean
  testEventPassed: boolean; productionConnected: boolean; highLivePassed: boolean; normalLivePassed: boolean
  breakObserved: boolean; repairPassed: boolean; completed: boolean; lastNeedsAttention: boolean
  revision: number; clientUpdatedAt: string
}

export type PersistedLessonProgress = { status: LessonStatus; started_at: string | null; completed_at: string | null; progress_data: Lesson01Progress }
