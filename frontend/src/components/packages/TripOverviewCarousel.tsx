'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, MapPin, Calendar, Sparkles, ArrowUpRight } from 'lucide-react'
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
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
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 md:px-8 pb-8 scrollbar-hide"
          style={{ scrollbarWidth: 'none', perspective: '1500px' }}
          onMouseEnter={() => { pausedRef.current = true }}
          onMouseLeave={() => { pausedRef.current = false; setHoveredIndex(null) }}
        >
          {doubled.map((pkg, index) => {
            const isHovered = hoveredIndex === index
            return (
              <div
                key={`${pkg.id}-${index}`}
                data-trip-card="true"
                className="relative flex-shrink-0 w-[70vw] sm:w-[38vw] lg:w-[26vw] xl:w-[calc((100%-8rem)/4)] max-w-[300px] xl:max-w-none cursor-pointer snap-start"
                style={{ 
                  transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  zIndex: isHovered ? 10 : 1
                }}
                onClick={() => router.push(`/packages/${pkg.id}`)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Luxury Compact Card */}
                <div className="relative h-[320px] sm:h-[340px] md:h-[360px] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_70px_rgba(15,118,110,0.3)] transition-all duration-500 bg-neutral-900 ring-1 ring-white/10">
                  
                  {/* Animated Border Glow */}
                  <div 
                    className="absolute inset-0 rounded-[2rem] p-[1px] transition-opacity duration-500"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      background: 'linear-gradient(135deg, rgba(43,196,190,0.6), rgba(15,118,110,0.3), rgba(43,196,190,0.6))'
                    }}
                  />

                  {/* Image */}
                  <div className="relative h-full w-full">
                    <Image
                      src={pkg.image}
                      alt={pkg.name}
                      fill
                      className="object-cover object-center transition-all duration-700 ease-out"
                      style={{
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                        filter: isHovered ? 'brightness(0.75)' : 'brightness(0.9)'
                      }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500"
                      style={{ opacity: isHovered ? 1 : 0.7 }}
                    />

                    {/* Subtle Glow on Hover */}
                    <div 
                      className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
                      style={{
                        opacity: isHovered ? 0.6 : 0,
                        background: 'radial-gradient(circle at 70% 20%, rgba(43,196,190,0.2) 0%, transparent 60%)'
                      }}
                    />
                  </div>

                  {/* Price Badge - Top Left - Glass Style */}
                  <div className="absolute top-4 left-4 z-20 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 px-3 py-2 shadow-lg">
                    <div className="flex items-center gap-1 text-[9px] font-bold text-white/90 uppercase tracking-wider mb-0.5">
                      <Sparkles className="h-2.5 w-2.5" />
                      <span>FROM</span>
                    </div>
                    <div className="text-lg font-black text-white leading-none">
                      {pkg.currency} {pkg.price.toLocaleString()}
                    </div>
                    <div className="text-[9px] text-white/70 mt-0.5">
                      / person
                    </div>
                  </div>

                  {/* Quick Action - Top Right */}
                  <div 
                    className="absolute top-4 right-4 z-20 transition-all duration-500"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered ? 'translateY(0)' : 'translateY(-10px)',
                    }}
                  >
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/30">
                      <ArrowUpRight className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  {/* Content - Bottom Left */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    {/* Title Always Visible */}
                    <h3 className="text-sm sm:text-base font-black uppercase tracking-[0.08em] leading-tight line-clamp-2 mb-1 font-display">
                      <span className="bg-gradient-to-r from-white via-white to-primary-200 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        {pkg.name}
                      </span>
                    </h3>

                    {/* Compact Divider */}
                    <div className="flex items-center gap-2 mb-3">
                      <div 
                        className="h-[2px] bg-gradient-to-r from-accent-400 to-primary-400 rounded-full transition-all duration-500"
                        style={{ width: isHovered ? '25px' : '12px' }}
                      />
                      <div className="w-1 h-1 rounded-full bg-accent-400" />
                    </div>

                    {/* Details Panel - Slides Up on Hover */}
                    <div 
                      className="transition-all duration-500 overflow-hidden"
                      style={{
                        maxHeight: isHovered ? '140px' : '0px',
                        opacity: isHovered ? 1 : 0,
                      }}
                    >
                      <div className="space-y-2 pb-1">
                        {/* Location */}
                        <div className="flex items-center gap-2 text-xs text-white/90">
                          <MapPin className="h-3 w-3 text-primary-300 flex-shrink-0" />
                          <span className="line-clamp-1 font-medium">{pkg.destination}</span>
                        </div>
                        
                        {/* Duration */}
                        <div className="flex items-center gap-2 text-xs text-accent-100">
                          <Calendar className="h-3 w-3 text-accent-300 flex-shrink-0" />
                          <span className="font-medium">{pkg.duration}</span>
                        </div>

                        {/* Description */}
                        <p className="text-[11px] text-white/70 leading-snug line-clamp-2 pt-1">
                          {pkg.description}
                        </p>

                        {/* Mini CTA */}
                        <div className="flex items-center gap-1.5 pt-2 text-[10px] font-bold text-accent-300 uppercase tracking-wider">
                          <span>Explore</span>
                          <ChevronRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Corner Accent */}
                  <div 
                    className="absolute top-4 left-4 w-6 h-6 transition-opacity duration-500"
                    style={{ opacity: isHovered ? 0.5 : 0.3 }}
                  >
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-white/60 to-transparent" />
                    <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-white/60 to-transparent" />
                  </div>
                </div>
              </div>
            )
          })}
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
