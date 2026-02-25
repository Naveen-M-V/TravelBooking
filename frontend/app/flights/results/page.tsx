'use client'

import { Suspense, useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { FlightResultCard } from '@/components/flights/FlightResultCard'
import { FlightDetailsModal } from '@/components/flights/FlightDetailsModal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Loader2, Plane, Clock, Filter, AlertCircle, RefreshCw } from 'lucide-react'
import { flightAPI } from '@/lib/api/flights'
import { getMockSearchResults } from '@/mocks/flight-mock-data'
import type { Itinerary } from '@/types/flights'
import { formatPrice } from '@/lib/utils'

const POLL_INTERVAL = 3000
const POLL_MAX = 20

function FlightResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [searchStatus, setSearchStatus] = useState<string>('Initiating search...')
  const [error, setError] = useState<string | null>(null)
  const [sId, setSId] = useState<string | null>(null)
  const [results, setResults] = useState<Itinerary[]>([])
  const [filteredResults, setFilteredResults] = useState<Itinerary[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [maxPrice, setMaxPrice] = useState(10000)
  const [selectedStops, setSelectedStops] = useState<string[]>([])
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([])
  const [selectedTimes, setSelectedTimes] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('recommended')
  const [showFilters, setShowFilters] = useState(true)
  const [selectedFlight, setSelectedFlight] = useState<Itinerary | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const pollCount = useRef(0)
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null)

  const airlines = Array.from(new Set(results.map(i => i.airline)))

  const loadResults = (itineraries: Itinerary[]) => {
    setResults(itineraries)
    setFilteredResults(itineraries)
    if (itineraries.length > 0) {
      const prices = itineraries.map((i: any) => Number(i.price?.total ?? 0))
      const min = Math.min(...prices)
      const max = Math.max(...prices)
      setPriceRange([min, max])
      setMaxPrice(max)
    }
    setLoading(false)
  }

  useEffect(() => {
    const performSearch = async () => {
      setLoading(true)
      setError(null)
      pollCount.current = 0

      const origin = searchParams.get('from') || ''
      const destination = searchParams.get('to') || ''
      const departureDate = searchParams.get('departure') || ''
      const returnDate = searchParams.get('return') || undefined
      const adults = parseInt(searchParams.get('adults') || '1')
      const children = parseInt(searchParams.get('children') || '0')
      const infants = parseInt(searchParams.get('infants') || '0')
      const cabinClass = searchParams.get('class') || 'ECONOMY'
      const tripType = returnDate ? 'RETURN' : 'ONE_WAY'

      if (!origin || !destination || !departureDate) {
        setError('Missing search parameters. Please go back and try again.')
        setLoading(false)
        return
      }

      setSearchStatus('Sending search request...')

      try {
        // Step 1: Initiate async search
        const searchRes = await flightAPI.asyncSearch({
          origin, destination, departureDate, returnDate,
          adults, children, infants, cabinClass, tripType, currency: 'SAR',
        })

        const searchId = searchRes.data?.sId || searchRes.sId
        if (!searchId) throw new Error('No search ID returned from API')

        setSId(searchId)
        setSearchStatus('Search initiated — polling for results...')

        // Step 2: Poll for results
        const poll = async () => {
          if (pollCount.current >= POLL_MAX) {
            setSearchStatus('Search timed out')
            if (results.length === 0) setError('Search timed out. Please try again.')
            setLoading(false)
            return
          }

          pollCount.current++
          setSearchStatus(`Searching... (${pollCount.current}/${POLL_MAX})`)

          try {
            const pollRes = await flightAPI.searchPolling(searchId)
            const status = pollRes.data?.status || pollRes.status
            const itineraries = pollRes.data?.itineraries || pollRes.itineraries || []

            if (status === 'COMPLETED' || itineraries.length > 0) {
              loadResults(itineraries)
              return
            }

            pollTimerRef.current = setTimeout(poll, POLL_INTERVAL)
          } catch (pollErr) {
            console.error('Poll error:', pollErr)
            pollTimerRef.current = setTimeout(poll, POLL_INTERVAL)
          }
        }

        setTimeout(poll, 2000)

      } catch {
        // Backend unavailable — fall back to demo data instantly
        console.warn('[Flight Search] Backend unavailable, using demo data')
        setSearchStatus('Loading demo results...')
        await new Promise(r => setTimeout(r, 800))
        loadResults(getMockSearchResults(origin, destination) as any)
      }
    }

    performSearch()

    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...results]

    filtered = filtered.filter(i => {
      const price = Number((i as any).price?.total ?? 0)
      return price >= priceRange[0] && price <= priceRange[1]
    })

    if (selectedStops.length > 0) {
      filtered = filtered.filter((i: any) => {
        const stops = i.legs?.[0]?.stops ?? 0
        if (selectedStops.includes('direct') && stops === 0) return true
        if (selectedStops.includes('1stop') && stops === 1) return true
        if (selectedStops.includes('2plus') && stops >= 2) return true
        return false
      })
    }

    if (selectedAirlines.length > 0) {
      filtered = filtered.filter(i => selectedAirlines.includes(i.airline))
    }

    filtered.sort((a: any, b: any) => {
      switch (sortBy) {
        case 'price-low':  return Number(a.price?.total ?? 0) - Number(b.price?.total ?? 0)
        case 'price-high': return Number(b.price?.total ?? 0) - Number(a.price?.total ?? 0)
        default: return 0
      }
    })

    setFilteredResults(filtered)
  }, [selectedStops, selectedAirlines, selectedTimes, priceRange, sortBy, results])

  const handleSelectFlight = (itinerary: Itinerary) => {
    // Persist full itinerary so booking page can display real data without re-fetching
    try {
      sessionStorage.setItem('selected_flight_itinerary', JSON.stringify(itinerary))
    } catch {}
    router.push(`/flights/${itinerary.id}/booking?sId=${sId}`)
  }

  const handleViewDetails = (itinerary: Itinerary) => {
    setSelectedFlight(itinerary)
    setShowDetailsModal(true)
  }

  const handleSelectFromModal = (itinerary: Itinerary) => {
    setShowDetailsModal(false)
    handleSelectFlight(itinerary)
  }

  const toggleStopFilter = (stopType: string) => {
    setSelectedStops(prev =>
      prev.includes(stopType) ? prev.filter(s => s !== stopType) : [...prev, stopType]
    )
  }

  const toggleAirlineFilter = (airline: string) => {
    setSelectedAirlines(prev =>
      prev.includes(airline) ? prev.filter(a => a !== airline) : [...prev, airline]
    )
  }

  const clearAllFilters = () => {
    setSelectedStops([])
    setSelectedAirlines([])
    setSelectedTimes([])
    setPriceRange([0, maxPrice])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-800 mb-1">Searching Flights</p>
          <p className="text-gray-500">{searchStatus}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-800 mb-2">Search Failed</p>
          <p className="text-gray-500 mb-6">{error}</p>
          <Button onClick={() => router.back()} variant="outline" className="mr-3">Go Back</Button>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Flight Search Results</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 px-4 py-2">
              <Plane className="h-4 w-4 mr-2" />
              {searchParams.get('from')} to {searchParams.get('to')}
            </Badge>
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              {searchParams.get('departure')}
              {searchParams.get('return') && ` - ${searchParams.get('return')}`}
            </Badge>
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 px-4 py-2">
              {searchParams.get('adults') || '1'} Passenger(s)
            </Badge>
          </div>
        </div>
      </div>

      {/* Sort & Filter Bar */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{filteredResults.length}</span> flights found
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-gray-600 hidden sm:inline">Sort by:</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]" id="sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="departure">Departure Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader className="bg-gray-50">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                    </span>
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
                      Clear All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  {/* Price Range */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Price Range</Label>
                    <Slider
                      min={0}
                      max={maxPrice}
                      step={50}
                      value={priceRange}
                      onValueChange={(v) => setPriceRange(v as [number, number])}
                      className="mb-4"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{formatPrice(priceRange[0], 'SAR')}</span>
                      <span>{formatPrice(priceRange[1], 'SAR')}</span>
                    </div>
                  </div>
                  <Separator />

                  {/* Stops Filter */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Stops</Label>
                    <div className="space-y-3">
                      {[
                        { id: 'direct', label: 'Direct' },
                        { id: '1stop', label: '1 Stop' },
                        { id: '2plus', label: '2+ Stops' },
                      ].map(({ id, label }) => (
                        <div key={id} className="flex items-center space-x-2">
                          <Checkbox
                            id={id}
                            checked={selectedStops.includes(id)}
                            onCheckedChange={() => toggleStopFilter(id)}
                          />
                          <label htmlFor={id} className="text-sm cursor-pointer">{label}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />

                  {/* Airlines Filter */}
                  {airlines.length > 0 && (
                    <div>
                      <Label className="text-base font-semibold mb-3 block">Airlines</Label>
                      <div className="space-y-3">
                        {airlines.map(airline => (
                          <div key={airline} className="flex items-center space-x-2">
                            <Checkbox
                              id={airline}
                              checked={selectedAirlines.includes(airline)}
                              onCheckedChange={() => toggleAirlineFilter(airline)}
                            />
                            <label htmlFor={airline} className="text-sm cursor-pointer flex-1 flex justify-between">
                              <span>{airline}</span>
                              <span className="text-gray-500">
                                {results.filter(r => r.airline === airline).length}
                              </span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </aside>
          )}

          {/* Results List */}
          <main className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {filteredResults.length === 0 ? (
              <Card className="p-12 text-center">
                <Plane className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-600 mb-4">No flights match your filters</p>
                <Button onClick={clearAllFilters}>Clear All Filters</Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredResults.map((itinerary) => (
                  <FlightResultCard
                    key={itinerary.id}
                    itinerary={itinerary}
                    onSelect={handleSelectFlight}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <FlightDetailsModal
        itinerary={selectedFlight}
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onSelect={handleSelectFromModal}
      />
    </div>
  )
}

export default function FlightResultsPage() {
  return (
    <Suspense>
      <FlightResultsContent />
    </Suspense>
  )
}