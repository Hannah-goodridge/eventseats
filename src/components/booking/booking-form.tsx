'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'
import { BookingFormData, SeatSelection } from '../../types'

const bookingSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  emailOptIn: z.boolean(),
  smsOptIn: z.boolean(),
  accessibilityRequirements: z.string().optional(),
  specialRequests: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().optional()
})

interface BookingFormProps {
  selectedSeats: SeatSelection[]
  totalAmount: number
  onSubmit: (data: BookingFormData) => void
  isLoading?: boolean
  className?: string
}

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

const FormField: React.FC<FormFieldProps> = ({ label, error, required, children }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
)

export const BookingForm: React.FC<BookingFormProps> = ({
  selectedSeats,
  totalAmount,
  onSubmit,
  isLoading = false,
  className
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema as any),
    defaultValues: {
      emailOptIn: false,
      smsOptIn: false
    }
  })

  const phoneValue = watch('phone')
  const smsOptInDisabled = !phoneValue || phoneValue.trim() === ''

  const inputClasses = 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[var(--highlight)] focus:border-[var(--highlight)]'
  const textareaClasses = 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[var(--highlight)] focus:border-[var(--highlight)] resize-vertical min-h-[100px]'

  if (selectedSeats.length === 0) {
    return (
      <div className={cn('p-6 bg-gray-50 rounded-lg text-center', className)}>
        <p className="text-gray-700">Please select seats to continue with your booking.</p>
      </div>
    )
  }

  return (
    <div className={cn('max-w-2xl mx-auto', className)}>
      {/* Booking Summary */}
  <div className="mb-8 p-6 bg-emerald-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Booking Summary</h2>
        <div className="space-y-2 text-gray-800">
          {selectedSeats.map((selection) => (
            <div key={selection.seatId} className="flex justify-between items-center">
              <span>
                Seat {selection.seat.row}{selection.seat.number} ({selection.ticketType})
              </span>
              <span className="font-medium">£{selection.price.toFixed(2)}</span>
            </div>
          ))}
      <div className="pt-2 border-t border-emerald-200">
            <div className="flex justify-between items-center font-semibold">
              <span>Total:</span>
              <span>£{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Information Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="First Name" error={errors.firstName?.message} required>
            <input
              {...register('firstName')}
              type="text"
              placeholder="Enter your first name"
              className={cn(inputClasses, errors.firstName && 'border-red-500')}
            />
          </FormField>

          <FormField label="Last Name" error={errors.lastName?.message} required>
            <input
              {...register('lastName')}
              type="text"
              placeholder="Enter your last name"
              className={cn(inputClasses, errors.lastName && 'border-red-500')}
            />
          </FormField>
        </div>

        <FormField label="Email Address" error={errors.email?.message} required>
          <input
            {...register('email')}
            type="email"
            placeholder="Enter your email address"
            className={cn(inputClasses, errors.email && 'border-red-500')}
          />
        </FormField>

        <FormField label="Phone Number" error={errors.phone?.message}>
          <input
            {...register('phone')}
            type="tel"
            placeholder="Enter your phone number (optional)"
            className={inputClasses}
          />
        </FormField>

        <FormField label="Accessibility Requirements" error={errors.accessibilityRequirements?.message}>
          <textarea
            {...register('accessibilityRequirements')}
            placeholder="Please let us know if you have any accessibility requirements or need assistance during your visit"
            className={textareaClasses}
          />
        </FormField>

        <FormField label="Special Requests" error={errors.specialRequests?.message}>
          <textarea
            {...register('specialRequests')}
            placeholder="Any special requests or additional information"
            className={textareaClasses}
          />
        </FormField>

        {/* Marketing Preferences */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900">Marketing Preferences</h3>

          <div className="flex items-start space-x-3">
            <input
              {...register('emailOptIn')}
              type="checkbox"
              id="emailOptIn"
            className="mt-1 h-4 w-4 text-highlight focus:ring-[var(--highlight)] border-gray-300 rounded"
            />
            <label htmlFor="emailOptIn" className="text-sm text-gray-800">
              I would like to receive email updates about upcoming shows and special offers
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <input
              {...register('smsOptIn')}
              type="checkbox"
              id="smsOptIn"
              disabled={smsOptInDisabled}
            className="mt-1 h-4 w-4 text-highlight focus:ring-[var(--highlight)] border-gray-300 rounded disabled:opacity-50"
            />
            <label htmlFor="smsOptIn" className={cn(
              'text-sm',
              smsOptInDisabled ? 'text-gray-500' : 'text-gray-800'
            )}>
              I would like to receive SMS updates (phone number required)
            </label>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-gray-800">
            By completing this booking, you agree to our terms and conditions.
            All sales are final unless the performance is cancelled by the venue.
            Tickets will be sent to your email address after payment is confirmed.
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Processing...' : `Complete Booking - £${totalAmount.toFixed(2)}`}
        </Button>
      </form>
    </div>
  )
}
