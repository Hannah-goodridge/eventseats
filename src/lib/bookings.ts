import { getServerSupabase } from './supabase'

export type TicketType = 'ADULT' | 'CHILD' | 'CONCESSION'

export function calculateTotalMinor(
  prices: { adult: number; child: number; concession: number },
  seats: Array<{ ticketType: TicketType }>
): number {
  const priceFor = (t: TicketType) => {
    switch (t) {
      case 'ADULT': return Math.round(prices.adult * 100)
      case 'CHILD': return Math.round(prices.child * 100)
      case 'CONCESSION': return Math.round(prices.concession * 100)
      default: return 0
    }
  }
  return seats.reduce((sum, s) => sum + priceFor(s.ticketType), 0)
}

export async function ensureCustomer(email: string, firstName?: string, lastName?: string, phone?: string) {
  const supabase = getServerSupabase()
  const { data: existing } = await supabase.from('customers').select('id').eq('email', email).single()
  if (existing?.id) return existing.id
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('customers')
    .insert({
      email,
      firstName: firstName || 'Customer',
      lastName: lastName || '',
      phone: phone || null,
      country: 'GB',
      createdAt: now,
      updatedAt: now,
    })
    .select('id')
    .single()
  if (error) throw error
  return data.id as string
}


