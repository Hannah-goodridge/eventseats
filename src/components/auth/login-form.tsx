'use client'

import React, { useState, Suspense } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  className?: string
}

const DisplayError = ({ error }: { error: string | null }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent error={error} />
    </Suspense>
  )
}

const ErrorContent = ({ error }: { error: string | null }) => {
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')
  const displayError = error || (urlError ? 'Authentication failed' : null)

  if (!displayError) return null

  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center">
        <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <span className="text-red-700 text-sm">{displayError}</span>
      </div>
    </div>
  )
}

const LoginFormContent: React.FC<LoginFormProps> = ({ className }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      })

      if (result?.error) {
        setError('Invalid email or password')
        return
      }

      // Get the updated session
      const session = await getSession()

      if (session?.user) {
        // Redirect to admin dashboard or intended page
        const callbackUrl = searchParams.get('callbackUrl') || '/admin'
        router.push(callbackUrl)
        router.refresh()
      } else {
        setError('Login failed. Please try again.')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const inputClasses = 'w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--highlight)] focus:border-[var(--highlight)]'

  // Check for error from URL params


  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-700">Sign in to manage your booking system</p>
        </div>

        {/* Error Alert */}
        <DisplayError error={error} />

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-2">
              Email Address
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              placeholder="Enter your email address"
              className={cn(
                inputClasses,
                errors.email && 'border-red-500 focus:ring-red-500 focus:border-red-500'
              )}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-2">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              id="password"
              placeholder="Enter your password"
              className={cn(
                inputClasses,
                errors.password && 'border-red-500 focus:ring-red-500 focus:border-red-500'
              )}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-700">
            Need help accessing your account?{' '}
            <a href="mailto:admin@yourvenue.com" className="text-highlight hover:text-lowlight">
              Contact support
            </a>
          </p>
        </div>
      </div>

      {/* Demo Credentials */}
      <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
        <h3 className="text-sm font-medium text-emerald-900 mb-2">Demo Credentials</h3>
        <div className="text-sm text-emerald-700 space-y-1">
          <p><strong>Email:</strong> admin@demo-theatre.com</p>
          <p><strong>Password:</strong> demo123</p>
          <p className="text-xs text-emerald-700 mt-2">
            Note: These credentials will work once you set up the database and create a demo user.
          </p>
        </div>
      </div>
    </div>

  )
}

export const LoginForm: React.FC<LoginFormProps> = ({ className }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormContent className={className} />
    </Suspense>
  )
}
