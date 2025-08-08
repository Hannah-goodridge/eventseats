'use client'

import React, { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AdminDashboard } from '../../components/admin/admin-dashboard'
import { Button } from '../../components/ui/button'
import { Booking, Performance } from '../../types'

interface DashboardStats {
  totalBookings: number
  totalRevenue: number
  upcomingShows: number
  checkedInToday: number
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    upcomingShows: 0,
    checkedInToday: 0
  })
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [upcomingPerformances, setUpcomingPerformances] = useState<Performance[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (status === 'unauthenticated') {
      router.push('/admin/login')
      return
    }

    // Load dashboard data
    loadDashboardData()
  }, [status, router])

    const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Fetch comprehensive admin dashboard data
      const dashboardResponse = await fetch('/api/admin-dashboard')
      const dashboardData = await dashboardResponse.json()

      if (dashboardData.success) {
        // Set stats from the response
        setStats(dashboardData.data.stats)

        // Set recent bookings with proper formatting
        setRecentBookings(dashboardData.data.recentBookings.map((booking: any) => ({
          id: booking.id,
          bookingNumber: booking.bookingNumber,
          totalAmount: booking.totalAmount,
          bookingFee: booking.bookingFee,
          status: booking.status,
          customerId: booking.customer?.id || '',
          customer: booking.customer ? {
            id: booking.customer.id,
            firstName: booking.customer.firstName,
            lastName: booking.customer.lastName,
            email: booking.customer.email,
            phone: booking.customer.phone,
            emailOptIn: true,
            smsOptIn: false,
            country: 'GB',
            createdAt: new Date(),
            updatedAt: new Date(),
            bookings: []
          } : null,
          showId: booking.show?.id || '',
          show: booking.show ? {
            id: booking.show.id,
            title: booking.show.title,
            slug: '',
            adultPrice: 25,
            childPrice: 15,
            concessionPrice: 20,
            status: 'PUBLISHED',
            organizationId: '',
            venueId: '',
            seatingLayoutId: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            performances: []
          } : null,
          performanceId: booking.performance?.id || '',
          createdAt: new Date(booking.createdAt),
          updatedAt: new Date(booking.createdAt),
          bookingItems: []
        })))

        // Set upcoming performances with booking data
        setUpcomingPerformances(dashboardData.data.upcomingPerformances.map((perf: any) => ({
          id: perf.id,
          dateTime: new Date(perf.dateTime),
          isMatinee: perf.isMatinee,
          notes: perf.notes,
          showId: perf.show.id,
          show: {
            id: perf.show.id,
            title: perf.show.title
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          bookings: perf.bookings || []
        })))

        console.log('📊 Dashboard data loaded:', {
          stats: dashboardData.data.stats,
          recentBookings: dashboardData.data.recentBookings.length,
          upcomingPerformances: dashboardData.data.upcomingPerformances.length
        })
      } else {
        console.error('Failed to fetch dashboard data:', dashboardData.error)
        // Fallback to empty data
        setStats({
          totalBookings: 0,
          totalRevenue: 0,
          upcomingShows: 0,
          checkedInToday: 0
        })
        setRecentBookings([])
        setUpcomingPerformances([])
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setStats({
        totalBookings: 0,
        totalRevenue: 0,
        upcomingShows: 0,
        checkedInToday: 0
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewBooking = (bookingId: string) => {
    router.push(`/admin/bookings/${bookingId}`)
  }

  const handleViewPerformance = (performanceId: string) => {
    router.push(`/admin/shows?performance=${performanceId}`)
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/admin/login')
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null // Redirecting...
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              {session?.user?.organization && (
                <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {session.user.organization.name}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {session?.user?.name || session?.user?.email}
              </span>
              <Button
                variant="outline"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a href="/admin" className="py-3 px-1 border-b-2 border-blue-500 text-sm font-medium text-blue-600">
              Dashboard
            </a>
            <a href="/admin/shows" className="py-3 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700">
              Shows
            </a>
            <a href="/admin/bookings" className="py-3 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700">
              Bookings
            </a>
            <a href="/admin/customers" className="py-3 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700">
              Customers
            </a>
            <a href="/admin/settings" className="py-3 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700">
              Settings
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminDashboard
          stats={stats}
          recentBookings={recentBookings}
          upcomingPerformances={upcomingPerformances}
          onViewBooking={handleViewBooking}
          onViewPerformance={handleViewPerformance}
        />
      </main>
    </div>
  )
}