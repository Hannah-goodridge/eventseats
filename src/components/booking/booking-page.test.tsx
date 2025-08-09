import { render, screen, fireEvent, within, waitFor } from '@testing-library/react'
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BookingPage } from './booking-page'
import type { Show, Performance, SeatingLayout, SeatSelection, BookingFormData } from '../../types'

// Mock SeatGrid so we can drive selections deterministically
vi.mock('../seat/seat-grid', () => ({
  SeatGrid: (props: any) => {
    const { onSeatSelect, onTicketTypeChange } = props
    return (
      <div>
        <button onClick={() => onSeatSelect({ id: 'seat-1', row: 'A', number: 1 }, 'ADULT')}>Select A1 Adult</button>
        <button onClick={() => onSeatSelect({ id: 'seat-2', row: 'A', number: 2 }, 'CHILD')}>Select A2 Child</button>
        <button onClick={() => onTicketTypeChange('seat-2', 'CONCESSION')}>Change A2 to Concession</button>
      </div>
    )
  },
}))

const show: Show = {
  id: 'show-1',
  title: 'Hamlet',
  slug: 'hamlet',
  description: '',
  imageUrl: '',
  genre: 'Drama',
  duration: 120,
  ageRating: 'PG',
  warnings: undefined,
  adultPrice: 20,
  childPrice: 10,
  concessionPrice: 15,
  status: 'PUBLISHED' as any,
  organizationId: 'org-1',
  venueId: 'venue-1',
  seatingLayoutId: 'layout-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  performances: [],
}

const performance: Performance = {
  id: 'perf-1',
  dateTime: new Date(),
  isMatinee: false,
  showId: 'show-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  bookings: [],
}

const seatingLayout: SeatingLayout = {
  id: 'layout-1',
  name: 'Main',
  description: '',
  rows: 10,
  columns: 10,
  layoutData: {},
  venueId: 'venue-1',
  organizationId: 'org-1',
  seatingLayoutId: 'layout-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  seats: [],
}

describe('BookingPage totals and payment flows', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('computes totals across ticket types and updates when ticket type changes', async () => {
    const onCompleteBooking = vi.fn()
    render(
      <BookingPage
        show={show}
        performance={performance}
        seatingLayout={seatingLayout}
        bookedSeats={[]}
        onCompleteBooking={onCompleteBooking}
      />
    )

    // Use mocked SeatGrid buttons to select seats and change ticket type
    fireEvent.click(screen.getByText('Select A1 Adult')) // +20
    fireEvent.click(screen.getByText('Select A2 Child')) // +10 => total 30

    // Proceed button should appear
    fireEvent.click(screen.getByText('Continue to Customer Information'))

    // Total in summary and button label reflects 30.00
    expect(await screen.findByText('Total:')).toBeInTheDocument()
    expect(screen.getByText('£30.00')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Complete Booking - £30.00/i })).toBeInTheDocument()

    // Change A2 to concession (+15 instead of +10) => total 35.00
    // Go back to seat selection to trigger change, then return
    // Simulate change via mocked control
    // First go back
    fireEvent.click(screen.getByText('← Back to Seat Selection'))
    fireEvent.click(screen.getByText('Change A2 to Concession'))
    fireEvent.click(screen.getByText('Continue to Customer Information'))

    expect(screen.getByRole('button', { name: /Complete Booking - £35.00/i })).toBeInTheDocument()
  })

  it('submits successfully and shows confirmation with correct total', async () => {
    const onCompleteBooking = vi.fn().mockResolvedValue({
      bookingNumber: 'B-0001',
      bookingId: 'booking-1',
      qrCodeData: 'qr',
      createdAt: new Date().toISOString(),
    })

    render(
      <BookingPage
        show={show}
        performance={performance}
        seatingLayout={seatingLayout}
        bookedSeats={[]}
        onCompleteBooking={onCompleteBooking}
      />
    )

    fireEvent.click(screen.getByText('Select A1 Adult')) // +20
    fireEvent.click(screen.getByText('Select A2 Child')) // +10 => total 30
    fireEvent.click(screen.getByText('Continue to Customer Information'))

    // Fill form via placeholders (labels are not programmatically associated)
    fireEvent.change(screen.getByPlaceholderText('Enter your first name'), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your last name'), { target: { value: 'Doe' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), { target: { value: 'jane@example.com' } })

    fireEvent.click(screen.getByRole('button', { name: /Complete Booking - £30.00/i }))

    // Confirmation screen
    expect(await screen.findByText(/Booking Confirmed!/i)).toBeInTheDocument()
    expect(screen.getByText('£30.00')).toBeInTheDocument()
    expect(screen.getAllByText(/B-0001/).length).toBeGreaterThan(0)
  })

  it('handles payment error and prevents confirmation, alerting the user', async () => {
    const onCompleteBooking = vi.fn().mockRejectedValue(new Error('Payment failed'))
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(
      <BookingPage
        show={show}
        performance={performance}
        seatingLayout={seatingLayout}
        bookedSeats={[]}
        onCompleteBooking={onCompleteBooking}
      />
    )

    fireEvent.click(screen.getByText('Select A1 Adult')) // +20
    fireEvent.click(screen.getByText('Continue to Customer Information'))

    // Fill form via placeholders
    fireEvent.change(screen.getByPlaceholderText('Enter your first name'), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your last name'), { target: { value: 'Doe' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), { target: { value: 'jane@example.com' } })

    fireEvent.click(screen.getByRole('button', { name: /Complete Booking - £20.00/i }))

    // Alert called and confirmation not shown
    await waitFor(() => expect(alertSpy).toHaveBeenCalled())
    expect(screen.queryByText(/Booking Confirmed!/i)).not.toBeInTheDocument()
  })
})


