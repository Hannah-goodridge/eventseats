'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '../../components/ui/button'

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">EventSeats</h1>
                <p className="text-sm text-gray-600">Open Source Event Booking</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-500 hover:text-gray-900">Features</a>
              <a href="#pricing" className="text-gray-500 hover:text-gray-900">Pricing <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full ml-1">Soon</span></a>
              <a href="#docs" className="text-gray-500 hover:text-gray-900">Documentation</a>
              <a href="https://github.com/Hannah-goodridge/eventseats" className="text-gray-500 hover:text-gray-900">GitHub</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/admin/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link href="#get-started">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
                        <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
              Event Seat Booking
              <span className="relative whitespace-nowrap text-blue-600">
                <span className="relative"> Made Simple</span>
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
              Free, open-source seat booking system designed for small venues, theatre groups,
              and community events. Professional booking experience without the enterprise cost.
            </p>
            <div className="mt-10 flex justify-center gap-x-6">
              <Button variant="primary" size="lg">
                <a href="#get-started">Start Free Today</a>
              </Button>
              <Button variant="outline" size="lg">
                <a href="https://demo.eventseats.hannahgoodridge.dev">View Demo</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to sell tickets
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Built specifically for small theatre groups with big dreams but small budgets.
              </p>
            </div>

            <div className="mt-20">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {/* Feature 1 */}
                <div className="pt-6">
                  <div className="flow-root bg-white rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Interactive Seat Selection</h3>
                      <p className="mt-5 text-base text-gray-500">
                        Visual seat maps with real-time availability. Customers can see exactly where they&#39;ll sit.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="pt-6">
                  <div className="flow-root bg-white rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Multiple Ticket Types</h3>
                      <p className="mt-5 text-base text-gray-500">
                        Adult, child, and concession pricing. Perfect for family-friendly shows and student discounts.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="pt-6">
                  <div className="flow-root bg-white rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Embed Anywhere</h3>
                      <p className="mt-5 text-base text-gray-500">
                        Add booking to your existing website with a simple iframe. Works with WordPress, Squarespace, and any platform.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="pt-6">
                  <div className="flow-root bg-white rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Lightning Fast</h3>
                      <p className="mt-5 text-base text-gray-500">
                        Built with Next.js and optimized for speed. Your customers won&#39;t wait around to buy tickets.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature 5 */}
                <div className="pt-6">
                  <div className="flow-root bg-white rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Secure & Reliable</h3>
                      <p className="mt-5 text-base text-gray-500">
                        Built with security best practices. Your customer data and bookings are safe and protected.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature 6 */}
                <div className="pt-6">
                  <div className="flow-root bg-white rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Open Source</h3>
                      <p className="mt-5 text-base text-gray-500">
                        100% open source. Self-host for free, or use our hosted service. No vendor lock-in, ever.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Pricing that makes sense for small groups
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Choose the option that fits your budget and technical comfort level
              </p>
            </div>

            <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Free Tier */}
              <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
                <div className="p-6">
                  <h2 className="text-lg leading-6 font-medium text-gray-900">Self-Hosted</h2>
                  <p className="mt-4 text-sm text-gray-500">Perfect for tech-savvy groups and developers</p>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900">£0</span>
                    <span className="text-base font-medium text-gray-500">/month</span>
                  </p>
                  <Button variant="outline" className="mt-8 w-full">
                    <a href="https://github.com/Hannah-goodridge/eventseats">Download on GitHub</a>
                  </Button>
                </div>
                <div className="pt-6 pb-8 px-6">
                  <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">What's included</h3>
                  <ul className="mt-6 space-y-4">
                    <li className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">Full source code access</span>
                    </li>
                    <li className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">Unlimited shows & performances</span>
                    </li>
                    <li className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">Community support</span>
                    </li>
                    <li className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">Setup documentation</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Hosted Tier */}
              <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-blue-500 text-white">
                    Most Popular
                  </span>
                </div>
                <div className="p-6">
                  <h2 className="text-lg leading-6 font-medium text-gray-900">Hosted Starter</h2>
                  <p className="mt-4 text-sm text-gray-500">Perfect for small theatre groups</p>
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800 font-medium">🚧 Coming Soon</p>
                    <p className="text-xs text-yellow-700 mt-1">Hosted option launching early 2025</p>
                  </div>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-400">£29</span>
                    <span className="text-base font-medium text-gray-400">/month</span>
                  </p>
                  <Button variant="outline" className="mt-8 w-full" disabled>
                    Coming Soon
                  </Button>
                </div>
                <div className="pt-6 pb-8 px-6">
                  <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">What's included</h3>
                  <ul className="mt-6 space-y-4">
                    <li className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">Fully managed hosting</span>
                    </li>
                    <li className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">Custom domain</span>
                    </li>
                    <li className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">Up to 1,000 bookings/month</span>
                    </li>
                    <li className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">Email support</span>
                    </li>
                    <li className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">30-day free trial</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Enterprise Tier */}
              <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
                <div className="p-6">
                  <h2 className="text-lg leading-6 font-medium text-gray-900">Custom Enterprise</h2>
                  <p className="mt-4 text-sm text-gray-500">For larger venues and organizations</p>
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800 font-medium">💬 Available Now</p>
                    <p className="text-xs text-blue-700 mt-1">Custom solutions & consultation</p>
                  </div>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900">Custom</span>
                  </p>
                  <Button variant="outline" className="mt-8 w-full">
                    <a href="mailto:hello@hannahgoodridge.dev">Contact Us</a>
                  </Button>
                </div>
                <div className="pt-6 pb-8 px-6">
                  <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">What's included</h3>
                  <ul className="mt-6 space-y-4">
                    <li className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">Unlimited bookings</span>
                    </li>
                    <li className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">Custom integrations</span>
                    </li>
                    <li className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">Priority support</span>
                    </li>
                    <li className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500">Custom development</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="get-started" className="bg-blue-600">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  Ready to sell tickets the smart way?
                </h2>
                <p className="mt-3 max-w-3xl text-lg text-blue-200">
                  Join hundreds of theatre groups using SeatWise to manage their bookings.
                  Start with our free 30-day trial or download the open-source version.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" size="lg" className="bg-white text-blue-600 hover:bg-gray-50">
                    <a href="https://github.com/Hannah-goodridge/eventseats">Get Started (GitHub)</a>
                  </Button>
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-blue-700">
                    <a href="https://github.com/Hannah-goodridge/eventseats">View on GitHub</a>
                  </Button>
                </div>
              </div>
              <div className="mt-8 lg:mt-0">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Start</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-gray-600">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 mr-3">1</span>
                      Sign up for free trial
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 mr-3">2</span>
                      Add your first show
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 mr-3">3</span>
                      Embed booking on your website
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 mr-3">4</span>
                      Start selling tickets!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-white text-lg font-bold">EventSeats</h3>
                <p className="mt-2 text-gray-300 text-sm">
                  Open-source event booking system designed for small venues with big dreams.
                </p>
                <p className="mt-4 text-gray-400 text-xs">
                  Built with ❤️ by <a href="https://hannahgoodridge.dev" className="text-blue-400 hover:text-blue-300">Hannah Goodridge</a>
                </p>
              </div>
              <div>
                <h4 className="text-white font-medium">Product</h4>
                <ul className="mt-4 space-y-2">
                  <li><a href="#features" className="text-gray-300 hover:text-white text-sm">Features</a></li>
                  <li><a href="#pricing" className="text-gray-300 hover:text-white text-sm">Pricing <span className="text-xs">🚧</span></a></li>
                  <li><a href="https://demo.eventseats.hannahgoodridge.dev" className="text-gray-300 hover:text-white text-sm">Demo</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium">Resources</h4>
                <ul className="mt-4 space-y-2">
                  <li><a href="/docs" className="text-gray-300 hover:text-white text-sm">Documentation</a></li>
                  <li><a href="https://github.com/hannahgoodridge/show-bookings-system" className="text-gray-300 hover:text-white text-sm">GitHub</a></li>
                  <li><a href="mailto:hello@hannahgoodridge.dev" className="text-gray-300 hover:text-white text-sm">Support</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700">
              <p className="text-gray-400 text-xs text-center">
                © 2024 EventSeats. Open source under MIT License.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
