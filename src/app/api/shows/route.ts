import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { randomUUID } from 'crypto'

interface CreateShowRequest {
  title: string
  description?: string
  imageUrl?: string
  genre?: string
  duration?: number
  ageRating?: string
  adultPrice: number
  childPrice: number
  concessionPrice: number
  status: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateShowRequest = await request.json()

    // Validate required fields
    if (!body.title || !body.adultPrice || !body.childPrice || !body.concessionPrice) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: title, adultPrice, childPrice, concessionPrice'
      }, { status: 400 })
    }

    // Generate slug from title
    const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Create the show
    const showId = randomUUID()
    const now = new Date().toISOString()

    const { data: show, error } = await supabase
      .from('shows')
      .insert({
        id: showId,
        title: body.title,
        slug: slug,
        description: body.description || '',
        imageUrl: body.imageUrl || null,
        genre: body.genre || '',
        duration: body.duration || 120,
        ageRating: body.ageRating || 'PG',
        adultPrice: body.adultPrice,
        childPrice: body.childPrice,
        concessionPrice: body.concessionPrice,
        status: body.status || 'DRAFT',
        // Set default IDs for required fields - these should be configurable in a real app
        organizationId: '550e8400-e29b-41d4-a716-446655440000', // Demo org ID
        venueId: 'a550e840-e29b-41d4-a716-446655440000', // Demo venue ID
        seatingLayoutId: '869f0aca-0611-4b8b-bf16-b9356854b35a', // Demo seating layout ID
        createdAt: now,
        updatedAt: now
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating show:', error)
      throw new Error(`Database error: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      data: show
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating show:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create show'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    const organizationId = searchParams.get('organizationId')
    const search = searchParams.get('search')

    // Build query
    let query = supabase
      .from('shows')
      .select(`
        id,
        title,
        slug,
        description,
        imageUrl,
        genre,
        duration,
        ageRating,
        adultPrice,
        childPrice,
        concessionPrice,
        status,
        createdAt,
        updatedAt,
        performances (
          id,
          dateTime,
          isMatinee,
          notes,
          createdAt,
          updatedAt
        )
      `)

    // Apply filters - show is published if status is PUBLISHED
    if (published === 'true') {
      query = query.eq('status', 'PUBLISHED')
    }

    if (organizationId) {
      query = query.eq('organizationId', organizationId)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,genre.ilike.%${search}%`)
    }

    // Order by
    query = query.order('createdAt', { ascending: false })

    const { data: shows, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      throw new Error(`Database error: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      data: shows || [],
      meta: {
        total: shows?.length || 0,
        page: 1,
        limit: 100,
        totalPages: 1
      }
    })

  } catch (error: any) {
    console.error('Error fetching shows:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch shows'
    }, { status: 500 })
  }
}
