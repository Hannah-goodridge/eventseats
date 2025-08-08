import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { width: string; height: string } }
) {
  try {
    const width = parseInt(params.width) || 400
    const height = parseInt(params.height) || 300

    // Create an SVG placeholder image
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <g transform="translate(${width/2}, ${height/2})">
          <circle cx="0" cy="-20" r="8" fill="#9ca3af" opacity="0.6"/>
          <rect x="-30" y="-5" width="60" height="4" rx="2" fill="#9ca3af" opacity="0.6"/>
          <rect x="-25" y="5" width="50" height="3" rx="1.5" fill="#9ca3af" opacity="0.4"/>
          <rect x="-20" y="12" width="40" height="3" rx="1.5" fill="#9ca3af" opacity="0.4"/>
          <text x="0" y="35" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#6b7280">
            Show Image
          </text>
        </g>
      </svg>
    `

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error generating placeholder image:', error)
    return new NextResponse('Error generating placeholder', { status: 500 })
  }
}
