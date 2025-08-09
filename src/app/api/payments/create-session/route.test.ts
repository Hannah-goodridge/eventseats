import { describe, it, expect, vi, beforeEach } from 'vitest'

// Capture args passed to Stripe checkout.sessions.create
let lastCreateArgs: any = null

vi.mock('stripe', () => {
  return {
    default: class StripeMock {
      checkout = {
        sessions: {
          create: vi.fn(async (args: any) => {
            lastCreateArgs = args
            return { url: 'https://stripe.test/session' }
          }),
        },
      }
      webhooks = { constructEvent: vi.fn() }
      constructor(_key: string) {}
    },
  }
})

// Simple Supabase mock for performances, bookings and booking_items
vi.mock('@/lib/supabase', () => {
  const state: any = {
    show: { id: 'show-1', adultPrice: 20, childPrice: 10, concessionPrice: 15, title: 'Hamlet' },
    performance: { id: 'perf-1', dateTime: new Date().toISOString(), showId: 'show-1' },
  }

  function performancesBuilder() {
    return {
      select: () => ({ eq: (_: string, __: string) => ({ single: async () => ({
        data: { ...state.performance, shows: state.show }, error: null,
      }) }) }),
    }
  }
  function bookingsBuilder() {
    return {
      insert: (_payload: any) => ({ select: () => ({ single: async () => ({ data: { id: 'booking-1' }, error: null }) }) }),
      delete: () => ({ eq: async () => ({}) }),
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
    supabase: {
      from: (table: string) => {
        switch (table) {
          case 'performances': return performancesBuilder()
          case 'bookings': return bookingsBuilder()
          case 'booking_items': return bookingItemsBuilder()
          case 'customers': return customersBuilder()
          default: throw new Error(`Unexpected table ${table}`)
        }
      },
    },
  }
})

describe('POST /api/payments/create-session', () => {
  beforeEach(() => { lastCreateArgs = null; vi.resetModules() })

  it('pre-creates a pending booking and returns checkout URL with bookingId in cancel_url and metadata', async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_123'
    const { POST } = await import('./route')

    const req = new Request('http://localhost/api/payments/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        performanceId: 'perf-1',
        customer: { email: 'a@b.com', firstName: 'A', lastName: 'B' },
        seats: [
          { seatId: 'seat-1', ticketType: 'ADULT' },
          { seatId: 'seat-2', ticketType: 'CHILD' },
        ],
      }),
    })

    const res = await POST(req as any)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.url).toContain('https://stripe.test/session')

    expect(lastCreateArgs).toBeTruthy()
    expect(lastCreateArgs?.cancel_url).toContain('bookingId=')
    expect(lastCreateArgs?.metadata?.bookingId).toBeTruthy()
  })
})


