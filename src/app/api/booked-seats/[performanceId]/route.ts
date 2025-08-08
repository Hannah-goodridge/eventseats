import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ performanceId: string }> }
) {
  try {
    const { performanceId } = await params

    // Fetch all confirmed bookings for this performance with seat details
    const { data: bookedSeats, error } = await supabase
      .from('booking_items')
      .select(`
        seatId,
        seats (
          id,
          row,
          number,
          section
        ),
        bookings!inner (
          id,
          status,
          performanceId
        )
      `)
      .eq('bookings.performanceId', performanceId)
      .in('bookings.status', ['CONFIRMED', 'PAID', 'CHECKED_IN'])

    if (error) {
      console.error('Error fetching booked seats:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch booked seats'
      }, { status: 500 })
    }

    // Extract seat information
    const bookedSeatData = bookedSeats?.map(item => ({
      seatId: item.seatId,
      seatDisplay: `${(item.seats as any).row}${(item.seats as any).number}`,
      row: (item.seats as any).row,
      number: (item.seats as any).number,
      section: (item.seats as any).section
    })) || []

    // Also return just the seat IDs for easy checking
    const bookedSeatIds = bookedSeatData.map(seat => seat.seatId)
    const bookedSeatDisplays = bookedSeatData.map(seat => seat.seatDisplay)

    return NextResponse.json({
      success: true,
      data: {
        performanceId: performanceId,
        bookedSeats: bookedSeatData,
        bookedSeatIds: bookedSeatIds,
        bookedSeatDisplays: bookedSeatDisplays,
        totalBooked: bookedSeatData.length
      }
    })

  } catch (error: any) {
    console.error('Error fetching booked seats:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch booked seats'
    }, { status: 500 })
  }
}
