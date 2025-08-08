// Core types for the Show Bookings System

export interface Seat {
  id: string;
  row: string;
  number: string;
  section?: string;
  isAccessible: boolean;
  isWheelchairSpace: boolean;
  notes?: string;
  seatingLayoutId: string;
}

export interface SeatingLayout {
  id: string;
  name: string;
  description?: string;
  rows: number;
  columns: number;
  layoutData: Record<string, unknown>; // JSON data for the layout
  seats: Seat[];
}

export interface Show {
  id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  genre?: string;
  duration?: number;
  ageRating?: string;
  warnings?: string;
  adultPrice: number;
  childPrice: number;
  concessionPrice: number;
  status: ShowStatus;
  organizationId: string;
  venueId: string;
  seatingLayoutId: string;
  performances: Performance[];
}

export interface Performance {
  id: string;
  dateTime: Date;
  isMatinee: boolean;
  notes?: string;
  capacity?: number;
  showId: string;
  show?: Show;
  bookings: Booking[];
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  emailOptIn: boolean;
  smsOptIn: boolean;
  address?: string;
  city?: string;
  postcode?: string;
  country: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  totalAmount: number;
  bookingFee: number;
  status: BookingStatus;
  stripePaymentIntentId?: string;
  paidAt?: Date;
  customerId: string;
  customer?: Customer;
  showId: string;
  show?: Show;
  performanceId: string;
  performance?: Performance;
  accessibilityRequirements?: string;
  specialRequests?: string;
  checkedInAt?: Date;
  qrCodeData?: string;
  createdAt: string;
  updatedAt: string;
  bookingItems: BookingItem[];
}

export interface BookingItem {
  id: string;
  ticketType: TicketType;
  price: number;
  bookingId: string;
  seatId: string;
  seat?: Seat;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  logoUrl?: string;
  currency: string;
  timezone: string;
  stripeAccountId?: string;
  stripePublishableKey?: string;
}

export interface Venue {
  id: string;
  name: string;
  slug: string;
  description?: string;
  address?: string;
  capacity?: number;
  organizationId: string;
  seatingLayouts: SeatingLayout[];
}

// Enums
export enum ShowStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  CHECKED_IN = 'CHECKED_IN'
}

export enum TicketType {
  ADULT = 'ADULT',
  CHILD = 'CHILD',
  CONCESSION = 'CONCESSION'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  VOLUNTEER = 'VOLUNTEER'
}

// UI State types
export interface SeatSelection {
  seatId: string;
  seat: Seat;
  ticketType: TicketType;
  price: number;
}

export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  emailOptIn: boolean;
  smsOptIn: boolean;
  accessibilityRequirements?: string;
  specialRequests?: string;
}

export interface SeatingLayoutConfig {
  rows: number;
  columns: number;
  seatGaps: { row: number; seat: number }[];
  aisles: { afterRow?: number; afterSeat?: number }[];
  disabledSeats: { row: number; seat: number }[];
  accessibleSeats: { row: number; seat: number }[];
  sections: {
    name: string;
    startRow: number;
    endRow: number;
    startSeat: number;
    endSeat: number;
  }[];
}
