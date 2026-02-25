'use client'

import { useState, useEffect } from 'react'
import { Plane, Building2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FlightSearchForm } from './FlightSearchForm'
import { PackageSearchForm } from './PackageSearchForm'

const HERO_IMAGES = [
  'https://picsum.photos/seed/dubai-skyline/1600/600',
  'https://picsum.photos/seed/istanbul-mosque/1600/600',
  'https://picsum.photos/seed/maldives-ocean/1600/600',
  'https://picsum.photos/seed/morocco-travel/1600/600',
]

export function SearchHero() {
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImg(prev => (prev + 1) % HERO_IMAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative overflow-hidden px-4 py-14" style={{ minHeight: '560px' }}>
      {/* Background slideshow */}
      {HERO_IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          style={{ backgroundImage: `url(${src})`, opacity: i === activeImg ? 1 : 0 }}
        />
      ))}

      {/* Gradient overlay — deeper at top/bottom for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/75" />

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-3xl">

        {/* Badge pill */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/90 text-xs font-semibold tracking-wide">Halal-Verified Travel Platform</span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-7">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg tracking-tight leading-tight">
            Travel the World,{' '}
            <span className="text-teal-300">the Halal Way</span>
          </h1>
          <p className="text-base text-white/80 drop-shadow max-w-lg mx-auto leading-relaxed">
            Flights, stays &amp; packages — all halal-verified, all in one place
          </p>
        </div>

        {/* Search card */}
        <div className="bg-white rounded-2xl shadow-2xl p-5 ring-1 ring-white/10">
          <Tabs defaultValue="flights" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 h-10 rounded-lg">
              <TabsTrigger value="flights" className="flex items-center gap-1.5 text-sm font-semibold rounded-md">
                <Plane className="h-3.5 w-3.5" />
                Flights
              </TabsTrigger>
              <TabsTrigger value="packages" className="flex items-center gap-1.5 text-sm font-semibold rounded-md">
                <Building2 className="h-3.5 w-3.5" />
                Packages
              </TabsTrigger>
            </TabsList>

            <TabsContent value="flights">
              <FlightSearchForm />
            </TabsContent>

            <TabsContent value="packages">
              <PackageSearchForm />
            </TabsContent>
          </Tabs>
        </div>

        {/* Trust stats strip */}
        <div className="flex justify-center gap-8 mt-6 flex-wrap">
          {[
            { emoji: '✈️', label: '5,000+ Trips Booked' },
            { emoji: '🕌', label: '50+ Halal Destinations' },
            { emoji: '⭐', label: '4.9 / 5 Rating' },
          ].map(({ emoji, label }) => (
            <div key={label} className="flex items-center gap-2 text-white/75 text-sm font-medium">
              <span>{emoji}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Slide dots */}
        <div className="flex justify-center gap-2 mt-5">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              aria-label={`Background ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === activeImg
                  ? 'bg-white w-7 h-2 shadow-lg'
                  : 'bg-white/40 hover:bg-white/65 w-2 h-2'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
