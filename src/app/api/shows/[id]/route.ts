import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface UpdateShowRequest {
  title?: string
  description?: string
  genre?: string
  duration?: number
  ageRating?: string
  adultPrice?: number
  childPrice?: number
  concessionPrice?: number
  status?: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: show, error } = await supabase
      .from('shows')
      .select(`
        id,
        title,
        slug,
        description,
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
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching show:', error)

      if (error.code === 'PGRST116') {
        return NextResponse.json({
          success: false,
          error: 'Show not found'
        }, { status: 404 })
      }

      throw new Error(`Database error: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      data: show
    })

  } catch (error: any) {
    console.error('Error fetching show:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch show'
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body: UpdateShowRequest = await request.json()

    // Build update object (only include provided fields)
    const updateData: any = {}

    if (body.title !== undefined) {
      updateData.title = body.title
      // Update slug when title changes
      updateData.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }
    if (body.description !== undefined) updateData.description = body.description
    if (body.genre !== undefined) updateData.genre = body.genre
    if (body.duration !== undefined) updateData.duration = body.duration
    if (body.ageRating !== undefined) updateData.ageRating = body.ageRating
    if (body.adultPrice !== undefined) updateData.adultPrice = body.adultPrice
    if (body.childPrice !== undefined) updateData.childPrice = body.childPrice
    if (body.concessionPrice !== undefined) updateData.concessionPrice = body.concessionPrice
    if (body.status !== undefined) updateData.status = body.status

    // Add updated timestamp
    updateData.updatedAt = new Date().toISOString()

    // Update the show
    const { data: show, error } = await supabase
      .from('shows')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating show:', error)

      if (error.code === 'PGRST116') {
        return NextResponse.json({
          success: false,
          error: 'Show not found'
        }, { status: 404 })
      }

      throw new Error(`Database error: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      data: show
    })

  } catch (error: any) {
    console.error('Error updating show:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update show'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if show has any bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id')
      .eq('showId', id)
      .limit(1)

    if (bookingsError) {
      console.error('Error checking bookings:', bookingsError)
      throw new Error(`Database error: ${bookingsError.message}`)
    }

    if (bookings && bookings.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete show with existing bookings'
      }, { status: 400 })
    }

    // Delete the show (performances will be cascade deleted)
    const { error } = await supabase
      .from('shows')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting show:', error)

      if (error.code === 'PGRST116') {
        return NextResponse.json({
          success: false,
          error: 'Show not found'
        }, { status: 404 })
      }

      throw new Error(`Database error: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Show deleted successfully'
    })

  } catch (error: any) {
    console.error('Error deleting show:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete show'
    }, { status: 500 })
  }
}
