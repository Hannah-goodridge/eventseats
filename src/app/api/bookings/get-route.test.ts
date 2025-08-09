import { describe, it, expect, vi } from 'vitest'
import { GET } from './route'

// Build a light supabase mock that can apply simple filters and order
vi.mock('@/lib/supabase', () => {
  const dataset = [
    { id: 'b1', customerId: 'c1', performanceId: 'p1', status: 'PAID', createdAt: '2024-01-02T00:00:00Z', customers: { id: 'c1', firstName: 'A', lastName: 'A', email: 'a@example.com', phone: '1' }, performances: { id: 'p1', dateTime: '2024-02-01', isMatinee: false, shows: { id: 's1', title: 'Hamlet', venue: { name: 'Main', address: '1 Road' } } }, booking_items: [] },
    { id: 'b2', customerId: 'c2', performanceId: 'p2', status: 'PENDING', createdAt: '2024-01-03T00:00:00Z', customers: { id: 'c2', firstName: 'B', lastName: 'B', email: 'b@example.com', phone: '2' }, performances: { id: 'p2', dateTime: '2024-02-02', isMatinee: true, shows: { id: 's1', title: 'Hamlet', venue: { name: 'Main', address: '1 Road' } } }, booking_items: [] },
  ]

  function createQuery() {
    let items = [...dataset]
    const query: any = {
      eq(field: string, value: string) {
        items = items.filter((it: any) => it[field] === value)
        return query
      },
      order(_field: string, _opts: { ascending: boolean }) {
        return query
      },
      then(resolve: any) {
        // Allow `await query` to work by being thenable
        resolve({ data: items, error: null })
      },
    }
    return query
  }

  return {
    superset: dataset,
    supabase: {
      from: (table: string) => {
        if (table !== 'bookings') throw new Error('Unexpected table')
        return {
          select: () => createQuery(),
        }
      },
    },
  }
})

const makeRequest = (url: string) => new Request(url)

describe('GET /api/bookings', () => {
  it('returns all bookings when no filters', async () => {
    const res = await GET(makeRequest('http://localhost/api/bookings'))
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.length).toBe(2)
  })

  it('filters by status', async () => {
    const res = await GET(makeRequest('http://localhost/api/bookings?status=PAID'))
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.length).toBe(1)
    expect(json.data[0].status).toBe('PAID')
  })

  it('filters by performanceId', async () => {
    const res = await GET(makeRequest('http://localhost/api/bookings?performanceId=p2'))
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.length).toBe(1)
    expect(json.data[0].performanceId).toBe('p2')
  })
})


