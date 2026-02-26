'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { HalalRatingBadge } from '@/components/ui/halal-rating-badge'
import { Star, Calendar, MapPin, Heart, Tag } from 'lucide-react'
import type { FeaturedPackage } from '@/mocks/featured-packages'

interface PackageCarouselProps {
  title: string
  packages: FeaturedPackage[]
  onPackageClick: (pkg: FeaturedPackage) => void
  /** Speed in seconds for a full loop. Defaults to packages.length × 6 */
  speed?: number
}

export function PackageCarousel({ title, packages, onPackageClick, speed }: PackageCarouselProps) {
  const [isPaused, setIsPaused] = useState(false)

  // Duplicate the list so the second half is identical to the first — the
  // animation moves -50% which lands exactly on the clone, creating a seamless loop.
  const doubled = [...packages, ...packages]
  const duration = speed ?? packages.length * 6

  const animationStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
    width: 'max-content',
    animation: `htc-marquee ${duration}s linear infinite`,
    animationPlayState: isPaused ? 'paused' : 'running',
  }

  return (
    <div className="mb-16">
      {/* keyframe injected once per component instance */}
      <style>{`
        @keyframes htc-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      {/* Section header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="w-10 h-0.5 bg-primary rounded-full mt-1.5" />
      </div>

      {/* Scrolling track */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left / right fade masks */}
        <div className="pointer-events-none absolute left-0 inset-y-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 inset-y-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10" />

        <div style={animationStyle}>
          {doubled.map((pkg, index) => (
            <div
              key={`${pkg.id}-${index}`}
              className="w-64 flex-shrink-0 sm:w-72"
            >
              <Card
                className="overflow-hidden cursor-pointer group border-0 shadow-[0_12px_30px_rgba(17,24,39,0.10)] hover:shadow-[0_22px_60px_rgba(17,24,39,0.18)] transition-all duration-300 rounded-3xl bg-white h-full"
                onClick={() => onPackageClick(pkg)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={`https://picsum.photos/seed/${encodeURIComponent(pkg.destination + pkg.id)}/600/450`}
                    alt={pkg.destination}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Like button */}
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-3 right-3 grid place-items-center h-10 w-10 rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-sm text-white transition-all duration-300 hover:bg-white/20 hover:scale-105"
                    aria-label="Save package"
                  >
                    <Heart className="h-4 w-4" />
                  </button>

                  {/* Halal badge */}
                  <div className="absolute top-3 left-3">
                    <HalalRatingBadge
                      rating={{
                        score: pkg.halalRating,
                        features: pkg.features.slice(0, 2),
                      }}
                    />
                  </div>

                  {/* Destination overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="text-white font-extrabold text-lg leading-tight line-clamp-1">
                      {pkg.destination}
                    </h3>
                    <p className="text-white/70 text-sm">{pkg.country}</p>
                  </div>
                </div>

                {/* Card body */}
                <CardContent className="p-4">
                  <h4 className="font-bold text-sm text-gray-900 line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                    {pkg.name}
                  </h4>

                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Tag className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="font-semibold text-gray-800">
                        {pkg.currency} {pkg.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{pkg.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mb-4">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-xs text-gray-900">{pkg.rating}</span>
                    <span className="text-xs text-gray-400">({pkg.reviews} reviews)</span>
                  </div>

                  <button className="w-full rounded-2xl py-2.5 text-sm font-semibold transition-all duration-300 bg-gray-900 text-white hover:bg-primary active:scale-[0.99]">
                    View Details
                  </button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle pause hint */}
      <p className="text-center text-xs text-gray-400 mt-4 select-none">
        Hover to pause · {packages.length} packages
      </p>
    </div>
  )
}
