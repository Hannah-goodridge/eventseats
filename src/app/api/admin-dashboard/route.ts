import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    // Verify user is admin
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('role, organizationId')
      .eq('email', session.user.email)
      .single()

    if (userError || !user || user.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        error: 'Insufficient permissions'
      }, { status: 403 })
    }
    // Fetch all bookings with customer and performance details
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        id,
        bookingNumber,
        status,
        totalAmount,
        bookingFee,
        createdAt,
        customers (
          id,
          firstName,
          lastName,
          email,
          phone
        ),
        performances (
          id,
          dateTime,
          isMatinee,
          shows (
            id,
            title
          )
        )
      `)
      .order('createdAt', { ascending: false })

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError)
      throw new Error(`Failed to fetch bookings: ${bookingsError.message}`)
    }

    // Fetch all shows with performances
    const { data: shows, error: showsError } = await supabase
      .from('shows')
      .select(`
        id,
        title,
        status,
        performances (
          id,
          dateTime,
          isMatinee,
          notes
        )
      `)
      .order('createdAt', { ascending: false })

    if (showsError) {
      console.error('Error fetching shows:', showsError)
      throw new Error(`Failed to fetch shows: ${showsError.message}`)
    }

    // Calculate stats
    const totalBookings = bookings?.length || 0
    const totalRevenue = bookings?.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0) || 0
    const upcomingShows = shows?.filter(show => show.status === 'PUBLISHED').length || 0
    const checkedInToday = bookings?.filter(booking => booking.status === 'CHECKED_IN').length || 0

    // Get upcoming performances with booking data
    const allPerformances = shows?.flatMap(show =>
      show.performances?.map(perf => ({
        id: perf.id,
        dateTime: perf.dateTime,
        isMatinee: perf.isMatinee,
        notes: perf.notes,
        show: {
          id: show.id,
          title: show.title
        },
        // Add booking data for this performance
        bookings: bookings?.filter(booking =>
          booking.performances?.id === perf.id
        ).map(booking => ({
          id: booking.id,
          totalAmount: booking.totalAmount,
          status: booking.status,
          createdAt: booking.createdAt
        })) || []
      })) || []
    ) || []

    // Filter to only future performances and sort by date
    const upcomingPerformances = allPerformances
      .filter(perf => new Date(perf.dateTime) > new Date())
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
      .slice(0, 5)

    // Recent bookings (last 10)
    const recentBookings = bookings?.slice(0, 10).map(booking => ({
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      totalAmount: booking.totalAmount,
      bookingFee: booking.bookingFee,
      status: booking.status,
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
      } : null
    })) || []

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalBookings,
          totalRevenue,
          upcomingShows,
          checkedInToday
        },
        recentBookings,
        upcomingPerformances
      }
    })

  } catch (error: any) {
    console.error('Error fetching admin dashboard data:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch dashboard data'
    }, { status: 500 })
  }
}
