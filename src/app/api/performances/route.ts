import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { randomUUID } from 'crypto'

interface CreatePerformanceRequest {
  showId: string
  dateTime: string
  isMatinee: boolean
  notes?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePerformanceRequest = await request.json()

    // Validate required fields
    if (!body.showId || !body.dateTime) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: showId, dateTime'
      }, { status: 400 })
    }

    // Validate that the show exists
    const { data: show, error: showError } = await supabase
      .from('shows')
      .select('id')
      .eq('id', body.showId)
      .single()

    if (showError || !show) {
      return NextResponse.json({
        success: false,
        error: 'Show not found'
      }, { status: 404 })
    }

    // Create the performance
    const performanceId = randomUUID()
    const now = new Date().toISOString()

    const { data: performance, error } = await supabase
      .from('performances')
      .insert({
        id: performanceId,
        showId: body.showId,
        dateTime: body.dateTime,
        isMatinee: body.isMatinee || false,
        notes: body.notes || '',
        createdAt: now,
        updatedAt: now
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating performance:', error)
      throw new Error(`Database error: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      data: performance
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating performance:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create performance'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const showId = searchParams.get('showId')
    const upcoming = searchParams.get('upcoming')

    let query = supabase
      .from('performances')
      .select(`
        id,
        showId,
        dateTime,
        isMatinee,
        notes,
        createdAt,
        updatedAt,
        shows (
          id,
          title,
          status
        )
      `)

    // Apply filters
    if (showId) {
      query = query.eq('showId', showId)
    }

    if (upcoming === 'true') {
      query = query.gte('dateTime', new Date().toISOString())
    }

    // Order by date
    query = query.order('dateTime', { ascending: true })

    const { data: performances, error } = await query

    if (error) {
      console.error('Error fetching performances:', error)
      throw new Error(`Database error: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      data: performances || [],
      meta: {
        total: performances?.length || 0
      }
    })

  } catch (error: any) {
    console.error('Error fetching performances:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch performances'
    }, { status: 500 })
  }
}
