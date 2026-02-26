'use client'

import { useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { HalalRatingBadge } from '@/components/ui/halal-rating-badge'
import { ChevronLeft, ChevronRight, Calendar, Heart } from 'lucide-react'
import type { FeaturedPackage } from '@/mocks/featured-packages'

const CARD_WIDTH = 288  // w-72 = 18rem = 288px
const CARD_GAP   = 16   // gap-4 = 1rem = 16px
const CARD_STEP  = CARD_WIDTH + CARD_GAP
const AUTO_INTERVAL_MS = 3800

interface PackageCarouselProps {
  title: string
  packages: FeaturedPackage[]
  onPackageClick: (pkg: FeaturedPackage) => void
  reverse?: boolean
}

export function PackageCarousel({ title, packages, onPackageClick, reverse = false }: PackageCarouselProps) {
  const trackRef  = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null)

  // Duplicate so we can scroll infinitely in both directions
  const doubled = [...packages, ...packages]

  const wrap = () => {
    const el = trackRef.current
    if (!el) return
    const half = packages.length * CARD_STEP
    if (el.scrollLeft >= half) {
      el.style.scrollBehavior = 'auto'
      el.scrollLeft -= half
      void el.offsetWidth // force reflow so the jump is invisible
      el.style.scrollBehavior = 'smooth'
    }
    if (el.scrollLeft < 0) {
      el.style.scrollBehavior = 'auto'
      el.scrollLeft += half
      void el.offsetWidth
      el.style.scrollBehavior = 'smooth'
    }
  }

  const advance = (direction: 1 | -1 = 1) => {
    if (!trackRef.current) return
    trackRef.current.scrollBy({ left: direction * CARD_STEP, behavior: 'smooth' })
    setTimeout(wrap, 600)
  }

  useEffect(() => {
    const el = trackRef.current
    if (el) el.style.scrollBehavior = 'smooth'

    timerRef.current = setInterval(() => {
      if (!pausedRef.current) advance(reverse ? -1 : 1)
    }, AUTO_INTERVAL_MS)

    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [packages.length, reverse]) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePrev = () => {
    pausedRef.current = true
    advance(-1)
    if (timerRef.current) clearInterval(timerRef.current)
    setTimeout(() => {
      pausedRef.current = false
      timerRef.current = setInterval(() => { if (!pausedRef.current) advance(reverse ? -1 : 1) }, AUTO_INTERVAL_MS)
    }, 6000)
  }

  const handleNext = () => {
    pausedRef.current = true
    advance(1)
    if (timerRef.current) clearInterval(timerRef.current)
    setTimeout(() => {
      pausedRef.current = false
      timerRef.current = setInterval(() => { if (!pausedRef.current) advance(reverse ? -1 : 1) }, AUTO_INTERVAL_MS)
    }, 6000)
  }

  return (
    <div className="mb-16">
      {/* Section header + arrows */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <div className="w-10 h-0.5 bg-primary rounded-full mt-1.5" />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            aria-label="Previous"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm hover:border-primary hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm hover:border-primary hover:text-primary transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrolling track — left/right fade masks */}
      <div className="relative">
        <div className="pointer-events-none absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-gray-50 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-gray-50 to-transparent z-10" />

        <div
          ref={trackRef}
          className="pkg-carousel-track overflow-x-scroll"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
          onMouseEnter={() => { pausedRef.current = true }}
          onMouseLeave={() => { pausedRef.current = false }}
        >
          {/* Inject webkit scrollbar hide rule once */}
          <style>{`.pkg-carousel-track::-webkit-scrollbar{display:none}`}</style>

          <div className="flex gap-4" style={{ width: 'max-content' }}>
            {doubled.map((pkg, index) => (
              <div key={`${pkg.id}-${index}`} className="w-72 flex-shrink-0">
                <Card
                  className="overflow-hidden cursor-pointer group border-0 shadow-[0_12px_30px_rgba(17,24,39,0.10)] hover:shadow-[0_22px_60px_rgba(17,24,39,0.18)] transition-all duration-300 rounded-3xl bg-white h-full flex flex-col"
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

                    <button
                      type="button"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-3 right-3 grid place-items-center h-10 w-10 rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-sm text-white transition-all hover:bg-white/20 hover:scale-105"
                      aria-label="Save package"
                    >
                      <Heart className="h-4 w-4" />
                    </button>

                    <div className="absolute top-3 left-3">
                      <HalalRatingBadge rating={{ score: pkg.halalRating, features: pkg.features.slice(0, 2) }} />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className="text-white font-extrabold text-lg leading-tight line-clamp-1">{pkg.destination}</h3>
                      <p className="text-white/70 text-sm">{pkg.country}</p>
                    </div>
                  </div>

                  {/* Body */}
                  <CardContent className="p-4 flex flex-col flex-1">
                    <h4 className="font-bold text-sm text-gray-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {pkg.name}
                    </h4>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{pkg.duration}</span>
                    </div>

                    <div className="mt-auto pt-4">
                      <button className="w-full rounded-2xl py-2.5 text-sm font-semibold transition-all bg-gray-900 text-white hover:bg-primary active:scale-[0.99]">
                        View Details
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
