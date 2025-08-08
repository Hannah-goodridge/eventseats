'use client'

import React from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'default'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--highlight)] rounded-full disabled:opacity-50 disabled:pointer-events-none'

  const variantClasses = {
    default: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
    primary: 'bg-highlight text-white shadow-lg btn-primary-3d hover:bg-lowlight',
    secondary: 'bg-white text-highlight border-2 border-highlight hover:bg-highlight hover:text-white',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700',
    ghost: 'hover:bg-gray-100 text-gray-700',
    destructive: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
  } as const

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  } as const

  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className)

  if (href) {
    return (

      <a href={href} className={classes} role="button">
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
