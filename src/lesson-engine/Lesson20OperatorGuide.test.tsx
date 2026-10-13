import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Lesson20OperatorGuide } from './Lesson20OperatorGuide'
import { lesson20GuideSteps } from './lesson20-guide-data'

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'learner-20', email: 'learner@example.com' }, logout: vi.fn() }),
}))

describe('Lesson 20 Operator Guide experience', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal('scrollTo', vi.fn())
  })

  it('presents the complete flagship outline before the learning journey', () => {
    render(<Lesson20OperatorGuide />)
    expect(screen.getByRole('heading', { name: /Lesson 20\s*Operator Guide/i })).toBeInTheDocument()
    expect(screen.getByText('The System You Are About to Operate')).toBeInTheDocument()
    expect(screen.getByText('Operator Readiness Mission')).toBeInTheDocument()
    expect(screen.getByText(/No live action is executed here/i)).toBeInTheDocument()
  })

  it('starts the continuous journey and explains incorrect reasoning', () => {
    render(<Lesson20OperatorGuide />)
    fireEvent.click(screen.getByRole('button', { name: /Start the interactive learning journey/i }))
    expect(screen.getByRole('heading', { name: /A production-style system is a chain of responsibility/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }))
    expect(screen.getByRole('heading', { name: /Interface, identity and protected backend/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /learner’s browser alone/i }))
    expect(screen.getByText(/Not yet—inspect the control boundary/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Complete the decision above/i })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: /^The protected backend$/i }))
    expect(screen.getByText(/That reasoning is sound/i)).toBeInTheDocument()
  })

  it('keeps guide progress separate in user-specific browser storage', () => {
    render(<Lesson20OperatorGuide />)
    fireEvent.click(screen.getByRole('button', { name: /Start the interactive learning journey/i }))
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }))
    const saved = JSON.parse(localStorage.getItem('detleng:l20-operator-guide:learner-20') ?? '{}') as { completed?: string[] }
    expect(saved.completed).toContain('l20g-system-01')
    expect(localStorage.getItem('detleng:n8n-readiness')).toBeNull()
  })

  it('records the final mission and reaches true 100% readiness', () => {
    localStorage.setItem('detleng:l20-operator-guide:learner-20', JSON.stringify({
      step: lesson20GuideSteps.length - 1,
      completed: lesson20GuideSteps.slice(0, -1).map((step) => step.id),
    }))
    render(<Lesson20OperatorGuide />)
    fireEvent.click(screen.getByRole('button', { name: /Resume the interactive journey/i }))
    fireEvent.click(screen.getByRole('button', { name: /Authenticated rejection, zero actions/i }))
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /You understand the system/i })).toBeInTheDocument()
    const saved = JSON.parse(localStorage.getItem('detleng:l20-operator-guide:learner-20') ?? '{}') as { completed?: string[] }
    expect(saved.completed).toHaveLength(lesson20GuideSteps.length)
  })
})
