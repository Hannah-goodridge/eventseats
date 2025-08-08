# EventSeats software API

This document describes the REST API endpoints for the EventSeats software.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require authentication (will be implemented with NextAuth.js).

## Error Responses
All endpoints return errors in this format:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE" // optional
}
```

## Endpoints

### Shows

#### Get All Shows
```
GET /shows
```

Query Parameters:
- `published` (boolean) - Filter published shows only
- `organizationId` (string) - Filter by organization
- `search` (string) - Search in title, description, genre
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10, max: 100)

Response:
```json
{
  "data": [
    {
      "id": "show_id",
      "title": "Romeo and Juliet",
      "description": "Shakespeare's classic...",
      "adultPrice": 25.00,
      "childPrice": 15.00,
      "concessionPrice": 20.00,
      "performances": [...],
      "organization": {...},
      "venue": {...}
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalCount": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Get Single Show
```
GET /shows/{id}
```

Returns detailed show information including seating layout, performances, and booking statistics.

### Performances

#### Get Performances
```
GET /performances
```

Query Parameters:
- `showId` (string) - Filter by show
- `upcoming` (boolean) - Only future performances
- `from` (ISO date) - Start date filter
- `to` (ISO date) - End date filter
- `includeStats` (boolean) - Include booking statistics

### Seat Availability

#### Get Seat Availability
```
GET /seats/availability
```

Query Parameters:
- `performanceId` (string, required) - Performance to check
- `seatingLayoutId` (string, optional) - Specific layout

Response:
```json
{
  "performanceId": "perf_id",
  "seats": [
    {
      "id": "seat_id",
      "row": "A",
      "number": "1",
      "isAvailable": true,
      "isBooked": false,
      "isAccessible": false
    }
  ],
  "seatsByRow": {
    "A": [...],
    "B": [...]
  },
  "statistics": {
    "totalSeats": 100,
    "availableSeats": 75,
    "bookedSeats": 25,
    "occupancyRate": 25.0
  }
}
```

### Bookings

#### Create Booking
```
POST /bookings
```

Request Body:
```json
{
  "performanceId": "perf_id",
  "customer": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+44 1234 567890",
    "emailOptIn": true,
    "smsOptIn": false
  },
  "seats": [
    {
      "seatId": "seat_id",
      "ticketType": "ADULT",
      "price": 25.00
    }
  ],
  "totalAmount": 25.00,
  "bookingFee": 0.00,
  "accessibilityRequirements": "Optional requirements",
  "specialRequests": "Optional requests"
}
```

Response: Returns the created booking with booking number and QR code.

#### Get Bookings
```
GET /bookings
```

Query Parameters:
- `status` (string) - Filter by booking status
- `performanceId` (string) - Filter by performance
- `showId` (string) - Filter by show
- `customerEmail` (string) - Filter by customer email
- `bookingNumber` (string) - Search by booking number

#### Get Single Booking
```
GET /bookings/{id}
```

#### Update Booking
```
PATCH /bookings/{id}
```

Request Body:
```json
{
  "status": "PAID",
  "stripePaymentIntentId": "pi_...",
  "paidAt": "2024-01-15T10:30:00Z"
}
```

#### Delete Booking
```
DELETE /bookings/{id}
```

Note: Only allowed for PENDING bookings or confirmed bookings more than 24 hours before the performance.

### Admin Statistics

#### Get Dashboard Stats
```
GET /admin/stats
```

Query Parameters:
- `organizationId` (string) - Filter by organization

Response:
```json
{
  "overview": {
    "totalBookings": 150,
    "totalRevenue": 3750.00,
    "upcomingShows": 5,
    "checkedInToday": 12,
    "thisMonthBookings": 23,
    "thisMonthRevenue": 575.00
  },
  "recentBookings": [...],
  "upcomingPerformances": [...],
  "trends": {
    "bookingTrends": [...],
    "ticketTypeDistribution": [...]
  },
  "showStats": [...]
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., seat already booked)
- `500` - Internal Server Error

## Booking Status Flow

```
PENDING → CONFIRMED → PAID → CHECKED_IN
    ↓         ↓        ↓
 CANCELLED CANCELLED REFUNDED
```

## Rate Limiting

- Public endpoints: 100 requests per minute
- Authenticated endpoints: 500 requests per minute
- Admin endpoints: 1000 requests per minute

## Development Notes

To test the API endpoints, you'll need to:

1. Set up a PostgreSQL database
2. Run `npm run db:migrate` to create tables
3. Seed the database with test data
4. Configure environment variables

The API is designed to be stateless and follows REST conventions.
