'use client'

import React, { useEffect, useState } from 'react'
import { ShowListing } from '../components/ui/show-listing'
import { Show, ShowStatus } from '../types'

interface ApiShow {
  id: string
  title: string
  slug: string
  description?: string
  genre?: string
  duration?: number
  ageRating?: string
  adultPrice: number
  childPrice: number
  concessionPrice: number
  status: string
  performances: {
    id: string
    dateTime: string
    isMatinee: boolean
    notes?: string
  }[]
}

// Converting API shows to the Show interface format
const convertApiShowToShow = (apiShow: ApiShow): Show => ({
  id: apiShow.id,
  title: apiShow.title,
  slug: apiShow.slug,
  description: apiShow.description || '',
  imageUrl: '/api/placeholder/400/300', // Default placeholder
  genre: apiShow.genre || '',
  duration: apiShow.duration || 120,
  ageRating: apiShow.ageRating || 'PG',
  warnings: undefined,
  adultPrice: apiShow.adultPrice,
  childPrice: apiShow.childPrice,
  concessionPrice: apiShow.concessionPrice,
  status: apiShow.status as ShowStatus,
  organizationId: '1', // Default for now
  venueId: '1', // Default for now
  seatingLayoutId: '1', // Default for now
  createdAt: new Date(),
  updatedAt: new Date(),
  performances: apiShow.performances.map(p => ({
    id: p.id,
    dateTime: new Date(p.dateTime),
    isMatinee: p.isMatinee,
    showId: apiShow.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    bookings: []
  }))
})

export default function Home() {
  const [shows, setShows] = useState<Show[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchShows = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/shows?published=true')
        const data = await response.json()

        if (data.success) {
          const convertedShows = data.data.map(convertApiShowToShow)
          setShows(convertedShows)
        } else {
          setError(data.error || 'Failed to fetch shows')
        }
      } catch (err) {
        setError('Error fetching shows')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchShows()
  }, [])

  const handleBookShow = (showId: string, performanceId: string) => {
    console.log('Book show:', { showId, performanceId })
    // Navigate to booking page
    window.location.href = `/book/${showId}/${performanceId}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Demo Theatre</h1>
              <p className="text-gray-600">Community Drama Group</p>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-blue-600 font-medium">What's On</a>
              <a href="/admin" className="text-gray-600 hover:text-gray-900">Admin</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-red-800 font-medium">Error loading shows</h3>
            <p className="text-red-600 mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <ShowListing
            shows={shows}
            onBookShow={handleBookShow}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Demo Theatre. All rights reserved.</p>
            <p className="mt-2 text-sm">
              Contact information and additional links can be configured in{' '}
              <a href="/admin/settings" className="text-blue-600 hover:text-blue-800">
                Admin Settings
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}