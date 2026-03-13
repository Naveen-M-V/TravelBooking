'use client'

import { useState, useEffect } from 'react'
import { Plane, Building2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FlightSearchForm } from './FlightSearchForm'
import { PackageSearchForm } from './PackageSearchForm'
import { heroImagesAPI } from '@/lib/api/heroImages'

const HERO_IMAGES = [
  'https://picsum.photos/seed/dubai-skyline/1600/600',
  'https://picsum.photos/seed/istanbul-mosque/1600/600',
  'https://picsum.photos/seed/maldives-ocean/1600/600',
  'https://picsum.photos/seed/morocco-travel/1600/600',
]

export function SearchHero() {
  const [activeImg, setActiveImg] = useState(0)
  const [heroImages, setHeroImages] = useState(HERO_IMAGES)

  useEffect(() => {
    heroImagesAPI.getPublic()
      .then((res) => {
        const urls = (res.images || [])
          .map((item: { url?: string }) => item?.url)
          .filter((url: string | undefined): url is string => Boolean(url))

        if (urls.length) {
          setHeroImages(urls)
          setActiveImg(0)
        }
      })
      .catch(() => {
        setHeroImages(HERO_IMAGES)
      })
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImg(prev => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroImages.length])

  return (
    <section className="relative w-full pt-0">
      {/* Full-screen Hero */}
      <div className="relative w-full h-[100svh] min-h-[640px] sm:min-h-[700px] md:min-h-[760px] overflow-hidden">
        {/* Background Slideshow */}
        {heroImages.map((src, i) => (
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#30c9d3]/26 via-[#2dbdb8]/8 to-[#2fc6c0]/34" />
        <div className="hero-pattern-overlay" />

        {/* Subtle Islamic decorative symbols */}
        <div className="absolute top-8 left-8 w-7 h-7 bg-white/20 islamic-star animate-geometric" />
        <div className="absolute bottom-12 right-10 text-white/35 crescent-moon animate-geometric" style={{ animationDelay: '1.2s' }}></div>

        {/* Headline Over Image */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center -translate-y-4 sm:-translate-y-6 md:-translate-y-10">
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight max-w-3xl [text-shadow:0_2px_8px_rgba(34,211,238,0.45)] px-2">
            Go Explore, <span className="italic font-serif text-[#FDE6CF]">It's a Big World</span> Out There!
          </h1>
        </div>

        {/* Search Box on Hero */}
        <div className="absolute inset-x-0 bottom-3 sm:bottom-5 md:bottom-7 px-3 sm:px-4 z-20">
          <div className="max-w-6xl mx-auto">
            <div className="relative group">
              {/* Decorative Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#2DBDB8]/40 to-[#30c9d3]/35 rounded-2xl blur-2xl opacity-45 group-hover:opacity-70 transition duration-1000" />

              <Tabs defaultValue="flights" className="relative w-full">
                <div className="flex justify-center mb-1.5 sm:mb-2.5 relative z-20">
                  <TabsList className="bg-white/18 backdrop-blur-2xl border border-white/35 p-1 sm:p-1.5 rounded-xl h-auto shadow-[0_10px_36px_rgba(0,0,0,0.35)]">
                    <TabsTrigger
                      value="flights"
                      className="px-3 sm:px-5 py-2 sm:py-2.5 data-[state=active]:bg-[#30c9d3]/95 data-[state=active]:text-white rounded-lg transition-all duration-300 flex flex-row items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/90"
                    >
                      <Plane className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="font-bold uppercase tracking-wide">Book Flights</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="packages"
                      className="px-3 sm:px-5 py-2 sm:py-2.5 data-[state=active]:bg-[#2dbdb8]/95 data-[state=active]:text-white rounded-lg transition-all duration-300 flex flex-row items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/90"
                    >
                      <Building2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="font-bold uppercase tracking-wide">Packages</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Search Forms - Glassmorphic */}
                <div className="bg-white/14 backdrop-blur-2xl rounded-2xl shadow-[0_20px_55px_rgba(0,0,0,0.38)] border border-white/35 p-3 sm:p-5 md:p-6 overflow-hidden">
                  <div className="hero-pattern-overlay opacity-[0.2]" />
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
      </div>
    </section>
  )
}
