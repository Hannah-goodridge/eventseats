import { render, screen } from '@testing-library/react'
import React from 'react'
import BookingRoute from './page'
import { vi } from 'vitest'

// Mock next/navigation useParams
vi.mock('next/navigation', async () => {
  const actual: any = await vi.importActual('next/navigation')
  return {
    ...actual,
    useParams: () => ({ showId: 'show-1', performanceId: 'perf-1' }),
  }
})

describe('Booking page route', () => {
  it('loads show and performance and renders booking UI', async () => {
    render(React.createElement(BookingRoute))

    // Assert final UI appears
    expect(await screen.findByText('Hamlet')).toBeInTheDocument()
    expect(await screen.findByText(/Book Tickets/i)).toBeInTheDocument()
  })
})


