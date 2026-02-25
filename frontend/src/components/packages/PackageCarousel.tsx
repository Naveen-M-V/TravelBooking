'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { HalalRatingBadge } from '@/components/ui/halal-rating-badge'
import { ChevronLeft, ChevronRight, Star, Calendar, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FeaturedPackage } from '@/mocks/featured-packages'

interface PackageCarouselProps {
  title: string
  packages: FeaturedPackage[]
  onPackageClick: (pkg: FeaturedPackage) => void
}

export function PackageCarousel({ title, packages, onPackageClick }: PackageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const carouselRef = useRef<HTMLDivElement>(null)
  const itemsToShow = 4 // Show 4 packages at a time

  // Auto-scroll effect
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, packages.length - itemsToShow)
        return prev >= maxIndex ? 0 : prev + 1
      })
    }, 5000) // Move every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, packages.length, itemsToShow])

  const handlePrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, packages.length - itemsToShow)
      return prev === 0 ? maxIndex : prev - 1
    })
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, packages.length - itemsToShow)
      return prev >= maxIndex ? 0 : prev + 1
    })
  }

  const visiblePackages = packages.slice(currentIndex, currentIndex + itemsToShow)
  
  // If we don't have enough packages to fill the view, add from the beginning
  if (visiblePackages.length < itemsToShow) {
    visiblePackages.push(...packages.slice(0, itemsToShow - visiblePackages.length))
  }

  return (
    <div className="mb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <div className="w-10 h-0.5 bg-primary rounded-full mt-1.5" />
        </div>
        
        {/* Navigation Arrows */}
        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            className="btn-teal-ghost p-2 rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous packages"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="btn-teal-ghost p-2 rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next packages"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div 
        ref={carouselRef}
        className="relative overflow-hidden"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div 
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-transform duration-700 ease-in-out"
        >
          {visiblePackages.map((pkg, index) => (
            <Card
              key={`${pkg.id}-${index}`}
              className="overflow-hidden hover:shadow-[0_8px_30px_rgba(20,184,166,0.18)] transition-all duration-300 cursor-pointer group border-0 shadow-md"
              onClick={() => onPackageClick(pkg)}
            >
              {/* Image */}
              <div className="relative h-32 overflow-hidden">
                <img
                  src={`https://picsum.photos/seed/${encodeURIComponent(pkg.destination)}/400/200`}
                  alt={pkg.destination}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />

                {/* Halal Rating Badge */}
                <div className="absolute top-2 right-2">
                  <HalalRatingBadge
                    rating={{
                      score: pkg.halalRating,
                      features: pkg.features.slice(0, 2),
                    }}
                  />
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-3">
                {/* Package Name */}
                <h3 className="font-bold text-sm mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
                  {pkg.name}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{pkg.destination}</span>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                  <Calendar className="w-3 h-3" />
                  <span>{pkg.duration}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-3">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-xs">{pkg.rating}</span>
                  <span className="text-xs text-gray-400">({pkg.reviews})</span>
                </div>

                {/* CTA */}
                <div className="border-t pt-2.5">
                  <button className="btn-teal w-full bg-primary text-white font-semibold text-xs py-1.5 px-3 rounded-lg">
                    Enquire Now
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: Math.max(1, packages.length - itemsToShow + 1) }).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAutoPlaying(false)
              setCurrentIndex(index)
            }}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-300',
              currentIndex === index
                ? 'bg-primary w-8'
                : 'bg-gray-300 hover:bg-gray-400'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
