import React from 'react'
import { getServerSupabase } from '@/lib/supabase'
import Stripe from 'stripe'
import Link from 'next/link'

async function fetchBooking(identifier: string) {
  // identifier may be a Stripe Checkout Session ID (cs_...) or our booking UUID
  const supabase = getServerSupabase()
  const bookingQuery = supabase
    .from('bookings')
    .select(`
      id,
      bookingNumber,
      totalAmount,
      bookingFee,
      status,
      createdAt,
      qrCodeData,
      stripePaymentIntentId,
      customers ( firstName, lastName, email ),
      performances ( id, dateTime ),
      shows ( id, title )
    `)

  if (identifier.startsWith('cs_')) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe not configured for success page lookup')
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const session = await stripe.checkout.sessions.retrieve(identifier)
    const piId = (session.payment_intent as string) || ''
    if (!piId) throw new Error('Payment not found for session')
    // Retry to allow webhook to write booking
    for (let attempt = 0; attempt < 20; attempt++) {
      const { data, error } = await bookingQuery.eq('stripePaymentIntentId', piId).limit(1)
      if (error) throw new Error(error.message)
      const booking = Array.isArray(data) ? data[0] : data
      if (booking) return booking
      // wait 500ms before next attempt
      await new Promise(r => setTimeout(r, 500))
    }
    // Fallback: use bookingId from session metadata if webhook hasn't updated yet
    const fallbackBookingId = (session.metadata && (session.metadata as any).bookingId) as string | undefined
    if (fallbackBookingId) {
      const { data, error } = await bookingQuery.eq('id', fallbackBookingId).limit(1)
      if (error) throw new Error(error.message)
      const booking = Array.isArray(data) ? data[0] : data
      if (booking) return booking
    }
    throw new Error('Booking not found')
  }

  const { data, error } = await bookingQuery.eq('id', identifier).limit(1)
  if (error) throw new Error(error.message)
  const booking = Array.isArray(data) ? data[0] : data
  if (!booking) throw new Error('Booking not found')
  return booking
}

export default async function BookingSuccessPage({ params, searchParams }: { params: Promise<{ bookingId: string }>, searchParams?: Promise<Record<string, string>> }) {
  const { bookingId } = await params
  const sp = (await (searchParams || Promise.resolve({}))) || {}
  const fallbackId = (sp as any).bookingId as string | undefined
  const booking = await fetchBooking(bookingId.startsWith('cs_') && fallbackId ? fallbackId : bookingId)

  const show = (booking as any).shows
  const perf = (booking as any).performances

  const bookingDateRaw = (booking as any).createdAt || (booking as any).paidAt || new Date().toISOString()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Book Tickets</h1>
              <p className="text-gray-600">Demo Theatre</p>
            </div>
            <nav>
              <Link href="/" className="text-blue-600 hover:text-blue-500">← Back to Shows</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Step Indicator matching booking flow */}
      <div className="flex items-center justify-center mb-8 mt-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium bg-green-600 text-white">1</div>
          <span className="text-sm font-medium text-gray-700">Select Seats</span>
          <div className="w-8 h-px bg-gray-300" />
          <div className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium bg-green-600 text-white">2</div>
          <span className="text-sm font-medium text-gray-700">Customer Info</span>
          <div className="w-8 h-px bg-gray-300" />
          <div className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium bg-green-600 text-white">3</div>
          <span className="text-sm font-medium text-green-600">Confirmation</span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-lg text-gray-700 mb-1">Your tickets have been successfully booked.</p>
          <p className="text-gray-600">Booking confirmation has been sent to {(booking.customers as any)?.email}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h3>
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-gray-600">Booking Number</span>
                  <span className="text-sm font-mono text-gray-900">{booking.bookingNumber}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-600">Booking Date</span>
                  <span className="text-sm text-gray-900">{new Date(bookingDateRaw as any).toLocaleString('en-GB')}</span>
                </div>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-medium text-gray-900 mb-2">Show Information</h4>
                <div className="space-y-1">
                  <p className="text-sm text-gray-800"><span className="font-medium">Title:</span> {show?.title}</p>
                  <p className="text-sm text-gray-800"><span className="font-medium">Date & Time:</span> {new Date(perf?.dateTime).toLocaleString('en-GB')}</p>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-emerald-900">Total Amount</span>
                  <span className="text-2xl font-bold text-emerald-900">£{Number(booking.totalAmount).toFixed(2)}</span>
                </div>
                <p className="text-xs text-emerald-700 mt-1">Payment confirmed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Digital Tickets</h3>
            <p className="text-sm text-gray-600 mb-4">Keep this page for your records. You will receive an email with ticket details.</p>
            <Link href="/" className="inline-flex items-center justify-center bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">Back to Shows</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
