'use client'

import { useState, useEffect } from 'react'
import { Plane, Building2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FlightSearchForm } from './FlightSearchForm'
import { PackageSearchForm } from './PackageSearchForm'
import { heroImagesAPI } from '@/lib/api/heroImages'

const HERO_IMAGES = [
  '/images/beautiful-view-plaza-de-espana-seville-spain.jpg',
  '/images/cibeles-palace-fountain-plaza-de-cibeles-madrid-spain-scaled.jpg',
  '/images/port-barcelona-evening-spain-scaled.jpg',
  '/images/dawn-view-toledo-scaled.jpg',
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

        {/* Overlay - stronger visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/30 via-neutral-900/10 to-neutral-900/38" />
        <div className="hero-pattern-overlay opacity-[0.18]" />

        {/* Subtle Islamic decorative symbols */}
        <div className="absolute top-8 left-8 w-7 h-7 bg-white/45 islamic-star animate-geometric" />
        <div className="absolute bottom-12 right-10 text-primary-200/80 crescent-moon animate-geometric" style={{ animationDelay: '1.2s' }}></div>

        {/* Headline Over Image */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center -translate-y-4 sm:-translate-y-6 md:-translate-y-10">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-50 tracking-tight leading-tight max-w-4xl [text-shadow:0_4px_16px_rgba(47,43,38,0.55)] px-2">
            Go Explore, <span className="italic font-serif text-accent-100">It's a Big World</span> Out There!
          </h1>
        </div>

        {/* Search Box on Hero */}
        <div className="absolute inset-x-0 bottom-3 sm:bottom-5 md:bottom-7 px-3 sm:px-4 z-20">
          <div className="max-w-6xl mx-auto">
            <div className="relative group">
              {/* Decorative Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-400/35 via-primary-500/20 to-accent-400/25 rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition duration-1000" />

              <Tabs defaultValue="flights" className="relative w-full">
                <div className="flex justify-center mb-1.5 sm:mb-2.5 relative z-20">
                  <TabsList className="bg-white/50 backdrop-blur-2xl border border-neutral-200/80 p-1 sm:p-1.5 rounded-xl h-auto shadow-lg shadow-primary-200/20">
                    <TabsTrigger
                      value="flights"
                      className="px-3 sm:px-5 py-2 sm:py-2.5 data-[state=active]:bg-primary-500 data-[state=active]:text-white rounded-lg transition-all duration-500 ease-out flex flex-row items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-neutral-700 hover:bg-gradient-to-r hover:from-primary-400 hover:to-accent-400 hover:text-white hover:shadow-[0_4px_20px_rgba(43,196,190,0.4)] hover:scale-[1.02]"
                    >
                      <Plane className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 transition-transform duration-300 group-hover:rotate-12" />
                      <span className="font-bold uppercase tracking-wide">Book Flights</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="packages"
                      className="px-3 sm:px-5 py-2 sm:py-2.5 data-[state=active]:bg-accent-500 data-[state=active]:text-white rounded-lg transition-all duration-500 ease-out flex flex-row items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-neutral-700 hover:bg-gradient-to-r hover:from-accent-400 hover:to-primary-400 hover:text-white hover:shadow-[0_4px_20px_rgba(20,184,166,0.4)] hover:scale-[1.02]"
                    >
                      <Building2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 transition-transform duration-300 group-hover:rotate-12" />
                      <span className="font-bold uppercase tracking-wide">Packages</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Search Forms - Glassmorphic */}
                <div className="bg-white/72 backdrop-blur-2xl rounded-2xl shadow-xl shadow-primary-200/20 border border-neutral-200/80 p-3 sm:p-5 md:p-6 overflow-hidden">
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
