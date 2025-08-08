'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Booking } from '../../../types'
import { Button } from '../../../components/ui/button'

interface BookingFilters {
  status?: string
  showId?: string
  performanceId?: string
  customerEmail?: string
  bookingNumber?: string
}

export default function AdminBookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<BookingFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/admin/login')
      return
    }

    loadBookings()
  }, [status, router, currentPage, filters])

  const loadBookings = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value && value.trim() !== '')
        )
      })

      const response = await fetch(`/api/bookings?${params}`)
      const data = await response.json()

      if (data.success) {
        // Transform the data to match the expected format
        const transformedBookings = data.data.map((booking: any) => ({
          id: booking.id,
          bookingNumber: booking.bookingNumber,
          status: booking.status,
          totalAmount: booking.totalAmount,
          bookingFee: booking.bookingFee,
          accessibilityRequirements: booking.accessibilityRequirements,
          specialRequests: booking.specialRequests,
          createdAt: booking.createdAt,
          customer: booking.customers ? {
            id: booking.customers.id,
            firstName: booking.customers.firstName,
            lastName: booking.customers.lastName,
            email: booking.customers.email,
            phone: booking.customers.phone
          } : null,
          show: booking.performances?.shows ? {
            id: booking.performances.shows.id,
            title: booking.performances.shows.title
          } : null,
          performance: booking.performances ? {
            id: booking.performances.id,
            dateTime: booking.performances.dateTime,
            isMatinee: booking.performances.isMatinee
          } : null,
          bookingItems: booking.booking_items ? booking.booking_items.map((item: any) => ({
            id: item.id,
            seatId: item.seatId,
            ticketType: item.ticketType,
            price: item.price,
            seat: item.seats ? {
              id: item.seats.id,
              row: item.seats.row,
              number: item.seats.number,
              section: item.seats.section
            } : null
          })) : []
        }))

        setBookings(transformedBookings)
        setTotalPages(Math.ceil((data.meta?.total || transformedBookings.length) / 20))
      } else {
        console.error('Failed to load bookings:', data.error)
      }
    } catch (error) {
      console.error('Error loading bookings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      // TODO: Implement status update API call
      console.log('Update booking status:', bookingId, newStatus)
      // Reload bookings after update
      loadBookings()
    } catch (error) {
      console.error('Error updating booking status:', error)
    }
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
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDateTime = (dateTime: string | Date) => {
    const date = new Date(dateTime)
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
              <p className="text-gray-700">Manage and track all booking orders</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/admin')}
              >
                ← Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a href="/admin" className="py-3 px-1 border-b-2 border-transparent text-sm font-medium text-gray-700 hover:text-gray-800">
              Dashboard
            </a>
            <a href="/admin/bookings" className="py-3 px-1 border-b-2 border-blue-500 text-sm font-medium text-blue-600">
              Bookings
            </a>
            <a href="/admin/shows" className="py-3 px-1 border-b-2 border-transparent text-sm font-medium text-gray-700 hover:text-gray-800">
              Shows
            </a>
            <a href="/admin/customers" className="py-3 px-1 border-b-2 border-transparent text-sm font-medium text-gray-700 hover:text-gray-800">
              Customers
            </a>
            <a href="/admin/settings" className="py-3 px-1 border-b-2 border-transparent text-sm font-medium text-gray-700 hover:text-gray-800">
              Settings
            </a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Bookings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-800 mb-1">
                Status
              </label>
              <select
                id="status"
                value={filters.status || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PAID">Paid</option>
                <option value="CHECKED_IN">Checked In</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label htmlFor="bookingNumber" className="block text-sm font-medium text-gray-800 mb-1">
                Booking Number
              </label>
              <input
                type="text"
                id="bookingNumber"
                value={filters.bookingNumber || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, bookingNumber: e.target.value }))}
                placeholder="Search booking number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-800 mb-1">
                Customer Email
              </label>
              <input
                type="email"
                id="customerEmail"
                value={filters.customerEmail || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, customerEmail: e.target.value }))}
                placeholder="Search by email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-800 mb-1">Actions</label>
              <div className="flex gap-2">
                <Button variant="primary" size="sm" onClick={loadBookings}>
                  Search
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilters({})
                    setCurrentPage(1)
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Bookings ({bookings.length} of {totalPages > 1 ? 'many' : bookings.length})
            </h3>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No bookings found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Booking
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Show & Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Seats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.bookingNumber}
                          </div>
                          <div className="text-xs text-gray-600">
                            {formatDateTime(booking.createdAt)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.customer?.firstName} {booking.customer?.lastName}
                          </div>
                          <div className="text-xs text-gray-600">
                            {booking.customer?.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.show?.title}
                          </div>
                          <div className="text-xs text-gray-600">
                            {booking.performance && formatDateTime(booking.performance.dateTime)}
                            {booking.performance?.isMatinee && <span className="ml-1 text-green-600">(Matinee)</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {booking.bookingItems?.map(item =>
                            `${item.seat?.row}${item.seat?.number}`
                          ).join(', ') || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-600">
                          {booking.bookingItems?.length || 0} seat{(booking.bookingItems?.length || 0) !== 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          £{booking.totalAmount.toFixed(2)}
                        </div>
                        {booking.bookingFee > 0 && (
                          <div className="text-xs text-gray-600">
                            inc. £{booking.bookingFee.toFixed(2)} fee
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/bookings/${booking.id}`)}
                          >
                            View
                          </Button>
                          {booking.status === 'PENDING' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                            >
                              Confirm
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
