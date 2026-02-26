'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Calendar, Users, MapPin, ArrowLeftRight, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { airportCodes } from '@/mocks/destinations'
import { format, parseISO } from 'date-fns'

export function FlightSearchForm() {
  const router = useRouter()
  const [tripType, setTripType] = useState<'round-trip' | 'one-way'>('round-trip')
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: 'ECONOMY',
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams({
      from: searchData.origin,
      to: searchData.destination,
      departure: searchData.departureDate,
      ...(tripType === 'round-trip' && searchData.returnDate && { return: searchData.returnDate }),
      adults: searchData.adults.toString(),
      children: searchData.children.toString(),
      infants: searchData.infants.toString(),
      cabin: searchData.cabinClass,
    })
    router.push(`/flights/results?${params.toString()}`)
  }

  const today = new Date()

  return (
    <form onSubmit={handleSearch} className="space-y-3">
      {/* Trip type toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTripType('round-trip')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
            tripType === 'round-trip'
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'bg-white text-gray-600 border-gray-300 hover:border-primary hover:text-primary'
          }`}
        >
          <ArrowLeftRight className="h-3 w-3" />
          Round Trip
        </button>
        <button
          type="button"
          onClick={() => setTripType('one-way')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
            tripType === 'one-way'
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'bg-white text-gray-600 border-gray-300 hover:border-primary hover:text-primary'
          }`}
        >
          <ArrowRight className="h-3 w-3" />
          One Way
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Origin */}
        <div className="space-y-1">
          <Label htmlFor="origin" className="flex items-center gap-1.5 text-xs">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            From
          </Label>
          <Select
            value={searchData.origin}
            onValueChange={(v) => setSearchData({ ...searchData, origin: v })}
            required
          >
            <SelectTrigger id="origin" className="h-9 text-sm">
              <SelectValue placeholder="Select origin" />
            </SelectTrigger>
            <SelectContent>
              {airportCodes.map((a) => (
                <SelectItem key={a.code} value={a.code}>{a.code} — {a.city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Destination */}
        <div className="space-y-1">
          <Label htmlFor="destination" className="flex items-center gap-1.5 text-xs">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            To
          </Label>
          <Select
            value={searchData.destination}
            onValueChange={(v) => setSearchData({ ...searchData, destination: v })}
            required
          >
            <SelectTrigger id="destination" className="h-9 text-sm">
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              {airportCodes.map((a) => (
                <SelectItem key={a.code} value={a.code}>{a.code} — {a.city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Departure */}
        <div className="space-y-1">
          <Label htmlFor="departure" className="flex items-center gap-1.5 text-xs">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            Departure
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-9 w-full justify-start text-left text-sm font-normal"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {searchData.departureDate ? format(parseISO(searchData.departureDate), 'MMM dd, yyyy') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={searchData.departureDate ? parseISO(searchData.departureDate) : undefined}
                onSelect={(date) => {
                  if (!date) return
                  const next = format(date, 'yyyy-MM-dd')
                  setSearchData((prev) => ({
                    ...prev,
                    departureDate: next,
                    ...(tripType === 'round-trip' && prev.returnDate && prev.returnDate < next
                      ? { returnDate: '' }
                      : null),
                  }))
                }}
                disabled={(date) => date < today}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <input type="hidden" name="departure" value={searchData.departureDate} />
        </div>

        {/* Return date — only for round trip */}
        {tripType === 'round-trip' ? (
          <div className="space-y-1">
            <Label htmlFor="return" className="flex items-center gap-1.5 text-xs">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Return
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 w-full justify-start text-left text-sm font-normal"
                  disabled={!searchData.departureDate}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {searchData.returnDate ? format(parseISO(searchData.returnDate), 'MMM dd, yyyy') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={searchData.returnDate ? parseISO(searchData.returnDate) : undefined}
                  onSelect={(date) => {
                    if (!date) return
                    setSearchData({ ...searchData, returnDate: format(date, 'yyyy-MM-dd') })
                  }}
                  disabled={(date) =>
                    date < (searchData.departureDate ? parseISO(searchData.departureDate) : today)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <input type="hidden" name="return" value={searchData.returnDate} />
          </div>
        ) : (
          <div /> /* keep grid even on one-way */
        )}

        {/* Passengers */}
        <div className="space-y-1">
          <Label className="flex items-center gap-1.5 text-xs">
            <Users className="h-3.5 w-3.5 text-primary" />
            Passengers
          </Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-xs text-gray-500 mb-1">Adults</p>
              <Input
                type="number" min="1" max="9" className="h-9 text-sm"
                value={searchData.adults}
                onChange={(e) => setSearchData({ ...searchData, adults: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Children</p>
              <Input
                type="number" min="0" max="9" className="h-9 text-sm"
                value={searchData.children}
                onChange={(e) => setSearchData({ ...searchData, children: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Infants</p>
              <Input
                type="number" min="0" max="9" className="h-9 text-sm"
                value={searchData.infants}
                onChange={(e) => setSearchData({ ...searchData, infants: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </div>

        {/* Cabin class */}
        <div className="space-y-1">
          <Label htmlFor="cabin" className="text-xs">Cabin Class</Label>
          <Select
            value={searchData.cabinClass}
            onValueChange={(v) => setSearchData({ ...searchData, cabinClass: v })}
          >
            <SelectTrigger id="cabin" className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ECONOMY">Economy</SelectItem>
              <SelectItem value="PREMIUM_ECONOMY">Premium Economy</SelectItem>
              <SelectItem value="BUSINESS">Business</SelectItem>
              <SelectItem value="FIRST">First Class</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full h-10" size="default">
        <Search className="mr-2 h-4 w-4" />
        Search Flights
      </Button>
    </form>
  )
}