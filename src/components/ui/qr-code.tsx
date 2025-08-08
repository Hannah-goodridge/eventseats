'use client'

import React from 'react'

interface QRCodeProps {
  value: string
  size?: number
  className?: string
}

export const QRCode: React.FC<QRCodeProps> = ({
  value,
  size = 200,
  className = ''
}) => {
  // For now, we'll create a visual QR code placeholder
  // In a real implementation, you would use a library like 'qrcode' or 'qr-code-generator'
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`

  return (
    <div className={`inline-block ${className}`}>
      <img
        src={qrCodeUrl}
        alt="QR Code"
        width={size}
        height={size}
        className="border border-gray-200 rounded"
        onError={(e) => {
          // Fallback to a placeholder if the QR service fails
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          const fallback = target.nextElementSibling as HTMLElement
          if (fallback) {
            fallback.classList.remove('hidden')
            fallback.classList.add('flex')
          }
        }}
      />
      <div className="hidden bg-gray-100 border border-gray-200 rounded items-center justify-center" style={{width: size, height: size}}>
        <div className="text-center p-4">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h2M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          <p className="text-xs text-gray-600">QR Code</p>
        </div>
      </div>
    </div>
  )
}

// Helper function to generate wallet pass data
export const generateWalletPassData = (bookingData: {
  bookingNumber: string
  showTitle: string
  performanceDate: string
  venue: string
  seats: string[]
  customerName: string
}) => {
  // This would generate Apple Wallet or Google Pay pass data
  // For now, return a JSON structure that could be used for wallet integration
  return {
    formatVersion: 1,
    passTypeIdentifier: 'pass.com.demo-theatre.ticket',
    serialNumber: bookingData.bookingNumber,
    teamIdentifier: 'DEMO123',
    organizationName: 'Demo Theatre',
    description: `${bookingData.showTitle} - Theatre Ticket`,
    logoText: 'Demo Theatre',
    foregroundColor: 'rgb(255, 255, 255)',
    backgroundColor: 'rgb(30, 58, 138)',
    eventTicket: {
      primaryFields: [
        {
          key: 'event',
          label: 'Event',
          value: bookingData.showTitle
        }
      ],
      secondaryFields: [
        {
          key: 'date',
          label: 'Date',
          value: bookingData.performanceDate
        },
        {
          key: 'venue',
          label: 'Venue',
          value: bookingData.venue
        }
      ],
      auxiliaryFields: [
        {
          key: 'seats',
          label: 'Seats',
          value: bookingData.seats.join(', ')
        },
        {
          key: 'customer',
          label: 'Customer',
          value: bookingData.customerName
        }
      ],
      backFields: [
        {
          key: 'booking',
          label: 'Booking Number',
          value: bookingData.bookingNumber
        },
        {
          key: 'terms',
          label: 'Terms and Conditions',
          value: 'Please arrive 15 minutes before the performance. Late arrivals may not be admitted until a suitable break.'
        }
      ]
    },
    barcode: {
      message: bookingData.bookingNumber,
      format: 'PKBarcodeFormatQR',
      messageEncoding: 'iso-8859-1'
    }
  }
}
