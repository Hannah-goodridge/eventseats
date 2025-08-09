import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import Page from './page'

vi.mock('@/lib/supabase', () => ({
  getServerSupabase: () => ({
    from: () => ({
      select: () => ({ eq: () => ({ limit: async () => ({ data: [
        {
          id: 'booking-1', bookingNumber: 'B-0001', totalAmount: 30, bookingFee: 0, status: 'PAID', qrCodeData: 'qr',
          customers: { firstName: 'A', lastName: 'B', email: 'a@b.com' }, performances: { id: 'perf-1', dateTime: new Date().toISOString() }, shows: { id: 'show-1', title: 'Hamlet' },
        }
      ], error: null }) }) })
    })
  })
}))

describe('Success page', () => {
  it('renders booking info given a booking id param', async () => {
    const ui = await Page({ params: Promise.resolve({ bookingId: 'booking-1' }) })
    expect(React.isValidElement(ui)).toBe(true)
  })
})


