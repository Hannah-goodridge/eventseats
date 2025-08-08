import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1)
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '50', 10), 1), 100)
    const search = (searchParams.get('search') || '').trim()
    const emailOptInParam = searchParams.get('emailOptIn')
    const smsOptInParam = searchParams.get('smsOptIn')

    const from = (page - 1) * limit
    const to = from + limit - 1

    // Base customer query with count for pagination
    let customerQuery = supabase
      .from('customers')
      .select('id, firstName, lastName, email, phone, emailOptIn, smsOptIn, createdAt', { count: 'exact' })

    if (search) {
      customerQuery = customerQuery.or(
        `firstName.ilike.%${search}%,lastName.ilike.%${search}%,email.ilike.%${search}%`
      )
    }

    if (emailOptInParam === 'true') {
      customerQuery = customerQuery.eq('emailOptIn', true)
    } else if (emailOptInParam === 'false') {
      customerQuery = customerQuery.eq('emailOptIn', false)
    }

    if (smsOptInParam === 'true') {
      customerQuery = customerQuery.eq('smsOptIn', true)
    } else if (smsOptInParam === 'false') {
      customerQuery = customerQuery.eq('smsOptIn', false)
    }

    customerQuery = customerQuery.order('createdAt', { ascending: false }).range(from, to)

    const { data: customers, error: customersError, count } = await customerQuery

    if (customersError) {
      console.error('Error fetching customers:', customersError)
      throw new Error(`Database error: ${customersError.message}`)
    }

    const customerIds = (customers || []).map((c: any) => c.id)

    // If there are customers, compute booking stats for them
    let statsByCustomerId: Record<string, { bookingCount: number; totalSpent: number; lastBooking: number | null }> = {}

    if (customerIds.length > 0) {
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('customerId, totalAmount, createdAt')
        .in('customerId', customerIds)

      if (bookingsError) {
        console.error('Error fetching bookings for customers:', bookingsError)
        throw new Error(`Database error: ${bookingsError.message}`)
      }

      statsByCustomerId = (bookings || []).reduce((acc: any, b: any) => {
        const key = b.customerId
        if (!acc[key]) {
          acc[key] = { bookingCount: 0, totalSpent: 0, lastBooking: null }
        }
        acc[key].bookingCount += 1
        acc[key].totalSpent += Number(b.totalAmount || 0)
        const ts = new Date(b.createdAt).getTime()
        acc[key].lastBooking = Math.max(acc[key].lastBooking || 0, ts)
        return acc
      }, {})
    }

    const data = (customers || []).map((c: any) => ({
      id: c.id,
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      phone: c.phone,
      emailOptIn: c.emailOptIn,
      smsOptIn: c.smsOptIn,
      createdAt: c.createdAt,
      bookingCount: statsByCustomerId[c.id]?.bookingCount || 0,
      totalSpent: statsByCustomerId[c.id]?.totalSpent || 0,
      lastBooking: statsByCustomerId[c.id]?.lastBooking || null,
    }))

    const totalCount = count || 0
    const totalPages = Math.max(1, Math.ceil(totalCount / limit))

    return NextResponse.json({
      success: true,
      data,
      meta: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    })
  } catch (error: any) {
    console.error('Error in customers API:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch customers'
    }, { status: 500 })
  }
}
