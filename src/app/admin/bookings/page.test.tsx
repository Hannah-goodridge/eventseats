import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import AdminBookingsPage from './page'
import { vi } from 'vitest'

// Mock next-auth session as authenticated
vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { id: 'u1', email: 'admin@example.com' } }, status: 'authenticated' }),
}))

// Mock router
vi.mock('next/navigation', async () => {
  const actual: any = await vi.importActual('next/navigation')
  return {
    ...actual,
    useRouter: () => ({ push: vi.fn() }),
  }
})

describe('AdminBookingsPage', () => {
  it('fetches bookings and renders table with transformed data', async () => {
    render(React.createElement(AdminBookingsPage))

    // Table content
    expect(await screen.findByText('Bookings Management')).toBeInTheDocument()
    expect(await screen.findByText('B-0001')).toBeInTheDocument()
    expect(await screen.findByText('Hamlet')).toBeInTheDocument()

    // Seats string from booking_items
    expect(await screen.findByText(/A1, A2/)).toBeInTheDocument()

    // Amount formatting
    expect(await screen.findByText('£40.00')).toBeInTheDocument()
  })
})


