import { describe, it, expect, vi, beforeEach } from 'vitest'

// Minimal in-memory fixtures
const perf = {
  id: 'perf-1',
  dateTime: new Date().toISOString(),
  showId: 'show-1',
  shows: { id: 'show-1', title: 'Hamlet', organizationId: 'org-1' },
}

// Build a small supabase mock that satisfies the chains used by this route
const buildSupabaseMock = () => {
  const state: any = {
    performances: { 'perf-1': perf },
    customersByEmail: {},
    bookingItems: [],
  }

  function performancesBuilder() {
    return {
      select: () => ({
        eq: (_field: string, id: string) => ({
          single: async () => ({ data: state.performances[id] ?? null, error: state.performances[id] ? null : { message: 'not found' } }),
        }),
      }),
    }
  }

  function bookingItemsBuilder() {
    return {
      select: () => ({
        eq: () => ({
          in: () => ({
            in: () => Promise.resolve({ data: [], error: null }),
          }),
        }),
      }),
      insert: (items: any[]) => ({
        select: () => Promise.resolve({ data: items, error: null }),
      }),
    }
  }

  function customersBuilder() {
    return {
      select: () => ({
        eq: (_f: string, email: string) => ({
          single: async () => {
            const id = state.customersByEmail[email]
            return { data: id ? { id } : null, error: id ? null : { message: 'not found' } }
          },
        }),
      }),
      insert: (payload: any) => ({
        select: () => ({
          single: async () => {
            const id = 'cust-1'
            const email = payload.email ?? payload?.[0]?.email
            if (email) state.customersByEmail[email] = id
            return { data: { id }, error: null }
          },
        }),
      }),
    }
  }

  function bookingsBuilder() {
    return {
      insert: (payload: any) => ({
        select: () => ({
          single: async () => {
            return {
              data: {
                ...payload,
                id: 'booking-1',
                bookingNumber: 'BKTEST',
                createdAt: new Date().toISOString(),
              },
              error: null,
            }
          },
        }),
      }),
      delete: () => ({ eq: async () => ({}) }),
    }
  }

  return {
    supabase: {
      from: (table: string) => {
        switch (table) {
          case 'performances':
            return performancesBuilder()
          case 'booking_items':
            return bookingItemsBuilder()
          case 'customers':
            return customersBuilder()
          case 'bookings':
            return bookingsBuilder()
          default:
            throw new Error(`Unhandled table in mock: ${table}`)
        }
      },
    },
  }
}

describe('POST /api/bookings', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('creates booking and items successfully', async () => {
    vi.doMock('@/lib/supabase', () => buildSupabaseMock())
    const { POST: PostFn } = await import('./route')

    const req = new Request('http://localhost/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        performanceId: 'perf-1',
        customer: { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com' },
        seats: [
          { seatId: 'seat-1', ticketType: 'ADULT', price: 20 },
          { seatId: 'seat-2', ticketType: 'ADULT', price: 20 },
        ],
        totalAmount: 40,
      }),
    })

    const res = await PostFn(req)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.booking.bookingNumber).toBeTruthy()
    expect(json.data.items.length).toBe(2)
    expect(json.data.performance.show.title).toBe('Hamlet')
  })

  it('returns 400 when required fields are missing', async () => {
    // Mock as well to avoid real supabase init during import
    vi.doMock('@/lib/supabase', () => buildSupabaseMock())
    const { POST } = await import('./route')
    const req = new Request('http://localhost/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ performanceId: '', customer: { firstName: '', lastName: '', email: '' }, seats: [], totalAmount: 0 }),
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('returns 409 when seats already booked', async () => {
    const buildConflictMock = () => {
      const base = buildSupabaseMock()
      // Override booking_items select chain to return existing items
      const origFrom = (base as any).supabase.from
      ;(base as any).supabase.from = (table: string) => {
        if (table === 'booking_items') {
          return {
            select: () => ({
              eq: () => ({
                in: () => ({
                  in: () => Promise.resolve({ data: [ { seatId: 'seat-1' } ], error: null }),
                }),
              }),
            }),
            insert: (_: any[]) => ({ select: async () => ({ data: [], error: null }) }),
          }
        }
        return origFrom(table)
      }
      return base
    }

    vi.doMock('@/lib/supabase', () => buildConflictMock())
    const { POST: PostFn } = await import('./route')

    const req = new Request('http://localhost/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        performanceId: 'perf-1',
        customer: { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com' },
        seats: [ { seatId: 'seat-1', ticketType: 'ADULT', price: 20 } ],
        totalAmount: 20,
      }),
    })

    const res = await PostFn(req)
    expect(res.status).toBe(409)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.alreadyBookedSeats).toEqual(['seat-1'])
  })
})


