'use client'

import React from 'react'
import { LoginForm } from '../../../components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gray-50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100"></div>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Event Seats
          </h1>
          <p className="text-lg text-gray-600">
            Administration Portal
          </p>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Event Seats. Open source software for drama groups.
          </p>
          <div className="mt-2 flex justify-center space-x-4 text-sm">
            <a href="/" className="text-blue-600 hover:text-blue-500">
              Public Site
            </a>
            <span className="text-gray-300">•</span>

            <span className="text-gray-300">•</span>
            <a href="https://github.com/hannah-goodridge/eventseats" className="text-blue-600 hover:text-blue-500">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
