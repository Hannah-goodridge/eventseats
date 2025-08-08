'use client'

import React from 'react'
import { formatPrice, formatDateTime } from '../../lib/utils'
import { Booking, Show, Performance } from '../../types'
import { Button } from '../ui/button'

interface DashboardStats {
  totalBookings: number
  totalRevenue: number
  upcomingShows: number
  checkedInToday: number
}



interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-800">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-sm text-gray-700">{subtitle}</p>}
      </div>
      {icon && <div className="text-gray-600">{icon}</div>}
    </div>
  </div>
)

interface BookingTableProps {
  bookings: Booking[]
  onViewBooking: (bookingId: string) => void
}

const RecentBookingsTable: React.FC<BookingTableProps> = ({ bookings, onViewBooking }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
    </div>
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
              Show
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
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {booking.bookingNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {booking.customer?.firstName} {booking.customer?.lastName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {booking.show?.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatPrice(booking.totalAmount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  booking.status === 'PAID'
                    ? 'bg-green-100 text-green-800'
                    : booking.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : booking.status === 'CANCELLED'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {booking.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewBooking(booking.id)}
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

interface PerformanceTableProps {
  performances: Performance[]
  onViewPerformance: (performanceId: string) => void
}

const UpcomingPerformancesTable: React.FC<PerformanceTableProps> = ({ performances, onViewPerformance }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">Upcoming Performances</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Show
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Date & Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Bookings
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Revenue
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {performances.map((performance) => {
            const bookingCount = performance.bookings?.length || 0
            const revenue = performance.bookings?.reduce((sum, booking) => sum + booking.totalAmount, 0) || 0

            return (
              <tr key={performance.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {performance.show?.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDateTime(performance.dateTime)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {bookingCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatPrice(revenue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewPerformance(performance.id)}
                  >
                    Manage
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  </div>
)

interface AdminDashboardProps {
  stats: DashboardStats
  recentBookings: Booking[]
  upcomingPerformances: Performance[]
  onViewBooking?: (bookingId: string) => void
  onViewPerformance?: (performanceId: string) => void
  className?: string
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  recentBookings,
  upcomingPerformances,
  onViewBooking,
  onViewPerformance,
  className
}) => {
  const handleViewBooking = (bookingId: string) => {
    if (onViewBooking) {
      onViewBooking(bookingId)
    } else {
      window.location.href = `/admin/bookings/${bookingId}`
    }
  }

  const handleViewPerformance = (performanceId: string) => {
    if (onViewPerformance) {
      onViewPerformance(performanceId)
    } else {
      window.location.href = `/admin/shows?performance=${performanceId}`
    }
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-700">Overview of your booking system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Bookings"
          value={stats.totalBookings}
          subtitle="All time"
        />
        <StatsCard
          title="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          subtitle="All time"
        />
        <StatsCard
          title="Upcoming Shows"
          value={stats.upcomingShows}
          subtitle="Next 30 days"
        />
        <StatsCard
          title="Checked In Today"
          value={stats.checkedInToday}
          subtitle="Today's performances"
        />
      </div>

      {/* Tables */}
      <div className="space-y-8">
        <RecentBookingsTable
          bookings={recentBookings}
          onViewBooking={handleViewBooking}
        />

        <UpcomingPerformancesTable
          performances={upcomingPerformances}
          onViewPerformance={handleViewPerformance}
        />
      </div>
    </div>
  )
}
