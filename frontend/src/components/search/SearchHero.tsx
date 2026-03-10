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
    <section className="relative w-full bg-gray-50 pt-0">
      {/* Large Hero Image - Full Width, Bigger */}
      <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[650px] overflow-hidden">
        {/* Background Slideshow */}
        {HERO_IMAGES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center transition-all duration-[5000ms]"
            style={{ 
              backgroundImage: `url(${src})`, 
              opacity: i === activeImg ? 1 : 0,
              transform: i === activeImg ? 'scale(1.05)' : 'scale(1)',
              transition: 'opacity 1.5s ease-in-out, transform 5s ease-out'
            }}
          />
        ))}

        {/* Overlay - Lighter gradient to keep image visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />

        {/* Headline Over Image */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight max-w-3xl [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
            Go Explore, <span className="italic font-serif text-cyan-200">It's a Big World</span> Out There!
          </h1>
        </div>
      </div>

      {/* Search Box - Below Hero Image with Better Positioning */}
      <div className="relative -mt-24 sm:-mt-32 md:-mt-40 mb-12 sm:mb-16 md:mb-20 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="relative group">
            {/* Decorative Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/30 to-teal-400/30 rounded-2xl blur-2xl opacity-50 group-hover:opacity-70 transition duration-1000" />
            
            <Tabs defaultValue="flights" className="relative w-full">
              {/* Floating Tabs - Centered Above Card */}
              <div className="flex justify-center mb-6 relative z-20">
                <TabsList className="bg-white/80 backdrop-blur-xl border border-white/20 p-1.5 rounded-xl h-auto shadow-2xl">
                  <TabsTrigger 
                    value="flights" 
                    className="px-4 sm:px-6 py-3 sm:py-3 data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-lg transition-all duration-300 flex flex-col sm:flex-row items-center gap-2 text-xs sm:text-sm text-slate-700"
                  >
                    <Plane className="h-6 w-6 sm:h-5 sm:w-5" />
                    <span className="font-bold uppercase tracking-wide hidden sm:inline">Book Flights</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="packages" 
                    className="px-4 sm:px-6 py-3 sm:py-3 data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-lg transition-all duration-300 flex flex-col sm:flex-row items-center gap-2 text-xs sm:text-sm text-slate-700"
                  >
                    <Building2 className="h-6 w-6 sm:h-5 sm:w-5" />
                    <span className="font-bold uppercase tracking-wide hidden sm:inline">Holiday Packages</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Search Forms - Single Line */}
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-5 md:p-6">
                <TabsContent value="flights" className="mt-0 focus-visible:outline-none">
                  <FlightSearchForm />
                </TabsContent>
                <TabsContent value="packages" className="mt-0 focus-visible:outline-none">
                  <PackageSearchForm />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  )
}
