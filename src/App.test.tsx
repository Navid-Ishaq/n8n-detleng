import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { App } from './App'
import { safeReturnTo } from './lib/routing'
import { friendlyAuthError } from './lib/auth-errors'

vi.mock('./context/AuthContext', () => ({
  useAuth: () => ({ loading: false, user: null, session: null, logout: vi.fn() }),
}))

describe('public learning experience', () => {
  it('shows the complete curriculum and project identity', () => {
    render(<App />)

    expect(screen.getAllByText(/n8n core/i).length).toBeGreaterThan(0)
    expect(screen.getByText('Monitoring, Security & Human Approval')).toBeInTheDocument()
    expect(screen.getByText(/3 live lessons ready/i)).toBeInTheDocument()
    expect(screen.getAllByText(/FLAGSHIP LIVE/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Built by Muhammad Naveed Ishaque').length).toBeGreaterThan(0)
    expect(screen.getByText(/Independent learning project/)).toBeInTheDocument()
  })

  it('preserves the chosen lesson in the login destination', () => {
    render(<App />)
    const lessonLink = screen.getByRole('link', { name: /Webhooks/ })
    expect(lessonLink).toHaveAttribute('href', '/login?returnTo=%2Flessons%2Fwebhooks')
  })

  it('promotes the protected Lesson 20 Operator Guide', () => {
    render(<App />)
    const guideLinks = screen.getAllByRole('link', { name: /Lesson 20 Operator Guide/i })
    expect(guideLinks.length).toBeGreaterThan(0)
    expect(guideLinks[0]).toHaveAttribute('href', '/login?returnTo=%2Flesson-20-operator-guide')
    expect(screen.getByText(/32 guided learning steps/i)).toBeInTheDocument()
  })

  it('preserves a safe return route and rejects external redirects', () => {
    expect(safeReturnTo('?returnTo=%2Flessons%2Fn8n-core')).toBe('/lessons/n8n-core')
    expect(safeReturnTo('?returnTo=https%3A%2F%2Fevil.example')).toBe('/dashboard')
    expect(safeReturnTo('?returnTo=%2F%2Fevil.example')).toBe('/dashboard')
  })

  it('maps common Supabase failures to learner-friendly messages', () => {
    expect(friendlyAuthError('Invalid login credentials')).toMatch(/email or password is incorrect/i)
    expect(friendlyAuthError('User already registered')).toMatch(/account already exists/i)
    expect(friendlyAuthError('Password should be at least 8 characters')).toMatch(/stronger password/i)
  })

  it('protects a direct Lesson 01 route for unauthenticated learners', () => {
    window.history.pushState({}, '', '/lessons/n8n-core')
    render(<App />)
    expect(screen.getByText(/Taking you to login/i)).toBeInTheDocument()
    window.history.pushState({}, '', '/')
  })

  it('protects a direct Lesson 02 route for unauthenticated learners', () => {
    window.history.pushState({}, '', '/lessons/json')
    render(<App />)
    expect(screen.getByText(/Taking you to login/i)).toBeInTheDocument()
    window.history.pushState({}, '', '/')
  })

  it('protects the optional Lesson 02 visual guide', () => {
    window.history.pushState({}, '', '/lessons/json-visual-guide')
    render(<App />)
    expect(screen.getByText(/Taking you to login/i)).toBeInTheDocument()
    window.history.pushState({}, '', '/')
  })

  it('protects the direct Lesson 20 flagship route', () => {
    window.history.pushState({}, '', '/lessons/monitoring-security-approval')
    render(<App />)
    expect(screen.getByText(/Taking you to login/i)).toBeInTheDocument()
    window.history.pushState({}, '', '/')
  })

  it('protects the direct Lesson 20 Operator Guide route', () => {
    window.history.pushState({}, '', '/lesson-20-operator-guide')
    render(<App />)
    expect(screen.getByText(/Taking you to login/i)).toBeInTheDocument()
    window.history.pushState({}, '', '/')
  })
})
