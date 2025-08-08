import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Fetch the specific booking with all related data
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        id,
        bookingNumber,
        status,
        totalAmount,
        bookingFee,
        accessibilityRequirements,
        specialRequests,
        qrCodeData,
        createdAt,
        updatedAt,
        customers (
          id,
          firstName,
          lastName,
          email,
          phone,
          emailOptIn,
          smsOptIn,
          address,
          city,
          postcode,
          country
        ),
        performances (
          id,
          dateTime,
          isMatinee,
          notes,
          shows (
            id,
            title,
            description,
            genre,
            duration,
            ageRating,
            adultPrice,
            childPrice,
            concessionPrice,
            venues (
              id,
              name,
              address,
              phone,
              email
            )
          )
        ),
        booking_items (
          id,
          seatId,
          ticketType,
          price,
          seats (
            id,
            row,
            number,
            section,
            isAccessible,
            isWheelchairSpace,
            notes
          )
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching booking:', error)

      if (error.code === 'PGRST116') {
        return NextResponse.json({
          success: false,
          error: 'Booking not found'
        }, { status: 404 })
      }

      throw new Error(`Database error: ${error.message}`)
    }

    if (!booking) {
      return NextResponse.json({
        success: false,
        error: 'Booking not found'
      }, { status: 404 })
    }

    // Transform the data to match the expected format
    const transformedBooking = {
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      status: booking.status,
      totalAmount: booking.totalAmount,
      bookingFee: booking.bookingFee,
      accessibilityRequirements: booking.accessibilityRequirements,
      specialRequests: booking.specialRequests,
      qrCodeData: booking.qrCodeData,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      customer: booking.customers ? {
        id: booking.customers.id,
        firstName: booking.customers.firstName,
        lastName: booking.customers.lastName,
        email: booking.customers.email,
        phone: booking.customers.phone,
        emailOptIn: booking.customers.emailOptIn,
        smsOptIn: booking.customers.smsOptIn,
        address: booking.customers.address,
        city: booking.customers.city,
        postcode: booking.customers.postcode,
        country: booking.customers.country
      } : null,
      show: booking.performances?.shows ? {
        id: booking.performances.shows.id,
        title: booking.performances.shows.title,
        description: booking.performances.shows.description,
        genre: booking.performances.shows.genre,
        duration: booking.performances.shows.duration,
        ageRating: booking.performances.shows.ageRating,
        adultPrice: booking.performances.shows.adultPrice,
        childPrice: booking.performances.shows.childPrice,
        concessionPrice: booking.performances.shows.concessionPrice,
        venue: booking.performances.shows.venues ? {
          id: booking.performances.shows.venues.id,
          name: booking.performances.shows.venues.name,
          address: booking.performances.shows.venues.address,
          phone: booking.performances.shows.venues.phone,
          email: booking.performances.shows.venues.email
        } : null
      } : null,
      performance: booking.performances ? {
        id: booking.performances.id,
        dateTime: booking.performances.dateTime,
        isMatinee: booking.performances.isMatinee,
        notes: booking.performances.notes
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
          section: item.seats.section,
          isAccessible: item.seats.isAccessible,
          isWheelchairSpace: item.seats.isWheelchairSpace,
          notes: item.seats.notes
        } : null
      })) : []
    }

    return NextResponse.json({
      success: true,
      data: transformedBooking
    })

  } catch (error: any) {
    console.error('Error fetching booking:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch booking'
    }, { status: 500 })
  }
}
