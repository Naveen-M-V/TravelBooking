'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PackageResultCard } from '@/components/packages/PackageResultCard'
import { EnquiryFormModal } from '@/components/packages/EnquiryFormModal'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Filter, SlidersHorizontal, MapPin, ShieldCheck, Calendar, X, Loader2, Users, BedDouble, Plus, Minus, Info } from 'lucide-react'
import { packagesAPI } from '@/lib/api/packages'
import { couponsAPI } from '@/lib/api/coupons'
import { wishlistAPI } from '@/lib/api/wishlist'
import { useAuth } from '@/context/AuthContext'

/** Normalize a backend Package record to the shape PackageResultCard + EnquiryFormModal expect */
function normalizePackage(p: any) {
  const imagesArr = [p.coverImage, ...(p.images ?? [])].filter(Boolean)
  const priceNum  = Number(p.price)
  const currency  = p.currency ?? 'SAR'
  const nightsMatch = (p.duration ?? '').match(/(\d+)\s*[Nn]ight/)
  const nights = nightsMatch ? parseInt(nightsMatch[1], 10) : 7
  return {
    // Enquiry-modal fields
    id:          p.id,
    name:        p.name,
    destination: p.destination,
    country:     p.country,
    duration:    p.duration,
    description: p.description ?? '',
    features:    Array.isArray(p.features)  ? p.features  : [],
    highlights:  Array.isArray(p.highlights) ? p.highlights : [],
    included:    Array.isArray(p.included)  ? p.included  : [],
    excluded:    Array.isArray(p.excluded)  ? p.excluded  : [],
    bookingConditions: Array.isArray(p.bookingConditions) ? p.bookingConditions : [],
    halalFacilities: Array.isArray(p.halalFacilities) ? p.halalFacilities : [],
    gallery:     Array.isArray(p.images) ? p.images : [],
    itinerary:   Array.isArray(p.itinerary) ? p.itinerary : [],
    // Card-specific fields
    hotelName:   p.name,
    location:    p.destination,
    halalRating: 4,
    nights,
    price:       { total: priceNum, currency, base: priceNum, tax: 0 },
    images:      imagesArr.length ? imagesArr : [`https://picsum.photos/seed/${encodeURIComponent(p.id)}/800/600`],
    amenities:   Array.isArray(p.features) ? p.features : [],
    roomType:    p.category ?? '',
    boardType:   '',
    checkIn:     'Flexible Dates',
    checkOut:    'Flexible Dates',
  }
}

function PackagesPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const maxChildrenForAdults = (adults: number) => Math.max(0, 4 - adults)

  const [packages, setPackages] = useState<any[]>([])
  const [basePackages, setBasePackages] = useState<any[]>([])
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set())
  const [pkgLoading, setPkgLoading] = useState(true)
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [searchLocation, setSearchLocation] = useState('')
  const [searchNights, setSearchNights] = useState('')
  const [searchDate, setSearchDate] = useState('')
  const [rooms, setRooms] = useState<Array<{ adults: number; children: number }>>([{ adults: 2, children: 0 }])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedHalalRatings, setSelectedHalalRatings] = useState<number[]>([])
  const [sortBy, setSortBy] = useState('recommended')
  const [showFilters, setShowFilters] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [enquiryPackage, setEnquiryPackage] = useState<any>(null)
  const [couponStatus, setCouponStatus] = useState<string | null>(null)

  const couponCode = (searchParams.get('coupon') || '').trim().toUpperCase()

  useEffect(() => {
    packagesAPI.getAll({ isActive: true })
      .then((res) => {
        const normalized = (res.packages || []).map(normalizePackage)
        setBasePackages(normalized)
        setPackages(normalized)
      })
      .catch(() => {
        setBasePackages([])
        setPackages([])
      })
      .finally(() => setPkgLoading(false))
  }, [])

  useEffect(() => {
    const applyCoupon = async () => {
      if (!couponCode) {
        setPackages(basePackages)
        setCouponStatus(null)
        return
      }

      if (!basePackages.length) {
        setPackages([])
        return
      }

      const adjusted = await Promise.all(basePackages.map(async (pkg) => {
        try {
          const orderValue = Number(pkg.price?.total || 0)
          const validation = await couponsAPI.validate({
            code: couponCode,
            orderValue,
            type: 'PACKAGE',
          })

          if (!validation?.valid) return pkg

          const finalAmount = Number(validation.finalAmount)
          const discount = Number(validation.discount)

          return {
            ...pkg,
            price: {
              ...pkg.price,
              total: finalAmount,
            },
            couponApplied: {
              code: couponCode,
              discount,
              originalTotal: orderValue,
            },
          }
        } catch {
          return pkg
        }
      }))

      const appliedCount = adjusted.filter((pkg) => Boolean(pkg.couponApplied)).length
      if (appliedCount > 0) {
        setCouponStatus(`Coupon ${couponCode} applied to ${appliedCount} package${appliedCount > 1 ? 's' : ''}.`)
      } else {
        setCouponStatus(`Coupon ${couponCode} is not valid for current package prices.`)
      }

      setPackages(adjusted)
    }

    applyCoupon()
  }, [basePackages, couponCode])

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

  const totalAdults = rooms.reduce((sum, room) => sum + room.adults, 0)
  const totalChildren = rooms.reduce((sum, room) => sum + room.children, 0)
  const totalGuests = totalAdults + totalChildren
  const totalRooms = rooms.length

  const updateRoomAdults = (index: number, nextAdults: number) => {
    const boundedAdults = Math.max(1, Math.min(3, nextAdults))
    setRooms(prev => prev.map((room, i) => {
      if (i !== index) return room
      const nextChildrenCap = maxChildrenForAdults(boundedAdults)
      return {
        adults: boundedAdults,
        children: Math.min(room.children, nextChildrenCap),
      }
    }))
  }

  const updateRoomChildren = (index: number, nextChildren: number) => {
    setRooms(prev => prev.map((room, i) => {
      if (i !== index) return room
      const childCap = maxChildrenForAdults(room.adults)
      return {
        ...room,
        children: Math.max(0, Math.min(childCap, nextChildren)),
      }
    }))
  }

  const addRoom = () => {
    setRooms(prev => [...prev, { adults: 1, children: 0 }])
  }

  const removeRoom = (index: number) => {
    setRooms(prev => prev.length === 1 ? prev : prev.filter((_, i) => i !== index))
  }

  const locations = Array.from(new Set(packages.map((p: any) => p.location)))
  
  const filteredPackages = packages
    .filter(pkg => {
      const withinPrice = pkg.price.total >= priceRange[0] && pkg.price.total <= priceRange[1]
      const searchLocationValue = searchLocation.trim().toLowerCase()
      const matchSearchLocation = !searchLocationValue || pkg.location.toLowerCase().includes(searchLocationValue)
      const parsedSearchNights = searchNights ? parseInt(searchNights, 10) : null
      const matchNights = !parsedSearchNights || pkg.nights === parsedSearchNights
      const matchLocation = selectedLocations.length === 0 || selectedLocations.includes(pkg.location)
      const matchHalal = selectedHalalRatings.length === 0 || selectedHalalRatings.includes(pkg.halalRating)
      return withinPrice && matchSearchLocation && matchNights && matchLocation && matchHalal
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price.total - b.price.total
        case 'price-high': return b.price.total - a.price.total
        case 'halal': return b.halalRating - a.halalRating
        default: return 0
      }
    })

  const appliedFilterCount = selectedLocations.length + selectedHalalRatings.length

  const clearAllFilters = () => {
    setPriceRange([0, 10000])
    setSelectedLocations([])
    setSelectedHalalRatings([])
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

  const filterSections = (
    <>
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
    </>
  )

  return (
    <div className="min-h-screen page-ivory text-gray-900 relative">
      <div className="ivory-pattern-overlay" />
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(20,184,166,0.08),transparent)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />
        <div className="container mx-auto px-4 pt-28 pb-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 border border-teal-400/20 px-4 py-2 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              <span className="text-teal-700 text-xs font-bold uppercase tracking-[0.18em]">Packages</span>
            </div>
            <h1 className="mt-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] mb-4">
              Halal holiday packages,{' '}
              <span className="italic font-serif text-teal-600">curated</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-6">
              Unique stays, thoughtful itineraries, and a seamless halal-friendly experience.
            </p>

            {couponStatus && (
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm text-teal-700">
                <span className="h-2 w-2 rounded-full bg-teal-500" />
                {couponStatus}
              </div>
            )}

            {/* Sort and Filter Controls */}
            <div className="flex items-center gap-3 flex-wrap mb-6">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="halal">Halal Rating</SelectItem>
                </SelectContent>
              </Select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="hidden md:inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filters ({appliedFilterCount})
              </button>
              <button
                onClick={() => setShowMobileFilters(true)}
                className="inline-flex md:hidden items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filters ({appliedFilterCount})
              </button>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <div className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-4 py-2 shadow-sm">
                <MapPin className="h-4 w-4 text-teal-500" />
                <span className="text-gray-700">{locations.length} Destinations</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-4 py-2 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-teal-500" />
                <span className="text-gray-700">Halal-Friendly</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-4 py-2 shadow-sm">
                <Calendar className="h-4 w-4 text-teal-500" />
                <span className="text-gray-700">Flexible Booking</span>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400 mb-1.5">Location</p>
                <Input
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="e.g. Barcelona"
                  className="h-10"
                />
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400 mb-1.5">Number of Nights</p>
                <Input
                  type="number"
                  min={1}
                  value={searchNights}
                  onChange={(e) => setSearchNights(e.target.value)}
                  placeholder="e.g. 7"
                  className="h-10"
                />
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400 mb-1.5">When</p>
                <Input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="h-10"
                />
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400 mb-1.5">Guests and Rooms</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-left text-sm text-gray-700 hover:bg-gray-50">
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-teal-500" />
                        {totalGuests} Guest{totalGuests !== 1 ? 's' : ''} · {totalRooms} Room{totalRooms !== 1 ? 's' : ''}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[360px] p-4" align="end">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Guests and Rooms</p>
                        <p className="text-xs text-gray-500">Adult 12+ · Children (Age 0-12)</p>
                      </div>

                      {rooms.map((room, idx) => {
                        const childCap = maxChildrenForAdults(room.adults)
                        const reachedChildCap = room.children >= childCap

                        return (
                          <div key={idx} className="rounded-xl border border-gray-200 p-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-gray-800 inline-flex items-center gap-1.5">
                                <BedDouble className="h-4 w-4 text-teal-500" />
                                Room {idx + 1}
                              </span>
                              {rooms.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeRoom(idx)}
                                  className="text-xs text-gray-500 hover:text-red-600"
                                >
                                  Remove
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Adults</p>
                                <div className="flex items-center justify-between rounded-md border border-gray-200 px-2 py-1.5">
                                  <button
                                    type="button"
                                    onClick={() => updateRoomAdults(idx, room.adults - 1)}
                                    className="p-1 text-gray-600 hover:text-teal-600"
                                    disabled={room.adults <= 1}
                                  >
                                    <Minus className="h-3.5 w-3.5" />
                                  </button>
                                  <span className="text-sm font-semibold">{room.adults}</span>
                                  <button
                                    type="button"
                                    onClick={() => updateRoomAdults(idx, room.adults + 1)}
                                    className="p-1 text-gray-600 hover:text-teal-600"
                                    disabled={room.adults >= 3}
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <p className="text-xs text-gray-500">Children</p>
                                  {reachedChildCap && (
                                    <span
                                      className="inline-flex text-amber-500"
                                      title="Add another room to add more guests"
                                    >
                                      <Info className="h-3.5 w-3.5" />
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center justify-between rounded-md border border-gray-200 px-2 py-1.5">
                                  <button
                                    type="button"
                                    onClick={() => updateRoomChildren(idx, room.children - 1)}
                                    className="p-1 text-gray-600 hover:text-teal-600"
                                    disabled={room.children <= 0}
                                  >
                                    <Minus className="h-3.5 w-3.5" />
                                  </button>
                                  <span className="text-sm font-semibold">{room.children}</span>
                                  <button
                                    type="button"
                                    onClick={() => updateRoomChildren(idx, room.children + 1)}
                                    className="p-1 text-gray-600 hover:text-teal-600"
                                    disabled={room.children >= childCap}
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            <p className="text-[11px] text-gray-500">
                              Max 4 members per room. Adults: 1-3. Children allowed now: 0-{childCap}.
                            </p>
                            {reachedChildCap && (
                              <p className="text-[11px] text-amber-600">Add another room to add more guests.</p>
                            )}
                          </div>
                        )
                      })}

                      <button
                        type="button"
                        onClick={addRoom}
                        className="w-full rounded-md border border-dashed border-teal-300 py-2 text-sm font-medium text-teal-700 hover:bg-teal-50"
                      >
                        Add Room
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                {searchDate ? `Travel date selected: ${searchDate}` : 'Pick your travel date to help planning your package.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchLocation('')
                  setSearchNights('')
                  setSearchDate('')
                  setRooms([{ adults: 2, children: 0 }])
                }}
                className="text-xs font-medium text-gray-500 hover:text-teal-700"
              >
                Reset search
              </button>
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
                className={`hidden md:inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  showFilters
                    ? 'bg-teal-600 text-white'
                    : 'bg-white ring-1 ring-gray-200 text-gray-600 hover:bg-gray-50 hover:text-teal-600'
                }`}
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
              <button
                onClick={() => setShowMobileFilters(true)}
                className="inline-flex md:hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold bg-white ring-1 ring-gray-200 text-gray-600 hover:bg-gray-50 hover:text-teal-600 transition-all"
              >
                <Filter className="h-4 w-4" />
                Filters ({appliedFilterCount})
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
                  <SelectItem value="halal">Halal Rating: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showMobileFilters} onOpenChange={setShowMobileFilters}>
        <DialogContent className="max-w-md w-[95vw] max-h-[85vh] overflow-y-auto md:hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-teal-500" />
              Filters
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <button
              onClick={clearAllFilters}
              className="text-xs text-gray-500 hover:text-teal-700 inline-flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Clear all
            </button>

            {filterSections}

            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full rounded-lg bg-teal-600 text-white py-2.5 text-sm font-semibold hover:bg-teal-500"
            >
              Apply Filters ({filteredPackages.length} packages)
            </button>
          </div>
        </DialogContent>
      </Dialog>

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
                    onClick={clearAllFilters}
                    className="text-xs text-gray-400 hover:text-teal-600 transition-colors flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Clear all
                  </button>
                </div>

                {filterSections}
              </div>
            </aside>
          )}

          {/* Results */}
          <main className={showFilters ? 'lg:col-span-9' : 'lg:col-span-12'}>
            {pkgLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600 mr-3" />
                <span className="text-gray-500">Loading packages…</span>
              </div>
            ) : (
            <div className="space-y-5">
              {filteredPackages.map(pkg => (
                <PackageResultCard
                  key={pkg.id}
                  package={pkg}
                  onSelect={setEnquiryPackage}
                  onViewDetails={(selectedPkg) => router.push(`/packages/${selectedPkg.id}`)}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={wishlistIds.has(pkg.id)}
                />
              ))}

              {filteredPackages.length === 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-16 text-center shadow-sm">
                  <p className="text-gray-500 mb-5">No packages match your filters.</p>
                  <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-2 rounded-full bg-teal-500 text-white px-6 py-2.5 text-sm font-semibold hover:bg-teal-400 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
            )}
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

export default function PackagesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen page-ivory" />}>
      <PackagesPageContent />
    </Suspense>
  )
}
