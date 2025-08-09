import { describe, it, expect, vi } from 'vitest'
import { GET } from './route'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: (table: string) => {
      if (table === 'seating_layouts') {
        return {
          select: () => ({
            eq: (_: string, __: string) => ({ single: async () => ({ data: { id: 'layout-1', name: 'Main', organizationId: 'org-1', venueId: 'venue-1' }, error: null }) }),
          }),
        }
      }
      if (table === 'seats') {
        return {
          select: () => ({
            eq: () => ({
              order: () => ({ order: async () => ({ data: [ { id: 'seat-1', row: 'A', number: 1, section: 'Stalls', seatingLayoutId: 'layout-1' } ], error: null }) }),
            }),
          }),
        }
      }
      throw new Error(`Unexpected table ${table}`)
    },
  },
}))

const makeRequest = (url: string) => new Request(url)

describe('GET /api/seats-for-layout/[layoutId]', () => {
  it('returns layout and seats', async () => {
    const res = await GET(makeRequest('http://localhost/api/seats-for-layout/layout-1') as any, { params: Promise.resolve({ layoutId: 'layout-1' }) })
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.layout.id).toBe('layout-1')
    expect(json.data.seats[0].id).toBe('seat-1')
  })
})


