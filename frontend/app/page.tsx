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
          <div className="text-center mb-10 sm:mb-14 relative">
            {/* Islamic star decorations */}
            <div className="absolute -top-4 left-1/4 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-teal-400 to-orange-400 islamic-star opacity-35 animate-pulse"></div>
            <div className="absolute -top-4 right-1/4 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-orange-400 to-teal-400 islamic-star opacity-35 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-100 to-accent-100 border border-primary-200 px-4 sm:px-5 py-1.5 sm:py-2 mb-3 sm:mb-4 shadow-lg">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 animate-pulse"></span>
              <span className="text-primary-700 text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em]">Explore</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mt-2 mb-3 sm:mb-4 px-2">
              <span className="gradient-text">Discover Amazing</span>
              <br />
              <span className="text-primary-600">Packages</span>
            </h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-1 bg-gradient-to-r from-transparent to-primary-400 rounded-full"></div>
              <div className="w-16 h-1.5 bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 rounded-full"></div>
              <div className="w-8 h-1 bg-gradient-to-l from-transparent to-accent-400 rounded-full"></div>
            </div>
            <p className="text-neutral-700 text-lg max-w-2xl mx-auto leading-relaxed">
              Handpicked halal-friendly tours for <span className="text-primary-600 font-semibold">unforgettable experiences</span>
            </p>
          </div>

          {/* Our Best Tour Packages */}
          <div className="rounded-[2rem] bg-white/78 border border-white/85 shadow-[0_18px_50px_rgba(15,118,110,0.12)] backdrop-blur-sm px-3 sm:px-4">
            <TripOverviewCarousel
              title="Our Best Tour Packages"
              packages={rollingBestPkgs}
              reverse={false}
            />
          </div>

          {/* New & Most Popular Tours */}
          <div className="rounded-[2rem] bg-white/78 border border-white/85 shadow-[0_18px_50px_rgba(15,118,110,0.12)] backdrop-blur-sm px-3 sm:px-4 mt-6 sm:mt-8">
            <TripOverviewCarousel
              title="New &amp; Most Popular Tours"
              packages={rollingPopularPkgs}
              reverse
            />
          </div>

          {/* Top Destinations */}
          <div className="rounded-[2rem] bg-white/78 border border-white/85 shadow-[0_18px_50px_rgba(15,118,110,0.12)] backdrop-blur-sm px-3 sm:px-4 mt-6 sm:mt-8">
            <TripOverviewCarousel
              title="Top Destinations"
              packages={rollingTopDestPkgs}
              reverse={false}
            />
          </div>

          {/* Family Destinations */}
          <div className="rounded-[2rem] bg-white/78 border border-white/85 shadow-[0_18px_50px_rgba(15,118,110,0.12)] backdrop-blur-sm px-3 sm:px-4 mt-6 sm:mt-8">
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
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-100 to-primary-50 border border-primary-200 px-4 sm:px-5 py-1.5 sm:py-2 mb-3 sm:mb-4 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-400 animate-pulse" />
              <span className="text-primary-700 text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.18em]">#HTC</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold mt-2 mb-3 sm:mb-4 px-2">
              <span className="gradient-text">Halal / Muslim Friendly</span>
              <br />
              <span className="text-primary-600">Services</span>
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 rounded-full mx-auto mb-3 sm:mb-4" />
            <p className="text-neutral-700 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed px-4">
              Every detail of your stay is carefully managed to meet your <span className="text-primary-600 font-semibold">Halal travel needs</span>
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
              <div key={title} className="rounded-[1.7rem] bg-white/90 backdrop-blur-sm border border-teal-100 p-5 sm:p-6 md:p-7 shadow-lg hover:shadow-2xl hover:border-teal-300 hover:-translate-y-1 transition-all duration-300 group">
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

