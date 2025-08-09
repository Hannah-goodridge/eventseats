'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { Booking } from '../../../../types'
import { Button } from '../../../../components/ui/button'

export default function BookingDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const bookingId = params.id as string

  const [booking, setBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefunding, setIsRefunding] = useState(false)
  const [refundAmount, setRefundAmount] = useState<string>('')
  const [refundMessage, setRefundMessage] = useState<string>('')

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/admin/login')
      return
    }

    if (bookingId) {
      loadBooking()
    }
  }, [status, router, bookingId])

  const loadBooking = async () => {
    setIsLoading(true)
    setRefundMessage('')
    try {
      const response = await fetch(`/api/bookings/${bookingId}`)
      const data = await response.json()

      if (data.success) {
        setBooking(data.data)
        const total = Number(data.data.totalAmount || 0)
        setRefundAmount(total.toFixed(2))
      } else {
        console.error('Failed to load booking:', data.error)
      }
    } catch (error) {
      console.error('Error loading booking:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDateTime = (dateTime: string | Date) => {
    const date = new Date(dateTime)
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800'
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'CHECKED_IN':
        return 'bg-purple-100 text-purple-800'
      case 'REFUNDED':
        return 'bg-gray-200 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const canRefund = () => {
    if (!booking) return false
    return booking.status === 'PAID' || booking.status === 'CONFIRMED'
  }

  const handleRefund = async (partial?: boolean) => {
    if (!booking) return
    setIsRefunding(true)
    setRefundMessage('')

    try {
      const payload: any = { bookingId: booking.id }
      if (partial) {
        const amt = parseFloat(refundAmount)
        if (isNaN(amt) || amt <= 0) {
          setRefundMessage('Enter a valid refund amount > 0')
          setIsRefunding(false)
          return
        }
        payload.amount = amt
      }

      const res = await fetch('/api/admin/refunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!data.success) {
        throw new Error(data.error || 'Refund failed')
      }

      setRefundMessage(`Refund ${data.data.fullRefund ? 'completed (full)' : 'created'}: £${Number(data.data.amount).toFixed(2)}`)
      await loadBooking()
    } catch (err: any) {
      setRefundMessage(err.message || 'Refund failed')
    } finally {
      setIsRefunding(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h1>
          <p className="text-gray-700 mb-4">The requested booking could not be found.</p>
          <Button variant="primary" onClick={() => router.push('/admin/bookings')}>
            Back to Bookings
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
              <p className="text-gray-700">Booking #{booking.bookingNumber}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/admin/bookings')}
              >
                ← Back to Bookings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Booking Overview */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Booking Overview</h2>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
              {booking.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-3">Booking Information</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Booking Number:</dt>
                  <dd className="font-medium text-gray-900">{booking.bookingNumber}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Created:</dt>
                  <dd className="text-gray-900">{formatDateTime(booking.createdAt)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">QR Code:</dt>
                  <dd className="font-mono text-xs text-gray-900">{booking.qrCodeData}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-3">Financial Details</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Subtotal:</dt>
                  <dd className="text-gray-900">£{(booking.totalAmount - booking.bookingFee).toFixed(2)}</dd>
                </div>
                {booking.bookingFee > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Booking Fee:</dt>
                    <dd className="text-gray-900">£{booking.bookingFee.toFixed(2)}</dd>
                  </div>
                )}
                <div className="flex justify-between font-medium text-base pt-2 border-t border-gray-200">
                  <dt className="text-gray-900">Total Amount:</dt>
                  <dd className="text-gray-900">£{booking.totalAmount.toFixed(2)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Payments & Refunds */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Payments & Refunds</h2>
            <span className="text-sm text-gray-600">Admin/Staff only</span>
          </div>

          {refundMessage && (
            <div className="mb-4 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded p-3">{refundMessage}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Refund amount (optional)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--highlight)] focus:border-[var(--highlight)]"
                placeholder="e.g. 10.00"
                disabled={!canRefund() || isRefunding}
              />
              <p className="mt-1 text-xs text-gray-500">Leave as total for full refund, or enter a partial amount.</p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => handleRefund(true)}
                disabled={!canRefund() || isRefunding}
              >
                {isRefunding ? 'Processing...' : 'Refund Amount'}
              </Button>
              <Button
                variant="primary"
                onClick={() => handleRefund(false)}
                disabled={!canRefund() || isRefunding}
              >
                {isRefunding ? 'Processing...' : 'Full Refund'}
              </Button>
            </div>
          </div>

          {!canRefund() && (
            <p className="mt-4 text-sm text-gray-600">Refunds are only available for PAID or CONFIRMED bookings.</p>
          )}
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-3">Contact Details</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Name:</dt>
                  <dd className="font-medium text-gray-900">
                    {booking.customer?.firstName} {booking.customer?.lastName}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Email:</dt>
                  <dd className="text-gray-900">{booking.customer?.email}</dd>
                </div>
                {booking.customer?.phone && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Phone:</dt>
                    <dd className="text-gray-900">{booking.customer.phone}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-3">Preferences</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Email Updates:</dt>
                  <dd className="text-gray-900">
                    {booking.customer?.emailOptIn ? 'Yes' : 'No'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">SMS Updates:</dt>
                  <dd className="text-gray-900">
                    {booking.customer?.smsOptIn ? 'Yes' : 'No'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Show & Performance Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Show & Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-3">Show Information</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Title:</dt>
                  <dd className="font-medium text-gray-900">{booking.show?.title}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-3">Performance Details</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Date & Time:</dt>
                  <dd className="text-gray-900">
                    {booking.performance && formatDateTime(booking.performance.dateTime)}
                  </dd>
                </div>
                {booking.performance?.isMatinee && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Type:</dt>
                    <dd className="text-green-700 font-medium">Matinee Performance</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>

        {/* Seats & Tickets */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Seats & Tickets</h2>
          {booking.bookingItems && booking.bookingItems.length > 0 ? (
            <div className="space-y-3">
              {booking.bookingItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-100 border-2 border-blue-300 rounded-t flex items-center justify-center text-xs font-medium text-blue-800">
                      {item.seat?.number}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Row {item.seat?.row}, Seat {item.seat?.number}
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.ticketType} Ticket
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      £{item.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No seat information available.</p>
          )}
        </div>

        {/* Special Requirements */}
        {(booking.accessibilityRequirements || booking.specialRequests) && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Special Requirements</h2>
            <div className="space-y-4">
              {booking.accessibilityRequirements && (
                <div>
                  <h3 className="text-sm font-medium text-gray-800 mb-2">Accessibility Requirements</h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    {booking.accessibilityRequirements}
                  </p>
                </div>
              )}
              {booking.specialRequests && (
                <div>
                  <h3 className="text-sm font-medium text-gray-800 mb-2">Special Requests</h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    {booking.specialRequests}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
