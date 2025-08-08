'use client'

import React, { useEffect, useState } from 'react'
import { ShowListing } from '../../components/ui/show-listing'
import { Show, ShowStatus } from '../../types'

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
  imageUrl: '', // No image - will use CSS placeholder
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

export default function WhatsOnPage() {
  const [shows, setShows] = useState<Show[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch settings and shows in parallel
        const [settingsResponse, showsResponse] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/shows?published=true')
        ])

        const settingsData = await settingsResponse.json()
        const showsData = await showsResponse.json()

        if (settingsData.success) {
          setSettings(settingsData.data)
        }

        if (showsData.success) {
          const convertedShows = showsData.data.map(convertApiShowToShow)
          setShows(convertedShows)
        } else {
          setError(showsData.error || 'Failed to fetch shows')
        }
      } catch (err) {
        setError('Error fetching data')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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
              <h1 className="text-2xl font-bold text-gray-900">
                {settings?.venue?.name || 'Demo Theatre'}
              </h1>
              <p className="text-gray-600">
                {settings?.system?.tagline || 'Community Drama Group'}
              </p>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/whats-on" className="text-[#39BB9A] font-medium">What's On</a>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Venue Info */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {settings?.venue?.name || 'Demo Theatre'}
              </h3>
              {settings?.venue?.address && (
                <p className="text-gray-600 text-sm mb-1">
                  {settings.venue.address}
                  {settings.venue.city && `, ${settings.venue.city}`}
                  {settings.venue.postcode && `, ${settings.venue.postcode}`}
                </p>
              )}
              {settings?.venue?.phone && (
                <p className="text-gray-600 text-sm mb-1">
                  📞 {settings.venue.phone}
                </p>
              )}
              {settings?.venue?.email && (
                <p className="text-gray-600 text-sm">
                  ✉️ {settings.venue.email}
                </p>
              )}
            </div>

            {/* Quick Links */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Links</h3>
              <div className="space-y-1">
                <a href="/whats-on" className="block text-gray-600 text-sm hover:text-blue-600">What's On</a>
                <a href="/admin" className="block text-gray-600 text-sm hover:text-blue-600">Admin</a>
                {settings?.venue?.website && (
                  <a href={settings.venue.website} target="_blank" rel="noopener noreferrer" className="block text-gray-600 text-sm hover:text-blue-600">
                    Visit Website
                  </a>
                )}
              </div>
            </div>

            {/* System Info */}
            <div className="text-center md:text-right">
              <p className="text-gray-600 text-sm">
                &copy; {new Date().getFullYear()} {settings?.venue?.name || 'EventSeats'}. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Powered by <a href="https://hannahgoodridge.dev" className="text-blue-600 hover:text-blue-800">Hannah Goodridge</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
