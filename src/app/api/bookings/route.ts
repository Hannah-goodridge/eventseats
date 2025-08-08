import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { randomUUID } from 'crypto'

interface BookingRequest {
  performanceId: string
  customer: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    emailOptIn?: boolean
    smsOptIn?: boolean
    address?: string
    city?: string
    postcode?: string
    country?: string
  }
  seats: Array<{
    seatId: string
    ticketType: 'ADULT' | 'CHILD' | 'CONCESSION'
    price: number
  }>
  accessibilityRequirements?: string
  specialRequests?: string
  totalAmount: number
  bookingFee?: number
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingRequest = await request.json()
    console.log('📝 Creating booking:', body)

    const {
      performanceId,
      customer,
      seats,
      accessibilityRequirements,
      specialRequests,
      totalAmount,
      bookingFee = 0
    } = body

    // Validate required fields
    if (!performanceId || !customer.firstName || !customer.lastName || !customer.email || !seats || seats.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    // Get performance details to validate it exists
    const { data: performance, error: perfError } = await supabase
      .from('performances')
      .select(`
        id,
        dateTime,
        showId,
        shows (
          id,
          title,
          organizationId
        )
      `)
      .eq('id', performanceId)
      .single()

    if (perfError || !performance) {
      console.error('Performance not found:', perfError)
      return NextResponse.json({
        success: false,
        error: 'Performance not found'
      }, { status: 404 })
    }

    console.log('✅ Found performance:', (performance.shows as any).title)

    // Check for double booking - verify seats are still available
    const seatIds = seats.map(seat => seat.seatId)
    const { data: existingBookings, error: bookingCheckError } = await supabase
      .from('booking_items')
      .select(`
        seatId,
        bookings!inner (
          status,
          performanceId
        )
      `)
      .eq('bookings.performanceId', performanceId)
      .in('bookings.status', ['CONFIRMED', 'PAID', 'CHECKED_IN'])
      .in('seatId', seatIds)

    if (bookingCheckError) {
      console.error('Error checking existing bookings:', bookingCheckError)
      return NextResponse.json({
        success: false,
        error: 'Failed to verify seat availability'
      }, { status: 500 })
    }

    if (existingBookings && existingBookings.length > 0) {
      const alreadyBookedSeats = existingBookings.map(booking => booking.seatId)
      console.error('❌ Seats already booked:', alreadyBookedSeats)
      return NextResponse.json({
        success: false,
        error: `Some seats are no longer available. Please refresh and try again.`,
        alreadyBookedSeats: alreadyBookedSeats
      }, { status: 409 }) // 409 Conflict
    }

    console.log('✅ All seats are available for booking')

    // Create or find customer
    let customerId = null

    // Check if customer exists
    const { data: existingCustomer, error: customerLookupError } = await supabase
      .from('customers')
      .select('id')
      .eq('email', customer.email)
      .single()

    if (existingCustomer) {
      customerId = existingCustomer.id
      console.log('✅ Found existing customer:', customerId)
    } else {
      // Create new customer
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          id: randomUUID(),
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone || null,
          address: customer.address || null,
          city: customer.city || null,
          postcode: customer.postcode || null,
          country: customer.country || 'GB',
          emailOptIn: customer.emailOptIn || false,
          smsOptIn: customer.smsOptIn || false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .select('id')
        .single()

      if (customerError) {
        console.error('Error creating customer:', customerError)
        return NextResponse.json({
          success: false,
          error: 'Failed to create customer'
        }, { status: 500 })
      }

      customerId = newCustomer.id
      console.log('✅ Created new customer:', customerId)
    }

    // Generate booking number
    const bookingNumber = `BK${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`

    // Create booking
    const bookingId = randomUUID()
    const now = new Date().toISOString()

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        id: bookingId,
        bookingNumber: bookingNumber,
        status: 'CONFIRMED',
        totalAmount: totalAmount,
        bookingFee: bookingFee,
        accessibilityRequirements: accessibilityRequirements || null,
        specialRequests: specialRequests || null,
        performanceId: performanceId,
        showId: performance.showId,
        customerId: customerId,
        createdAt: now,
        updatedAt: now
      })
      .select('*')
      .single()

    if (bookingError) {
      console.error('Error creating booking:', bookingError)
      return NextResponse.json({
        success: false,
        error: 'Failed to create booking'
      }, { status: 500 })
    }

    console.log('✅ Created booking:', booking.bookingNumber)

    // Create booking items for each seat
    const bookingItems = seats.map(seat => ({
      id: randomUUID(),
      seatId: seat.seatId,
      ticketType: seat.ticketType,
      price: seat.price,
      bookingId: bookingId,
      createdAt: now
    }))

    const { data: items, error: itemsError } = await supabase
      .from('booking_items')
      .insert(bookingItems)
      .select('*')

    if (itemsError) {
      console.error('Error creating booking items:', itemsError)
      // Try to rollback booking
      await supabase.from('bookings').delete().eq('id', bookingId)
      return NextResponse.json({
        success: false,
        error: 'Failed to create booking items'
      }, { status: 500 })
    }

    console.log('✅ Created booking items:', items.length)

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Booking created successfully!',
      data: {
        booking: {
          id: booking.id,
          bookingNumber: booking.bookingNumber,
          status: booking.status,
          totalAmount: booking.totalAmount,
          bookingFee: booking.bookingFee,
          performanceId: booking.performanceId,
          customerId: booking.customerId,
          createdAt: booking.createdAt
        },
        items: items,
        performance: {
          id: performance.id,
          dateTime: performance.dateTime,
          show: performance.shows
        }
      }
    })

  } catch (error: any) {
    console.error('❌ Error creating booking:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error occurred'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')
    const performanceId = searchParams.get('performanceId')
    const status = searchParams.get('status')

    let query = supabase
      .from('bookings')
      .select(`
        id,
        bookingNumber,
        status,
        totalAmount,
        bookingFee,
        accessibilityRequirements,
        specialRequests,
        createdAt,
        updatedAt,
        customers (
          id,
          firstName,
          lastName,
          email,
          phone,
          emailOptIn,
          smsOptIn
        ),
        performances (
          id,
          dateTime,
          isMatinee,
          shows (
            id,
            title,
            venue:venues (
              name,
              address
            )
          )
        ),
        booking_items (
          id,
          seatId,
          ticketType,
          price,
          seats (
            id,
            row,
            number,
            section
          )
        )
      `)

    // Apply filters
    if (customerId) {
      query = query.eq('customerId', customerId)
    }

    if (performanceId) {
      query = query.eq('performanceId', performanceId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    // Order by creation date (newest first)
    query = query.order('createdAt', { ascending: false })

    const { data: bookings, error } = await query

    if (error) {
      console.error('Error fetching bookings:', error)
      throw new Error(`Database error: ${error.message}`)
    }

    // Normalize shape: expose `customer` (singular) for consumers
    const normalized = (bookings || []).map((b: any) => {
      const customer = b.customers
        ? {
            id: b.customers.id,
            firstName: b.customers.firstName,
            lastName: b.customers.lastName,
            email: b.customers.email,
            phone: b.customers.phone,
          }
        : null
      return {
        ...b,
        customer,
      }
    })

    return NextResponse.json({
      success: true,
      data: normalized,
      meta: {
        total: normalized.length
      }
    })

  } catch (error: any) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch bookings'
    }, { status: 500 })
  }
}
