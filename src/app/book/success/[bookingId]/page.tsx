import React from 'react'
import { supabase } from '@/lib/supabase'
import { NextRequest } from 'next/server'
import Link from 'next/link'

async function fetchBooking(bookingId: string) {
  // Avoid PostgREST single-object coercion issues by selecting as an array and picking the first row
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      bookingNumber,
      totalAmount,
      bookingFee,
      status,
      qrCodeData,
      customers ( firstName, lastName, email ),
      performances ( id, dateTime ),
      shows ( id, title )
    `)
    .eq('id', bookingId)
    .limit(1)

  if (error) throw new Error(error.message)
  const booking = Array.isArray(data) ? data[0] : data
  if (!booking) throw new Error('Booking not found')
  return booking
}

export default async function BookingSuccessPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params
  const booking = await fetchBooking(bookingId)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Booking Successful</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Thank you! Your payment was successful.</h2>
            <p className="text-gray-700 mt-2">A confirmation email has been sent to {(booking.customers as any)?.email}.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Booking</h3>
              <p className="text-sm text-gray-700">Booking Number: <span className="font-mono">{booking.bookingNumber}</span></p>
              <p className="text-sm text-gray-700">Show: {(booking.shows as any)?.title}</p>
              <p className="text-sm text-gray-700">Performance: {new Date((booking.performances as any)?.dateTime).toLocaleString('en-GB')}</p>
              <p className="text-sm text-gray-700 mt-2">Total: £{Number(booking.totalAmount).toFixed(2)}</p>
            </div>

            <div className="text-center md:text-left">
              <h3 className="font-medium text-gray-900 mb-2">Next steps</h3>
              <p className="text-sm text-gray-700">Please arrive 15 minutes before the performance. Bring your confirmation email.</p>
              <Link href="/" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Back to shows</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
