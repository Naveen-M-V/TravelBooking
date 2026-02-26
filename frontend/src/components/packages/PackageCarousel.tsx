'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { HalalRatingBadge } from '@/components/ui/halal-rating-badge'
import { ChevronLeft, ChevronRight, Star, Calendar, MapPin, Heart, Tag } from 'lucide-react'
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
              className="overflow-hidden cursor-pointer group border-0 shadow-[0_12px_30px_rgba(17,24,39,0.10)] hover:shadow-[0_22px_60px_rgba(17,24,39,0.18)] transition-all duration-300 rounded-3xl bg-white"
              onClick={() => onPackageClick(pkg)}
            >
              <div className="relative">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={`https://picsum.photos/seed/${encodeURIComponent(pkg.destination)}/600/450`}
                    alt={pkg.destination}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />

                  {/* Gradient overlay to match reference */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Like button */}
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-3 right-3 grid place-items-center h-10 w-10 rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-sm text-white transition-all duration-300 hover:bg-white/15 hover:scale-105"
                    aria-label="Save package"
                  >
                    <Heart className="h-4 w-4" />
                  </button>

                  {/* Halal Rating Badge */}
                  <div className="absolute top-3 left-3">
                    <HalalRatingBadge
                      rating={{
                        score: pkg.halalRating,
                        features: pkg.features.slice(0, 2),
                      }}
                    />
                  </div>

                  {/* Bottom text overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="text-white font-extrabold text-lg leading-tight line-clamp-1">
                      {pkg.destination}
                    </h3>
                    <p className="text-white/70 text-sm line-clamp-1">
                      {pkg.duration}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-4">
                  <div className="mb-3">
                    <h4 className="font-bold text-sm text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                      {pkg.name}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
                      <Tag className="w-3.5 h-3.5" />
                      <span className="truncate">From ${pkg.price}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[110px]">{pkg.destination}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-xs">{pkg.rating}</span>
                      <span className="text-xs text-gray-400">({pkg.reviews})</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="truncate">{pkg.duration}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button className="w-full rounded-2xl py-2.5 text-sm font-semibold transition-all duration-300 bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.99]">
                      Enquire Now
                    </button>
                  </div>
                </CardContent>
              </div>
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
