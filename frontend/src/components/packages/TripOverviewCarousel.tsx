'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, MapPin, Calendar, Sparkles, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import type { FeaturedPackage } from '@/mocks/featured-packages'

interface TripOverviewCarouselProps {
  title?: string
  packages: FeaturedPackage[]
}

const AUTO_INTERVAL = 3000

export function TripOverviewCarousel({
  title = "Featured Tours",
  packages,
}: TripOverviewCarouselProps) {

  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % packages.length)
  }

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + packages.length) % packages.length)
  }

  // ✅ AUTO SLIDE
  useEffect(() => {
    if (isPaused) return

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % packages.length)
    }, AUTO_INTERVAL)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPaused, packages.length])

  if (packages.length === 0) return null

  return (
    <div className="py-12">

      {/* Title */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-black gradient-text">
          {title}
        </h2>
      </div>

      {/* Carousel */}
      <div
        className="relative w-full h-[420px] flex items-center justify-center overflow-hidden"
        style={{ perspective: '1200px' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >

        {/* Left Button */}
        <button
          onClick={prevSlide}
          className="absolute left-4 z-20 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition"
        >
          <ChevronLeft />
        </button>

        {/* Right Button */}
        <button
          onClick={nextSlide}
          className="absolute right-4 z-20 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition"
        >
          <ChevronRight />
        </button>

        {/* Cards */}
        {packages.map((pkg, index) => {
          const offset = index - activeIndex

          return (
            <div
              key={pkg.id}
              className="absolute transition-all duration-700 ease-in-out cursor-pointer"
              style={{
                transform: `
                  translateX(${offset * 240}px)
                  scale(${offset === 0 ? 1 : 0.75})
                  rotateY(${offset === 0 ? 0 : offset > 0 ? -25 : 25}deg)
                `,
                zIndex: offset === 0 ? 20 : 10 - Math.abs(offset),
                opacity: Math.abs(offset) > 3 ? 0 : 1,
              }}
              onClick={() => setActiveIndex(index)}
            >

              {/* Card */}
              <style>{`
                @keyframes glassShine-dark {
                  0% { left: -100%; }
                  100% { left: 100%; }
                }
                .trip-shimmer-card::before {
                  content: '';
                  position: absolute;
                  top: -50%;
                  left: -100%;
                  width: 35%;
                  height: 200%;
                  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 25%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.35) 75%, transparent 100%);
                  transform: skewX(-20deg);
                  pointer-events: none;
                  border-radius: 2rem;
                  opacity: 0;
                  animation: glassShine-dark 1.5s ease-in-out;
                  filter: blur(2px);
                }
                .trip-shimmer-card:hover::before {
                  opacity: 1;
                  animation: glassShine-dark 1.5s ease-in-out infinite;
                }
              `}</style>
              <div
                className="trip-shimmer-card relative w-[260px] h-[360px] rounded-[2rem] overflow-hidden shadow-2xl bg-neutral-900 transition-all duration-500 hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:scale-105 hover:-translate-y-2 cursor-pointer group"
                onClick={() => router.push(`/packages/${pkg.id}`)}
              >

                {/* Image */}
                <Image
                  src={pkg.image}
                  alt={pkg.name}
                  fill
                  className="object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Price */}
                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-2 rounded-xl text-white text-sm">
                  <div className="flex items-center gap-1 text-[10px] uppercase">
                    <Sparkles className="w-3 h-3" />
                    FROM
                  </div>
                  <div className="font-bold text-lg">
                    {pkg.currency} {pkg.price}
                  </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 p-5 text-white">
                  <h3 className="text-sm font-bold uppercase">
                    {pkg.name}
                  </h3>

                  <div className="flex items-center gap-2 text-xs mt-2">
                    <MapPin className="w-3 h-3" />
                    {pkg.destination}
                  </div>

                  <div className="flex items-center gap-2 text-xs mt-1">
                    <Calendar className="w-3 h-3" />
                    {pkg.duration}
                  </div>
                </div>

                {/* Arrow */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>

              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}