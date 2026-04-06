'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BadgeCheck, Headphones, Lock, Plane, XCircle, BookOpen, Compass, MapPin, Utensils, Star } from 'lucide-react'
import { SearchHero } from '@/components/search/SearchHero'
import { TripOverviewCarousel } from '@/components/packages/TripOverviewCarousel'
import {
  getBestPackages,
  getPopularPackages,
  getTopDestinationPackages,
  getFamilyPackages,
  type FeaturedPackage,
} from '@/mocks/featured-packages'
import { packagesAPI } from '@/lib/api/packages'
import { wishlistAPI } from '@/lib/api/wishlist'
import { testimonialsAPI, type Testimonial } from '@/lib/api/testimonials'
import { testimonialFallbackMockData } from '@/mocks/testimonials'
import { aboutMarketStats } from '@/data/aboutContent'
import { useAuth } from '@/context/AuthContext'

function normalizePackage(p: any): FeaturedPackage {
  return {
    id:            p.id,
    name:          p.name,
    destination:   p.destination,
    country:       p.country,
    duration:      p.duration,
    price:         Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
    currency:      p.currency ?? 'SAR',
    image:         p.coverImage || p.images?.[0] || `https://picsum.photos/seed/${encodeURIComponent(p.id)}/800/600`,
    halalRating:   4,
    features:      Array.isArray(p.features)   ? p.features   : [],
    category:      (p.category ?? 'best') as FeaturedPackage['category'],
    description:   p.description ?? '',
    highlights:    Array.isArray(p.highlights)  ? p.highlights  : [],
    included:      Array.isArray(p.included)    ? p.included    : [],
    itinerary:     Array.isArray(p.itinerary)   ? p.itinerary   : [],
  }
}

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()
  const [bestPkgs,    setBestPkgs]    = useState<FeaturedPackage[]>(getBestPackages())
  const [popularPkgs, setPopularPkgs] = useState<FeaturedPackage[]>(getPopularPackages())
  const [topDestPkgs, setTopDestPkgs] = useState<FeaturedPackage[]>(getTopDestinationPackages())
  const [familyPkgs,  setFamilyPkgs]  = useState<FeaturedPackage[]>(getFamilyPackages())
  const [testimonials, setTestimonials] = useState<Testimonial[]>(testimonialFallbackMockData)
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    packagesAPI.getAll({ isActive: true })
      .then((res) => {
        const pkgs = (res.packages || []).map(normalizePackage)
        const by = (cat: string) => pkgs.filter((p: FeaturedPackage) => p.category === cat)
        const best    = by('best')
        const popular = by('popular')
        const topDest = by('top-destination')
        const family  = by('family')
        if (best.length)    setBestPkgs(best)
        if (popular.length) setPopularPkgs(popular)
        if (topDest.length) setTopDestPkgs(topDest)
        if (family.length)  setFamilyPkgs(family)
      })
      .catch(() => {}) // keep mocks if API unavailable
  }, [])

  useEffect(() => {
    if (!user) {
      setWishlistIds(new Set())
      return
    }

    wishlistAPI.getMine()
      .then((res) => {
        const ids = new Set<string>((res.items || []).map((item: any) => item.packageId))
        setWishlistIds(ids)
      })
      .catch(() => setWishlistIds(new Set()))
  }, [user])

  useEffect(() => {
    testimonialsAPI.getPublic({ limit: 3 })
      .then((res) => {
        if (Array.isArray(res.testimonials) && res.testimonials.length > 0) {
          setTestimonials(res.testimonials.slice(0, 3))
        }
      })
      .catch(() => {
        setTestimonials(testimonialFallbackMockData)
      })
  }, [])

  const handleCardClick = (pkg: any) => {
    router.push(`/packages/${pkg.id}`)
  }

  const toggleWishlist = async (pkg: any) => {
    if (!user) {
      router.push('/login')
      return
    }

    const packageId = pkg.id as string
    const isWishlisted = wishlistIds.has(packageId)

    try {
      if (isWishlisted) {
        await wishlistAPI.remove(packageId)
        setWishlistIds(prev => {
          const next = new Set(prev)
          next.delete(packageId)
          return next
        })
      } else {
        await wishlistAPI.add(packageId)
        setWishlistIds(prev => new Set([...prev, packageId]))
      }
    } catch (error: any) {
      alert(error?.response?.data?.error || 'Failed to update wishlist')
    }
  }

  const ensureRollingData = (pkgs: FeaturedPackage[], target = 12) => {
    if (!pkgs.length) return pkgs
    if (pkgs.length >= target) return pkgs
    return Array.from({ length: target }, (_, idx) => pkgs[idx % pkgs.length])
  }

  const rollingBestPkgs = useMemo(() => ensureRollingData(bestPkgs, 12), [bestPkgs])
  const rollingPopularPkgs = useMemo(() => ensureRollingData(popularPkgs, 12), [popularPkgs])
  const rollingTopDestPkgs = useMemo(() => ensureRollingData(topDestPkgs, 12), [topDestPkgs])
  const rollingFamilyPkgs = useMemo(() => ensureRollingData(familyPkgs, 12), [familyPkgs])

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-neutral-50 via-primary-50/35 to-neutral-100">
      <div className="pointer-events-none absolute inset-0 opacity-[0.32]" style={{ backgroundImage: "url('/image.png')", backgroundSize: '140px 140px' }} />
      <div className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-primary-200/35 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-[28%] -right-32 w-[460px] h-[460px] rounded-full bg-gradient-to-br from-accent-200/25 to-transparent blur-3xl" />

      {/* Hero Search Section */}
      <SearchHero />

      {/* Why Choose Us strip */}
      <section className="py-12 sm:py-14 md:py-16 px-4 bg-gradient-to-br from-white via-primary-50/25 to-accent-50/20 border-b border-primary-100/60 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.28]" style={{ backgroundImage: "url('/image.png')", backgroundSize: '140px 140px' }} />
        <div className="absolute inset-0 islamic-pattern opacity-30" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/70 to-transparent" />
        {/* Decorative floating circles - smaller on mobile */}
        <div className="absolute top-5 sm:top-10 left-10 sm:left-20 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-primary-200/20 to-accent-200/20 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-5 sm:bottom-10 right-10 sm:right-20 w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-br from-accent-200/20 to-primary-200/20 rounded-full blur-2xl animate-float-slow"></div>
        
        <div className="container mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center relative z-10">
            {[
              { Icon: BadgeCheck, title: 'Halal Verified', desc: 'Every stay, experience, and package is reviewed for halal compliance', color: 'from-primary-500 to-accent-400' },
              { Icon: Lock, title: 'Secure Checkout', desc: 'Encrypted payments with privacy-first data protection', color: 'from-primary-400 to-primary-500' },
              { Icon: Headphones, title: 'Concierge Support', desc: 'Specialists available whenever you need assistance', color: 'from-primary-500 to-supporting-sage-400' },
            ].map(({ Icon, title, desc, color }) => (
            <div key={title} className="flex flex-col items-center group px-3 py-5 rounded-[2rem] bg-white/75 border border-white/90 shadow-[0_16px_40px_rgba(15,118,110,0.12)] backdrop-blur-sm">
              <div className="mb-3 sm:mb-4 relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
                <div className="relative rounded-2xl bg-white shadow-lg ring-1 ring-primary-100 p-3 sm:p-4 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                  <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary-600" />
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2 text-primary-700">{title}</h3>
              <p className="text-neutral-700 text-sm leading-relaxed max-w-xs">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-primary-50/30 to-white" />
        <div className="absolute inset-0 opacity-[0.24]" style={{ backgroundImage: "url('/image.png')", backgroundSize: '140px 140px' }} />
        <div className="absolute top-8 left-10 text-cyan-500/15 crescent-moon animate-geometric" />
        <div className="absolute top-20 right-14 text-orange-400/20 crescent-moon animate-geometric" style={{ animationDelay: '1.3s' }} />
        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16 relative">
            {/* Decorative floating orbs */}
            <div className="absolute -top-8 left-1/4 w-32 h-32 bg-gradient-to-br from-primary-200/20 to-accent-200/10 rounded-full blur-3xl" />
            <div className="absolute -top-4 right-1/4 w-24 h-24 bg-gradient-to-br from-accent-200/20 to-primary-200/10 rounded-full blur-2xl" />
            
            {/* Islamic star decorations */}
            <div className="absolute -top-6 left-[15%] sm:left-1/4 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-teal-400 via-primary-400 to-orange-400 islamic-star opacity-60 animate-pulse shadow-lg shadow-primary-200/30"></div>
            <div className="absolute -top-2 right-[15%] sm:right-1/4 w-5 h-5 sm:w-7 sm:h-7 bg-gradient-to-br from-orange-400 via-accent-400 to-teal-400 islamic-star opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-100/90 to-accent-100/90 border border-primary-200/80 px-5 sm:px-6 py-2 sm:py-2.5 mb-4 sm:mb-5 shadow-lg shadow-primary-100/20 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 animate-pulse"></span>
              <span className="text-primary-800 text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.22em]">Explore</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mt-3 mb-4 sm:mb-5 px-2 tracking-tight font-display">
              <span className="gradient-text drop-shadow-[0_2px_12px_rgba(15,118,110,0.15)]" style={{ textShadow: '0 0 50px rgba(43,196,190,0.12)' }}>Discover Amazing</span>
              <br />
              <span className="text-primary-700">Packages</span>
            </h2>
            
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-10 h-[2px] bg-gradient-to-r from-transparent via-primary-300 to-primary-400 rounded-full"></div>
              <div className="w-20 h-[3px] bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 rounded-full shadow-sm shadow-accent-200/50"></div>
              <div className="w-10 h-[2px] bg-gradient-to-l from-transparent via-accent-300 to-accent-400 rounded-full"></div>
            </div>
            
            <p className="text-neutral-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
              Handpicked halal-friendly tours for <span className="text-primary-600 font-semibold">unforgettable experiences</span>
            </p>
          </div>

          {/* Our Best Tour Packages */}
          <div className="rounded-[2.5rem] bg-gradient-to-br from-white/90 via-white/80 to-primary-50/40 border border-white/90 shadow-[0_24px_80px_rgba(15,118,110,0.14)] backdrop-blur-xl px-4 sm:px-6 py-2 ring-1 ring-primary-100/50">
            <TripOverviewCarousel
              title="Our Best Tour Packages"
              packages={rollingBestPkgs}
              reverse={false}
            />
          </div>

          {/* New & Most Popular Tours */}
          <div className="rounded-[2.5rem] bg-gradient-to-br from-white/90 via-white/80 to-accent-50/30 border border-white/90 shadow-[0_24px_80px_rgba(15,118,110,0.14)] backdrop-blur-xl px-4 sm:px-6 py-2 mt-8 sm:mt-10 ring-1 ring-accent-100/50">
            <TripOverviewCarousel
              title="New &amp; Most Popular Tours"
              packages={rollingPopularPkgs}
              reverse
            />
          </div>

          {/* Top Destinations */}
          <div className="rounded-[2.5rem] bg-gradient-to-br from-white/90 via-white/80 to-primary-50/40 border border-white/90 shadow-[0_24px_80px_rgba(15,118,110,0.14)] backdrop-blur-xl px-4 sm:px-6 py-2 mt-8 sm:mt-10 ring-1 ring-primary-100/50">
            <TripOverviewCarousel
              title="Top Destinations"
              packages={rollingTopDestPkgs}
              reverse={false}
            />
          </div>

          {/* Family Destinations */}
          <div className="rounded-[2.5rem] bg-gradient-to-br from-white/90 via-white/80 to-supporting-sand-50/40 border border-white/90 shadow-[0_24px_80px_rgba(15,118,110,0.14)] backdrop-blur-xl px-4 sm:px-6 py-2 mt-8 sm:mt-10 ring-1 ring-supporting-sand-200/50">
            <TripOverviewCarousel
              title="Family Destinations"
              packages={rollingFamilyPkgs}
              reverse
            />
          </div>
        </div>
      </section>

      {/* #HTC Muslim Friendly Services */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-primary-50/60 via-primary-50/35 to-accent-50/20 relative overflow-hidden islamic-pattern">
        <div className="absolute inset-0 opacity-[0.24]" style={{ backgroundImage: "url('/image.png')", backgroundSize: '140px 140px' }} />
        {/* Islamic geometric patterns and animated elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-br from-teal-300/20 to-transparent rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-5 sm:bottom-10 right-5 sm:right-10 w-56 sm:w-72 h-56 sm:h-72 bg-gradient-to-br from-cyan-300/20 to-transparent rounded-full blur-3xl" style={{ animation: 'float 8s ease-in-out infinite', animationDelay: '1s' }}></div>
          {/* Crescent moons in corners */}
          <div className="absolute top-5 sm:top-10 right-10 sm:right-20 crescent-moon text-teal-500/20 sm:text-teal-500/15 animate-geometric" style={{ animationDelay: '0s' }}></div>
          <div className="absolute bottom-8 sm:bottom-16 left-10 sm:left-20 crescent-moon text-cyan-500/20 sm:text-cyan-500/15 animate-geometric" style={{ animationDelay: '3s' }}></div>
          {/* Islamic stars */}
          <div className="absolute top-1/4 right-1/3 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-teal-400/25 to-cyan-400/25 islamic-star animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/3 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-cyan-400/25 to-teal-400/25 islamic-star animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-14 sm:mb-18">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-100/90 to-accent-100/90 border border-primary-200/80 px-5 py-2 mb-5 shadow-sm backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 animate-pulse" />
              <span className="text-primary-800 text-[10px] font-bold uppercase tracking-[0.2em]">#HTC</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mt-3 mb-4 px-2 tracking-tight font-display">
              <span className="gradient-text">Halal / Muslim Friendly</span>
              <br />
              <span className="text-primary-700">Services</span>
            </h2>
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-10 h-[2px] bg-gradient-to-r from-transparent via-primary-300 to-primary-400 rounded-full"></div>
              <div className="w-16 h-[3px] bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 rounded-full shadow-sm shadow-accent-200/30"></div>
              <div className="w-10 h-[2px] bg-gradient-to-l from-transparent via-accent-300 to-accent-400 rounded-full"></div>
            </div>
            <p className="text-neutral-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light px-4">
              Every detail of your stay is carefully managed to meet your <span className="text-primary-600 font-semibold">Halal travel needs</span>
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" style={{ perspective: '1200px' }}>
            {[
              { Icon: XCircle,   title: 'Mini Bar Removal',      desc: 'No liquor or alcohol-related items in hotel room mini bars. Pure, halal-compliant environment.', gradient: 'from-rose-400 via-rose-500 to-pink-500', iconBg: 'bg-rose-500', ringColor: 'ring-rose-300' },
              { Icon: BookOpen,  title: 'Prayer Mat Provided',     desc: 'Fresh prayer mats available in every hotel room for your daily prayers and spiritual needs.', gradient: 'from-teal-400 via-teal-500 to-emerald-500', iconBg: 'bg-teal-500', ringColor: 'ring-teal-300' },
              { Icon: Compass,   title: 'Qiblah Direction Marked', desc: 'Clearly marked Qiblah direction in hotel rooms for convenient and accurate prayer orientation.', gradient: 'from-cyan-400 via-cyan-500 to-blue-500', iconBg: 'bg-cyan-500', ringColor: 'ring-cyan-300' },
              { Icon: MapPin,    title: 'Nearby Mosques Info',    desc: 'Comprehensive information on nearby mosques and prayer facilities for easy access during your stay.', gradient: 'from-teal-400 via-cyan-500 to-teal-500', iconBg: 'bg-cyan-500', ringColor: 'ring-cyan-300' },
              { Icon: Utensils,  title: 'Halal Restaurants Guide', desc: 'Curated list of Muslim-owned and halal-certified restaurants near your accommodation.', gradient: 'from-orange-400 via-orange-500 to-amber-500', iconBg: 'bg-orange-500', ringColor: 'ring-orange-300' },
            ].map(({ Icon, title, desc, gradient, iconBg, ringColor }) => (
              <div
                key={title}
                className="relative h-[260px] sm:h-[280px] cursor-pointer group"
                style={{ perspective: '1200px' }}
              >
                {/* Flip Container */}
                <div
                  className="relative w-full h-full transition-transform duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:[transform:rotateY(180deg)]"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front Side - Icon Only */}
                  <div
                    className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/90 via-white/80 to-neutral-50/90 backdrop-blur-2xl border border-white/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    {/* Subtle gradient orb */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br ${gradient} rounded-full blur-3xl opacity-20`} />
                    
                    <div className="relative h-full w-full flex flex-col items-center justify-center">
                      {/* Premium Icon Container */}
                      <div className="relative">
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`}></div>
                        <div className={`relative h-20 w-20 sm:h-24 sm:w-24 rounded-3xl bg-gradient-to-br from-white to-neutral-50 ${ringColor} ring-2 flex items-center justify-center shadow-[0_12px_40px_rgba(0,0,0,0.12)] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.18)] group-hover:scale-105 transition-all duration-500`}>
                          <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl ${iconBg} flex items-center justify-center shadow-lg`}>
                            <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" strokeWidth={1.5} />
                          </div>
                        </div>
                      </div>
                      
                      {/* Elegant hint text */}
                      <div className="mt-6 flex items-center gap-2">
                        <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
                        <p className="text-[10px] text-neutral-400 font-medium tracking-[0.15em] uppercase">Discover</p>
                        <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
                      </div>
                    </div>
                    
                    {/* Decorative corner accents */}
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
                    <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
                  </div>

                  {/* Back Side - Details */}
                  <div
                    className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white via-neutral-50/50 to-white backdrop-blur-2xl border border-white/90 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.15)]"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    {/* Gradient accent line at top */}
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r ${gradient} rounded-b-full`} />
                    
                    <div className="h-full flex flex-col justify-center">
                      {/* Header with icon */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`h-12 w-12 rounded-2xl ${iconBg} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                          <Icon className="h-6 w-6 text-white" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-bold text-teal-800 text-base sm:text-lg leading-tight tracking-tight">{title}</h3>
                          <div className="mt-1 flex items-center gap-1">
                            <div className={`w-6 h-[2px] bg-gradient-to-r ${gradient} rounded-full`} />
                          </div>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-neutral-600 text-sm leading-relaxed font-light">{desc}</p>
                      
                      {/* Premium footer hint */}
                      <div className="mt-4 flex items-center gap-2 opacity-60">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                        <span className="text-[10px] text-neutral-400 tracking-wide">Included Service</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof + testimonials */}
      <section className="py-14 md:py-16 px-4 relative overflow-hidden bg-neutral-100">
        <div className="absolute inset-0 opacity-[0.14]" style={{ backgroundImage: "url('/image.png')", backgroundSize: '140px 140px' }} />

        <div className="relative container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16 text-center">
            {aboutMarketStats.map((item) => (
              <div key={item.label}>
                <div className="text-4xl md:text-6xl font-bold text-primary-500 leading-none">{item.value}</div>
                <p className="text-lg text-neutral-700 mt-2">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="text-center mb-10 md:mb-12">
            <h3 className="text-3xl md:text-4xl font-extrabold text-neutral-800">Trusted by Muslim Travelers</h3>
            <p className="text-base md:text-lg text-neutral-700 mt-4">Live testimonials with reliable fallback insights from our About story.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <article key={t.id} className="rounded-[1.8rem] border border-neutral-200 bg-white px-7 py-7 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1 mb-5 text-accent-500">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.round(t.rating) ? 'fill-accent-500 text-accent-500' : 'text-neutral-300'}`} />
                  ))}
                </div>
                <p className="text-base md:text-lg leading-relaxed text-neutral-800 mb-6">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-lg font-bold text-neutral-800">{t.name}</p>
                <p className="text-sm text-neutral-500 mt-1">{t.city}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - modular compact layout */}
      <section className="py-10 md:py-12 px-4 bg-gradient-to-br from-primary-50/40 via-white to-neutral-50 relative overflow-hidden border-t border-primary-100/70">
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "url('/image.png')", backgroundSize: '140px 140px' }} />
        <div className="relative container mx-auto max-w-6xl">
          <div className="rounded-[2rem] border border-primary-100/80 bg-white/90 backdrop-blur-sm shadow-xl shadow-primary-100/50 p-5 sm:p-6 md:p-7">
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr,0.7fr] gap-6 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 border border-primary-100 px-3 py-1 mb-3">
                  <span className="h-2 w-2 rounded-full bg-primary-500" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-700">Plan with confidence</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-800 leading-tight">
                  Start your next halal journey
                </h2>
                <p className="text-sm sm:text-base text-neutral-700 mt-3 max-w-2xl">
                  Curated destinations, verified services, and concierge support in one modern booking flow.
                </p>

                <div className="mt-5 flex flex-wrap gap-2.5">
                  {[
                    'Verified Halal-Friendly Stays',
                    'Muslim-Friendly Dining Guidance',
                    'Prayer & Mosque Convenience',
                    'Concierge-Level Human Support',
                  ].map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center rounded-full border border-primary-100 bg-primary-50/70 px-3 py-1.5 text-xs font-medium text-primary-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:justify-center">
                <button
                  onClick={() => router.push('/register')}
                  className="w-full rounded-xl bg-accent-500 text-white px-6 py-3 text-sm font-semibold hover:bg-accent-400 transition-colors"
                >
                  Start Planning Your Trip
                </button>
                <button
                  onClick={() => router.push('/about')}
                  className="w-full rounded-xl border border-primary-200 bg-primary-50/50 text-primary-700 px-6 py-3 text-sm font-semibold hover:bg-primary-50 transition-colors"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

