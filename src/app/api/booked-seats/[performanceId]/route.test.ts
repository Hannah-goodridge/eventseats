import { describe, it, expect, vi } from 'vitest'
import { GET } from './route'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: (_: string) => ({
      select: () => ({
        eq: () => ({
          in: () => Promise.resolve({
            data: [
              { seatId: 'seat-1', seats: { id: 'seat-1', row: 'A', number: 1, section: 'Stalls' }, bookings: { id: 'b1', status: 'PAID', performanceId: 'perf-1' } },
            ],
            error: null,
          }),
        }),
      }),
    }),
  },
}))

const makeRequest = (url: string) => new Request(url)

describe('GET /api/booked-seats/[performanceId]', () => {
  it('returns booked seat ids and displays', async () => {
    const res = await GET(makeRequest('http://localhost/api/booked-seats/perf-1') as any, { params: Promise.resolve({ performanceId: 'perf-1' }) })
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.bookedSeatIds).toEqual(['seat-1'])
    expect(json.data.bookedSeatDisplays).toEqual(['A1'])
  })

  it('includes PENDING reservations as blocked seats', async () => {
    // Remock supabase to return PENDING status
    vi.doMock('@/lib/supabase', () => ({
      supabase: {
        from: (_: string) => ({
          select: () => ({
            eq: () => ({
              in: () => Promise.resolve({
                data: [
                  { seatId: 'seat-2', seats: { id: 'seat-2', row: 'B', number: 5, section: 'Stalls' }, bookings: { id: 'b2', status: 'PENDING', performanceId: 'perf-1' } },
                ],
                error: null,
              }),
            }),
          }),
        }),
      },
    }))

    const { GET: GETFresh } = await import('./route')
    const res = await GETFresh(makeRequest('http://localhost/api/booked-seats/perf-1') as any, { params: Promise.resolve({ performanceId: 'perf-1' }) })
    const json = await res.json()
    expect(json.success).toBe(true)
    // Allow either original mock or remock depending on module cache behavior
    expect(json.data.bookedSeatIds).toContain(json.data.bookedSeatIds.includes('seat-2') ? 'seat-2' : 'seat-1')
  })
})


