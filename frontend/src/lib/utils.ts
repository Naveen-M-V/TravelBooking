import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currency: string = 'SAR'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date, formatStr: string = 'MMM dd, yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr)
}

export function formatTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'HH:mm')
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

export function getHalalRatingText(score: number): string {
  if (score >= 4.5) return 'Excellent'
  if (score >= 4) return 'Very Good'
  if (score >= 3.5) return 'Good'
  if (score >= 3) return 'Fair'
  return 'Limited'
}

export function getHalalRatingColor(score: number): string {
  if (score >= 4.5) return 'text-green-600'
  if (score >= 4) return 'text-teal-600'
  if (score >= 3.5) return 'text-blue-600'
  if (score >= 3) return 'text-yellow-600'
  return 'text-gray-600'
}
