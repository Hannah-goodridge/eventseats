'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '../../../components/ui/button'

interface VenueSettings {
  name: string
  address: string
  city: string
  postcode: string
  phone: string
  email: string
  website: string
}

interface BookingSettings {
  defaultBookingFee: number
  allowCancellations: boolean
  cancellationDeadlineHours: number
  requirePhone: boolean
  enableSmsNotifications: boolean
  enableEmailNotifications: boolean
}

interface SystemSettings {
  siteName: string
  siteDescription: string
  maintenanceMode: boolean
  maxSeatsPerBooking: number
  advanceBookingDays: number
}

interface ExternalLinks {
  aboutUsUrl: string
  contactUrl: string
  facebookUrl: string
  twitterUrl: string
  instagramUrl: string
  privacyPolicyUrl: string
  termsOfServiceUrl: string
}

export default function AdminSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('venue')

  // Settings state
  const [venueSettings, setVenueSettings] = useState<VenueSettings>({
    name: 'Demo Theatre',
    address: '123 Theatre Street',
    city: 'Demo City',
    postcode: 'DC1 2AB',
    phone: '+44 1234 567890',
    email: 'info@demo-theatre.com',
    website: 'https://demo-theatre.com'
  })

  const [bookingSettings, setBookingSettings] = useState<BookingSettings>({
    defaultBookingFee: 2.50,
    allowCancellations: true,
    cancellationDeadlineHours: 24,
    requirePhone: false,
    enableSmsNotifications: true,
    enableEmailNotifications: true
  })

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: 'Demo Theatre Booking System',
    siteDescription: 'Book tickets for amazing performances',
    maintenanceMode: false,
    maxSeatsPerBooking: 8,
    advanceBookingDays: 90
  })

  const [externalLinks, setExternalLinks] = useState<ExternalLinks>({
    aboutUsUrl: '',
    contactUrl: '',
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    privacyPolicyUrl: '',
    termsOfServiceUrl: ''
  })

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/admin/login')
      return
    }

    loadSettings()
  }, [status, router])

  const loadSettings = async () => {
    setIsLoading(true)
    try {
      // TODO: Load settings from API when implemented
      // For now, using default values
      console.log('Loading settings...')
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      // TODO: Save settings to API when implemented
      console.log('Saving settings:', {
        venue: venueSettings,
        booking: bookingSettings,
        system: systemSettings
      })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: Save external links to API when implemented
      console.log('Saving external links:', externalLinks)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      alert('External links saved successfully!')
    } catch (error) {
      console.error('Error saving external links:', error)
      alert('Failed to save external links. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: 'venue', name: 'Venue Information', icon: '🏛️' },
    { id: 'booking', name: 'Booking Settings', icon: '🎫' },
    { id: 'system', name: 'System Settings', icon: '⚙️' },
    { id: 'links', name: 'External Links', icon: '🔗' },
    { id: 'admin', name: 'Admin Users', icon: '👥' }
  ]

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading settings...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
              <p className="text-gray-700">Configure your booking system</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="primary"
                onClick={handleSaveSettings}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save All Settings'}
              </Button>
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
            <a href="/admin/customers" className="py-3 px-1 border-b-2 border-transparent text-sm font-medium text-gray-700 hover:text-gray-800">
              Customers
            </a>
            <a href="/admin/settings" className="py-3 px-1 border-b-2 border-blue-500 text-sm font-medium text-blue-600">
              Settings
            </a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          {/* Sidebar */}
          <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group rounded-md px-3 py-2 flex items-center text-sm font-medium w-full text-left ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 hover:bg-blue-50'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3 text-lg">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            {/* Venue Information */}
            {activeTab === 'venue' && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Venue Information</h3>
                  <p className="text-sm text-gray-700">Manage your venue's contact and location details</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="venueName" className="block text-sm font-medium text-gray-800 mb-1">
                      Venue Name
                    </label>
                    <input
                      type="text"
                      id="venueName"
                      value={venueSettings.name}
                      onChange={(e) => setVenueSettings(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="venueEmail" className="block text-sm font-medium text-gray-800 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      id="venueEmail"
                      value={venueSettings.email}
                      onChange={(e) => setVenueSettings(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="venueAddress" className="block text-sm font-medium text-gray-800 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      id="venueAddress"
                      value={venueSettings.address}
                      onChange={(e) => setVenueSettings(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="venuePhone" className="block text-sm font-medium text-gray-800 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="venuePhone"
                      value={venueSettings.phone}
                      onChange={(e) => setVenueSettings(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="venueCity" className="block text-sm font-medium text-gray-800 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="venueCity"
                      value={venueSettings.city}
                      onChange={(e) => setVenueSettings(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="venuePostcode" className="block text-sm font-medium text-gray-800 mb-1">
                      Postcode
                    </label>
                    <input
                      type="text"
                      id="venuePostcode"
                      value={venueSettings.postcode}
                      onChange={(e) => setVenueSettings(prev => ({ ...prev, postcode: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="venueWebsite" className="block text-sm font-medium text-gray-800 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      id="venueWebsite"
                      value={venueSettings.website}
                      onChange={(e) => setVenueSettings(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Booking Settings */}
            {activeTab === 'booking' && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Booking Settings</h3>
                  <p className="text-sm text-gray-700">Configure booking rules and fees</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="bookingFee" className="block text-sm font-medium text-gray-800 mb-1">
                        Default Booking Fee (£)
                      </label>
                      <input
                        type="number"
                        id="bookingFee"
                        step="0.01"
                        min="0"
                        value={bookingSettings.defaultBookingFee}
                        onChange={(e) => setBookingSettings(prev => ({ ...prev, defaultBookingFee: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="maxSeats" className="block text-sm font-medium text-gray-800 mb-1">
                        Max Seats per Booking
                      </label>
                      <input
                        type="number"
                        id="maxSeats"
                        min="1"
                        max="20"
                        value={systemSettings.maxSeatsPerBooking}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, maxSeatsPerBooking: parseInt(e.target.value) || 1 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="allowCancellations"
                        type="checkbox"
                        checked={bookingSettings.allowCancellations}
                        onChange={(e) => setBookingSettings(prev => ({ ...prev, allowCancellations: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="allowCancellations" className="ml-2 text-sm text-gray-800">
                        Allow booking cancellations
                      </label>
                    </div>

                    {bookingSettings.allowCancellations && (
                      <div className="ml-6">
                        <label htmlFor="cancellationDeadline" className="block text-sm font-medium text-gray-800 mb-1">
                          Cancellation deadline (hours before performance)
                        </label>
                        <input
                          type="number"
                          id="cancellationDeadline"
                          min="0"
                          max="168"
                          value={bookingSettings.cancellationDeadlineHours}
                          onChange={(e) => setBookingSettings(prev => ({ ...prev, cancellationDeadlineHours: parseInt(e.target.value) || 0 }))}
                          className="w-32 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}

                    <div className="flex items-center">
                      <input
                        id="requirePhone"
                        type="checkbox"
                        checked={bookingSettings.requirePhone}
                        onChange={(e) => setBookingSettings(prev => ({ ...prev, requirePhone: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="requirePhone" className="ml-2 text-sm text-gray-800">
                        Require phone number for bookings
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="enableEmailNotifications"
                        type="checkbox"
                        checked={bookingSettings.enableEmailNotifications}
                        onChange={(e) => setBookingSettings(prev => ({ ...prev, enableEmailNotifications: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="enableEmailNotifications" className="ml-2 text-sm text-gray-800">
                        Enable email notifications
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="enableSmsNotifications"
                        type="checkbox"
                        checked={bookingSettings.enableSmsNotifications}
                        onChange={(e) => setBookingSettings(prev => ({ ...prev, enableSmsNotifications: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="enableSmsNotifications" className="ml-2 text-sm text-gray-800">
                        Enable SMS notifications
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* System Settings */}
            {activeTab === 'system' && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900">System Settings</h3>
                  <p className="text-sm text-gray-700">Configure system-wide options</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="siteName" className="block text-sm font-medium text-gray-800 mb-1">
                      Site Name
                    </label>
                    <input
                      type="text"
                      id="siteName"
                      value={systemSettings.siteName}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, siteName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-800 mb-1">
                      Site Description
                    </label>
                    <textarea
                      id="siteDescription"
                      rows={3}
                      value={systemSettings.siteDescription}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="advanceBookingDays" className="block text-sm font-medium text-gray-800 mb-1">
                      Advance Booking Period (days)
                    </label>
                    <input
                      type="number"
                      id="advanceBookingDays"
                      min="1"
                      max="365"
                      value={systemSettings.advanceBookingDays}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, advanceBookingDays: parseInt(e.target.value) || 1 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-600 mt-1">How far in advance customers can book tickets</p>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="maintenanceMode"
                      type="checkbox"
                      checked={systemSettings.maintenanceMode}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="maintenanceMode" className="ml-2 text-sm text-gray-800">
                      Enable maintenance mode
                    </label>
                  </div>
                  {systemSettings.maintenanceMode && (
                    <div className="ml-6 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-sm text-yellow-800">
                        ⚠️ Maintenance mode will prevent new bookings and show a maintenance message to visitors.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* External Links */}
            {activeTab === 'links' && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900">External Links</h3>
                  <p className="text-sm text-gray-700">Configure external links for your website navigation and social media</p>
                </div>

                <div className="space-y-6">
                  {/* Website Links */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Website Pages</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">About Us Page URL</label>
                        <input
                          type="url"
                          value={externalLinks.aboutUsUrl}
                          onChange={(e) => setExternalLinks(prev => ({ ...prev, aboutUsUrl: e.target.value }))}
                          placeholder="https://yourwebsite.com/about"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Link to your about us page</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">Contact Page URL</label>
                        <input
                          type="url"
                          value={externalLinks.contactUrl}
                          onChange={(e) => setExternalLinks(prev => ({ ...prev, contactUrl: e.target.value }))}
                          placeholder="https://yourwebsite.com/contact"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Link to your contact page</p>
                      </div>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Social Media</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">Facebook URL</label>
                        <input
                          type="url"
                          value={externalLinks.facebookUrl}
                          onChange={(e) => setExternalLinks(prev => ({ ...prev, facebookUrl: e.target.value }))}
                          placeholder="https://facebook.com/yourpage"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">Twitter URL</label>
                        <input
                          type="url"
                          value={externalLinks.twitterUrl}
                          onChange={(e) => setExternalLinks(prev => ({ ...prev, twitterUrl: e.target.value }))}
                          placeholder="https://twitter.com/yourhandle"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">Instagram URL</label>
                        <input
                          type="url"
                          value={externalLinks.instagramUrl}
                          onChange={(e) => setExternalLinks(prev => ({ ...prev, instagramUrl: e.target.value }))}
                          placeholder="https://instagram.com/yourhandle"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Legal Pages */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Legal Pages</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">Privacy Policy URL</label>
                        <input
                          type="url"
                          value={externalLinks.privacyPolicyUrl}
                          onChange={(e) => setExternalLinks(prev => ({ ...prev, privacyPolicyUrl: e.target.value }))}
                          placeholder="https://yourwebsite.com/privacy"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">Terms of Service URL</label>
                        <input
                          type="url"
                          value={externalLinks.termsOfServiceUrl}
                          onChange={(e) => setExternalLinks(prev => ({ ...prev, termsOfServiceUrl: e.target.value }))}
                          placeholder="https://yourwebsite.com/terms"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Usage Instructions */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">💡 How to Use These Links</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Configure external links to your main website, social media, and legal pages</li>
                      <li>• These can be added to your main navigation or footer as needed</li>
                      <li>• Leave fields empty if you don't have those pages/accounts</li>
                      <li>• Links will open in new tabs when clicked</li>
                    </ul>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Links'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Users */}
            {activeTab === 'admin' && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Admin Users</h3>
                  <p className="text-sm text-gray-700">Manage administrative access</p>
                </div>

                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">Admin user management coming soon!</p>
                  <p className="text-sm text-gray-500">
                    This feature will allow you to add, remove, and manage administrative users.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
