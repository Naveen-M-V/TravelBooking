'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, MapPin, Calendar, Sparkles } from 'lucide-react'
import Image from 'next/image'
import type { FeaturedPackage } from '@/mocks/featured-packages'

interface TripOverviewCarouselProps {
  title?: string
  packages: FeaturedPackage[]
  reverse?: boolean
}

const AUTO_INTERVAL_MS = 3200

export function TripOverviewCarousel({ title = "Featured Tours", packages, reverse = false }: TripOverviewCarouselProps) {
  const router = useRouter()
  const carouselRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pausedRef = useRef(false)
  const doubled = [...packages, ...packages]

  const getStep = () => {
    const el = carouselRef.current
    if (!el) return 0
    const firstCard = el.querySelector('[data-trip-card="true"]') as HTMLElement | null
    if (!firstCard) return 0
    const cardWidth = firstCard.getBoundingClientRect().width
    const wrapper = firstCard.parentElement
    const gap = wrapper ? parseFloat(getComputedStyle(wrapper).columnGap || getComputedStyle(wrapper).gap || '0') : 0
    return cardWidth + gap
  }

  const getHalfWidth = () => getStep() * packages.length

  const wrap = () => {
    const el = carouselRef.current
    if (!el) return
    const step = getStep()
    const half = getHalfWidth()
    if (!step || !half) return

    if (el.scrollLeft >= half + step / 2) {
      el.style.scrollBehavior = 'auto'
      el.scrollLeft -= half
      void el.offsetWidth
      el.style.scrollBehavior = 'smooth'
    }
    if (el.scrollLeft <= step / 2) {
      el.style.scrollBehavior = 'auto'
      el.scrollLeft += half
      void el.offsetWidth
      el.style.scrollBehavior = 'smooth'
    }
  }

  const scroll = (direction: 'left' | 'right', holdAuto = true) => {
    if (!carouselRef.current) return
    const step = getStep()
    if (!step) return

    if (holdAuto) {
      pausedRef.current = true
      if (timerRef.current) clearInterval(timerRef.current)
      setTimeout(() => {
        pausedRef.current = false
        timerRef.current = setInterval(() => {
          if (!pausedRef.current) scroll(reverse ? 'left' : 'right', false)
        }, AUTO_INTERVAL_MS)
      }, 6000)
    }

    const newScrollLeft = carouselRef.current.scrollLeft + (direction === 'right' ? step : -step)
    carouselRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
    setTimeout(wrap, 650)
  }

  useEffect(() => {
    const el = carouselRef.current
    if (!el || packages.length === 0) return
    const half = getHalfWidth()
    if (!half) return

    el.style.scrollBehavior = 'auto'
    el.scrollLeft = half
    void el.offsetWidth
    el.style.scrollBehavior = 'smooth'

    timerRef.current = setInterval(() => {
      if (!pausedRef.current) scroll(reverse ? 'left' : 'right', false)
    }, AUTO_INTERVAL_MS)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [packages.length, reverse]) // eslint-disable-line react-hooks/exhaustive-deps

  if (packages.length === 0) return null

  return (
    <div className="py-10 md:py-14">
      {/* Title */}
      <div className="text-center mb-10 md:mb-12">
        {/* Decorative badge above title */}
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-100/80 to-accent-100/80 border border-primary-200/60 px-4 py-1.5 mb-4 shadow-sm backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 animate-pulse" />
          <span className="text-primary-700 text-[10px] font-bold uppercase tracking-[0.2em]">Curated Tours</span>
        </div>
        
        <h2 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-5 tracking-tight font-display">
          <span className="gradient-text drop-shadow-[0_2px_10px_rgba(15,118,110,0.15)]" style={{ textShadow: '0 0 40px rgba(43,196,190,0.15)' }}>
            {title}
          </span>
        </h2>
        
        {/* Premium divider with diamond accent */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-[2px] bg-gradient-to-r from-transparent via-primary-300 to-primary-400 rounded-full"></div>
          <div className="w-2 h-2 rotate-45 bg-gradient-to-br from-primary-400 to-accent-400 rounded-sm shadow-sm"></div>
          <div className="w-16 h-[3px] bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 rounded-full shadow-sm shadow-accent-200/30"></div>
          <div className="w-2 h-2 rotate-45 bg-gradient-to-br from-accent-400 to-primary-400 rounded-sm shadow-sm"></div>
          <div className="w-10 h-[2px] bg-gradient-to-l from-transparent via-accent-300 to-accent-400 rounded-full"></div>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border-2 border-primary-200 flex items-center justify-center text-neutral-700 hover:bg-primary-500 hover:border-accent-300 hover:text-accent-50 hover:scale-110 hover:shadow-[0_0_22px_rgba(43,196,190,0.45)] transition-all duration-300"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        <button
          onClick={() => scroll('right')}
          className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border-2 border-primary-200 flex items-center justify-center text-neutral-700 hover:bg-primary-500 hover:border-accent-300 hover:text-accent-50 hover:scale-110 hover:shadow-[0_0_22px_rgba(43,196,190,0.45)] transition-all duration-300"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        <div
          ref={carouselRef}
          className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 md:px-6 pb-6 scrollbar-hide"
          style={{ scrollbarWidth: 'none' }}
          onMouseEnter={() => { pausedRef.current = true }}
          onMouseLeave={() => { pausedRef.current = false }}
        >
          {doubled.map((pkg, index) => (
            <div
              key={`${pkg.id}-${index}`}
              data-trip-card="true"
              className="relative flex-shrink-0 w-[78vw] sm:w-[44vw] lg:w-[29vw] xl:w-[calc((100%-4rem)/4)] max-w-[320px] xl:max-w-none group cursor-pointer snap-start"
              onClick={() => router.push(`/packages/${pkg.id}`)}
            >
              {/* Premium Price Badge */}
              <div className="absolute top-4 left-4 z-10 rounded-2xl border border-white/30 bg-gradient-to-br from-neutral-900/75 via-neutral-800/80 to-neutral-900/75 backdrop-blur-xl px-4 py-3 shadow-2xl shadow-black/20">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-primary-300">
                  <Sparkles className="h-3 w-3" />
                  <span>From</span>
                </div>
                <p className="mt-1.5 text-lg font-black leading-none text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.4)]">
                  {pkg.currency} {pkg.price.toLocaleString()}
                </p>
                <p className="mt-0.5 text-[11px] font-medium leading-none text-neutral-300">/ person</p>
              </div>

              {/* Premium Card Container */}
              <div className="relative h-[380px] sm:h-[410px] md:h-[420px] rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] hover:shadow-[0_32px_80px_rgba(15,118,110,0.25)] transition-all duration-700 hover:-translate-y-2 ring-1 ring-white/20">
                {/* Image with enhanced zoom */}
                <div className="relative h-full w-full">
                  <Image
                    src={pkg.image}
                    alt={pkg.name}
                    fill
                    className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-110"
                  />
                  {/* Subtle vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60" />
                </div>

                {/* Hover Glow Effect */}
                <div className="pointer-events-none absolute inset-0 opacity-0 bg-[radial-gradient(circle_at_50%_50%,rgba(43,196,190,0.25)_0%,rgba(43,196,190,0.08)_40%,rgba(43,196,190,0)_70%)] transition-opacity duration-700 group-hover:opacity-100" />

                {/* Premium Bottom Content Panel */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neutral-950/95 via-neutral-900/80 to-transparent p-5 sm:p-6 transition-all duration-500">
                  <div className="rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-xl p-4 sm:p-5 shadow-xl">
                    {/* Premium Title with gradient text effect */}
                    <h3 className="relative text-sm sm:text-base md:text-lg font-bold uppercase tracking-[0.08em] leading-snug line-clamp-2 mb-1 font-display">
                      <span className="bg-gradient-to-r from-white via-white to-primary-200 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                        {pkg.name}
                      </span>
                    </h3>

                    {/* Expandable Details */}
                    <div className="max-h-0 opacity-0 overflow-hidden group-hover:max-h-56 group-hover:opacity-100 transition-all duration-500 ease-out">
                      <div className="pt-3 space-y-2">
                        <div className="flex items-center gap-2.5 text-sm text-neutral-100/95">
                          <div className="w-7 h-7 rounded-lg bg-primary-500/20 backdrop-blur-sm flex items-center justify-center">
                            <MapPin className="h-3.5 w-3.5 text-primary-300" />
                          </div>
                          <span className="font-medium">{pkg.destination}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-sm">
                          <div className="w-7 h-7 rounded-lg bg-accent-500/20 backdrop-blur-sm flex items-center justify-center">
                            <Calendar className="h-3.5 w-3.5 text-accent-300" />
                          </div>
                          <span className="font-medium text-accent-100">{pkg.duration}</span>
                        </div>
                        <p className="text-sm text-neutral-100/80 leading-relaxed font-light line-clamp-3 pt-1">
                          {pkg.description}
                        </p>
                        
                        {/* Premium CTA hint */}
                        <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-primary-300 uppercase tracking-wider">
                          <span>View Details</span>
                          <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
