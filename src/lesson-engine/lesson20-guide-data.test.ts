import { describe, expect, it } from 'vitest'
import { lesson20GuideModules, lesson20GuideSteps } from './lesson20-guide-data'

describe('Lesson 20 Operator Guide curriculum', () => {
  it('contains the exact eight-module, 32-step journey', () => {
    expect(lesson20GuideModules).toHaveLength(8)
    expect(lesson20GuideSteps).toHaveLength(32)
    expect(lesson20GuideModules.map((module) => module.title)).toEqual([
      'The System You Are About to Operate',
      'Follow One Request End to End',
      'AI Is an Adviser, Not the Authority',
      'Embeddings, pgvector and RAG',
      'Bounded Capabilities, Rules and Risk',
      'Human Approval and Safe Action',
      'Failure, Audit, Monitoring and Verification',
      'Operator Readiness Mission',
    ])
  })

  it('uses stable unique activity IDs and meaningful decision labs', () => {
    const ids = lesson20GuideSteps.map((step) => step.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.every((id) => id.startsWith('l20g-'))).toBe(true)
    expect(lesson20GuideSteps.filter((step) => step.interaction)).toHaveLength(29)
  })

  it('gives every decision lab one unambiguous correct answer with feedback', () => {
    lesson20GuideSteps.forEach((step) => {
      if (!step.interaction) return
      expect(step.interaction.options.filter((option) => option.correct)).toHaveLength(1)
      expect(step.interaction.options.every((option) => option.feedback.length > 25)).toBe(true)
    })
  })
})
