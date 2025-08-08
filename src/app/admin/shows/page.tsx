'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '../../../components/ui/button'

interface Show {
  id: string
  title: string
  status: string
  slug: string
  description?: string
  genre?: string
  duration?: number
  ageRating?: string
  adultPrice: number
  childPrice: number
  concessionPrice: number
  performances: Performance[]
}

interface Performance {
  id: string
  dateTime: string
  isMatinee: boolean
  notes?: string
}

interface EditingShow {
  id?: string
  title: string
  description: string
  genre: string
  duration: number
  ageRating: string
  adultPrice: number
  childPrice: number
  concessionPrice: number
  status: string
}

interface EditingPerformance {
  id?: string
  showId: string
  dateTime: string
  isMatinee: boolean
  notes: string
}

export default function AdminShowsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [shows, setShows] = useState<Show[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false)
  const [performanceEditModal, setPerformanceEditModal] = useState(false)
  const [editingShow, setEditingShow] = useState<EditingShow | null>(null)
  const [editingPerformance, setEditingPerformance] = useState<EditingPerformance | null>(null)
  const [selectedShowForPerformances, setSelectedShowForPerformances] = useState<Show | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const fetchShows = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/shows')
      const data = await response.json()

      if (data.success) {
        setShows(data.data || [])
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

  const handleEditShow = (show: Show) => {
    setEditingShow({
      id: show.id,
      title: show.title,
      description: show.description || '',
      genre: show.genre || '',
      duration: show.duration || 120,
      ageRating: show.ageRating || 'PG',
      adultPrice: show.adultPrice,
      childPrice: show.childPrice,
      concessionPrice: show.concessionPrice,
      status: show.status
    })
    setShowEditModal(true)
  }

  const handleNewShow = () => {
    setEditingShow({
      title: '',
      description: '',
      genre: '',
      duration: 120,
      ageRating: 'PG',
      adultPrice: 25.00,
      childPrice: 15.00,
      concessionPrice: 20.00,
      status: 'DRAFT'
    })
    setShowEditModal(true)
  }

  const handleSaveShow = async () => {
    if (!editingShow) return

    setIsSaving(true)
    try {
      const method = editingShow.id ? 'PUT' : 'POST'
      const url = editingShow.id ? `/api/shows/${editingShow.id}` : '/api/shows'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingShow)
      })

      const data = await response.json()

      if (data.success) {
        await fetchShows() // Refresh the list
        setShowEditModal(false)
        setEditingShow(null)
        alert('Show saved successfully!')
      } else {
        alert('Failed to save show: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error saving show:', error)
      alert('Failed to save show: ' + error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleManagePerformances = (show: Show) => {
    setSelectedShowForPerformances(show)
  }

  const handleNewPerformance = () => {
    if (!selectedShowForPerformances) return

    setEditingPerformance({
      showId: selectedShowForPerformances.id,
      dateTime: new Date().toISOString().slice(0, 16),
      isMatinee: false,
      notes: ''
    })
    setPerformanceEditModal(true)
  }

  const handleEditPerformance = (performance: Performance) => {
    setEditingPerformance({
      id: performance.id,
      showId: selectedShowForPerformances?.id || '',
      dateTime: new Date(performance.dateTime).toISOString().slice(0, 16),
      isMatinee: performance.isMatinee,
      notes: performance.notes || ''
    })
    setPerformanceEditModal(true)
  }

  const handleSavePerformance = async () => {
    if (!editingPerformance) return

    setIsSaving(true)
    try {
      const method = editingPerformance.id ? 'PUT' : 'POST'
      const url = editingPerformance.id ? `/api/performances/${editingPerformance.id}` : '/api/performances'

      const performanceData = {
        ...editingPerformance,
        dateTime: new Date(editingPerformance.dateTime).toISOString()
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(performanceData)
      })

      const data = await response.json()

      if (data.success) {
        await fetchShows() // Refresh the list
        setPerformanceEditModal(false)
        setEditingPerformance(null)
        alert('Performance saved successfully!')
      } else {
        alert('Failed to save performance: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error saving performance:', error)
      alert('Failed to save performance: ' + error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeletePerformance = async (performanceId: string) => {
    if (!confirm('Are you sure you want to delete this performance? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/performances/${performanceId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        await fetchShows() // Refresh the list
        alert('Performance deleted successfully!')
      } else {
        alert('Failed to delete performance: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error deleting performance:', error)
      alert('Failed to delete performance: ' + error)
    }
  }

  const formatDateTime = (dateTime: string) => {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateTime))
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (status === 'authenticated') {
      fetchShows()
    }
  }, [status, router])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">Error loading shows</h3>
          <p className="text-red-600 mt-1">{error}</p>
          <button
            onClick={fetchShows}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Shows Management</h1>
              {session?.user?.organization && (
                <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {session.user.organization.name}
                </span>
              )}
            </div>
            <Button variant="primary" onClick={handleNewShow}>
              Add New Show
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a href="/admin" className="py-3 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700">
              Dashboard
            </a>
            <a href="/admin/shows" className="py-3 px-1 border-b-2 border-blue-500 text-sm font-medium text-blue-600">
              Shows
            </a>
            <a href="/admin/bookings" className="py-3 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700">
              Bookings
            </a>
            <a href="/admin/customers" className="py-3 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700">
              Customers
            </a>
            <a href="/admin/settings" className="py-3 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700">
              Settings
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">All Shows</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Show
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performances
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bookings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shows.map((show) => {
                  const totalBookings = 0 // TODO: Calculate from bookings
                  const revenue = 0 // TODO: Calculate from bookings

                  return (
                    <tr key={show.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{show.title}</div>
                        {show.genre && (
                          <div className="text-sm text-gray-500">{show.genre}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          show.status === 'PUBLISHED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {show.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {show.performances?.length || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {totalBookings}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        £{revenue.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a
                          href={`/book/${show.id}/${show.performances?.[0]?.id || ''}`}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          Book Tickets
                        </a>
                        <button
                          onClick={() => handleEditShow(show)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleManagePerformances(show)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Performances
                        </button>
                        <button
                          onClick={() => router.push(`/admin/bookings?showId=${show.id}`)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          View Bookings
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Shows</h3>
            <p className="text-3xl font-bold text-blue-600">{shows.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Published Shows</h3>
            <p className="text-3xl font-bold text-green-600">
              {shows.filter(show => show.status === 'PUBLISHED').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Performances</h3>
            <p className="text-3xl font-bold text-purple-600">
              {shows.reduce((sum, show) => sum + (show.performances?.length || 0), 0)}
            </p>
          </div>
        </div>
      </main>

      {/* Show Edit Modal */}
      {showEditModal && editingShow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingShow.id ? 'Edit Show' : 'Add New Show'}
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Title</label>
                  <input
                    type="text"
                    value={editingShow.title}
                    onChange={(e) => setEditingShow(prev => prev ? {...prev, title: e.target.value} : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter show title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Description</label>
                  <textarea
                    value={editingShow.description}
                    onChange={(e) => setEditingShow(prev => prev ? {...prev, description: e.target.value} : null)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter show description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">Genre</label>
                    <input
                      type="text"
                      value={editingShow.genre}
                      onChange={(e) => setEditingShow(prev => prev ? {...prev, genre: e.target.value} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Drama, Comedy, Musical"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      value={editingShow.duration}
                      onChange={(e) => setEditingShow(prev => prev ? {...prev, duration: parseInt(e.target.value) || 0} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">Age Rating</label>
                    <select
                      value={editingShow.ageRating}
                      onChange={(e) => setEditingShow(prev => prev ? {...prev, ageRating: e.target.value} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="U">U - Universal</option>
                      <option value="PG">PG - Parental Guidance</option>
                      <option value="12">12 - 12 and over</option>
                      <option value="15">15 - 15 and over</option>
                      <option value="18">18 - Adults only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">Status</label>
                    <select
                      value={editingShow.status}
                      onChange={(e) => setEditingShow(prev => prev ? {...prev, status: e.target.value} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="DRAFT">Draft (not visible to customers)</option>
                      <option value="PUBLISHED">Published (visible to customers)</option>
                      <option value="ARCHIVED">Archived (hidden from customers)</option>
                    </select>
                    <p className="text-xs text-gray-600 mt-1">Only shows with "Published" status appear on the What's On page</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">Adult Price (£)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingShow.adultPrice}
                      onChange={(e) => setEditingShow(prev => prev ? {...prev, adultPrice: parseFloat(e.target.value) || 0} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">Child Price (£)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingShow.childPrice}
                      onChange={(e) => setEditingShow(prev => prev ? {...prev, childPrice: parseFloat(e.target.value) || 0} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">Concession Price (£)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingShow.concessionPrice}
                      onChange={(e) => setEditingShow(prev => prev ? {...prev, concessionPrice: parseFloat(e.target.value) || 0} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>
                </div>


              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveShow}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Show'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Management Modal */}
      {selectedShowForPerformances && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Manage Performances - {selectedShowForPerformances.title}
                </h3>
                <button
                  onClick={() => setSelectedShowForPerformances(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <Button variant="primary" onClick={handleNewPerformance}>
                  Add New Performance
                </Button>
              </div>

              <div className="space-y-3">
                {selectedShowForPerformances.performances?.length ? (
                  selectedShowForPerformances.performances.map((performance) => (
                    <div key={performance.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">
                          {formatDateTime(performance.dateTime)}
                        </div>
                        {performance.isMatinee && (
                          <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                            Matinee
                          </span>
                        )}
                        {performance.notes && (
                          <div className="text-sm text-gray-600 mt-1">{performance.notes}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPerformance(performance)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePerformance(performance.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    No performances scheduled. Add the first performance to get started.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Edit Modal */}
      {performanceEditModal && editingPerformance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingPerformance.id ? 'Edit Performance' : 'Add New Performance'}
                </h3>
                <button
                  onClick={() => setPerformanceEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={editingPerformance.dateTime}
                    onChange={(e) => setEditingPerformance(prev => prev ? {...prev, dateTime: e.target.value} : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isMatinee"
                    checked={editingPerformance.isMatinee}
                    onChange={(e) => setEditingPerformance(prev => prev ? {...prev, isMatinee: e.target.checked} : null)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isMatinee" className="ml-2 text-sm text-gray-800">
                    Matinee performance
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Notes (optional)</label>
                  <textarea
                    value={editingPerformance.notes}
                    onChange={(e) => setEditingPerformance(prev => prev ? {...prev, notes: e.target.value} : null)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any special notes for this performance"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setPerformanceEditModal(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSavePerformance}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Performance'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
