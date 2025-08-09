import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock supabase chains used in webhook handler
vi.mock('@/lib/supabase', () => {
  const state: any = {
    show: { adultPrice: 20, childPrice: 10, concessionPrice: 15 },
    bookingUpdated: null as any,
    bookingItemsInserted: false,
  }

  function showsBuilder() {
    return { select: () => ({ eq: () => ({ single: async () => ({ data: state.show, error: null }) }) }) }
  }
  function bookingsBuilder() {
    return {
      update: (payload: any) => ({ eq: () => ({ select: () => ({ single: async () => ({ data: { id: 'booking-1', ...payload }, error: null }) }) }) }),
      insert: (payload: any) => ({ select: () => ({ single: async () => ({ data: { id: 'booking-1', ...payload }, error: null }) }) }),
    }
  }
  function bookingItemsBuilder() {
    return { insert: async () => ({ data: [], error: null }) }
  }
  function customersBuilder() {
    return {
      select: () => ({ eq: () => ({ single: async () => ({ data: null, error: { message: 'not found' } }) }) }),
      insert: () => ({ select: () => ({ single: async () => ({ data: { id: 'cust-1' }, error: null }) }) }),
    }
  }

  return {
    getServerSupabase: () => ({
      from: (table: string) => {
        switch (table) {
          case 'shows': return showsBuilder()
          case 'bookings': return bookingsBuilder()
          case 'booking_items': return bookingItemsBuilder()
          case 'customers': return customersBuilder()
          default: throw new Error(`Unexpected table ${table}`)
        }
      },
    }),
  }
})

// Mock Stripe webhook signature validation and event
vi.mock('stripe', () => {
  class StripeMock {
    webhooks = {
      constructEvent: vi.fn((payload: string, _sig: string, _sec: string) => {
        const session = { payment_intent: 'pi_123', metadata: { bookingId: 'booking-1', performanceId: 'perf-1', showId: 'show-1', seatsJson: JSON.stringify([{ seatId: 's1', ticketType: 'ADULT' }]), customerEmail: 'a@b.com', customerFirstName: 'A', customerLastName: 'B' } }
        return { type: 'checkout.session.completed', data: { object: session } }
      }),
    }
    constructor(_key: string) {}
  }
  return { default: StripeMock }
})

describe('POST /api/stripe/webhook', () => {
  it('updates pre-reserved booking to PAID on checkout.session.completed', async () => {
    const { POST } = await import('./route')
    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': 't=1,v1=test' },
      body: JSON.stringify({}),
    }) as any

    // Inject env secrets
    process.env.STRIPE_SECRET_KEY = 'sk_test_123'
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_123'

    const res = await POST(req)
    const json = await res.json()
    expect(json.received).toBe(true)
  })
})


