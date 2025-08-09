import '@testing-library/jest-dom'
import React from 'react'
import { server } from './__tests__/mocks/server'
import { vi } from 'vitest'

// Mock next/image to a simple img for tests
vi.mock('next/image', () => ({
  default: (props: any) => React.createElement('img', props),
}))

// Mock next/link to just render children
vi.mock('next/link', () => ({
  default: ({ children, href, ...rest }: any) => React.createElement('a', { href, ...rest }, children),
}))

// Establish API mocking before all tests.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished.
afterAll(() => server.close())


