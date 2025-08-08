import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface UpdatePerformanceRequest {
  showId?: string
  dateTime?: string
  isMatinee?: boolean
  notes?: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: performance, error } = await supabase
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
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching performance:', error)

      if (error.code === 'PGRST116') {
        return NextResponse.json({
          success: false,
          error: 'Performance not found'
        }, { status: 404 })
      }

      throw new Error(`Database error: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      data: performance
    })

  } catch (error: any) {
    console.error('Error fetching performance:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch performance'
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body: UpdatePerformanceRequest = await request.json()

    // Build update object (only include provided fields)
    const updateData: any = {}

    if (body.showId !== undefined) updateData.showId = body.showId
    if (body.dateTime !== undefined) updateData.dateTime = body.dateTime
    if (body.isMatinee !== undefined) updateData.isMatinee = body.isMatinee
    if (body.notes !== undefined) updateData.notes = body.notes

    // Add updated timestamp
    updateData.updatedAt = new Date().toISOString()

    // Update the performance
    const { data: performance, error } = await supabase
      .from('performances')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating performance:', error)

      if (error.code === 'PGRST116') {
        return NextResponse.json({
          success: false,
          error: 'Performance not found'
        }, { status: 404 })
      }

      throw new Error(`Database error: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      data: performance
    })

  } catch (error: any) {
    console.error('Error updating performance:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update performance'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if performance has any bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id')
      .eq('performanceId', id)
      .limit(1)

    if (bookingsError) {
      console.error('Error checking bookings:', bookingsError)
      throw new Error(`Database error: ${bookingsError.message}`)
    }

    if (bookings && bookings.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete performance with existing bookings'
      }, { status: 400 })
    }

    // Delete the performance
    const { error } = await supabase
      .from('performances')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting performance:', error)

      if (error.code === 'PGRST116') {
        return NextResponse.json({
          success: false,
          error: 'Performance not found'
        }, { status: 404 })
      }

      throw new Error(`Database error: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Performance deleted successfully'
    })

  } catch (error: any) {
    console.error('Error deleting performance:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete performance'
    }, { status: 500 })
  }
}
