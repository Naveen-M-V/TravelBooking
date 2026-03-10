'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BadgeCheck, Headphones, Lock, Plane, XCircle, BookOpen, Compass, MapPin, Utensils } from 'lucide-react'
import { SearchHero } from '@/components/search/SearchHero'
import { PackageCarousel } from '@/components/packages/PackageCarousel'
import { PackageCardCarousel } from '@/components/packages/PackageCardCarousel'
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

// TODO: Fetch dynamic backgrounds from backend
const heroBackgrounds = [
  '/images/hero/maldives-beach.jpg',
  '/images/hero/istanbul-mosque.jpg',
  '/images/hero/dubai-skyline.jpg',
  '/images/hero/makkah-haram.jpg',
]

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

  // Transform featured packages to card carousel format
  const transformToCardFormat = (pkgs: FeaturedPackage[]) => pkgs.map(pkg => ({
    id: pkg.id,
    name: pkg.name,
    destination: pkg.destination,
    duration: pkg.duration,
    price: { total: pkg.price, currency: pkg.currency },
    images: [pkg.image],
    nights: parseInt(pkg.duration.match(/(\d+)/)?.[1] || '7')
  }))

  // Sample itinerary data for trip overview carousel
  const sampleItinerary = [
    {
      location: 'Istanbul',
      description: 'Arrive in the morning. Spend the day wandering around the historic streets and exploring beautiful mosques.',
      image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&auto=format&fit=crop',
      transportType: 'flight' as const
    },
    {
      location: 'Istanbul',
      description: 'Visit the Blue Mosque, Hagia Sophia, and Topkapi Palace with your personal tour guide.',
      image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&auto=format&fit=crop',
    },
    {
      location: 'Cappadocia',
      description: 'Explore the fairy chimneys and underground cities of this magical region.',
      image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&auto=format&fit=crop',
      transportType: 'train' as const
    },
    {
      location: 'Cappadocia',
      description: 'Experience a hot air balloon ride at sunrise over the stunning landscape.',
      image: 'https://images.unsplash.com/photo-1575408264798-b50b252663e6?w=800&auto=format&fit=crop',
    },
    {
      location: 'Pamukkale',
      description: 'Visit the white travertine terraces and ancient Hierapolis ruins.',
      image: 'https://images.unsplash.com/photo-1605037815219-b2ca2c1e70e8?w=800&auto=format&fit=crop',
      transportType: 'car' as const
    },
    {
      location: 'Antalya',
      description: 'Relax on beautiful Mediterranean beaches and explore the old town.',
      image: 'https://images.unsplash.com/photo-1599694044224-8ae44c732ae7?w=800&auto=format&fit=crop',
      transportType: 'car' as const
    },
    {
      location: 'Bodrum',
      description: 'Enjoy the coastal town, visit the castle and explore local markets.',
      image: 'https://images.unsplash.com/photo-1605610728948-0e8e8b0c4d4d?w=800&auto=format&fit=crop',
    },
    {
      location: 'Istanbul',
      description: 'Return to Istanbul for one final evening before your departure.',
      image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&auto=format&fit=crop',
      transportType: 'flight' as const
    },
  ]

  return (
    <div className="bg-gray-50">
      {/* Hero Search Section */}
      <SearchHero />

      {/* Why Choose Us strip */}
      <section className="py-12 sm:py-14 md:py-16 px-4 bg-gradient-to-br from-white via-teal-50/30 to-cyan-50/20 border-b border-teal-100/50 relative overflow-hidden">
        {/* Decorative floating circles - smaller on mobile */}
        <div className="absolute top-5 sm:top-10 left-10 sm:left-20 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-teal-200/20 to-cyan-200/20 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-5 sm:bottom-10 right-10 sm:right-20 w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-br from-cyan-200/20 to-teal-200/20 rounded-full blur-2xl animate-float-slow"></div>
        
        <div className="container mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center relative z-10">
          {[
            { Icon: BadgeCheck, title: 'Halal Verified', desc: 'Every stay, experience, and package is reviewed for halal compliance', color: 'from-teal-500 to-cyan-500' },
            { Icon: Lock, title: 'Secure Checkout', desc: 'Encrypted payments with privacy-first data protection', color: 'from-cyan-500 to-blue-500' },
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
      <section className="py-12 sm:py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-14 relative">
            {/* Islamic star decorations */}
            <div className="absolute -top-4 left-1/4 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-teal-400 to-cyan-400 islamic-star opacity-35 animate-pulse"></div>
            <div className="absolute -top-4 right-1/4 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-cyan-400 to-teal-400 islamic-star opacity-35 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-100 to-cyan-100 border border-teal-200 px-4 sm:px-5 py-1.5 sm:py-2 mb-3 sm:mb-4 shadow-lg">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 animate-pulse"></span>
              <span className="text-teal-700 text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em]">Explore</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-2 mb-3 sm:mb-4 px-2">
              <span className="gradient-text">Discover Amazing</span>
              <br />
              <span className="text-teal-600">Packages</span>
            </h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-1 bg-gradient-to-r from-transparent to-teal-400 rounded-full"></div>
              <div className="w-16 h-1.5 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 rounded-full"></div>
              <div className="w-8 h-1 bg-gradient-to-l from-transparent to-cyan-400 rounded-full"></div>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Handpicked halal-friendly tours for <span className="text-teal-600 font-semibold">unforgettable experiences</span>
            </p>
          </div>

          {/* Our Best Tour Packages - Card Carousel */}
          <PackageCardCarousel
            title="Our Best Tour Packages"
            packages={transformToCardFormat([...bestPkgs, ...bestPkgs, ...bestPkgs])}
            onCardClick={handleCardClick}
            onWishlistToggle={toggleWishlist}
            wishlistIds={wishlistIds}
          />

          {/* New & Most Popular Tours */}
          <TripOverviewCarousel
            title="New &amp; Most Popular Tours"
            packages={[...popularPkgs, ...popularPkgs]}
          />

          {/* Top Destinations */}
          <PackageCarousel
            title="Top Destinations"
            packages={topDestPkgs}
          />

          {/* Family Destinations */}
          <PackageCarousel
            title="Family Destinations"
            packages={familyPkgs}
            reverse
          />
        </div>
      </section>

      {/* #HTC Muslim Friendly Services */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-teal-50/50 via-cyan-50/30 to-blue-50/50 relative overflow-hidden islamic-pattern">
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mt-2 mb-3 sm:mb-4 px-2">
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

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 px-4 relative overflow-hidden">
        {/* Vibrant gradient background with Islamic pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 islamic-pattern"></div>
        
        {/* Islamic-inspired animated decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 sm:-top-32 -right-20 sm:-right-32 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-white rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-10 sm:-bottom-20 -left-10 sm:-left-20 w-56 sm:w-72 md:w-80 h-56 sm:h-72 md:h-80 bg-white rounded-full blur-3xl animate-float-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[500px] md:w-[600px] h-[400px] sm:h-[500px] md:h-[600px] bg-white/30 rounded-full blur-3xl" />
          {/* Crescent moon decorative elements */}
          <div className="absolute top-10 sm:top-20 right-8 sm:right-1/4 crescent-moon text-white/40 sm:text-white/35 animate-geometric"></div>
          <div className="absolute bottom-10 sm:bottom-20 left-8 sm:left-1/4 crescent-moon text-white/40 sm:text-white/35 animate-geometric" style={{ animationDelay: '2s' }}></div>
          {/* Islamic stars */}
          <div className="absolute top-1/3 left-8 sm:left-1/4 w-8 h-8 sm:w-10 sm:h-10 bg-white/25 sm:bg-white/20 islamic-star animate-pulse"></div>
          <div className="absolute bottom-1/3 right-8 sm:right-1/4 w-8 h-8 sm:w-10 sm:h-10 bg-white/25 sm:bg-white/20 islamic-star animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative container mx-auto max-w-4xl text-center text-white px-2">
          <div className="mb-5 sm:mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-2xl blur-xl opacity-50"></div>
              <div className="relative rounded-2xl bg-white/20 backdrop-blur-md ring-2 ring-white/30 p-3 sm:p-4 shadow-2xl">
                <Plane className="h-10 w-10 sm:h-12 sm:w-12" />
              </div>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-5 leading-tight">
            Ready for Your Next
            <br />
            <span className="inline-block mt-2 bg-white text-teal-600 px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-xl text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Adventure?</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12 text-white/90 max-w-2xl mx-auto leading-relaxed font-medium px-2">
            Join <span className="font-bold text-white">5,000+</span> Muslim travelers who trust <span className="font-bold">Halal Travels</span> for their journeys
          </p>
          <div className="flex gap-3 sm:gap-4 md:gap-5 justify-center flex-wrap px-2">
            <button
              onClick={() => router.push('/register')}
              className="group relative bg-white text-teal-600 px-6 sm:px-8 md:px-12 py-3 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-300 min-h-[48px] sm:min-h-0"
            >
              <span className="relative z-10"><span className="hidden sm:inline">Create Free Account</span><span className="sm:hidden">Sign Up Free</span></span>
              <div className="absolute inset-0 bg-gradient-to-r from-white to-teal-50 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            <button
              onClick={() => router.push('/packages')}
              className="border-2 sm:border-3 border-white/80 backdrop-blur-sm bg-white/10 text-white px-6 sm:px-8 md:px-12 py-3 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-white hover:text-teal-600 hover:scale-105 transition-all duration-300 shadow-xl min-h-[48px] sm:min-h-0"
            >
              Explore Packages
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

