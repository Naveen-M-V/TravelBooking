'use client'

import { useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Calendar, Heart } from 'lucide-react'
import type { FeaturedPackage } from '@/mocks/featured-packages'

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
  const cardSizeClasses = 'w-[82vw] sm:w-[46vw] lg:w-[31vw] xl:w-[calc((100%-3rem)/4)] max-w-[340px] xl:max-w-none flex-shrink-0 snap-start'

  const getStep = () => {
    const el = trackRef.current
    if (!el) return 0
    const firstCard = el.querySelector('[data-carousel-card="true"]') as HTMLElement | null
    if (!firstCard) return 0
    const cardWidth = firstCard.getBoundingClientRect().width
    const wrapper = firstCard.parentElement
    const gap = wrapper ? parseFloat(getComputedStyle(wrapper).columnGap || getComputedStyle(wrapper).gap || '0') : 0
    return cardWidth + gap
  }

  const getHalfWidth = () => {
    const step = getStep()
    return step * packages.length
  }

  const wrap = () => {
    const el = trackRef.current
    if (!el) return
    const step = getStep()
    const half = getHalfWidth()
    if (!step || !half) return

    // For infinite loop illusion, keep scroll in the "middle" equivalent range.
    // We always start from one full chunk offset and jump by one chunk when near edges.
    if (el.scrollLeft >= half + step / 2) {
      el.style.scrollBehavior = 'auto'
      el.scrollLeft -= half
      void el.offsetWidth // force reflow so the jump is invisible
      el.style.scrollBehavior = 'smooth'
    }
    if (el.scrollLeft <= step / 2) {
      el.style.scrollBehavior = 'auto'
      el.scrollLeft += half
      void el.offsetWidth
      el.style.scrollBehavior = 'smooth'
    }
  }

  const advance = (direction: 1 | -1 = 1) => {
    if (!trackRef.current) return
    const step = getStep()
    if (!step) return
    trackRef.current.scrollBy({ left: direction * step, behavior: 'smooth' })
    setTimeout(wrap, 600)
  }

  useEffect(() => {
    const el = trackRef.current
    if (el) {
      const half = getHalfWidth()
      if (!half) return
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
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-cyan-700 to-teal-700 bg-clip-text text-transparent">{title}</h2>
          <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full mt-2.5" />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handlePrev}
            aria-label="Previous"
            className="inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border-2 border-cyan-500 bg-gradient-to-br from-white to-cyan-50 text-cyan-600 shadow-xl hover:shadow-2xl hover:from-cyan-600 hover:to-cyan-500 hover:text-white hover:scale-110 hover:border-transparent transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next"
            className="inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border-2 border-cyan-500 bg-gradient-to-br from-white to-cyan-50 text-cyan-600 shadow-xl hover:shadow-2xl hover:from-cyan-600 hover:to-cyan-500 hover:text-white hover:scale-110 hover:border-transparent transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
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

          <style>{`
            @keyframes glassShine {
              0% { left: -100%; }
              100% { left: 100%; }
            }
            .pkg-shimmer-card {
              position: relative;
              overflow: hidden;
            }
            .pkg-shimmer-card::before {
              content: '';
              position: absolute;
              top: -50%;
              left: -100%;
              width: 30%;
              height: 200%;
              background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 25%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 75%, transparent 100%);
              transform: skewX(-20deg);
              pointer-events: none;
              border-radius: 1.5rem;
              opacity: 0;
              animation: glassShine 1.5s ease-in-out;
              filter: blur(2px);
            }
            .pkg-shimmer-card:hover::before {
              opacity: 1;
              animation: glassShine 1.5s ease-in-out infinite;
            }
          `}</style>
          <div className="flex gap-4" style={{ width: 'max-content' }}>
            {doubled.map((pkg, index) => (
              <div key={`${pkg.id}-${index}`} className={cardSizeClasses} data-carousel-card="true">
                <Card
                  className="pkg-shimmer-card overflow-hidden cursor-pointer group border-0 shadow-[0_10px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.15)] transition-all duration-500 rounded-3xl bg-white h-full flex flex-col relative hover:scale-105 hover:-translate-y-2"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2dbdb8]/82 via-[#30c9d3]/18 to-transparent transition-all duration-500 group-hover:from-[#2dbdb8]/92 group-hover:via-[#30c9d3]/28" />
                    <div className="pointer-events-none absolute -inset-10 opacity-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0)_58%)] transition-opacity duration-500 group-hover:opacity-100" />

                    <button
                      type="button"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-3 right-3 grid place-items-center h-9 w-9 rounded-full bg-[#2dbdb8]/28 ring-1 ring-white/20 backdrop-blur-sm text-white transition-all duration-200 hover:bg-[#30c9d3]/45 hover:scale-110"
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
