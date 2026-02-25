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
    <div className="relative overflow-hidden px-4 py-10" style={{ minHeight: '400px' }}>
      {/* Background slideshow */}
      {HERO_IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          style={{ backgroundImage: `url(${src})`, opacity: i === activeImg ? 1 : 0 }}
        />
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/70" />

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-3xl">
        <div className="text-center mb-5">
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg tracking-tight">
            Halal-Friendly Travel, Simplified
          </h1>
          <p className="text-sm text-white/80 drop-shadow">
            Find flights and packages that respect your values
          </p>
        </div>

        {/* Search card */}
        <div className="bg-white rounded-xl shadow-2xl p-4">
          <Tabs defaultValue="flights" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 h-9">
              <TabsTrigger value="flights" className="flex items-center gap-1.5 text-sm">
                <Plane className="h-3.5 w-3.5" />
                Flights
              </TabsTrigger>
              <TabsTrigger value="packages" className="flex items-center gap-1.5 text-sm">
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

        {/* Slide dots */}
        <div className="flex justify-center gap-2 mt-4">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              aria-label={`Background ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === activeImg
                  ? 'bg-white w-6 h-2 shadow'
                  : 'bg-white/45 hover:bg-white/70 w-2 h-2'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
