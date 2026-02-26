'use client'

import { useState } from 'react'
import { PackageResultCard } from '@/components/packages/PackageResultCard'
import { EnquiryFormModal } from '@/components/packages/EnquiryFormModal'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Filter, SlidersHorizontal, MapPin, Star, Calendar, X } from 'lucide-react'
import { mockPackages } from '@/data/mockPackages'

export default function PackagesPage() {
  const [packages] = useState(mockPackages)
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [selectedHalalRatings, setSelectedHalalRatings] = useState<number[]>([])
  const [sortBy, setSortBy] = useState('recommended')
  const [showFilters, setShowFilters] = useState(true)
  const [enquiryPackage, setEnquiryPackage] = useState<any>(null)

  const locations = Array.from(new Set(mockPackages.map(p => p.location)))
  
  const filteredPackages = packages
    .filter(pkg => {
      const withinPrice = pkg.price.total >= priceRange[0] && pkg.price.total <= priceRange[1]
      const matchLocation = selectedLocations.length === 0 || selectedLocations.includes(pkg.location)
      const matchRating = selectedRatings.length === 0 || selectedRatings.some(r => pkg.rating >= r)
      const matchHalal = selectedHalalRatings.length === 0 || selectedHalalRatings.includes(pkg.halalRating)
      return withinPrice && matchLocation && matchRating && matchHalal
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price.total - b.price.total
        case 'price-high': return b.price.total - a.price.total
        case 'rating': return b.rating - a.rating
        case 'halal': return b.halalRating - a.halalRating
        default: return 0
      }
    })

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(20,184,166,0.08),transparent)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />
        <div className="container mx-auto px-4 pt-14 pb-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 border border-teal-400/20 px-4 py-2 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              <span className="text-teal-700 text-xs font-bold uppercase tracking-[0.18em]">Packages</span>
            </div>
            <h1 className="mt-0 text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-4">
              Halal holiday packages,{' '}
              <span className="italic font-serif text-teal-600">curated</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-6">
              Unique stays, thoughtful itineraries, and a seamless halal-friendly experience.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-4 py-2 shadow-sm">
                <MapPin className="h-4 w-4 text-teal-500" />
                <span className="text-gray-700">{locations.length} Destinations</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-4 py-2 shadow-sm">
                <Star className="h-4 w-4 text-teal-500" />
                <span className="text-gray-700">Halal-Friendly</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-4 py-2 shadow-sm">
                <Calendar className="h-4 w-4 text-teal-500" />
                <span className="text-gray-700">Flexible Booking</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
        <div className="sticky top-0 z-10 border-y border-gray-200 bg-white/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  showFilters
                    ? 'bg-teal-600 text-white'
                    : 'bg-white ring-1 ring-gray-200 text-gray-600 hover:bg-gray-50 hover:text-teal-600'
                }`}
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
              <span className="text-gray-500 text-sm">
                <span className="font-semibold text-gray-900">{filteredPackages.length}</span> packages
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm hidden sm:inline">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px] rounded-full bg-white border-gray-200 text-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 text-gray-900">
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating: High to Low</SelectItem>
                  <SelectItem value="halal">Halal Rating: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="lg:col-span-3">
              <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-teal-500" />
                    Filters
                  </h3>
                  <button
                    onClick={() => { setPriceRange([0, 10000]); setSelectedLocations([]); setSelectedRatings([]); setSelectedHalalRatings([]) }}
                    className="text-xs text-gray-400 hover:text-teal-600 transition-colors flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Clear all
                  </button>
                </div>

                {/* Price Range */}
                <div className="mb-7">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.18em] mb-4">Price Range (SAR)</p>
                  <Slider
                    min={0}
                    max={10000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-3"
                  />
                  <div className="flex justify-between text-xs font-semibold text-gray-500">
                    <span>{priceRange[0].toLocaleString()} SAR</span>
                    <span>{priceRange[1].toLocaleString()} SAR</span>
                  </div>
                </div>

                <div className="h-px bg-gray-100 mb-7" />

                {/* Location */}
                <div className="mb-7">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.18em] mb-4">Location</p>
                  <div className="space-y-2.5">
                    {locations.map(location => (
                      <div key={location} className="flex items-center gap-3">
                        <Checkbox
                          id={location}
                          checked={selectedLocations.includes(location)}
                          onCheckedChange={(checked) => {
                            if (checked) setSelectedLocations([...selectedLocations, location])
                            else setSelectedLocations(selectedLocations.filter(l => l !== location))
                          }}
                          className="border-white/20 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                        />
                        <label htmlFor={location} className="text-sm text-gray-600 cursor-pointer hover:text-gray-900 transition-colors">
                          {location}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-100 mb-7" />

                {/* Star Rating */}
                <div className="mb-7">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.18em] mb-4">Star Rating</p>
                  <div className="space-y-2.5">
                    {[5, 4, 3].map(rating => (
                      <div key={rating} className="flex items-center gap-3">
                        <Checkbox
                          id={`rating-${rating}`}
                          checked={selectedRatings.includes(rating)}
                          onCheckedChange={(checked) => {
                            if (checked) setSelectedRatings([...selectedRatings, rating])
                            else setSelectedRatings(selectedRatings.filter(r => r !== rating))
                          }}
                          className="border-white/20 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                        />
                        <label htmlFor={`rating-${rating}`} className="text-sm text-gray-600 cursor-pointer flex items-center gap-1">
                          {Array.from({ length: rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="ml-1 text-gray-400">& up</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-100 mb-7" />

                {/* Halal Rating */}
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.18em] mb-4">Halal Rating</p>
                  <div className="space-y-2.5">
                    {[5, 4, 3].map(rating => (
                      <div key={rating} className="flex items-center gap-3">
                        <Checkbox
                          id={`halal-${rating}`}
                          checked={selectedHalalRatings.includes(rating)}
                          onCheckedChange={(checked) => {
                            if (checked) setSelectedHalalRatings([...selectedHalalRatings, rating])
                            else setSelectedHalalRatings(selectedHalalRatings.filter(r => r !== rating))
                          }}
                          className="border-white/20 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                        />
                        <label htmlFor={`halal-${rating}`} className="text-sm text-gray-600 cursor-pointer">
                          {rating} Stars
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Results */}
          <main className={showFilters ? 'lg:col-span-9' : 'lg:col-span-12'}>
            <div className="space-y-5">
              {filteredPackages.map(pkg => (
                <PackageResultCard
                  key={pkg.id}
                  package={pkg}
                  onSelect={setEnquiryPackage}
                />
              ))}

              {filteredPackages.length === 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-16 text-center shadow-sm">
                  <p className="text-gray-500 mb-5">No packages match your filters.</p>
                  <button
                    onClick={() => { setPriceRange([0, 10000]); setSelectedLocations([]); setSelectedRatings([]); setSelectedHalalRatings([]) }}
                    className="inline-flex items-center gap-2 rounded-full bg-teal-500 text-white px-6 py-2.5 text-sm font-semibold hover:bg-teal-400 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Enquiry Modal */}
      {enquiryPackage && (
        <EnquiryFormModal
          package={enquiryPackage}
          isOpen={!!enquiryPackage}
          onClose={() => setEnquiryPackage(null)}
        />
      )}
    </div>
  )
}
