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
    expect(screen.getAllByText('Built by Muhammad Naveed Ishaque').length).toBeGreaterThan(0)
    expect(screen.getByText(/Independent learning project/)).toBeInTheDocument()
  })

  it('preserves the chosen lesson in the login destination', () => {
    render(<App />)
    const lessonLink = screen.getByRole('link', { name: /Webhooks/ })
    expect(lessonLink).toHaveAttribute('href', '/login?returnTo=%2Flessons%2Fwebhooks')
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
})
