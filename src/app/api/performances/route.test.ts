import { describe, it, expect, vi } from 'vitest'
import { GET } from './route'

const makeQuery = (data: any) => ({
  eq() { return this },
  gte() { return this },
  order() { return this },
  data,
  error: null,
})

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: (_: string) => ({
      select: (_sel: string) => makeQuery([
        {
          id: 'perf-1',
          showId: 'show-1',
          dateTime: new Date().toISOString(),
          isMatinee: false,
          notes: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          shows: { id: 'show-1', title: 'Hamlet', status: 'PUBLISHED' },
        },
      ]),
    }),
  },
}))

const makeRequest = (url: string) => new Request(url)

describe('GET /api/performances', () => {
  it('returns performances joined with show', async () => {
    const res = await GET(makeRequest('http://localhost/api/performances?showId=show-1&upcoming=true'))
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data[0].shows.title).toBe('Hamlet')
  })
})


