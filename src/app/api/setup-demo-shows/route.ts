import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { randomUUID } from 'crypto'

export async function POST(_request: NextRequest) {
  try {
    // Create demo shows and performances
    const demoShows = [
      {
        id: randomUUID(),
        title: "A Midsummer Night's Dream",
        slug: "midsummer-nights-dream",
        description: "Shakespeare's enchanting comedy about love, magic, and mistaken identities in an Athenian forest.",
        genre: "Comedy",
        duration: 150,
        ageRating: "PG",
        adultPrice: 18.00,
        childPrice: 12.00,
        concessionPrice: 15.00,
        status: 'PUBLISHED',
        organizationId: '550e8400-e29b-41d4-a716-446655440000',
        venueId: 'a550e840-e29b-41d4-a716-446655440000',
        seatingLayoutId: '869f0aca-0611-4b8b-bf16-b9356854b35a',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    const { data: shows, error: showsError } = await supabase
      .from('shows')
      .upsert(demoShows, { onConflict: 'slug' })
      .select()

    if (showsError) {
      throw new Error(`Failed to create demo shows: ${showsError.message}`)
    }

    return NextResponse.json({
      success: true,
      data: { shows },
      message: 'Demo shows created successfully'
    })

  } catch (error: unknown) {
    console.error('Error setting up demo shows:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to setup demo shows'
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 })
  }
}
