'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { SeatGrid } from '../seat/seat-grid'
import { BookingForm } from './booking-form'
import { Button } from '../ui/button'
import { QRCode, generateWalletPassData } from '../ui/qr-code'
import { cn } from '../../lib/utils'
import { Show, Performance, SeatingLayout, SeatSelection, BookingFormData, TicketType } from '../../types'

interface BookingResult {
  bookingNumber?: string
  bookingId?: string
  qrCodeData?: string
  createdAt?: string
  redirectingToPayment?: boolean
}

interface BookingPageProps {
  show: Show
  performance: Performance
  seatingLayout: SeatingLayout
  bookedSeats: string[]
  onCompleteBooking: (bookingData: BookingFormData, selectedSeats: SeatSelection[]) => Promise<BookingResult>
  className?: string
}

interface BookingConfirmation {
  bookingNumber: string
  bookingId: string
  qrCodeData: string
  customerInfo: BookingFormData
  totalAmount: number
  createdAt: string
}

enum BookingStep {
  SEAT_SELECTION = 'seat_selection',
  CUSTOMER_INFO = 'customer_info',
  CONFIRMATION = 'confirmation'
}

export const BookingPage: React.FC<BookingPageProps> = ({
  show,
  performance,
  seatingLayout,
  bookedSeats,
  onCompleteBooking,
  className
}) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>(BookingStep.SEAT_SELECTION)
  const [selectedSeats, setSelectedSeats] = useState<SeatSelection[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [redirectingToPayment, setRedirectingToPayment] = useState(false)
  const [bookingConfirmation, setBookingConfirmation] = useState<BookingConfirmation | null>(null)

  const prices = {
    adult: show.adultPrice,
    child: show.childPrice,
    concession: show.concessionPrice
  }

  const totalAmount = useMemo(() => {
    return selectedSeats.reduce((sum, seat) => sum + seat.price, 0)
  }, [selectedSeats])

  const handleSeatSelect = (seat: any, ticketType: TicketType) => {
    const price = prices[ticketType.toLowerCase() as keyof typeof prices]
    const selection: SeatSelection = {
      seatId: seat.id,
      seat,
      ticketType,
      price
    }

    setSelectedSeats(prev => [...prev, selection])
  }

  const handleSeatDeselect = (seatId: string) => {
    setSelectedSeats(prev => prev.filter(selection => selection.seatId !== seatId))
  }

  const handleTicketTypeChange = (seatId: string, ticketType: TicketType) => {
    setSelectedSeats(prev => prev.map(selection => {
      if (selection.seatId === seatId) {
        const price = prices[ticketType.toLowerCase() as keyof typeof prices]
        return {
          ...selection,
          ticketType,
          price
        }
      }
      return selection
    }))
  }

  const handleContinueToCustomerInfo = () => {
    if (selectedSeats.length > 0) {
      setCurrentStep(BookingStep.CUSTOMER_INFO)
    }
  }

  const handleBackToSeatSelection = () => {
    setCurrentStep(BookingStep.SEAT_SELECTION)
  }

  const handleSubmitBooking = async (bookingData: BookingFormData) => {
    setIsLoading(true)
    try {
      const result = await onCompleteBooking(bookingData, selectedSeats)

      // If we are redirecting to Stripe Checkout, do not show confirmation view
      if (result && result.redirectingToPayment) {
        setRedirectingToPayment(true)
        return
      }

      // Create booking confirmation data from the result
      if (result && result.bookingNumber && result.bookingId) {
        setBookingConfirmation({
          bookingNumber: result.bookingNumber,
          bookingId: result.bookingId,
          qrCodeData: result.qrCodeData || `${result.bookingNumber}-${performance.id}`,
          customerInfo: bookingData,
          totalAmount: totalAmount,
          createdAt: result.createdAt || new Date().toISOString()
        })
        setCurrentStep(BookingStep.CONFIRMATION)
      }
    } catch (error) {
      console.error('Booking failed:', error)
      alert('Booking failed. Please try again.')
    } finally {
      if (!redirectingToPayment) {
        setIsLoading(false)
      }
    }
  }

  const formatDateTime = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj)
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className={cn(
          'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium',
          currentStep === BookingStep.SEAT_SELECTION
            ? 'bg-highlight text-white'
            : selectedSeats.length > 0
            ? 'bg-green-600 text-white'
            : 'bg-gray-300 text-gray-800'
        )}>
          1
        </div>
        <span className={cn(
          'text-sm font-medium',
          currentStep === BookingStep.SEAT_SELECTION ? 'text-highlight' : 'text-gray-700'
        )}>
          Select Seats
        </span>

        <div className="w-8 h-px bg-gray-300"></div>

        <div className={cn(
          'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium',
          currentStep === BookingStep.CUSTOMER_INFO
            ? 'bg-highlight text-white'
            : currentStep === BookingStep.CONFIRMATION
            ? 'bg-green-600 text-white'
            : 'bg-gray-300 text-gray-800'
        )}>
          2
        </div>
        <span className={cn(
          'text-sm font-medium',
          currentStep === BookingStep.CUSTOMER_INFO ? 'text-highlight' : 'text-gray-700'
        )}>
          Customer Info
        </span>

        <div className="w-8 h-px bg-gray-300"></div>

        <div className={cn(
          'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium',
          currentStep === BookingStep.CONFIRMATION
            ? 'bg-green-600 text-white'
            : 'bg-gray-300 text-gray-800'
        )}>
          3
        </div>
        <span className={cn(
          'text-sm font-medium',
          currentStep === BookingStep.CONFIRMATION ? 'text-green-600' : 'text-gray-700'
        )}>
          Confirmation
        </span>
      </div>
    </div>
  )

  return (
    <div className={cn('max-w-6xl mx-auto p-6', className)}>
      {/* Full-screen overlay while redirecting to Stripe */}
      {redirectingToPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-transparent mx-auto mb-3"></div>
            <p className="text-gray-800 font-medium">Redirecting to secure payment…</p>
          </div>
        </div>
      )}

      {/* Show Header with Image */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Show Image */}
          <div className="md:col-span-1">
            <div className="relative h-40 sm:h-56 md:h-64 w-full rounded-lg overflow-hidden shadow-md">
              {show.imageUrl ? (
                <Image
                  src={show.imageUrl}
                  alt={show.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const placeholder = target.nextElementSibling as HTMLElement
                    if (placeholder) {
                      placeholder.style.display = 'block'
                    }
                  }}
                />
              ) : null}
              {/* Placeholder image - shown when no image URL or when image fails to load */}
              <div
                className={`absolute inset-0 ${show.imageUrl ? 'hidden' : 'block'}`}
                style={{
                  background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                  display: show.imageUrl ? 'none' : 'block'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs sm:text-sm text-gray-500">Show Image</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Show Details */}
          <div className="md:col-span-2 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{show.title}</h1>
            <p className="text-lg text-gray-700 mb-2">{formatDateTime(performance.dateTime)}</p>
            {performance.isMatinee && (
              <span className="inline-block mb-3 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded">
                Matinee Performance
              </span>
            )}
            {show.genre && (
              <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded">
                {show.genre}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <StepIndicator />

      {/* Step Content */}
      {currentStep === BookingStep.SEAT_SELECTION && (
        <div className="space-y-6">
          <SeatGrid
            seatingLayout={seatingLayout}
            selectedSeats={selectedSeats}
            onSeatSelect={handleSeatSelect}
            onSeatDeselect={handleSeatDeselect}
            onTicketTypeChange={handleTicketTypeChange}
            bookedSeats={bookedSeats}
            prices={prices}
          />

          {selectedSeats.length > 0 && (
            <div className="flex justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={handleContinueToCustomerInfo}
              >
                Continue to Customer Information
              </Button>
            </div>
          )}
        </div>
      )}

      {currentStep === BookingStep.CUSTOMER_INFO && (
        <div className="space-y-6">
          <BookingForm
            selectedSeats={selectedSeats}
            totalAmount={totalAmount}
            onSubmit={handleSubmitBooking}
            isLoading={isLoading || redirectingToPayment}
          />

          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleBackToSeatSelection}
              disabled={isLoading || redirectingToPayment}
            >
              ← Back to Seat Selection
            </Button>
          </div>
        </div>
      )}

      {currentStep === BookingStep.CONFIRMATION && bookingConfirmation && (
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-lg text-gray-700 mb-1">
              Your tickets have been successfully booked.
            </p>
            <p className="text-gray-600">
              Booking confirmation has been sent to {bookingConfirmation.customerInfo.email}
            </p>
          </div>

          {/* QR Code and Booking Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* QR Code Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Digital Tickets</h3>

              {/* QR Code */}
              <div className="flex justify-center mb-4">
                <QRCode
                  value={bookingConfirmation.qrCodeData}
                  size={192}
                  className="mx-auto"
                />
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Scan this QR code to add your tickets to your digital wallet
              </p>

              <div className="space-y-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    // Generate wallet pass data
                    const walletData = generateWalletPassData({
                      bookingNumber: bookingConfirmation.bookingNumber,
                      showTitle: show.title,
                      performanceDate: formatDateTime(performance.dateTime),
                      venue: 'Demo Theatre',
                      seats: selectedSeats.map(s => `${s.seat.row}${s.seat.number}`),
                      customerName: `${bookingConfirmation.customerInfo.firstName} ${bookingConfirmation.customerInfo.lastName}`
                    })

                    // For now, show the data structure - in production you'd send this to a wallet pass service
                    console.log('Wallet pass data:', walletData)
                    alert('Add to Wallet functionality requires Apple Wallet or Google Pay integration. Your booking details are ready for digital wallet integration!')
                  }}
                >
                  📱 Add to Wallet
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    // Generate a simple ticket data structure for PDF
                    const ticketData = {
                      bookingNumber: bookingConfirmation.bookingNumber,
                      show: show.title,
                      performance: formatDateTime(performance.dateTime),
                      seats: selectedSeats.map(s => `Row ${s.seat.row}, Seat ${s.seat.number} (${s.ticketType})`),
                      customer: `${bookingConfirmation.customerInfo.firstName} ${bookingConfirmation.customerInfo.lastName}`,
                      total: `£${bookingConfirmation.totalAmount.toFixed(2)}`,
                      qrCode: bookingConfirmation.qrCodeData
                    }

                    console.log('PDF ticket data:', ticketData)
                    alert('PDF generation functionality coming soon! Your ticket data is ready for PDF generation.')
                  }}
                >
                  📄 Download PDF
                </Button>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h3>

              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-600">Booking Number</span>
                    <span className="text-sm font-mono text-gray-900">{bookingConfirmation.bookingNumber}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600">Booking Date</span>
                    <span className="text-sm text-gray-900">
                      {new Date(bookingConfirmation.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Show Information</h4>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-800"><span className="font-medium">Title:</span> {show.title}</p>
                    {show.genre && <p className="text-sm text-gray-800"><span className="font-medium">Genre:</span> {show.genre}</p>}
                    <p className="text-sm text-gray-800"><span className="font-medium">Duration:</span> {show.duration} minutes</p>
                    <p className="text-sm text-gray-800"><span className="font-medium">Age Rating:</span> {show.ageRating}</p>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Performance Details</h4>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-800"><span className="font-medium">Date & Time:</span> {formatDateTime(performance.dateTime)}</p>
                    {performance.isMatinee && (
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        Matinee Performance
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Your Seats</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedSeats.map((selection, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <div className="w-6 h-6 bg-emerald-100 border-2 border-emerald-300 rounded-t flex items-center justify-center text-xs font-medium text-emerald-800">
                          {selection.seat.number}
                        </div>
                        <div className="text-sm">
                          <div className="font-medium text-gray-800">Row {selection.seat.row}</div>
                          <div className="text-gray-600">{selection.ticketType}</div>
                        </div>
                        <div className="text-sm font-bold ml-auto text-gray-800">
                          £{selection.price.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-emerald-900">Total Amount</span>
                    <span className="text-2xl font-bold text-emerald-900">£{bookingConfirmation.totalAmount.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-emerald-700 mt-1">Payment confirmed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Contact Details</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-800"><span className="font-medium text-gray-800">Name:</span> {bookingConfirmation.customerInfo.firstName} {bookingConfirmation.customerInfo.lastName}</p>
                  <p className="text-gray-800"><span className="font-medium text-gray-800">Email:</span> {bookingConfirmation.customerInfo.email}</p>
                  {bookingConfirmation.customerInfo.phone && (
                    <p className="text-gray-800"><span className="font-medium text-gray-800">Phone:</span> {bookingConfirmation.customerInfo.phone}</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Preferences</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-800"><span className="font-medium text-gray-800">Email Updates:</span> {bookingConfirmation.customerInfo.emailOptIn ? 'Yes' : 'No'}</p>
                  <p className="text-gray-800"><span className="font-medium text-gray-800">SMS Updates:</span> {bookingConfirmation.customerInfo.smsOptIn ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>

            {(bookingConfirmation.customerInfo.accessibilityRequirements || bookingConfirmation.customerInfo.specialRequests) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Special Requirements</h4>
                {bookingConfirmation.customerInfo.accessibilityRequirements && (
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-600">Accessibility:</span>
                    <p className="text-sm text-gray-900">{bookingConfirmation.customerInfo.accessibilityRequirements}</p>
                  </div>
                )}
                {bookingConfirmation.customerInfo.specialRequests && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Special Requests:</span>
                    <p className="text-sm text-gray-900">{bookingConfirmation.customerInfo.specialRequests}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Important Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Important Information</h3>
            <div className="text-sm text-yellow-800 space-y-2">
              <p>• Please arrive at least 15 minutes before the performance begins</p>
              <p>• Show your booking confirmation (email or digital ticket) at the venue</p>
              <p>• Late arrivals may not be admitted until a suitable break in the performance</p>
              <p>• For any changes or questions, contact us with your booking number: {bookingConfirmation.bookingNumber}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => window.print()}
              >
                Print Confirmation
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/'}
              >
                Book More Shows
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              A confirmation email has been sent to {bookingConfirmation.customerInfo.email}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
