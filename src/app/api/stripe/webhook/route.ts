import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ success: false, error: 'Stripe is not configured' }, { status: 500 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  try {
    const payload = await request.text()
    const signature = request.headers.get('stripe-signature') as string

    const event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET)

    const createOrFindCustomer = async (email: string, firstName?: string, lastName?: string) => {
      const { data: existing, error: lookupErr } = await supabase
        .from('customers')
        .select('id')
        .eq('email', email)
        .single()

      if (existing && existing.id) return existing.id

      const now = new Date().toISOString()
      const { data: created, error: createErr } = await supabase
        .from('customers')
        .insert({
          email,
          firstName: firstName || 'Customer',
          lastName: lastName || '',
          country: 'GB',
          createdAt: now,
          updatedAt: now
        })
        .select('id')
        .single()

      if (createErr) throw createErr
      return created.id
    }

    const createBookingFromMetadata = async (meta: any, paymentIntentId: string) => {
      const performanceId = meta.performanceId
      const showId = meta.showId
      const seats = JSON.parse(meta.seatsJson || '[]') as Array<{ seatId: string; ticketType: 'ADULT' | 'CHILD' | 'CONCESSION' }>
      const email = meta.customerEmail
      const firstName = meta.customerFirstName
      const lastName = meta.customerLastName

      // Load server-side prices
      const { data: show, error: showErr } = await supabase
        .from('shows')
        .select('adultPrice, childPrice, concessionPrice')
        .eq('id', showId)
        .single()

      if (showErr || !show) throw new Error('Show not found for pricing')

      const priceFor = (t: string) => {
        switch (t) {
          case 'ADULT': return Number(show.adultPrice || 0)
          case 'CHILD': return Number(show.childPrice || 0)
          case 'CONCESSION': return Number(show.concessionPrice || 0)
          default: return 0
        }
      }

      const totalAmount = seats.reduce((sum, s) => sum + priceFor(s.ticketType), 0)
      const now = new Date().toISOString()

      const customerId = await createOrFindCustomer(email, firstName, lastName)

      // Generate bookingNumber
      const bookingNumber = `BK${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`

      // Create booking (PAID immediately since PI succeeded)
      const { data: booking, error: bookingErr } = await supabase
        .from('bookings')
        .insert({
          bookingNumber,
          status: 'PAID',
          totalAmount,
          bookingFee: 0,
          performanceId,
          showId,
          customerId,
          stripePaymentIntentId: paymentIntentId,
          paidAt: now,
          createdAt: now,
          updatedAt: now
        })
        .select('*')
        .single()

      if (bookingErr) throw bookingErr

      // Insert booking_items
      const items = seats.map((s) => ({
        ticketType: s.ticketType,
        price: priceFor(s.ticketType),
        bookingId: booking.id,
        seatId: s.seatId,
        createdAt: now,
      }))

      const { error: itemsErr } = await supabase.from('booking_items').insert(items)
      if (itemsErr) throw itemsErr
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const piId = (session.payment_intent as string) || ''
        const meta = session.metadata || {}
        await createBookingFromMetadata(meta, piId)
        break
      }
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent
        const meta = pi.metadata || {}
        await createBookingFromMetadata(meta, pi.id)
        break
      }
      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('Stripe webhook error:', err.message)
    return NextResponse.json({ success: false, error: `Webhook Error: ${err.message}` }, { status: 400 })
  }
}
