import { http, HttpResponse } from 'msw'

// Sample fixtures
const shows = [
  {
    id: 'show-1',
    title: 'Hamlet',
    slug: 'hamlet',
    description: 'A tragedy by Shakespeare',
    imageUrl: '',
    genre: 'Drama',
    duration: 120,
    ageRating: 'PG',
    adultPrice: 20,
    childPrice: 10,
    concessionPrice: 15,
    status: 'PUBLISHED',
    performances: [
      {
        id: 'perf-1',
        dateTime: new Date(Date.now() + 86400000).toISOString(),
        isMatinee: false,
        notes: '',
      },
    ],
  },
]

const seatsForLayout = {
  layout: {
    id: 'layout-1',
    name: 'Main Hall',
    description: 'Seating layout',
    venueId: 'venue-1',
    organizationId: 'org-1',
  },
  seats: Array.from({ length: 5 }).map((_, i) => ({
    id: `seat-${i + 1}`,
    row: 'A',
    number: i + 1,
    section: 'Stalls',
    isAccessible: false,
    isWheelchairSpace: false,
    notes: null,
    seatingLayoutId: 'layout-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),
}

export const handlers = [
  // Shows
  http.get('/api/shows', () => {
    return HttpResponse.json({ success: true, data: shows })
  }),

  // Seats for layout
  http.get('/api/seats-for-layout/:layoutId', () => {
    return HttpResponse.json({ success: true, data: seatsForLayout })
  }),

  // Booked seats for a performance
  http.get('/api/booked-seats/:performanceId', () => {
    return HttpResponse.json({ success: true, data: { bookedSeatIds: ['seat-1'], bookedSeatDisplays: ['A1'] } })
  }),

  // Admin bookings list
  http.get('/api/bookings', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || '1')
    const limit = Number(url.searchParams.get('limit') || '20')
    const total = 1
    const data = [
      {
        id: 'booking-1',
        bookingNumber: 'B-0001',
        status: 'PAID',
        totalAmount: 40,
        bookingFee: 0,
        accessibilityRequirements: null,
        specialRequests: null,
        createdAt: new Date().toISOString(),
        customers: {
          id: 'cust-1',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
          phone: '123',
        },
        performances: {
          id: 'perf-1',
          dateTime: new Date().toISOString(),
          isMatinee: false,
          shows: {
            id: 'show-1',
            title: 'Hamlet',
          },
        },
        booking_items: [
          {
            id: 'bi-1',
            seatId: 'seat-1',
            ticketType: 'ADULT',
            price: 20,
            seats: { id: 'seat-1', row: 'A', number: 1, section: 'Stalls' },
          },
          {
            id: 'bi-2',
            seatId: 'seat-2',
            ticketType: 'ADULT',
            price: 20,
            seats: { id: 'seat-2', row: 'A', number: 2, section: 'Stalls' },
          },
        ],
      },
    ]
    return HttpResponse.json({ success: true, data, meta: { total, page, limit } })
  }),

  // Create booking
  http.post('/api/bookings', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      success: true,
      data: {
        booking: {
          id: 'booking-1',
          bookingNumber: 'B-0001',
          qrCodeData: 'qr-B-0001',
          createdAt: new Date().toISOString(),
        },
      },
    })
  }),
]


