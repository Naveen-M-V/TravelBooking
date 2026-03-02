'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Sparkles,
  Check,
  ChevronLeft,
  MessageSquare,
  ShieldCheck,
  Plane,
  Loader2,
} from 'lucide-react'
import { getPackageById, type FeaturedPackage } from '@/mocks/featured-packages'
import { packagesAPI } from '@/lib/api/packages'
import { HalalRatingBadge } from '@/components/ui/halal-rating-badge'
import { EnquiryFormModal } from '@/components/packages/EnquiryFormModal'

/** Normalize backend Package API response → FeaturedPackage shape */
function normalizeApiPackage(data: any): FeaturedPackage {
  return {
    id:            data.id,
    name:          data.name,
    destination:   data.destination,
    country:       data.country,
    duration:      data.duration,
    price:         Number(data.price),
    originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
    currency:      data.currency ?? 'SAR',
    image:         data.coverImage || (Array.isArray(data.images) && data.images[0]) || 'https://picsum.photos/seed/halal-package/800/600',
    halalRating:   4,
    features:      Array.isArray(data.features)   ? data.features   : [],
    category:      (data.category ?? 'best') as FeaturedPackage['category'],
    description:   data.description ?? '',
    highlights:    Array.isArray(data.highlights)  ? data.highlights  : [],
    included:      Array.isArray(data.included)    ? data.included    : [],
    itinerary:     Array.isArray(data.itinerary)   ? data.itinerary   : [],
  }
}

export default function PackageDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [pkg, setPkg] = useState<FeaturedPackage | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'included' | 'highlights'>('overview')
  const [showEnquiry, setShowEnquiry] = useState(false)

  useEffect(() => {
    if (!id) return
    packagesAPI.getById(id)
      .then((res) => {
        // API may return { package: {...} } or the object directly
        const raw = res?.package ?? res
        setPkg(normalizeApiPackage(raw))
      })
      .catch(() => {
        // Fall back to mock data (covers legacy mock IDs like 'pkg-001')
        const mock = getPackageById(id)
        setPkg(mock ?? null)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    )
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Package not found</h1>
          <p className="text-gray-500 mb-6">This package doesn&apos;t exist or has been removed.</p>
          <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-teal-600 text-white px-6 py-3 text-sm font-semibold hover:bg-teal-500 transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview',   label: 'Overview' },
    { id: 'itinerary',  label: 'Itinerary' },
    { id: 'included',   label: "What's Included" },
    { id: 'highlights', label: 'Highlights' },
  ] as const

  return (
    <>
      <div className="min-h-screen bg-gray-50">

        {/* ── Hero ── */}
        <div className="relative h-[52vh] min-h-[380px] max-h-[540px] overflow-hidden">
          <img
            src={pkg.image}
            alt={pkg.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

          {/* Back button */}
          <div className="absolute top-6 left-0 right-0 px-4">
            <div className="container mx-auto max-w-5xl">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white hover:bg-white/25 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            </div>
          </div>

          {/* Hero content */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-8">
            <div className="container mx-auto max-w-5xl">
              <div className="mb-3">
                <HalalRatingBadge rating={{ score: pkg.halalRating, features: pkg.features.slice(0, 2) }} />
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-2">
                {pkg.name}
              </h1>
              <div className="flex items-center gap-4 text-white/80 text-sm flex-wrap">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {pkg.destination}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {pkg.duration}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-teal-300" />
                  Halal Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="container mx-auto max-w-5xl px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left: Tabs ── */}
            <div className="lg:col-span-2">

              {/* Tab bar */}
              <div className="flex overflow-x-auto gap-1 p-1 bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 scrollbar-none">
                {tabs.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex-1 min-w-max rounded-xl px-4 py-2.5 text-sm font-semibold transition-all whitespace-nowrap ${
                      activeTab === id
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* ── Overview ── */}
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-3">About This Package</h2>
                    <p className="text-gray-600 leading-relaxed">{pkg.description}</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-3">Features</h2>
                    <div className="flex flex-wrap gap-2">
                      {pkg.features.map((f) => (
                        <span key={f} className="rounded-full bg-teal-50 border border-teal-200 text-teal-700 px-3 py-1 text-sm font-medium">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Itinerary ── */}
              {activeTab === 'itinerary' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {pkg.itinerary.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                      <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-400">Detailed itinerary coming soon</p>
                    </div>
                  ) : (
                    pkg.itinerary.map((day) => (
                      <div key={day.day} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        {/* Day header */}
                        <div className="flex items-center gap-3 bg-teal-600 px-5 py-3">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-white/20 ring-2 ring-white/30 flex items-center justify-center text-white font-bold text-sm">
                            {day.day}
                          </div>
                          <h3 className="text-white font-semibold">{day.title}</h3>
                        </div>
                        {/* Day body */}
                        <div className="p-5">
                          <p className="text-gray-600 leading-relaxed mb-4">{day.description}</p>
                          <div className="space-y-2">
                            {day.activities.map((activity, i) => (
                              <div key={i} className="flex items-start gap-2.5">
                                <Clock className="h-4 w-4 text-teal-400 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-500">{activity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ── Included ── */}
              {activeTab === 'included' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-emerald-600 mb-4">✓ Included</h2>
                    <ul className="space-y-3">
                      {pkg.included.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                            <Check className="h-3 w-3 text-emerald-600" />
                          </div>
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-rose-500 mb-4">✕ Not Included</h2>
                    <ul className="space-y-3">
                      {['Personal expenses and shopping', 'Tips and gratuities', 'Travel visa fees (if applicable)', 'Optional activities not listed above'].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex-shrink-0 text-rose-400 font-bold mt-0.5">✕</span>
                          <span className="text-gray-500">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* ── Highlights ── */}
              {activeTab === 'highlights' && (
                <div className="animate-in fade-in duration-200">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Experience Highlights</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {pkg.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-teal-600" />
                          </div>
                          <span className="text-sm text-gray-600 pt-1">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: Booking widget (sticky on desktop) ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                {/* Price card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4">
                  <div className="bg-teal-600 px-6 py-5">
                    <p className="text-teal-100 text-xs font-semibold uppercase tracking-widest mb-1">Starting From</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold text-white">
                        {pkg.price.toLocaleString()}
                      </span>
                      <span className="text-teal-200 font-semibold">{pkg.currency}</span>
                    </div>
                    {pkg.originalPrice && (
                      <p className="text-teal-200 text-sm mt-1 line-through">
                        {pkg.originalPrice.toLocaleString()} {pkg.currency}
                      </p>
                    )}
                  </div>

                  <div className="divide-y divide-gray-100">
                    <div className="flex items-center gap-3 px-5 py-3.5">
                      <Calendar className="h-4 w-4 text-teal-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Duration</p>
                        <p className="text-sm font-semibold text-gray-700">{pkg.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 px-5 py-3.5">
                      <MapPin className="h-4 w-4 text-teal-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Destination</p>
                        <p className="text-sm font-semibold text-gray-700">{pkg.country}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 px-5 py-3.5">
                      <Users className="h-4 w-4 text-teal-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Group Size</p>
                        <p className="text-sm font-semibold text-gray-700">2 – 15 people</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 px-5 py-3.5">
                      <Plane className="h-4 w-4 text-teal-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Flights</p>
                        <p className="text-sm font-semibold text-gray-700">Return Included</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-4">
                    <button
                      onClick={() => setShowEnquiry(true)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 text-white py-3.5 text-sm font-bold hover:bg-teal-500 active:scale-[0.98] transition-all"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Enquire Now
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-3">
                      Free quote within 24 hours · No commitment
                    </p>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
                  {[
                    { icon: ShieldCheck, text: 'Halal certified throughout' },
                    { icon: Check, text: 'Free personalised quote' },
                    { icon: Users, text: 'Expert local guides' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="h-7 w-7 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-3.5 w-3.5 text-teal-600" />
                      </div>
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Mobile: floating Enquire Now ── */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg lg:hidden z-40">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-gray-400">Starting from</p>
                <p className="text-xl font-extrabold text-teal-700">
                  {pkg.price.toLocaleString()} <span className="text-sm font-semibold text-gray-500">{pkg.currency}</span>
                </p>
              </div>
              <button
                onClick={() => setShowEnquiry(true)}
                className="flex-1 max-w-xs inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 text-white py-3.5 text-sm font-bold hover:bg-teal-500 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                Enquire Now
              </button>
            </div>
          </div>

          {/* Bottom padding so content isn't hidden behind mobile bar */}
          <div className="lg:hidden h-24" />
        </div>
      </div>

      <EnquiryFormModal
        package={pkg}
        isOpen={showEnquiry}
        onClose={() => setShowEnquiry(false)}
      />
    </>
  )
}
