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
    <div className="py-8 md:py-12">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3">
          <span className="gradient-text">{title}</span>
        </h2>
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-1 bg-gradient-to-r from-transparent to-primary-400 rounded-full"></div>
          <div className="w-16 h-1.5 bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 rounded-full"></div>
          <div className="w-8 h-1 bg-gradient-to-l from-transparent to-accent-400 rounded-full"></div>
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
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-3 md:px-4 pb-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none' }}
          onMouseEnter={() => { pausedRef.current = true }}
          onMouseLeave={() => { pausedRef.current = false }}
        >
          {doubled.map((pkg, index) => (
            <div
              key={`${pkg.id}-${index}`}
              data-trip-card="true"
              className="relative flex-shrink-0 w-[82vw] sm:w-[46vw] lg:w-[31vw] xl:w-[calc((100%-3rem)/4)] max-w-[340px] xl:max-w-none group cursor-pointer snap-start"
              onClick={() => router.push(`/packages/${pkg.id}`)}
            >
              <div className="absolute top-4 left-0 z-10 rounded-r-2xl border border-neutral-50/25 bg-neutral-900/52 backdrop-blur-md px-3 py-2.5 shadow-xl">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-100/95">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>From</span>
                </div>
                <p className="mt-1 text-base font-extrabold leading-none text-neutral-50 [text-shadow:0_2px_8px_rgba(0,0,0,0.55)]">
                  {pkg.currency} {pkg.price.toLocaleString()}
                </p>
                <p className="mt-1 text-xs font-medium leading-none text-neutral-100/90 [text-shadow:0_1px_6px_rgba(0,0,0,0.55)]">/ person</p>
              </div>

              <div className="relative h-[360px] sm:h-[390px] md:h-[400px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.03]">
                <div className="relative h-full w-full">
                  <Image
                    src={pkg.image}
                    alt={pkg.name}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="pointer-events-none absolute inset-0 opacity-0 bg-[radial-gradient(circle_at_center,rgba(43,196,190,0.34)_0%,rgba(43,196,190,0.08)_36%,rgba(43,196,190,0)_66%)] transition-opacity duration-500 group-hover:opacity-100 group-hover:animate-pulse" />

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/70 to-transparent p-4 sm:p-6 transition-all duration-500">
                  <div className="rounded-2xl bg-neutral-900/42 ring-1 ring-neutral-50/12 backdrop-blur-sm p-3.5 sm:p-4 text-neutral-50">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold uppercase tracking-wide leading-snug line-clamp-2 mb-0 group-hover:mb-2 [text-shadow:0_4px_14px_rgba(0,0,0,0.72)]">
                      {pkg.name}
                    </h3>

                    <div className="max-h-0 opacity-0 overflow-hidden group-hover:max-h-48 group-hover:opacity-100 transition-all duration-500">
                      <div className="flex items-center gap-2 text-sm text-neutral-100/95 mb-2 [text-shadow:0_3px_10px_rgba(0,0,0,0.65)]">
                        <MapPin className="h-4 w-4" />
                        <span>{pkg.destination}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-accent-100 mb-3 [text-shadow:0_3px_10px_rgba(0,0,0,0.65)]">
                        <Calendar className="h-4 w-4 text-accent-200" />
                        <span>{pkg.duration}</span>
                      </div>
                      <p className="text-sm text-neutral-100/85 leading-relaxed font-light line-clamp-3">
                        {pkg.description}
                      </p>
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
