import type { LessonStatus } from '../components/Dashboard'
import type { Lesson02Progress } from './lesson02-types'

export function computeLesson02Status(progress: Lesson02Progress): LessonStatus {
  if (progress.completed) return 'Completed'
  if (progress.lastNeedsAttention) return 'Needs Review'
  if (!progress.jsonAnatomyCompleted || progress.currentStage === 'nested-fields') return 'Learning'
  return 'Practicing'
}
