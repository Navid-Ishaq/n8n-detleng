import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from './App'

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
})
