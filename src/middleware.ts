import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Handle CORS for embed endpoints and API calls
  if (request.nextUrl.pathname.startsWith('/embed') ||
      request.nextUrl.pathname.startsWith('/api')) {

    const response = NextResponse.next()

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    // Additional headers for embed pages
    if (request.nextUrl.pathname.startsWith('/embed')) {
      response.headers.set('X-Frame-Options', 'ALLOWALL')
      response.headers.set('Content-Security-Policy', 'frame-ancestors *;')
    }

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/embed/:path*', '/api/:path*']
}
