import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

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

    // Load performance and show for product naming and pricing
    const { data: perf, error: perfError } = await supabase
      .from('performances')
      .select('id, dateTime, showId, shows ( id, title, adultPrice, childPrice, concessionPrice )')
      .eq('id', performanceId)
      .single()

    if (perfError || !perf) {
      return NextResponse.json({ success: false, error: 'Performance not found' }, { status: 404 })
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
      unitAmountMinor: Math.round(priceFor(s.ticketType) * 100)
    }))

    const totalMinor = seatItems.reduce((sum, i) => sum + i.unitAmountMinor, 0)
    if (totalMinor <= 0) {
      return NextResponse.json({ success: false, error: 'Calculated total is zero' }, { status: 400 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

    const appUrl = process.env.APP_URL || 'http://localhost:3000'
    const successUrl = `${appUrl}/book/success/{CHECKOUT_SESSION_ID}` // we will resolve in success page
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
      cancel_url: cancelUrl,
      metadata: {
        performanceId,
        showId: show.id,
        // Persist the exact seats and ticket types as JSON for webhook to create the booking
        seatsJson: JSON.stringify(seats),
        customerEmail: customer.email,
        customerFirstName: customer.firstName || '',
        customerLastName: customer.lastName || '',
      },
      payment_intent_data: {
        metadata: {
          performanceId,
          showId: show.id,
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
    return NextResponse.json({ success: false, error: error.message || 'Failed to create checkout session' }, { status: 500 })
  }
}
