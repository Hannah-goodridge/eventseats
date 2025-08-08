'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { BookingPage } from '../../../../components/booking/booking-page'
import { Show, Performance, SeatingLayout, BookingFormData, SeatSelection, ShowStatus } from '../../../../types'

interface ApiShow {
  id: string
  title: string
  slug: string
  description?: string
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
  const { showId, performanceId } = params

  const [show, setShow] = useState<Show | null>(null)
  const [performance, setPerformance] = useState<Performance | null>(null)
  const [seatingLayout, setSeatingLayout] = useState<SeatingLayout | null>(null)
  const [bookedSeats, setBookedSeats] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
          imageUrl: '/api/placeholder/400/300',
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

          performances: foundShow.performances.map(p => ({
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
          // Use seat IDs (UUIDs) for the booking component - this is what SeatGrid expects
          setBookedSeats(bookedSeatsData.data.bookedSeatIds)
          console.log('📍 Booked seats for this performance:', bookedSeatsData.data.bookedSeatDisplays)
          console.log('📍 Booked seat IDs:', bookedSeatsData.data.bookedSeatIds)
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
    console.log('Booking submitted:', { bookingData, selectedSeats })

    try {
      // Prepare booking request
      const bookingRequest = {
        performanceId: performanceId as string,
        customer: {
          firstName: bookingData.firstName,
          lastName: bookingData.lastName,
          email: bookingData.email,
          phone: bookingData.phone,
          emailOptIn: bookingData.emailOptIn || false,
          smsOptIn: bookingData.smsOptIn || false,
          address: bookingData.address,
          city: bookingData.city,
          postcode: bookingData.postcode,
          country: bookingData.country || 'GB'
        },
        seats: selectedSeats.map(seat => ({
          seatId: seat.seat.id,
          ticketType: seat.ticketType,
          price: seat.price
        })),
        accessibilityRequirements: bookingData.accessibilityRequirements,
        specialRequests: bookingData.specialRequests,
        totalAmount: selectedSeats.reduce((total, seat) => total + seat.price, 0),
        bookingFee: 0
      }

      console.log('💳 Submitting booking request:', bookingRequest)

      // Submit booking to API
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingRequest)
      })

      const result = await response.json()

                  if (result.success) {
        console.log('✅ Booking created successfully:', result.data.booking.bookingNumber)

        // Update booked seats immediately to prevent double booking
        const updatedBookedSeatsResponse = await fetch(`/api/booked-seats/${performanceId}`)
        const updatedBookedSeatsData = await updatedBookedSeatsResponse.json()

        if (updatedBookedSeatsData.success) {
          setBookedSeats(updatedBookedSeatsData.data.bookedSeatIds)
        }

        // Return booking result data for confirmation page
        return {
          bookingNumber: result.data.booking.bookingNumber,
          bookingId: result.data.booking.id,
          qrCodeData: result.data.booking.qrCodeData,
          createdAt: result.data.booking.createdAt
        }
      } else {
        console.error('❌ Booking failed:', result.error)
        throw new Error(result.error || 'Booking failed')
      }

    } catch (error) {
      console.error('❌ Error submitting booking:', error)
      throw error
    }
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