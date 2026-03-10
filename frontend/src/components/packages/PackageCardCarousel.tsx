'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin, Calendar, Users, Heart } from 'lucide-react'

interface PackageCard {
  id: string
  name: string
  destination: string
  duration: string
  price: { total: number; currency: string }
  images: string[]
  nights: number
}

interface PackageCardCarouselProps {
  title?: string
  packages: PackageCard[]
  onCardClick: (pkg: PackageCard) => void
  onWishlistToggle: (pkg: PackageCard) => void
  wishlistIds: Set<string>
}

export function PackageCardCarousel({ title = "Featured Packages", packages, onCardClick, onWishlistToggle, wishlistIds }: PackageCardCarouselProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Show only first 4 packages for carousel effect
  const displayPackages = packages.slice(0, 4)

  return (
    <div className="relative py-12">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3">
          <span className="gradient-text">{title}</span>
        </h2>
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-1 bg-gradient-to-r from-transparent to-teal-400 rounded-full"></div>
          <div className="w-16 h-1.5 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 rounded-full"></div>
          <div className="w-8 h-1 bg-gradient-to-l from-transparent to-cyan-400 rounded-full"></div>
        </div>
      </div>

      <div className="relative">
      {/* Container */}
      <div className="flex justify-center items-center min-h-[400px] px-4">
        <div className="flex items-center gap-0" style={{ perspective: '1000px' }}>
          {displayPackages.map((pkg, index) => {
            const isHovered = hoveredIndex === index
            const isAfterHovered = hoveredIndex !== null && index > hoveredIndex

            return (
              <div
                key={pkg.id}
                className={`
                  relative flex flex-col
                  h-[400px] w-[280px]
                  bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900
                  rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)]
                  transition-all duration-500 ease-out
                  cursor-pointer
                  ${index !== 0 ? '-ml-32' : ''}
                  ${isHovered ? 'translate-y-[-30px] z-30 scale-105' : 'z-10'}
                  ${isAfterHovered ? 'translate-x-[80px]' : ''}
                  hover:shadow-[0_20px_60px_rgba(20,184,166,0.4)]
                `}
                style={{
                  transformStyle: 'preserve-3d',
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onCardClick(pkg)}
              >
                {/* Card Content */}
                <div className="relative h-full w-full rounded-2xl overflow-hidden">
                  {/* Background Image with Overlay */}
                  <div className="absolute inset-0">
                    <Image
                      src={pkg.images[0] || '/placeholder-package.jpg'}
                      alt={pkg.name}
                      fill
                      className="object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col p-6">
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onWishlistToggle(pkg)
                      }}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors z-20"
                    >
                      <Heart
                        className={`h-5 w-5 transition-colors ${
                          wishlistIds.has(pkg.id) ? 'fill-red-500 text-red-500' : 'text-white'
                        }`}
                      />
                    </button>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2 pr-12">
                      {pkg.name}
                    </h3>

                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-auto">
                      <div
                        className={`h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 transition-all duration-700 ease-out ${
                          isHovered ? 'w-4/5' : 'w-0'
                        }`}
                      />
                    </div>

                    {/* Bottom Info */}
                    <div className="space-y-3 mt-4">
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin className="h-4 w-4 text-teal-400" />
                        <span className="text-sm">{pkg.destination}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="h-4 w-4 text-cyan-400" />
                        <span className="text-sm">{pkg.duration}</span>
                      </div>

                      {/* Circular Progress (SVG) */}
                      <div className="flex justify-center pt-4">
                        <svg width="120" height="120" className="transform rotate-[-90deg]">
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="3"
                            fill="transparent"
                          />
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            stroke="url(#gradient)"
                            strokeWidth="3"
                            fill="transparent"
                            strokeDasharray="314"
                            strokeDashoffset={isHovered ? 100 : 314}
                            className="transition-all duration-700 ease-out"
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#14B8A6" />
                              <stop offset="50%" stopColor="#06B6D4" />
                              <stop offset="100%" stopColor="#14B8A6" />
                            </linearGradient>
                          </defs>
                        </svg>
                        {/* Price in center of circle */}
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold text-white">
                            {pkg.price.total.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-400">{pkg.price.currency}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      </div>
    </div>
  )
}
