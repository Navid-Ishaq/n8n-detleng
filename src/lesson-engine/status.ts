import type { LessonStatus } from '../components/Dashboard'
import type { Lesson01Progress } from './types'

export function computeLesson01Status(progress: Lesson01Progress): LessonStatus {
  if (progress.completed) return 'Completed'
  if (progress.lastNeedsAttention) return 'Needs Review'
  if (!progress.understandCompleted || progress.currentStage === 'build-manually') return 'Learning'
  return 'Practicing'
}
