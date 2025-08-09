'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { BookingPage } from '../../../../components/booking/booking-page'
import { Show, Performance, SeatingLayout, BookingFormData, SeatSelection, ShowStatus, TicketType } from '../../../../types'

interface ApiShow {
  id: string
  title: string
  slug: string
  description?: string
  imageUrl?: string
  genre?: string
  duration?: number
  ageRating?: string
  adultPrice: number
  childPrice: number
  concessionPrice: number
  status: string
  performances: {
    id: string
    dateTime: string
    isMatinee: boolean
    notes?: string
  }[]
}

export default function BookingRoute() {
  const params = useParams()
  const searchParams = useSearchParams()
  const { showId, performanceId } = params

  const [show, setShow] = useState<Show | null>(null)
  const [performance, setPerformance] = useState<Performance | null>(null)
  const [seatingLayout, setSeatingLayout] = useState<SeatingLayout | null>(null)
  const [bookedSeats, setBookedSeats] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const paymentStatus = searchParams?.get('payment')
  const bookingIdFromQuery = searchParams?.get('bookingId')

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setIsLoading(true)

        // Fetch show data
        const showResponse = await fetch(`/api/shows`)
        const showData = await showResponse.json()

        if (!showData.success) {
          throw new Error('Failed to fetch show data')
        }

        // Find the specific show
        const foundShow = showData.data.find((s: ApiShow) => s.id === showId)
        if (!foundShow) {
          throw new Error('Show not found')
        }

        // Convert to Show interface
        const convertedShow: Show = {
          id: foundShow.id,
          title: foundShow.title,
          slug: foundShow.slug,
          description: foundShow.description || '',
          imageUrl: foundShow.imageUrl || '',
          genre: foundShow.genre || '',
          duration: foundShow.duration || 120,
          ageRating: foundShow.ageRating || 'PG',
          warnings: undefined,
          adultPrice: foundShow.adultPrice,
          childPrice: foundShow.childPrice,
          concessionPrice: foundShow.concessionPrice,
          status: foundShow.status as ShowStatus,
          organizationId: '1',
          venueId: '1',
          seatingLayoutId: '1',
          createdAt: new Date(),
          updatedAt: new Date(),

          performances: foundShow.performances.map((p: any) => ({
            id: p.id,
            dateTime: new Date(p.dateTime),
            isMatinee: p.isMatinee,
            showId: foundShow.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            bookings: []
          }))
        }

        // Find the specific performance
        const foundPerformance = convertedShow.performances.find(p => p.id === performanceId)
        if (!foundPerformance) {
          throw new Error('Performance not found')
        }

        setShow(convertedShow)
        setPerformance(foundPerformance)

        // Fetch real seating layout and seats from database
        const seatingResponse = await fetch(`/api/seats-for-layout/${foundShow.seatingLayoutId || '869f0aca-0611-4b8b-bf16-b9356854b35a'}`)
        const seatingData = await seatingResponse.json()

        if (seatingData.success) {
          const realSeatingLayout: SeatingLayout = {
            id: seatingData.data.layout.id,
            name: seatingData.data.layout.name,
            description: seatingData.data.layout.description || 'Traditional theatre seating',
            rows: 10,
            columns: 10,
            layoutData: {},
            venueId: seatingData.data.layout.venueId,
            organizationId: seatingData.data.layout.organizationId,
            seatingLayoutId: seatingData.data.layout.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            seats: seatingData.data.seats.map((seat: any) => ({
              id: seat.id,
              row: seat.row,
              number: seat.number,
              section: seat.section,
              isAccessible: seat.isAccessible || false,
              isWheelchairSpace: seat.isWheelchairSpace || false,
              notes: seat.notes,
              seatingLayoutId: seat.seatingLayoutId,
              createdAt: new Date(seat.createdAt),
              updatedAt: new Date(seat.updatedAt || seat.createdAt),
              bookingItems: []
            }))
          }
          setSeatingLayout(realSeatingLayout)
        } else {
          throw new Error('Failed to fetch seating layout')
        }

        // Fetch real booked seats for this performance
        const bookedSeatsResponse = await fetch(`/api/booked-seats/${performanceId}`)
        const bookedSeatsData = await bookedSeatsResponse.json()

        if (bookedSeatsData.success) {
          setBookedSeats(bookedSeatsData.data.bookedSeatIds)
        } else {
          console.warn('Failed to fetch booked seats, starting with empty list')
          setBookedSeats([])
        }

      } catch (err: any) {
        setError(err.message || 'Failed to load booking data')
        console.error('Error fetching booking data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (showId && performanceId) {
      fetchBookingData()
    }
  }, [showId, performanceId])

  const handleCompleteBooking = async (bookingData: BookingFormData, selectedSeats: SeatSelection[]): Promise<any> => {
    try {
      const payload = {
        performanceId: performanceId as string,
        customer: {
          firstName: bookingData.firstName,
          lastName: bookingData.lastName,
          email: bookingData.email,
          phone: bookingData.phone,
        },
        seats: selectedSeats.map(s => ({
          seatId: s.seat.id,
          ticketType: s.ticketType as TicketType,
        })),
      }

      const sessionRes = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const sessionData = await sessionRes.json()

      if (!sessionData.success || !sessionData.url) {
        console.error('Stripe session creation failed:', sessionData)
        throw new Error(sessionData.error || 'Failed to create payment session')
      }

      window.location.href = sessionData.url
      return { redirectingToPayment: true }
    } catch (error: any) {
      console.error('❌ Error starting payment:', error)
      alert(error?.message || 'Payment could not be initiated. Please try again.')
      throw error
    }
  }

  const Banner = () => {
    if (!paymentStatus) return null
    if (paymentStatus === 'success') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4 rounded-md bg-green-50 border border-green-200 p-4 text-green-800">
            Payment successful{bookingIdFromQuery ? ` for booking ${bookingIdFromQuery}` : ''}. Check your email for confirmation.
          </div>
        </div>
      )
    }
    if (paymentStatus === 'cancelled') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4 rounded-md bg-yellow-50 border border-yellow-200 p-4 text-yellow-800">
            Payment was cancelled. Your seats may be held briefly; please try again.
          </div>
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking page...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 max-w-md">
          <h3 className="text-red-800 font-medium">Error loading booking page</h3>
          <p className="text-red-600 mt-1">{error}</p>
          <div className="mt-4 space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
            <a
              href="/"
              className="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Back to Shows
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (!show || !performance || !seatingLayout) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Show or performance not found</h2>
          <p className="text-gray-600 mt-2">The requested show or performance could not be found.</p>
          <a
            href="/"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Shows
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Book Tickets</h1>
              <p className="text-gray-600">Demo Theatre</p>
            </div>
            <nav>
              <a href="/" className="text-blue-600 hover:text-blue-500">
                ← Back to Shows
              </a>
            </nav>
          </div>
        </div>
      </header>

      <Banner />

      {/* Main Content */}
      <main className="py-8">
        <BookingPage
          show={show}
          performance={performance}
          seatingLayout={seatingLayout}
          bookedSeats={bookedSeats}
          onCompleteBooking={handleCompleteBooking}
        />
      </main>
    </div>
  )
}