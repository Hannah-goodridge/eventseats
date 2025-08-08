import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(_request: NextRequest) {
  try {
    // Try to fetch settings from database first
    const { data: venueSettings, error: venueError } = await supabase
      .from('venues')
      .select('*')
      .limit(1)
      .single()

    // For now, return default settings with database override if available
    const settings = {
      venue: {
        name: venueSettings?.name || 'Demo Theatre',
        address: venueSettings?.address || '123 Theatre Street',
        city: venueSettings?.city || 'Demo City',
        postcode: venueSettings?.postcode || 'DC1 2AB',
        phone: venueSettings?.phone || '+44 1234 567890',
        email: venueSettings?.email || 'info@demo-theatre.com',
        website: venueSettings?.website || 'https://demo-theatre.com'
      },
      system: {
        siteName: 'Demo Theatre Booking System',
        siteDescription: 'Book tickets for amazing performances',
        tagline: 'Community Drama Group'
      },
      external: {
        aboutUsUrl: '',
        contactUrl: '',
        facebookUrl: '',
        twitterUrl: '',
        instagramUrl: '',
        privacyPolicyUrl: '',
        termsOfServiceUrl: ''
      }
    }

    return NextResponse.json({
      success: true,
      data: settings
    })

  } catch (error: unknown) {
    console.error('Error fetching settings:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch settings'
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 })
  }
}
