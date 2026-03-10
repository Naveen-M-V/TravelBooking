'use client'

import { useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Calendar, Heart } from 'lucide-react'
import type { FeaturedPackage } from '@/mocks/featured-packages'

const CARD_WIDTH = 288  // w-72 = 18rem = 288px
const CARD_GAP   = 16   // gap-4 = 1rem = 16px
const CARD_STEP  = CARD_WIDTH + CARD_GAP
const AUTO_INTERVAL_MS = 3200

interface PackageCarouselProps {
  title: string
  packages: FeaturedPackage[]
  onPackageClick?: (pkg: FeaturedPackage) => void
  reverse?: boolean
}

export function PackageCarousel({ title, packages, reverse = false }: PackageCarouselProps) {
  const router    = useRouter()
  const trackRef  = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null)

  // Duplicate so we can scroll infinitely in both directions
  const doubled = [...packages, ...packages]

  const wrap = () => {
    const el = trackRef.current
    if (!el) return

    // For infinite loop illusion, keep scroll in the "middle" equivalent range.
    // We always start from one full chunk offset and jump by one chunk when near edges.
    const half = packages.length * CARD_STEP
    if (el.scrollLeft >= half + CARD_STEP / 2) {
      el.style.scrollBehavior = 'auto'
      el.scrollLeft -= half
      void el.offsetWidth // force reflow so the jump is invisible
      el.style.scrollBehavior = 'smooth'
    }
    if (el.scrollLeft <= CARD_STEP / 2) {
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
    if (el) {
      const half = packages.length * CARD_STEP
      el.style.scrollBehavior = 'auto'
      el.scrollLeft = half
      void el.offsetWidth
      el.style.scrollBehavior = 'smooth'
    }

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-teal-700 to-cyan-700 bg-clip-text text-transparent">{title}</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mt-2.5" />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            aria-label="Previous"
            className="inline-flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full border-2 border-cyan-500 bg-gradient-to-br from-white to-cyan-50 text-cyan-600 shadow-xl hover:shadow-2xl hover:from-cyan-600 hover:to-teal-600 hover:text-white hover:scale-110 hover:border-transparent transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next"
            className="inline-flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full border-2 border-cyan-500 bg-gradient-to-br from-white to-cyan-50 text-cyan-600 shadow-xl hover:shadow-2xl hover:from-cyan-600 hover:to-teal-600 hover:text-white hover:scale-110 hover:border-transparent transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Scrolling track — left/right fade masks */}
      <div className="relative">
        <div className="pointer-events-none absolute left-0 inset-y-0 w-20 bg-gradient-to-r from-white via-white/60 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 inset-y-0 w-20 bg-gradient-to-l from-white via-white/60 to-transparent z-10" />

        <div
          ref={trackRef}
          className="pkg-carousel-track overflow-x-scroll snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
          onMouseEnter={() => { pausedRef.current = true }}
          onMouseLeave={() => { pausedRef.current = false }}
        >
          {/* Inject webkit scrollbar hide rule once */}
          <style>{`.pkg-carousel-track::-webkit-scrollbar{display:none}`}</style>

          <div className="flex gap-4" style={{ width: 'max-content' }}>
            {doubled.map((pkg, index) => (
              <div key={`${pkg.id}-${index}`} className="w-72 flex-shrink-0 snap-start">
                <Card
                  className="overflow-hidden cursor-pointer group border-0 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_60px_rgba(6,182,212,0.35)] transition-all duration-500 rounded-3xl bg-white h-full flex flex-col relative before:absolute before:inset-0 before:rounded-3xl before:p-[1px] before:bg-gradient-to-br before:from-cyan-400 before:via-teal-400 before:to-cyan-500 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:-z-10 hover:scale-[1.02]"
                  onClick={() => router.push(`/packages/${pkg.id}`)}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden isolate rounded-t-3xl">
                    <img
                      src={`https://picsum.photos/seed/${encodeURIComponent(pkg.destination + pkg.id)}/600/450`}
                      alt={pkg.destination}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.08] rounded-t-3xl"
                    />
                    {/* Gradient — deepens on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent transition-all duration-500 group-hover:from-black/90 group-hover:via-black/25" />

                    <button
                      type="button"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-3 right-3 grid place-items-center h-9 w-9 rounded-full bg-black/25 ring-1 ring-white/20 backdrop-blur-sm text-white transition-all duration-200 hover:bg-black/45 hover:scale-110"
                      aria-label="Save package"
                    >
                      <Heart className="h-4 w-4" />
                    </button>

                    <div className="absolute top-3 left-3">
                      <div className="rounded-xl bg-white/95 backdrop-blur-sm px-3 py-2 shadow-lg border border-cyan-200">
                        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Starting From</div>
                        <div className="text-lg font-bold text-cyan-600">{pkg.currency} {pkg.price.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* View Details pill — fades in on hover */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="rounded-full bg-white/15 ring-1 ring-white/35 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-white tracking-wide">
                        View Details →
                      </span>
                    </div>

                    {/* Title — slides up slightly on hover */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-0.5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5">
                      <h3 className="text-white font-extrabold text-lg leading-tight line-clamp-1">{pkg.destination}</h3>
                      <p className="text-white/70 text-sm transition-colors duration-300 group-hover:text-white/90">{pkg.country}</p>
                    </div>
                  </div>

                  {/* Body */}
                  <CardContent className="p-5 flex flex-col flex-1 bg-white">
                    <h4 className="font-bold text-base text-gray-900 line-clamp-2 mb-3 group-hover:bg-gradient-to-r group-hover:from-cyan-700 group-hover:to-teal-700 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                      {pkg.name}
                    </h4>

                    <div className="flex items-center gap-2 text-sm text-gray-700 mb-4">
                      <Calendar className="w-4 h-4 flex-shrink-0 text-cyan-600" />
                      <span className="truncate font-medium">{pkg.duration}</span>
                    </div>

                    <div className="mt-auto pt-4">
                      <button className="w-full rounded-2xl py-3 text-sm font-bold transition-all duration-300 bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg hover:shadow-xl hover:from-cyan-700 hover:to-teal-700 hover:scale-[1.02] active:scale-[0.98]">
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
