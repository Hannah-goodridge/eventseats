import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations (if needed)
export const createServerSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Service role client for trusted server-side operations (webhooks, server pages)
// Falls back to anon in non-prod/test environments if missing
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
export const supabaseService = createClient(supabaseUrl, serviceRoleKey)

export const getServerSupabase = () => {
  // If a service role key is present, prefer it; otherwise fallback to anon for simplicity
  return serviceRoleKey && serviceRoleKey !== supabaseAnonKey
    ? supabaseService
    : supabase
}

// Types for your database
export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          email: string
          phone: string | null
          website: string | null
          address: string | null
          logoUrl: string | null
          currency: string
          timezone: string
          stripeAccountId: string | null
          stripePublishableKey: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          email: string
          phone?: string | null
          website?: string | null
          address?: string | null
          logoUrl?: string | null
          currency?: string
          timezone?: string
          stripeAccountId?: string | null
          stripePublishableKey?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          email?: string
          phone?: string | null
          website?: string | null
          address?: string | null
          logoUrl?: string | null
          currency?: string
          timezone?: string
          stripeAccountId?: string | null
          stripePublishableKey?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
      venues: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          address: string | null
          capacity: number | null
          organizationId: string
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          address?: string | null
          capacity?: number | null
          organizationId: string
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          address?: string | null
          capacity?: number | null
          organizationId?: string
          createdAt?: string
          updatedAt?: string
        }
      }
      shows: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          imageUrl: string | null
          genre: string | null
          duration: number | null
          ageRating: string | null
          warnings: string | null
          adultPrice: number
          childPrice: number
          concessionPrice: number
          status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED'
          organizationId: string
          venueId: string
          seatingLayoutId: string
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          imageUrl?: string | null
          genre?: string | null
          duration?: number | null
          ageRating?: string | null
          warnings?: string | null
          adultPrice: number
          childPrice: number
          concessionPrice: number
          status?: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED'
          organizationId: string
          venueId: string
          seatingLayoutId: string
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          imageUrl?: string | null
          genre?: string | null
          duration?: number | null
          ageRating?: string | null
          warnings?: string | null
          adultPrice?: number
          childPrice?: number
          concessionPrice?: number
          status?: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED'
          organizationId?: string
          venueId?: string
          seatingLayoutId?: string
          createdAt?: string
          updatedAt?: string
        }
      }
      bookings: {
        Row: {
          id: string
          bookingNumber: string
          totalAmount: number
          bookingFee: number
          status: 'PENDING' | 'CONFIRMED' | 'PAID' | 'CANCELLED' | 'REFUNDED' | 'CHECKED_IN'
          stripePaymentIntentId: string | null
          paidAt: string | null
          customerId: string
          showId: string
          performanceId: string
          accessibilityRequirements: string | null
          specialRequests: string | null
          checkedInAt: string | null
          qrCodeData: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          bookingNumber: string
          totalAmount: number
          bookingFee?: number
          status?: 'PENDING' | 'CONFIRMED' | 'PAID' | 'CANCELLED' | 'REFUNDED' | 'CHECKED_IN'
          stripePaymentIntentId?: string | null
          paidAt?: string | null
          customerId: string
          showId: string
          performanceId: string
          accessibilityRequirements?: string | null
          specialRequests?: string | null
          checkedInAt?: string | null
          qrCodeData?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          bookingNumber?: string
          totalAmount?: number
          bookingFee?: number
          status?: 'PENDING' | 'CONFIRMED' | 'PAID' | 'CANCELLED' | 'REFUNDED' | 'CHECKED_IN'
          stripePaymentIntentId?: string | null
          paidAt?: string | null
          customerId?: string
          showId?: string
          performanceId?: string
          accessibilityRequirements?: string | null
          specialRequests?: string | null
          checkedInAt?: string | null
          qrCodeData?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
      // Add other table types as needed
    }
  }
}
