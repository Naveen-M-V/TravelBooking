'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react'
import Image from 'next/image'
import type { FeaturedPackage } from '@/mocks/featured-packages'

interface TripOverviewCarouselProps {
  title?: string
  packages: FeaturedPackage[]
}

export function TripOverviewCarousel({ title = "Featured Tours", packages }: TripOverviewCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return
    const scrollAmount = 320
    const newScrollLeft = carouselRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount)
    carouselRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
  }

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
          className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-6 sm:px-8 md:px-16 pb-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none' }}
        >
          {packages.map((pkg, index) => (
            <div
              key={`${pkg.id}-${index}`}
              className="relative flex-shrink-0 w-[250px] sm:w-[280px] md:w-[300px] group cursor-pointer snap-center"
            >
              <div className="absolute top-4 left-0 z-10 bg-teal-600 text-white text-xs font-semibold px-3 py-2 rounded-r-xl shadow-lg">
                {pkg.currency} {pkg.price.toLocaleString()}
              </div>

              <div className="relative h-[360px] sm:h-[390px] md:h-[400px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="relative h-full w-full">
                  <Image
                    src={pkg.image}
                    alt={pkg.name}
                    fill
                    className="object-cover object-center"
                  />
                </div>

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

        <div className="flex justify-center gap-2 mt-6">
          {packages.slice(0, Math.min(10, packages.length)).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!carouselRef.current) return
                const cardWidth = 320
                carouselRef.current.scrollTo({ left: cardWidth * index, behavior: 'smooth' })
              }}
              className="w-3 h-3 rounded-full bg-gray-300 hover:bg-teal-500 transition-colors duration-300"
            />
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
