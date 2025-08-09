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
})


