import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(_request: NextRequest) {
  try {
    // Try to fetch venue settings from database first
    const { data: venueSettings, error: venueError } = await supabase
      .from('venues')
      .select('*')
      .limit(1)
      .single()

    if (venueError && venueError.code !== 'PGRST116') {
      console.error('Error fetching venue settings:', venueError)
    }

    // Return settings with database override if available
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
        siteName: venueSettings?.name ? `${venueSettings.name} Booking System` : 'Demo Theatre Booking System',
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { venue, system, external } = body

    // Update venue settings
    if (venue) {
      const { data: existingVenue } = await supabase
        .from('venues')
        .select('id')
        .limit(1)
        .single()

      if (existingVenue) {
        // Update existing venue
        const { error: updateError } = await supabase
          .from('venues')
          .update({
            name: venue.name,
            address: venue.address,
            city: venue.city,
            postcode: venue.postcode,
            phone: venue.phone,
            email: venue.email,
            website: venue.website,
            updatedAt: new Date().toISOString()
          })
          .eq('id', existingVenue.id)

        if (updateError) {
          console.error('Error updating venue:', updateError)
          throw new Error('Failed to update venue settings')
        }
      } else {
        // Create new venue (this shouldn't happen in normal flow)
        const { error: insertError } = await supabase
          .from('venues')
          .insert({
            id: crypto.randomUUID(),
            name: venue.name,
            slug: venue.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            address: venue.address,
            city: venue.city,
            postcode: venue.postcode,
            phone: venue.phone,
            email: venue.email,
            website: venue.website,
            capacity: 100,
            organizationId: '550e8400-e29b-41d4-a716-446655440000', // Demo org ID
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })

        if (insertError) {
          console.error('Error creating venue:', insertError)
          throw new Error('Failed to create venue settings')
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully'
    })

  } catch (error: unknown) {
    console.error('Error saving settings:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to save settings'
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 })
  }
}
