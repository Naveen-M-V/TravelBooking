'use client'

import { ShieldCheck } from 'lucide-react'
import { cn, getHalalRatingText, getHalalRatingColor } from '@/lib/utils'
import type { HalalRating } from '@/types/ui'

interface HalalRatingBadgeProps {
  rating: HalalRating
  showFeatures?: boolean
  className?: string
}

export function HalalRatingBadge({ rating, showFeatures = false, className }: HalalRatingBadgeProps) {
  const { score, features } = rating

  return (
    <div className={cn('inline-flex flex-col gap-1', className)}>
      <div className="flex items-center gap-1.5 bg-primary-50 px-3 py-1.5 rounded-full">
        <ShieldCheck className={cn('h-4 w-4', getHalalRatingColor(score))} />
        <span className={cn('text-sm font-semibold', getHalalRatingColor(score))}>
          {getHalalRatingText(score)}
        </span>
      </div>

      {showFeatures && features.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {features.map((feature) => (
            <span
              key={feature}
              className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded"
            >
              {feature}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
