import { describe, expect, it } from 'vitest'
import { completeTeachingNode, highTeachingRequest, normalTeachingRequest, simulateLesson01, teachingBuildComplete } from './lesson01-simulator'

describe('Lesson 01 teaching workflow twin',()=>{
  it('routes High to Escalated and Normal to Standard',()=>{
    expect(simulateLesson01(highTeachingRequest)).toMatchObject({route:'escalated',branch:true,status:'ready'})
    expect(simulateLesson01(normalTeachingRequest)).toMatchObject({route:'standard',branch:false,status:'ready'})
  })
  it('shows the deliberate field mismatch and the canonical repair',()=>{
    expect(simulateLesson01(highTeachingRequest,'priorityLevel')).toMatchObject({route:'standard',branch:false,inspectedValue:undefined})
    expect(simulateLesson01(highTeachingRequest,'priority')).toMatchObject({route:'escalated',branch:true})
  })
  it('only completes teaching nodes in connected order',()=>{
    let state=completeTeachingNode([],'create-request')
    expect(state).toEqual([])
    state=completeTeachingNode(state,'manual-trigger')
    state=completeTeachingNode(state,'create-request')
    state=completeTeachingNode(state,'check-priority')
    state=completeTeachingNode(state,'escalated')
    state=completeTeachingNode(state,'standard')
    expect(teachingBuildComplete(state)).toBe(true)
  })
})
