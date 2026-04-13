'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BadgeCheck, Headphones, Lock, Star } from 'lucide-react'
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
import { MarketStatsStrip } from '@/components/MarketStatsStrip'

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

// ─── Arc geometry ─────────────────────────────────────────────────────────────
// Canvas 900 × 540. Dome centre bottom at (450, 500).
// Circles sit on a radius-320 arc from -155° to -25°.
const SVG_W  = 900
const SVG_H  = 540
const ARC_CX = 450
const ARC_CY = 500   // arc pivot (off bottom of canvas)
const ARC_R  = 320   // radius circles travel on
const CR     = 68    // circle radius

// 5 evenly-spaced angles across the top half
const ANGLES = [-155, -122, -90, -58, -25]

const arcPositions = ANGLES.map((deg) => {
  const rad = (deg * Math.PI) / 180
  return {
    x: Math.round(ARC_CX + ARC_R * Math.cos(rad)),
    y: Math.round(ARC_CY + ARC_R * Math.sin(rad)),
  }
})

const SERVICES = [
  {
    id: 'masjid',
    label: ['Masjid', 'Distance'],
    g1: '#fb923c', g2: '#ea580c',
    icon: (
      <g>
        <circle cx="0" cy="-11" r="14" fill="none" stroke="white" strokeWidth="3"/>
        <circle cx="0" cy="-11" r="6"  fill="white"/>
        <path   d="M-9,0 Q0,20 9,0" fill="white"/>
        <circle cx="0" cy="-15" r="3" fill="#ea580c"/>
      </g>
    ),
  },
  {
    id: 'prayer',
    label: ['Prayer', 'Mat'],
    g1: '#34d399', g2: '#059669',
    icon: (
      <g>
        <circle cx="0"  cy="-22" r="7"  fill="white"/>
        <path d="M-4,-14 L-12,4 L12,4 Z" fill="white"/>
        <path d="M-12,4 L-24,9"  stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M12,4  L24,9"   stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
      </g>
    ),
  },
  {
    id: 'veggie',
    label: ['Vegetarian', 'Restaurant'],
    g1: '#f472b6', g2: '#db2777',
    icon: (
      <g>
        <circle cx="0" cy="0" r="20" fill="none" stroke="white" strokeWidth="3"/>
        <circle cx="0" cy="0" r="12" fill="none" stroke="white" strokeWidth="2"/>
        <path d="M-7,-3 L0,10 L7,-3" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="0" cy="-9" r="3.5" fill="white"/>
      </g>
    ),
  },
  {
    id: 'muslim',
    label: ['Muslim', 'Restaurant'],
    g1: '#c084fc', g2: '#7c3aed',
    icon: (
      <g>
        <circle cx="0" cy="0" r="20" fill="none" stroke="white" strokeWidth="3"/>
        <path d="M-9,-16 L-9,16"         stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M-13,-16 L-13,-7 Q-9,-2 -9,-7" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M-5,-16  L-5,-7  Q-9,-2 -9,-7"  stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M9,-16 L9,16"          stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <ellipse cx="9" cy="-20" rx="5" ry="7" fill="none" stroke="white" strokeWidth="2.5"/>
      </g>
    ),
  },
  {
    id: 'qiblah',
    label: ['Qiblah', 'Direction'],
    g1: '#22d3ee', g2: '#0891b2',
    icon: (
      <g>
        <rect x="-14" y="-17" width="28" height="24" rx="3" fill="none" stroke="white" strokeWidth="3"/>
        <rect x="-7"  y="-9"  width="14" height="16" rx="2" fill="none" stroke="white" strokeWidth="2.5"/>
        <path d="M-9,-17 L0,-29 L9,-17" fill="white"/>
        <path d="M0,7 L0,16" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
      </g>
    ),
  },
]

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
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!user) { setWishlistIds(new Set()); return }
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
        if (Array.isArray(res.testimonials) && res.testimonials.length > 0)
          setTestimonials(res.testimonials.slice(0, 3))
      })
      .catch(() => setTestimonials(testimonialFallbackMockData))
  }, [])

  const ensureRollingData = (pkgs: FeaturedPackage[], target = 12) => {
    if (!pkgs.length) return pkgs
    if (pkgs.length >= target) return pkgs
    return Array.from({ length: target }, (_, idx) => pkgs[idx % pkgs.length])
  }

  const rollingBestPkgs    = useMemo(() => ensureRollingData(bestPkgs, 12),    [bestPkgs])
  const rollingPopularPkgs = useMemo(() => ensureRollingData(popularPkgs, 12), [popularPkgs])
  const rollingTopDestPkgs = useMemo(() => ensureRollingData(topDestPkgs, 12), [topDestPkgs])
  const rollingFamilyPkgs  = useMemo(() => ensureRollingData(familyPkgs, 12),  [familyPkgs])

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-neutral-50 via-primary-50/35 to-neutral-100">
      <div className="pointer-events-none absolute inset-0 opacity-[0.32]" style={{ backgroundImage: "url('/image.png')", backgroundSize: '140px 140px' }} />
      <div className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-primary-200/35 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-[28%] -right-32 w-[460px] h-[460px] rounded-full bg-gradient-to-br from-accent-200/25 to-transparent blur-3xl" />

      {/* Hero */}
      <SearchHero />

      {/* Why Choose Us */}
      <section className="py-12 sm:py-14 md:py-16 px-4 bg-gradient-to-br from-white via-primary-50/25 to-accent-50/20 border-b border-primary-100/60 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.28]" style={{ backgroundImage: "url('/image.png')", backgroundSize: '140px 140px' }} />
        <div className="absolute inset-0 islamic-pattern opacity-30" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/70 to-transparent" />
        <div className="absolute top-5 sm:top-10 left-10 sm:left-20 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-primary-200/20 to-accent-200/20 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-5 sm:bottom-10 right-10 sm:right-20 w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-br from-accent-200/20 to-primary-200/20 rounded-full blur-2xl animate-float-slow" />
        <div className="container mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center relative z-10">
          {[
            { Icon: BadgeCheck, title: 'Halal Verified',    desc: 'Every stay, experience, and package is reviewed for halal compliance',  color: 'from-primary-500 to-accent-400' },
            { Icon: Lock,       title: 'Secure Checkout',   desc: 'Encrypted payments with privacy-first data protection',                 color: 'from-primary-400 to-primary-500' },
            { Icon: Headphones, title: 'Concierge Support', desc: 'Specialists available whenever you need assistance',                    color: 'from-primary-500 to-supporting-sage-400' },
          ].map(({ Icon, title, desc, color }) => (
            <div key={title} className="flex flex-col items-center group px-3 py-5 rounded-[2rem] bg-white/75 border border-white/90 shadow-[0_16px_40px_rgba(15,118,110,0.12)] backdrop-blur-sm hover:bg-primary-600 hover:border-primary-500 hover:-translate-y-3 hover:shadow-[0_32px_60px_rgba(15,118,110,0.35)] transition-all duration-500 ease-out cursor-pointer relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="mb-3 sm:mb-4 relative z-10">
                <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-2xl blur-xl opacity-30 group-hover:opacity-60 group-hover:scale-125 transition-all duration-500`} />
                <div className="relative rounded-2xl bg-white shadow-lg ring-1 ring-primary-100 p-3 sm:p-4 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl transition-all duration-500 ease-out">
                  <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary-600 group-hover:text-primary-700 transition-colors duration-300" />
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2 text-primary-700 group-hover:text-white transition-colors duration-300 relative z-10">{title}</h3>
              <p className="text-neutral-700 text-sm leading-relaxed max-w-xs group-hover:text-white/90 transition-colors duration-300 relative z-10">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-12 sm:py-16 md:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-primary-50/30 to-white" />
        <div className="absolute inset-0 opacity-[0.24]" style={{ backgroundImage: "url('/image.png')", backgroundSize: '140px 140px' }} />
        <div className="absolute top-8 left-10 text-cyan-500/15 crescent-moon animate-geometric" />
        <div className="absolute top-20 right-14 text-orange-400/20 crescent-moon animate-geometric" style={{ animationDelay: '1.3s' }} />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-12 sm:mb-16 relative">
            <div className="absolute -top-8 left-1/4 w-32 h-32 bg-gradient-to-br from-primary-200/20 to-accent-200/10 rounded-full blur-3xl" />
            <div className="absolute -top-4 right-1/4 w-24 h-24 bg-gradient-to-br from-accent-200/20 to-primary-200/10 rounded-full blur-2xl" />
            <div className="absolute -top-6 left-[15%] sm:left-1/4 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-teal-400 via-primary-400 to-orange-400 islamic-star opacity-60 animate-pulse shadow-lg shadow-primary-200/30" />
            <div className="absolute -top-2 right-[15%] sm:right-1/4 w-5 h-5 sm:w-7 sm:h-7 bg-gradient-to-br from-orange-400 via-accent-400 to-teal-400 islamic-star opacity-50 animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-100/90 to-accent-100/90 border border-primary-200/80 px-5 sm:px-6 py-2 sm:py-2.5 mb-4 sm:mb-5 shadow-lg shadow-primary-100/20 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 animate-pulse" />
              <span className="text-primary-800 text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.22em]">Explore</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mt-3 mb-4 sm:mb-5 px-2 tracking-tight font-display">
              <span className="gradient-text drop-shadow-[0_2px_12px_rgba(15,118,110,0.15)]" style={{ textShadow: '0 0 50px rgba(43,196,190,0.12)' }}>Discover Amazing</span>
              <br />
              <span className="text-primary-700">Packages</span>
            </h2>
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-10 h-[2px] bg-gradient-to-r from-transparent via-primary-300 to-primary-400 rounded-full" />
              <div className="w-20 h-[3px] bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 rounded-full shadow-sm shadow-accent-200/50" />
              <div className="w-10 h-[2px] bg-gradient-to-l from-transparent via-accent-300 to-accent-400 rounded-full" />
            </div>
            <p className="text-neutral-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
              Handpicked halal-friendly tours for <span className="text-primary-600 font-semibold">unforgettable experiences</span>
            </p>
          </div>
          <div className="rounded-[2.5rem] bg-gradient-to-br from-white/90 via-white/80 to-primary-50/40 border border-white/90 shadow-[0_24px_80px_rgba(15,118,110,0.14)] backdrop-blur-xl px-4 sm:px-6 py-2 ring-1 ring-primary-100/50">
            <TripOverviewCarousel title="Our Best Tour Packages" packages={rollingBestPkgs} reverse={false} />
          </div>
          <div className="rounded-[2.5rem] bg-gradient-to-br from-white/90 via-white/80 to-accent-50/30 border border-white/90 shadow-[0_24px_80px_rgba(15,118,110,0.14)] backdrop-blur-xl px-4 sm:px-6 py-2 mt-8 sm:mt-10 ring-1 ring-accent-100/50">
            <TripOverviewCarousel title="New &amp; Most Popular Tours" packages={rollingPopularPkgs} reverse />
          </div>
          <div className="rounded-[2.5rem] bg-gradient-to-br from-white/90 via-white/80 to-primary-50/40 border border-white/90 shadow-[0_24px_80px_rgba(15,118,110,0.14)] backdrop-blur-xl px-4 sm:px-6 py-2 mt-8 sm:mt-10 ring-1 ring-primary-100/50">
            <TripOverviewCarousel title="Top Destinations" packages={rollingTopDestPkgs} reverse={false} />
          </div>
          <div className="rounded-[2.5rem] bg-gradient-to-br from-white/90 via-white/80 to-supporting-sand-50/40 border border-white/90 shadow-[0_24px_80px_rgba(15,118,110,0.14)] backdrop-blur-xl px-4 sm:px-6 py-2 mt-8 sm:mt-10 ring-1 ring-supporting-sand-200/50">
            <TripOverviewCarousel title="Family Destinations" packages={rollingFamilyPkgs} reverse />
          </div>
        </div>
      </section>

      {/* ── #HTC Muslim Friendly Services ──────────────────────────────────── */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-primary-50/60 via-primary-50/35 to-accent-50/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.24]" style={{ backgroundImage: "url('/image.png')", backgroundSize: '140px 140px' }} />
        <div className="absolute inset-0 islamic-pattern opacity-30" />
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-teal-300/15 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-br from-cyan-300/15 to-transparent rounded-full blur-3xl" style={{ animation: 'float 8s ease-in-out infinite', animationDelay: '1s' }} />

        <div className="container mx-auto max-w-5xl relative z-10">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-100/90 to-accent-100/90 border border-primary-200/80 px-5 py-2 mb-5 shadow-sm backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 animate-pulse" />
              <span className="text-primary-800 text-[10px] font-bold uppercase tracking-[0.2em]">#HTC</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mt-3 mb-4 px-2 tracking-tight font-display">
              <span className="gradient-text">Halal / Muslim Friendly</span>
              <br />
              <span className="text-primary-700">Services</span>
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-[2px] bg-gradient-to-r from-transparent via-primary-300 to-primary-400 rounded-full" />
              <div className="w-16 h-[3px] bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 rounded-full" />
              <div className="w-10 h-[2px] bg-gradient-to-l from-transparent via-accent-300 to-accent-400 rounded-full" />
            </div>
            <p className="text-neutral-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light px-4">
              Every detail of your stay is carefully managed to meet your{' '}
              <span className="text-primary-600 font-semibold">Halal travel needs</span>
            </p>
          </div>

          {/* ── Arc SVG ── */}
          <div className="w-full max-w-4xl mx-auto">
            <svg
              width="100%"
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              role="img"
              aria-label="Halal friendly services in a semicircular arc"
              style={{ overflow: 'visible' }}
            >
              <defs>
                {/* Per-service radial gradients */}
                {SERVICES.map((s) => (
                  <radialGradient key={s.id} id={`grad-${s.id}`} cx="38%" cy="32%" r="68%">
                    <stop offset="0%"   stopColor={s.g1} />
                    <stop offset="100%" stopColor={s.g2} />
                  </radialGradient>
                ))}

                {/* Dome: white → light grey, top to bottom */}
                <linearGradient id="dome-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#ffffff"/>
                  <stop offset="100%" stopColor="#dde4ec"/>
                </linearGradient>

                {/* Clip: only show dome from y=180 downward */}
                <clipPath id="dome-clip">
                  <rect x="60" y="180" width={SVG_W - 120} height={SVG_H - 180} />
                </clipPath>

                {/* Circle drop-shadow */}
                <filter id="cshadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#00000022" />
                </filter>
              </defs>

              {/* ── Half-dome base ── */}
              {/*
                We draw a large ellipse centred at (ARC_CX, ARC_CY) and clip it
                to only the bottom portion, creating a clean half-dome.
                rx=360, ry=330 makes it wide and shallow — matching the reference.
              */}
              <g clipPath="url(#dome-clip)">
                <ellipse
                  cx={ARC_CX}
                  cy={ARC_CY}
                  rx={360}
                  ry={330}
                  fill="url(#dome-grad)"
                  stroke="#d1d9e0"
                  strokeWidth="1.5"
                />
              </g>

              {/* ── Dome centre text ── */}
              <text
                x={ARC_CX}
                y={ARC_CY - 85}
                textAnchor="middle"
                fontFamily="inherit"
                fontSize="17"
                fill="#94a3b8"
                fontWeight="400"
                letterSpacing="0.4"
              >
                Halal Friendly
              </text>
              <text
                x={ARC_CX}
                y={ARC_CY - 44}
                textAnchor="middle"
                fontFamily="inherit"
                fontSize="34"
                fill="#1e293b"
                fontWeight="800"
                letterSpacing="-0.5"
              >
                Services
              </text>

              {/* ── Service circles ── */}
              {SERVICES.map((service, i) => {
                const { x, y } = arcPositions[i]
                const ly1 = y + CR + 24   // first label line
                const ly2 = y + CR + 46   // second label line

                return (
                  <g key={service.id} className="group cursor-pointer">
                    {/* shadow layer */}
                    <circle
                      cx={x} cy={y + 6} r={CR}
                      fill="#00000014"
                      filter="url(#cshadow)"
                      className="transition-all duration-300 group-hover:fill-black/30"
                    />
                    {/* main coloured circle with hover effects */}
                    <g className="origin-center transition-transform duration-300 ease-out group-hover:scale-110">
                      <circle cx={x} cy={y} r={CR} fill={`url(#grad-${service.id})`} />
                      {/* glow ring on hover */}
                      <circle
                        cx={x} cy={y} r={CR + 4}
                        fill="none"
                        stroke={service.g1}
                        strokeWidth="3"
                        opacity="0"
                        className="transition-opacity duration-300 group-hover:opacity-60"
                      />
                      {/* gloss sheen */}
                      <ellipse
                        cx={x - CR * 0.20}
                        cy={y - CR * 0.28}
                        rx={CR * 0.50}
                        ry={CR * 0.28}
                        fill="white"
                        opacity="0.18"
                        className="transition-opacity duration-300 group-hover:opacity-30"
                      />
                      {/* icon */}
                      <g transform={`translate(${x},${y + 2}) scale(1.2)`}>
                        {service.icon}
                      </g>
                    </g>
                    {/* label line 1 */}
                    <text
                      x={x} y={ly1}
                      textAnchor="middle"
                      fontFamily="inherit"
                      fontSize="15"
                      fill="#374151"
                      fontWeight="600"
                      className="transition-all duration-300 group-hover:fill-primary-700 group-hover:font-bold"
                    >
                      {service.label[0]}
                    </text>
                    {/* label line 2 */}
                    <text
                      x={x} y={ly2}
                      textAnchor="middle"
                      fontFamily="inherit"
                      fontSize="15"
                      fill="#374151"
                      fontWeight="600"
                      className="transition-all duration-300 group-hover:fill-primary-700 group-hover:font-bold"
                    >
                      {service.label[1]}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        </div>
      </section>

      {/* Social proof + testimonials */}
      <section className="py-14 md:py-16 px-4 relative overflow-hidden bg-neutral-100">
        <div className="absolute inset-0 opacity-[0.14]" style={{ backgroundImage: "url('/image.png')", backgroundSize: '140px 140px' }} />
        <div className="relative container mx-auto max-w-7xl">
          <div className="mb-12 md:mb-16">
            <MarketStatsStrip stats={aboutMarketStats} />
          </div>
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-100/80 to-accent-100/80 border border-primary-200/60 px-4 py-1.5 mb-5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent">Testimonials</span>
            </div>
            <h3 className="relative text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              <span className="font-serif italic font-light bg-gradient-to-r from-neutral-700 via-neutral-600 to-neutral-700 bg-clip-text text-transparent">Trusted by</span>{' '}
              <span className="font-black tracking-tight bg-gradient-to-r from-primary-600 via-accent-500 via-primary-400 to-accent-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(20,184,166,0.3)]">Muslim Travelers</span>
            </h3>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-primary-300 to-primary-400 rounded-full" />
              <div className="w-20 h-[3px] bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 rounded-full" />
              <div className="w-12 h-[2px] bg-gradient-to-l from-transparent via-accent-300 to-accent-400 rounded-full" />
            </div>
            <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto">Live testimonials with reliable fallback insights from our About story.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((t) => (
              <article key={t.id} className="group relative rounded-[2rem] overflow-hidden transition-all duration-700 ease-out hover:-translate-y-3">
                <div className="absolute -inset-[1px] rounded-[2rem] bg-gradient-to-br from-primary-300/60 via-accent-300/40 to-primary-300/60 opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative h-full rounded-[2rem] bg-gradient-to-br from-white/95 via-white/90 to-primary-50/80 backdrop-blur-xl border border-white/60 p-7 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] group-hover:shadow-[0_20px_50px_rgba(20,184,166,0.15)] transition-all duration-700">
                  <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary-400/5 via-transparent to-accent-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative">
                    <div className="flex items-center gap-1.5 mb-6">
                      {Array.from({ length: 5 }, (_, i) => (
                        <div key={i} className="relative group-hover:scale-110 transition-all duration-500" style={{ transitionDelay: `${i * 50}ms` }}>
                          <Star className={`h-5 w-5 transition-all duration-300 ${i < Math.round(t.rating) ? 'fill-gradient-to-br from-accent-400 to-primary-500 text-accent-500 drop-shadow-[0_2px_4px_rgba(20,184,166,0.3)]' : 'fill-neutral-100 text-neutral-300'}`} />
                          {i < Math.round(t.rating) && (
                            <div className="absolute inset-0 bg-gradient-to-br from-accent-400 to-primary-500 opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300" />
                          )}
                        </div>
                      ))}
                      <span className="ml-2 text-sm font-bold text-accent-600">{t.rating}.0</span>
                    </div>
                    <div className="relative mb-6">
                      <span className="absolute -top-3 -left-2 text-5xl text-primary-200/50 font-serif leading-none select-none">&ldquo;</span>
                      <p className="text-base md:text-lg leading-relaxed text-neutral-700 font-medium relative z-10 pl-4">{t.quote}</p>
                      <span className="absolute -bottom-6 right-0 text-5xl text-primary-200/50 font-serif leading-none select-none">&rdquo;</span>
                    </div>
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-primary-200/60 to-transparent mb-5" />
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 p-[2px] shadow-lg shadow-primary-200/50">
                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                            <span className="text-lg font-bold bg-gradient-to-br from-primary-600 to-accent-500 bg-clip-text text-transparent">{t.name.charAt(0)}</span>
                          </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-accent-400 to-primary-500 flex items-center justify-center shadow-md">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="text-base font-bold bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">{t.name}</p>
                        <p className="text-sm text-neutral-500 font-medium">{t.city}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Final CTA */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-br from-primary-50/60 via-white to-accent-50/40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(20,184,166,0.4) 1px, transparent 0)", backgroundSize: '40px 40px' }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-accent-200/30 to-transparent rounded-full blur-3xl" />
        <div className="relative container mx-auto max-w-6xl">
          <div className="relative rounded-[2.5rem] p-[2px] bg-gradient-to-br from-primary-300/80 via-accent-300/60 to-primary-300/80 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary-400/20 via-transparent to-accent-400/20 animate-pulse" />
            <div className="relative rounded-[2.4rem] bg-gradient-to-br from-white via-white/95 to-primary-50/90 backdrop-blur-xl p-6 sm:p-8 md:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-[1.4fr,0.6fr] gap-8 items-center">
                <div>
                  <div className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-primary-100/80 to-accent-100/80 border border-primary-200/60 px-4 py-2 mb-4 shadow-sm">
                    <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text">Plan with confidence</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4">
                    <span className="font-serif italic font-light bg-gradient-to-r from-neutral-700 to-neutral-600 bg-clip-text text-transparent">Start your</span>{' '}
                    <span className="font-black bg-gradient-to-r from-primary-600 via-accent-500 to-primary-500 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(20,184,166,0.25)]">next halal journey</span>
                  </h2>
                  <p className="text-sm sm:text-base text-neutral-600 mt-3 max-w-xl leading-relaxed">
                    Curated destinations, verified services, and concierge support in one modern booking flow.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {[
                      'Verified Halal-Friendly Stays',
                      'Muslim-Friendly Dining Guidance',
                      'Prayer & Mosque Convenience',
                      'Concierge-Level Human Support',
                    ].map((label) => (
                      <span key={label} className="group inline-flex items-center gap-2 rounded-full border border-primary-200/70 bg-gradient-to-r from-primary-50/80 to-white/80 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-primary-700 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-primary-300">
                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white text-[10px] font-bold">✓</span>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-4 lg:pl-4">
                  <button
                    onClick={() => router.push('/register')}
                    className="group relative w-full rounded-2xl bg-gradient-to-r from-accent-500 via-primary-500 to-accent-400 text-white px-8 py-4 text-sm font-bold shadow-lg shadow-accent-200/50 transition-all duration-500 ease-out hover:shadow-[0_12px_40px_rgba(20,184,166,0.4)] hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <span className="relative flex items-center justify-center gap-2">
                      Start Planning Your Trip
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </button>
                  <button
                    onClick={() => router.push('/about')}
                    className="group w-full rounded-2xl border-2 border-primary-200 bg-gradient-to-br from-white to-primary-50/50 text-primary-700 px-8 py-4 text-sm font-bold transition-all duration-300 hover:bg-gradient-to-br hover:from-primary-50 hover:to-white hover:border-primary-300 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Learn More
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}