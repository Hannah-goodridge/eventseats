import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from './route'

// Mock supabase client with a fluent builder
const makeQuery = (data: any) => ({
  eq() { return this },
  or() { return this },
  order() { return this },
  data,
  error: null,
})

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: (_: string) => ({
      select: (_sel: string) => makeQuery([
        {
          id: 'show-1',
          title: 'Hamlet',
          slug: 'hamlet',
          description: '',
          imageUrl: '',
          genre: 'Drama',
          duration: 120,
          ageRating: 'PG',
          adultPrice: 20,
          childPrice: 10,
          concessionPrice: 15,
          status: 'PUBLISHED',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          performances: [
            { id: 'perf-1', dateTime: new Date().toISOString(), isMatinee: false, notes: '', createdAt: '', updatedAt: '' },
          ],
        },
      ]),
    }),
  },
}))

const makeRequest = (url: string) => new Request(url)

describe('GET /api/shows', () => {
  it('returns shows with performances and meta', async () => {
    const res = await GET(makeRequest('http://localhost/api/shows'))
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(Array.isArray(json.data)).toBe(true)
    expect(json.data[0].title).toBe('Hamlet')
    expect(json.data[0].performances?.length).toBe(1)
  })
})


