'use client'

import React from 'react'
import Image from 'next/image'
import { formatDate, formatTime, formatPrice } from '../../lib/utils'
import { Show, Performance } from '../../types'
import { Button } from './button'
import { cn } from '../../lib/utils'

interface ShowListingProps {
  shows: Show[]
  onBookShow: (showId: string, performanceId: string) => void
  className?: string
}

interface ShowCardProps {
  show: Show
  onBookShow: (showId: string, performanceId: string) => void
}

const ShowCard: React.FC<ShowCardProps> = ({ show, onBookShow }) => {
  const upcomingPerformances = show.performances?.filter(
    perf => new Date(perf.dateTime) > new Date()
  ).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()) || []

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Show Image */}
      <div className="relative h-48 w-full">
        {show.imageUrl ? (
          <Image
            src={show.imageUrl}
            alt={show.title}
            fill
            className="object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const placeholder = target.nextElementSibling as HTMLElement
              if (placeholder) {
                placeholder.style.display = 'block'
              }
            }}
          />
        ) : null}
        {/* Placeholder image - shown when no image URL or when image fails to load */}
        <div
          className={`relative h-48 w-full ${show.imageUrl ? 'hidden' : 'block'}`}
          style={{
            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
            display: show.imageUrl ? 'none' : 'block'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-gray-500">Show Image</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Show Title and Genre */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{show.title}</h3>
          {show.genre && (
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
              {show.genre}
            </span>
          )}
        </div>

        {/* Show Details */}
        <div className="mb-4 space-y-2 text-sm text-gray-700">
          {show.duration && (
            <p>Duration: {show.duration} minutes</p>
          )}
          {show.ageRating && (
            <p>Age Rating: {show.ageRating}</p>
          )}
        </div>

        {/* Description */}
        {show.description && (
          <p className="text-gray-800 mb-4 line-clamp-3">{show.description}</p>
        )}

        {/* Warnings */}
        {show.warnings && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Please Note:</strong> {show.warnings}
            </p>
          </div>
        )}

        {/* Pricing */}
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Ticket Prices</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="text-gray-800">Adult</p>
              <p className="font-semibold text-gray-800">{formatPrice(show.adultPrice)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-800">Child</p>
              <p className="font-semibold text-gray-800">{formatPrice(show.childPrice)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-800">Concession</p>
              <p className="font-semibold text-gray-800">{formatPrice(show.concessionPrice)}</p>
            </div>
          </div>
        </div>

        {/* Upcoming Performances */}
        {upcomingPerformances.length > 0 ? (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Upcoming Performances</h4>
            {upcomingPerformances.slice(0, 3).map((performance) => (
              <div key={performance.id} className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200">
                <div>
                  <p className="font-medium text-gray-900">
                    {formatDate(performance.dateTime)}
                  </p>
                  <p className="text-sm text-gray-700">
                    {formatTime(performance.dateTime)}
                    {performance.isMatinee && <span className="ml-2 text-xs bg-green-100 text-green-800 px-1 rounded">Matinee</span>}
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onBookShow(show.id, performance.id)}
                >
                  Book Now
                </Button>
              </div>
            ))}
            {upcomingPerformances.length > 3 && (
              <p className="text-sm text-gray-700 text-center">
                +{upcomingPerformances.length - 3} more performances
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-700">No upcoming performances scheduled</p>
          </div>
        )}
      </div>
    </div>
  )
}

export const ShowListing: React.FC<ShowListingProps> = ({
  shows,
  onBookShow,
  className
}) => {
  const publishedShows = shows.filter(show => show.status === 'PUBLISHED')

  if (publishedShows.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <div className="text-gray-400 mb-4">
          <svg className="w-24 h-24 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No Shows Available</h3>
        <p className="text-gray-700">
          There are currently no shows available for booking. Please check back later.
        </p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-8', className)}>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">What's On</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our upcoming shows and book your tickets online.
          Select your preferred performance and secure your seats today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publishedShows.map((show) => (
          <ShowCard
            key={show.id}
            show={show}
            onBookShow={onBookShow}
          />
        ))}
      </div>
    </div>
  )
}
