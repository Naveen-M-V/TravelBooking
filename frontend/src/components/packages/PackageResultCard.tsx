'use client'

import { Button } from '@/components/ui/button'
import { MapPin, Calendar, Users, Wifi, Coffee, Utensils, Waves, Heart, ArrowUpRight } from 'lucide-react'
import { HalalRatingBadge } from '@/components/ui/halal-rating-badge'
import Image from 'next/image'

interface PackageResultCardProps {
  package: any
  onSelect: (pkg: any) => void
}

export function PackageResultCard({ package: pkg, onSelect }: PackageResultCardProps) {
  const {
    hotelName,
    location,
    halalRating,
    nights,
    price,
    images,
    amenities,
    roomType,
    boardType,
    checkIn,
    checkOut
  } = pkg

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-teal-400/50 hover:shadow-md">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(80%_60%_at_20%_0%,rgba(20,184,166,0.05),transparent_55%)]" />
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Image */}
        <div className="relative md:col-span-5 h-64 md:h-full overflow-hidden isolate">
          <Image
            src={images[0] || '/placeholder-hotel.jpg'}
            alt={hotelName}
            fill
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/15 transition-all duration-500 group-hover:from-black/75 group-hover:via-black/10" />

          <div className="absolute left-5 top-5 flex items-center gap-2">
            <div className="rounded-full bg-white/90 px-3 py-1.5 shadow-sm ring-1 ring-white/40">
              <HalalRatingBadge rating={halalRating} />
            </div>
          </div>

          <button
            type="button"
            className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 shadow-sm ring-1 ring-white/40 transition-colors hover:bg-white"
            aria-label="Save package"
          >
            <Heart className="h-5 w-5 text-slate-700 transition-all group-hover:text-red-500 group-hover:fill-red-500" />
          </button>

          <div className="absolute bottom-5 left-5 right-5">
            <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight">
              {hotelName}
            </h3>
            <div className="mt-2 flex items-center gap-3 text-sm text-white/85">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {location}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-7">
          <div className="relative p-6 md:p-7">
            <div className="grid grid-cols-1 gap-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <div className="text-xs font-semibold text-gray-400">Duration</div>
                  <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Calendar className="h-4 w-4 text-teal-400" />
                    {nights} Nights
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <div className="text-xs font-semibold text-gray-400">Room</div>
                  <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Users className="h-4 w-4 text-teal-400" />
                    {roomType}
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <div className="text-xs font-semibold text-gray-400">Board</div>
                  <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Utensils className="h-4 w-4 text-teal-400" />
                    {boardType}
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <div className="text-xs font-semibold text-gray-400">Dates</div>
                  <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Calendar className="h-4 w-4 text-teal-400" />
                    {checkIn} → {checkOut}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {amenities.includes('WiFi') && (
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-gray-100" title="WiFi">
                      <Wifi className="h-4 w-4 text-gray-500" />
                    </span>
                  )}
                  {amenities.includes('Breakfast') && (
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-gray-100" title="Breakfast">
                      <Coffee className="h-4 w-4 text-gray-500" />
                    </span>
                  )}
                  {amenities.includes('Restaurant') && (
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-gray-100" title="Restaurant">
                      <Utensils className="h-4 w-4 text-gray-500" />
                    </span>
                  )}
                  {amenities.includes('Pool') && (
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-gray-100" title="Pool">
                      <Waves className="h-4 w-4 text-gray-500" />
                    </span>
                  )}
                  {amenities.length > 0 && (
                    <span className="text-xs font-semibold text-gray-400">+{Math.max(0, amenities.length - 4)} more</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1 text-xs font-semibold">
                    Free Cancellation
                  </span>
                  <span className="rounded-full bg-gray-100 text-gray-500 border border-gray-200 px-3 py-1 text-xs font-semibold hidden sm:inline">
                    Instant Confirmation
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 border-t border-gray-200 pt-5">
                <Button onClick={() => onSelect(pkg)} size="lg" className="rounded-2xl h-11 px-5 bg-teal-500 text-white hover:bg-teal-400">
                  Enquire Now
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
