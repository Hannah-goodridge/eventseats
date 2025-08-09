'use client'

import React from 'react'
import Link from 'next/link'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white border border-red-200 rounded-lg shadow p-6 text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-.01-10a9 9 0 110 18 9 9 0 010-18z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-700 mb-4">{error?.message || 'An unexpected error occurred.'}</p>
            {error?.digest && (
              <p className="text-xs text-gray-500 mb-4">Reference: {error.digest}</p>
            )}
            <div className="flex gap-3 justify-center">
              <button onClick={reset} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Try again</button>
              <Link href="/" className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 text-gray-800">Back to home</Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}


