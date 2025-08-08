'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Customer } from '../../../types'
import { Button } from '../../../components/ui/button'

interface CustomerFilters {
  search?: string
  emailOptIn?: string
  smsOptIn?: string
}

export default function AdminCustomersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<CustomerFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/admin/login')
      return
    }

    // Initial load only; subsequent loads triggered by Search/Clear/Page change

  }, [status, router])

  const loadCustomers = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', currentPage.toString())
      params.set('limit', '50')
      if (filters.search) params.set('search', filters.search)
      if (filters.emailOptIn) params.set('emailOptIn', filters.emailOptIn)
      if (filters.smsOptIn) params.set('smsOptIn', filters.smsOptIn)

      const response = await fetch(`/api/customers?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setCustomers(data.data)
        setTotalPages(data.meta?.totalPages || 1)
      } else {
        console.error('Failed to load customers:', data.error)
      }
    } catch (error) {
      console.error('Error loading customers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(timestamp))
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading customers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
              <p className="text-gray-700">Manage customer information and marketing preferences</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/admin')}
              >
                ← Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a href="/admin" className="py-3 px-1 border-b-2 border-transparent text-sm font-medium text-gray-700 hover:text-gray-800">
              Dashboard
            </a>
            <a href="/admin/shows" className="py-3 px-1 border-b-2 border-transparent text-sm font-medium text-gray-700 hover:text-gray-800">
              Shows
            </a>
            <a href="/admin/bookings" className="py-3 px-1 border-b-2 border-transparent text-sm font-medium text-gray-700 hover:text-gray-800">
              Bookings
            </a>
            <a href="/admin/customers" className="py-3 px-1 border-b-2 border-blue-500 text-sm font-medium text-blue-600">
              Customers
            </a>
            <a href="/admin/settings" className="py-3 px-1 border-b-2 border-transparent text-sm font-medium text-gray-700 hover:text-gray-800">
              Settings
            </a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Customers</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-800 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={filters.search || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Name or email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="emailOptIn" className="block text-sm font-medium text-gray-800 mb-1">
                Email Opt-in
              </label>
              <select
                id="emailOptIn"
                value={filters.emailOptIn || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, emailOptIn: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All</option>
                <option value="true">Opted In</option>
                <option value="false">Not Opted In</option>
              </select>
            </div>

            <div>
              <label htmlFor="smsOptIn" className="block text-sm font-medium text-gray-800 mb-1">
                SMS Opt-in
              </label>
              <select
                id="smsOptIn"
                value={filters.smsOptIn || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, smsOptIn: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All</option>
                <option value="true">Opted In</option>
                <option value="false">Not Opted In</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Actions</label>
              <div className="flex gap-2">
                <Button variant="primary" size="sm" onClick={() => { setCurrentPage(1); loadCustomers() }}>
                  Search
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilters({})
                    setCurrentPage(1)
                    loadCustomers()
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Email Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter((c: any) => c.emailOptIn).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">SMS Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter((c: any) => c.smsOptIn).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  £{customers.reduce((sum: number, c: any) => sum + (c.totalSpent || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Customers ({customers.length})
            </h3>
          </div>

          {customers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No customers found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Bookings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Total Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Marketing
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Last Booking
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer: any) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {customer.firstName} {customer.lastName}
                          </div>
                          <div className="text-xs text-gray-600">
                            ID: {customer.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">{customer.email}</div>
                          {customer.phone && (
                            <div className="text-xs text-gray-600">{customer.phone}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.bookingCount || 0}
                        </div>
                        <div className="text-xs text-gray-600">
                          booking{(customer.bookingCount || 0) !== 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          £{(customer.totalSpent || 0).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            customer.emailOptIn ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            Email
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            customer.smsOptIn ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            SMS
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {customer.lastBooking ? formatDate(customer.lastBooking) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // Navigate to customer's bookings
                            router.push(`/admin/bookings?customerEmail=${encodeURIComponent(customer.email)}`)
                          }}
                        >
                          View Bookings
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
