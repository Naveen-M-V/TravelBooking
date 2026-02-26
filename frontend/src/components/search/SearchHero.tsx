'use client'

import { useState, useEffect } from 'react'
import { Plane, Building2, ShieldCheck, MapPin, Star } from 'lucide-react'
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
    <section className="relative min-h-[480px] flex items-center justify-center overflow-hidden px-4 py-10">
      {/* Background Slideshow */}
      {HERO_IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[5000ms] ease-out"
          style={{ 
            backgroundImage: `url(${src})`, 
            opacity: i === activeImg ? 1 : 0,
            transform: i === activeImg ? 'scale(1.05)' : 'scale(1)',
            transition: 'opacity 1.5s ease-in-out, transform 5s ease-out'
          }}
        />
      ))}

      {/* Premium Overlays */}
      <div className="absolute inset-0 bg-black/40 backdrop-brightness-90" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/60" />

      <div className="relative z-10 container mx-auto max-w-5xl">
        {/* Elite Headline Section */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 backdrop-blur-md mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span className="text-teal-50 text-[10px] font-bold tracking-[0.2em] uppercase">Premium Halal Concierge</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
            Elevate Your <span className="italic font-serif text-teal-200">Journey</span>
          </h1>
        </div>

        {/* --- UNIQUE SEARCH CARD START --- */}
        <div className="relative group max-w-3xl mx-auto">
          {/* Decorative Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000" />
          
          <Tabs defaultValue="flights" className="relative w-full">
            {/* Unique Floating Tabs */}
            <div className="flex justify-center -mb-6 relative z-20">
              <TabsList className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-1.5 rounded-2xl h-auto shadow-2xl">
                <TabsTrigger 
                  value="flights" 
                  className="px-8 py-3 data-[state=active]:bg-white data-[state=active]:text-slate-900 rounded-xl transition-all duration-300 gap-2"
                >
                  <Plane className="h-4 w-4" />
                  <span className="font-bold text-xs uppercase tracking-wider">Book Flights</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="packages" 
                  className="px-8 py-3 data-[state=active]:bg-white data-[state=active]:text-slate-900 rounded-xl transition-all duration-300 gap-2"
                >
                  <Building2 className="h-4 w-4" />
                  <span className="font-bold text-xs uppercase tracking-wider">Holiday Packages</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Main Card Body */}
            <div className="bg-white/90 backdrop-blur-3xl rounded-[2rem] p-5 pt-12 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)] border border-white/20">
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
    </section>
  )
}
