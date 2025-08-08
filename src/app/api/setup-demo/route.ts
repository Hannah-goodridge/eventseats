import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { randomUUID } from 'crypto'
import * as bcrypt from 'bcryptjs'

export async function POST(_request: NextRequest) {
  try {
    console.log('🎪 Setting up EventSeats demo data...')

    // Check if demo user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'admin@democentre.org')
      .single()

    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: 'Demo user already exists',
        credentials: {
          email: 'admin@democentre.org',
          password: 'demo123'
        }
      })
    }

    // Create demo organization
    const organizationId = randomUUID()
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .upsert({
        id: organizationId,
        name: 'Demo Community Centre',
        slug: 'demo-community-centre',
        description: 'A community venue for local events and performances',
        email: 'info@democentre.org',
        phone: '+44 1234 567890',
        address: '123 Community Street',
        city: 'Demo City',
        postcode: 'DC1 2AB',
        country: 'United Kingdom',
        website: 'https://democentre.org',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { onConflict: 'id' })
      .select()
      .single()

    if (orgError) {
      console.error('Error creating organization:', orgError)
      throw new Error(`Failed to create organization: ${orgError.message}`)
    }

    // Create demo venue
    const venueId = randomUUID()
    const { data: venue, error: venueError } = await supabase
      .from('venues')
      .upsert({
        id: venueId,
        name: 'Main Hall',
        address: '123 Community Street',
        city: 'Demo City',
        postcode: 'DC1 2AB',
        country: 'United Kingdom',
        phone: '+44 1234 567890',
        email: 'info@democentre.org',
        website: 'https://democentre.org',
        capacity: 100,
        organizationId: organizationId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { onConflict: 'id' })
      .select()
      .single()

    if (venueError) {
      console.error('Error creating venue:', venueError)
      throw new Error(`Failed to create venue: ${venueError.message}`)
    }

    // Create seating layout
    const seatingLayoutId = randomUUID()
    const { data: seatingLayout, error: layoutError } = await supabase
      .from('seating_layouts')
      .upsert({
        id: seatingLayoutId,
        name: 'Main Hall Layout',
        description: 'Standard theatre seating with 5 rows of 10 seats',
        rows: 5,
        columns: 10,
        layoutData: { type: 'standard' },
        venueId: venueId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { onConflict: 'id' })
      .select()
      .single()

    if (layoutError) {
      console.error('Error creating seating layout:', layoutError)
      throw new Error(`Failed to create seating layout: ${layoutError.message}`)
    }

    // Create seats
    const seats = []
    for (let row = 1; row <= 5; row++) {
      for (let seat = 1; seat <= 10; seat++) {
        seats.push({
          id: randomUUID(),
          row: row,
          number: seat,
          section: 'Main',
          seatingLayoutId: seatingLayoutId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
    }

    const { error: seatsError } = await supabase
      .from('seats')
      .upsert(seats, { onConflict: 'id' })

    if (seatsError) {
      console.error('Error creating seats:', seatsError)
      throw new Error(`Failed to create seats: ${seatsError.message}`)
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('demo123', 12)
    const userId = randomUUID()

    const { data: adminUser, error: userError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email: 'admin@democentre.org',
        hashedPassword: hashedPassword,
        name: 'Demo Admin',
        role: 'ADMIN',
        organizationId: organizationId,
        emailVerified: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { onConflict: 'email' })
      .select()
      .single()

    if (userError) {
      console.error('Error creating admin user:', userError)
      throw new Error(`Failed to create admin user: ${userError.message}`)
    }

    console.log('✅ Demo setup completed successfully!')

    return NextResponse.json({
      success: true,
      message: 'Demo data created successfully',
      credentials: {
        email: 'admin@democentre.org',
        password: 'demo123'
      },
      data: {
        organization,
        venue,
        seatingLayout,
        adminUser: { id: adminUser.id, email: adminUser.email, name: adminUser.name }
      }
    })

  } catch (error: unknown) {
    console.error('❌ Error setting up demo data:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to setup demo data'
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 })
  }
}
