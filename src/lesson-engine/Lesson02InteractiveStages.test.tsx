import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ReadShapeStage } from './Lesson02InteractiveStages'

describe('Lesson 02 interactive JSON explorer', () => {
  it('updates the inspected path when a JSON leaf is selected', () => {
    render(<ReadShapeStage onContinue={vi.fn()}/>)
    fireEvent.click(screen.getByRole('button', { name: /pricenumber50/i }))
    expect(screen.getByText('order.items[0].price')).toBeInTheDocument()
    expect(screen.getAllByText('50').length).toBeGreaterThan(0)
  })

  it('visually distinguishes null from a missing key', () => {
    render(<ReadShapeStage onContinue={vi.fn()}/>)
    fireEvent.click(screen.getByRole('button', { name: /country: null/i }))
    expect(screen.getByText(/key exists, but carries no value/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /country key missing/i }))
    expect(screen.getByText(/key does not exist/i)).toBeInTheDocument()
  })
})
