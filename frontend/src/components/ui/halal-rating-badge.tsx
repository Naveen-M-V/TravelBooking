'use client'

import { Star } from 'lucide-react'
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
      <div className="flex items-center gap-2 bg-primary-50 px-3 py-1.5 rounded-full">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                'h-3.5 w-3.5',
                i < Math.floor(score)
                  ? 'fill-primary text-primary'
                  : 'fill-gray-200 text-gray-200'
              )}
            />
          ))}
        </div>
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
