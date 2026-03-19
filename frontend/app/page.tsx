'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BadgeCheck, Headphones, Lock, Plane, XCircle, BookOpen, Compass, MapPin, Utensils } from 'lucide-react'
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
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-[#f7fcfc] to-[#f5fbfa]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.32]" style={{ backgroundImage: "url('/image.png')", backgroundSize: '140px 140px' }} />
      <div className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-cyan-200/35 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-[28%] -right-32 w-[460px] h-[460px] rounded-full bg-gradient-to-br from-orange-200/25 to-transparent blur-3xl" />

      {/* Hero Search Section */}
      <SearchHero />

      {/* Why Choose Us strip */}
      <section className="py-12 sm:py-14 md:py-16 px-4 bg-gradient-to-br from-white via-cyan-50/35 to-orange-50/20 border-b border-cyan-100/50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.28]" style={{ backgroundImage: "url('/image.png')", backgroundSize: '140px 140px' }} />
        <div className="absolute inset-0 islamic-pattern opacity-30" />
        {/* Decorative floating circles - smaller on mobile */}
        <div className="absolute top-5 sm:top-10 left-10 sm:left-20 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-teal-200/20 to-orange-200/20 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-5 sm:bottom-10 right-10 sm:right-20 w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-br from-orange-200/20 to-teal-200/20 rounded-full blur-2xl animate-float-slow"></div>
        
        <div className="container mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center relative z-10">
            {[
              { Icon: BadgeCheck, title: 'Halal Verified', desc: 'Every stay, experience, and package is reviewed for halal compliance', color: 'from-teal-500 to-orange-400' },
              { Icon: Lock, title: 'Secure Checkout', desc: 'Encrypted payments with privacy-first data protection', color: 'from-[#30c9d3] to-[#2ec2bd]' },
              { Icon: Headphones, title: 'Concierge Support', desc: 'Specialists available whenever you need assistance', color: 'from-teal-500 to-emerald-500' },
            ].map(({ Icon, title, desc, color }) => (
            <div key={title} className="flex flex-col items-center group px-2">
              <div className="mb-3 sm:mb-4 relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
                <div className="relative rounded-2xl bg-white shadow-lg ring-1 ring-teal-100 p-3 sm:p-4 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                  <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-teal-600" />
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2 text-teal-700">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-cyan-50/30 to-white" />
        <div className="absolute inset-0 opacity-[0.24]" style={{ backgroundImage: "url('/image.png')", backgroundSize: '140px 140px' }} />
        <div className="absolute top-8 left-10 text-cyan-500/15 crescent-moon animate-geometric" />
        <div className="absolute top-20 right-14 text-orange-400/20 crescent-moon animate-geometric" style={{ animationDelay: '1.3s' }} />
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-14 relative">
            {/* Islamic star decorations */}
            <div className="absolute -top-4 left-1/4 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-teal-400 to-orange-400 islamic-star opacity-35 animate-pulse"></div>
            <div className="absolute -top-4 right-1/4 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-orange-400 to-teal-400 islamic-star opacity-35 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-100 to-orange-100 border border-teal-200 px-4 sm:px-5 py-1.5 sm:py-2 mb-3 sm:mb-4 shadow-lg">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-500 to-orange-500 animate-pulse"></span>
              <span className="text-teal-700 text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em]">Explore</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mt-2 mb-3 sm:mb-4 px-2">
              <span className="gradient-text">Discover Amazing</span>
              <br />
              <span className="text-teal-600">Packages</span>
            </h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-1 bg-gradient-to-r from-transparent to-teal-400 rounded-full"></div>
              <div className="w-16 h-1.5 bg-gradient-to-r from-teal-400 via-orange-400 to-teal-400 rounded-full"></div>
              <div className="w-8 h-1 bg-gradient-to-l from-transparent to-orange-400 rounded-full"></div>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Handpicked halal-friendly tours for <span className="text-teal-600 font-semibold">unforgettable experiences</span>
            </p>
          </div>

          {/* Our Best Tour Packages */}
          <TripOverviewCarousel
            title="Our Best Tour Packages"
            packages={rollingBestPkgs}
            reverse={false}
          />

          {/* New & Most Popular Tours */}
          <TripOverviewCarousel
            title="New &amp; Most Popular Tours"
            packages={rollingPopularPkgs}
            reverse
          />

          {/* Top Destinations */}
          <TripOverviewCarousel
            title="Top Destinations"
            packages={rollingTopDestPkgs}
            reverse={false}
          />

          {/* Family Destinations */}
          <TripOverviewCarousel
            title="Family Destinations"
            packages={rollingFamilyPkgs}
            reverse
          />
        </div>
      </section>

      {/* #HTC Muslim Friendly Services */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-teal-50/60 via-cyan-50/35 to-orange-50/20 relative overflow-hidden islamic-pattern">
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
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-100 to-cyan-100 border border-teal-200 px-4 sm:px-5 py-1.5 sm:py-2 mb-3 sm:mb-4 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 animate-pulse" />
              <span className="text-teal-700 text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.18em]">#HTC</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold mt-2 mb-3 sm:mb-4 px-2">
              <span className="gradient-text">Halal / Muslim Friendly</span>
              <br />
              <span className="text-teal-600">Services</span>
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 rounded-full mx-auto mb-3 sm:mb-4" />
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed px-4">
              Every detail of your stay is carefully managed to meet your <span className="text-teal-600 font-semibold">Halal travel needs</span>
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[
              { Icon: XCircle,   title: 'Mini Bar Removal in Hotel Rooms',      desc: 'No liquor or alcohol-related items in mini bars.', gradient: 'from-rose-500 to-pink-500' },
              { Icon: BookOpen,  title: 'Prayer Mat in Hotel Rooms',             desc: 'Availability of Prayer Mat in Hotel Rooms.', gradient: 'from-teal-500 to-emerald-500' },
              { Icon: Compass,   title: 'Qiblah Direction Clearly Indicated',   desc: 'Hotel rooms feature a clearly marked Qiblah direction for convenient prayer.', gradient: 'from-cyan-500 to-blue-500' },
              { Icon: MapPin,    title: 'Nearby Mosques',                        desc: 'Information on Nearby Mosques for ease of access to prayer facilities if available.', gradient: 'from-teal-500 to-cyan-500' },
              { Icon: Utensils,  title: 'Muslim-Friendly Restaurant',            desc: 'Information of closest Muslim Owned Restaurants if available.', gradient: 'from-orange-500 to-amber-500' },
            ].map(({ Icon, title, desc, gradient }) => (
              <div key={title} className="rounded-2xl bg-white/90 backdrop-blur-sm border border-teal-100 p-5 sm:p-6 md:p-7 shadow-lg hover:shadow-2xl hover:border-teal-300 hover:-translate-y-1 transition-all duration-300 group">
                <div className="relative mb-3 sm:mb-4">
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                  <div className="relative h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 ring-2 ring-teal-200/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600" />
                  </div>
                </div>
                <h3 className="font-bold text-teal-700 mb-2 text-sm sm:text-base">{title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-20 md:py-28 px-4 relative overflow-hidden bg-gradient-to-br from-white via-cyan-50/65 to-orange-50/28">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.24]" style={{ backgroundImage: "url('/image.png')", backgroundSize: '140px 140px' }}></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-300/35 via-cyan-300/20 to-transparent rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-orange-300/25 via-teal-300/15 to-transparent rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-white/40 to-teal-200/20 rounded-full blur-3xl"></div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.06)_1px,transparent_1px)] bg-[size:50px_50px] opacity-40"></div>
        </div>

        <div className="relative container mx-auto max-w-5xl">
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mb-16 text-center">
            {[
              { stat: '5K+', label: 'Happy Travelers' },
              { stat: '50+', label: 'Dream Destinations' },
              { stat: '4.9★', label: 'Avg Rating' },
            ].map((item, idx) => (
              <div key={idx} className="group">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent mb-2">
                  {item.stat}
                </div>
                <p className="text-xs sm:text-sm text-teal-900/60 group-hover:text-teal-900/80 transition-colors">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Main CTA Content */}
          <div className="text-center mb-12">
            {/* Icon */}
            <div className="inline-flex items-center justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl blur-2xl opacity-40 animate-pulse"></div>
                <div className="relative bg-white/60 backdrop-blur-xl border border-teal-200/70 rounded-2xl p-5 shadow-[0_20px_60px_-20px_rgba(20,184,166,0.35)]">
                  <Plane className="h-12 w-12 text-teal-400 animate-bounce" />
                </div>
              </div>
            </div>

            {/* Headline */}
            <div className="mb-6">
              <p className="text-teal-400 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-3">Begin Your Journey</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-4 text-slate-900">
                <span className="inline-block">Ready to Explore</span>
                <br />
                <span className="inline-block bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">Halal-Friendly Wonders?</span>
              </h2>
              <p className="text-slate-700/80 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mt-6">
                Book your next adventure with confidence. Join thousands of Muslim travelers discovering authentic experiences at <span className="text-teal-400 font-semibold">5-star halal destinations</span>.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center sm:items-stretch mt-10 px-2">
              <button
                onClick={() => router.push('/register')}
                className="group relative px-8 sm:px-10 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg overflow-hidden shadow-[0_18px_45px_-16px_rgba(20,184,166,0.45)] hover:shadow-[0_22px_55px_-16px_rgba(20,184,166,0.55)] transition-all duration-300 hover:scale-105 min-h-[52px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 group-hover:from-teal-400 group-hover:to-cyan-400 transition-colors"></div>
                <span className="relative text-white font-semibold flex items-center justify-center gap-2">
                  <span>Start Your Journey</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>

              <button
                onClick={() => router.push('/packages')}
                className="group relative px-8 sm:px-10 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg border-2 border-teal-200 hover:border-teal-400 bg-white/55 backdrop-blur-sm hover:bg-white/75 transition-all duration-300 hover:scale-105 min-h-[52px] text-slate-800"
              >
                <span className="relative flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15a23.931 23.931 0 01-9-1.745M12 9a6 6 0 100-12 6 6 0 000 12zm0 0c1.657 0 3-4.03 3-9s-1.343-9-3-9-3 4.03-3 9 1.343 9 3 9z" />
                  </svg>
                  <span>Explore Packages</span>
                </span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-12 pt-8 border-t border-teal-200/70">
              {[
                { icon: '✓', text: '100% Halal Verified' },
                { icon: '🔒', text: 'Secure Booking' },
                { icon: '💬', text: '24/7 Support' },
              ].map((badge, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors group cursor-pointer">
                  <span className="text-lg group-hover:scale-125 transition-transform">{badge.icon}</span>
                  <span className="text-sm font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

