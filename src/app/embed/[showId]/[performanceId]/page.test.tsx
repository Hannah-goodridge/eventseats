import { render, screen } from '@testing-library/react'
import React from 'react'
import EmbedBookingRoute from './page'
import { vi } from 'vitest'

vi.mock('next/navigation', async () => {
  const actual: any = await vi.importActual('next/navigation')
  return {
    ...actual,
    useParams: () => ({ showId: 'show-1', performanceId: 'perf-1' }),
  }
})

describe('Embed booking page route', () => {
  it('loads show and performance and renders embedded booking UI', async () => {
    render(React.createElement(EmbedBookingRoute))
    expect(await screen.findByText('Hamlet')).toBeInTheDocument()
    expect(await screen.findByText(/Book Tickets/i)).toBeInTheDocument()
  })
})


