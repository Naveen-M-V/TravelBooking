'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react'
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
          <div className="w-8 h-1 bg-gradient-to-r from-transparent to-teal-400 rounded-full"></div>
          <div className="w-16 h-1.5 bg-gradient-to-r from-teal-400 via-orange-400 to-teal-400 rounded-full"></div>
          <div className="w-8 h-1 bg-gradient-to-l from-transparent to-orange-400 rounded-full"></div>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border-2 border-teal-200 flex items-center justify-center text-gray-800 hover:bg-teal-500 hover:text-white hover:scale-110 transition-all duration-300"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        <button
          onClick={() => scroll('right')}
          className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border-2 border-teal-200 flex items-center justify-center text-gray-800 hover:bg-teal-500 hover:text-white hover:scale-110 transition-all duration-300"
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
              <div className="absolute top-4 left-0 z-10 bg-teal-600 text-white text-xs font-semibold px-3 py-2 rounded-r-xl shadow-lg">
                <p className="text-[10px] uppercase tracking-wide text-white/85">Starting from</p>
                <p className="text-sm font-bold text-white leading-tight">{pkg.currency} {pkg.price.toLocaleString()} <span className="text-[11px] font-semibold text-white/85">/person</span></p>
              </div>

              <div className="relative h-[360px] sm:h-[390px] md:h-[400px] rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_25px_70px_rgba(6,182,212,0.32)] transition-all duration-500 hover:-translate-y-1 hover:scale-[1.03]">
                <div className="relative h-full w-full">
                  <Image
                    src={pkg.image}
                    alt={pkg.name}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="pointer-events-none absolute -inset-10 opacity-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0)_58%)] transition-opacity duration-500 group-hover:opacity-100" />

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent text-white p-4 sm:p-6 transition-all duration-500">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold uppercase tracking-wide leading-snug line-clamp-2 mb-0 group-hover:mb-2">
                    {pkg.name}
                  </h3>

                  <div className="max-h-0 opacity-0 overflow-hidden group-hover:max-h-48 group-hover:opacity-100 transition-all duration-500">
                    <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{pkg.destination}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-orange-200 mb-3">
                      <Calendar className="h-4 w-4 text-orange-300" />
                      <span>{pkg.duration}</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed font-light line-clamp-3">
                      {pkg.description}
                    </p>
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
