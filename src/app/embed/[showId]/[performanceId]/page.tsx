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

export default function EmbedBookingRoute() {
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

        // Post message to parent window if embedded
        if (window.parent !== window) {
          window.parent.postMessage({
            type: 'booking_complete',
            data: {
              bookingNumber: result.data.booking.bookingNumber,
              bookingId: result.data.booking.id,
              showTitle: show?.title,
              performance: performance?.dateTime,
              totalAmount: selectedSeats.reduce((total, seat) => total + seat.price, 0)
            }
          }, '*')
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-highlight mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking page...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 max-w-md">
          <h3 className="text-red-800 font-medium">Error loading booking page</h3>
          <p className="text-red-600 mt-1">{error}</p>
          <div className="mt-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!show || !performance || !seatingLayout) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Show or performance not found</h2>
          <p className="text-gray-600 mt-2">The requested show or performance could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Header for Embedded View */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3 text-center">
            <h1 className="text-lg font-semibold text-gray-900">Book Tickets</h1>
            <p className="text-sm text-gray-600">Secure Online Booking</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-4">
        <BookingPage
          show={show}
          performance={performance}
          seatingLayout={seatingLayout}
          bookedSeats={bookedSeats}
          onCompleteBooking={handleCompleteBooking}
          className="px-2 sm:px-4"
        />
      </main>

      {/* Footer with branding */}
      <footer className="bg-white border-t border-gray-200 py-2">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Powered by <a href="https://hannahgoodridge.dev" target="_blank" rel="noopener noreferrer" className="underline">hannahgoodridge.dev</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
