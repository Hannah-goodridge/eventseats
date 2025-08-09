import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSupabase } from '@/lib/supabase'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ success: false, error: 'Stripe is not configured (missing STRIPE_SECRET_KEY)' }, { status: 500 })
    }

    const body = await request.json()
    const { performanceId, customer, seats } = body as {
      performanceId: string
      customer: { email: string; firstName?: string; lastName?: string; phone?: string }
      seats: Array<{ seatId: string; ticketType: 'ADULT' | 'CHILD' | 'CONCESSION' }>
    }

    if (!performanceId || !customer?.email || !seats || seats.length === 0) {
      return NextResponse.json({ success: false, error: 'performanceId, customer.email, and seats are required' }, { status: 400 })
    }

    // Initialize Supabase client early (before first use)
    const supabase = getServerSupabase()

    // Load performance and show for product naming and pricing
    const { data: perf, error: perfError } = await supabase
      .from('performances')
      .select('id, dateTime, showId, shows ( id, title, adultPrice, childPrice, concessionPrice )')
      .eq('id', performanceId)
      .single()

    if (perfError || !perf) {
      return NextResponse.json({ success: false, error: `Performance not found: ${perfError?.message || ''}`.trim() }, { status: 404 })
    }

    const show = (perf as any).shows
    const title = show?.title || 'Performance'

    // Compute total using server-side prices (ignore any client price input)
    const priceFor = (ticketType: string) => {
      switch (ticketType) {
        case 'ADULT': return Number(show?.adultPrice || 0)
        case 'CHILD': return Number(show?.childPrice || 0)
        case 'CONCESSION': return Number(show?.concessionPrice || 0)
        default: return 0
      }
    }

    const currency = 'GBP'
    const seatItems = seats.map(s => ({
      ticketType: s.ticketType,
      unitAmountMinor: Math.round(priceFor(s.ticketType) * 100),
      seatId: s.seatId,
    }))

    const totalMinor = seatItems.reduce((sum, i) => sum + i.unitAmountMinor, 0)
    if (totalMinor <= 0) {
      return NextResponse.json({ success: false, error: 'Calculated total is zero' }, { status: 400 })
    }

    // Find or create customer (customerId is required by schema)
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', customer.email)
      .single()

    let customerId = existingCustomer?.id as string | null
    if (!customerId) {
      const { data: createdCust, error: custErr } = await supabase
        .from('customers')
        .insert({
          email: customer.email,
          firstName: customer.firstName || 'Customer',
          lastName: customer.lastName || '',
          phone: customer.phone || null,
          country: 'GB',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .select('id')
        .single()
      if (custErr) {
        return NextResponse.json({ success: false, error: `Failed to create customer: ${custErr.message}` }, { status: 500 })
      }
      customerId = createdCust.id
    }

    // Pre-create a PENDING booking and booking_items to reserve seats
    const now = new Date().toISOString()
    const bookingId = randomUUID()
    const bookingNumber = `BK${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`

    const { data: createdBooking, error: bookingErr } = await supabase
      .from('bookings')
      .insert({
        id: bookingId,
        bookingNumber,
        status: 'PENDING',
        totalAmount: totalMinor / 100,
        bookingFee: 0,
        performanceId,
        showId: show.id,
        customerId,
        createdAt: now,
        updatedAt: now,
      })
      .select('id')
      .single()

    if (bookingErr) {
      return NextResponse.json({ success: false, error: `Failed to create pending booking: ${bookingErr.message}` }, { status: 500 })
    }

    // Insert booking items for reservation
    const { error: itemsErr } = await supabase.from('booking_items').insert(
      seatItems.map((i) => ({
        id: randomUUID(),
        seatId: i.seatId,
        ticketType: i.ticketType,
        price: i.unitAmountMinor / 100,
        bookingId,
        createdAt: now,
      }))
    )
    if (itemsErr) {
      // Rollback booking if items fail
      await supabase.from('bookings').delete().eq('id', bookingId)
      return NextResponse.json({ success: false, error: `Failed to reserve seats: ${itemsErr.message}` }, { status: 500 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

    const appUrl = process.env.APP_URL || 'http://localhost:3000'
    const successUrl = `${appUrl}/book/success/{CHECKOUT_SESSION_ID}?bookingId=${bookingId}` // include bookingId for fallback
    const cancelUrl = `${appUrl}/book/${show.id}/${performanceId}?payment=cancelled`

    // Build a single line item with the full total to keep it simple, or expand to multiple items later
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: customer.email,
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `Tickets for ${title}`,
              description: new Date(perf.dateTime).toLocaleString('en-GB')
            },
            unit_amount: totalMinor,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: `${cancelUrl}&bookingId=${bookingId}`,
      metadata: {
        performanceId,
        showId: show.id,
        bookingId,
        // Persist the exact seats and ticket types as JSON for safety (webhook may validate)
        seatsJson: JSON.stringify(seats),
        customerEmail: customer.email,
        customerFirstName: customer.firstName || '',
        customerLastName: customer.lastName || '',
      },
      payment_intent_data: {
        metadata: {
          performanceId,
          showId: show.id,
          bookingId,
          seatsJson: JSON.stringify(seats),
          customerEmail: customer.email,
          customerFirstName: customer.firstName || '',
          customerLastName: customer.lastName || '',
        }
      }
    })

    if (!session.url) {
      return NextResponse.json({ success: false, error: 'Stripe did not return a checkout URL' }, { status: 500 })
    }

    return NextResponse.json({ success: true, url: session.url })
  } catch (error: any) {
    console.error('Error creating Stripe Checkout Session:', error)
    return NextResponse.json({ success: false, error: `Create-session failed: ${error?.message || 'Unknown error'}` }, { status: 500 })
  }
}
