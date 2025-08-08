import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(_request: NextRequest) {
  try {
    // Check if demo data exists
    const { data: organizations, error } = await supabase
      .from('organizations')
      .select('id, name')
      .limit(1)

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      hasData: organizations && organizations.length > 0,
      data: organizations
    })

  } catch (error: unknown) {
    console.error('Error checking demo data:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to check demo data'
    }, { status: 500 })
  }
}
