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
  today.setHours(0, 0, 0, 0)

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      {/* Trip type toggle - Compact */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTripType('round-trip')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
            tripType === 'round-trip'
              ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
              : 'bg-white/80 text-neutral-700 border-neutral-300 hover:border-primary-500 hover:text-primary-700'
          }`}
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          Round Trip
        </button>
        <button
          type="button"
          onClick={() => setTripType('one-way')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
            tripType === 'one-way'
              ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
              : 'bg-white/80 text-neutral-700 border-neutral-300 hover:border-primary-500 hover:text-primary-700'
          }`}
        >
          <ArrowRight className="h-3.5 w-3.5" />
          One Way
        </button>
      </div>

      {/* Single line layout - all fields in one row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-[2fr,1.5fr,1.5fr,1fr] gap-3 items-end">
        {/* Origin & Destination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="origin" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700">
              <MapPin className="h-3.5 w-3.5 text-primary-600" />
              From
            </Label>
            <Select
              value={searchData.origin}
              onValueChange={(v) => setSearchData({ ...searchData, origin: v })}
              required
            >
              <SelectTrigger id="origin" className="h-11 text-sm bg-white/85 border-neutral-300 focus:ring-primary-500">
                <SelectValue placeholder="Select origin" />
              </SelectTrigger>
              <SelectContent>
                {airportCodes.map((a) => (
                  <SelectItem key={a.code} value={a.code}>
                    {a.city} ({a.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="destination" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700">
              <MapPin className="h-3.5 w-3.5 text-primary-600" />
              To
            </Label>
            <Select
              value={searchData.destination}
              onValueChange={(v) => setSearchData({ ...searchData, destination: v })}
              required
            >
              <SelectTrigger id="destination" className="h-11 text-sm bg-white/85 border-neutral-300 focus:ring-primary-500">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {airportCodes.map((a) => (
                  <SelectItem key={a.code} value={a.code}>
                    {a.city} ({a.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="departureDate" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700">
              <Calendar className="h-3.5 w-3.5 text-primary-600" />
              Departure
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="departureDate"
                  variant="outline"
                  className="w-full h-11 justify-start text-left font-normal text-sm bg-white/85 border-neutral-300 hover:bg-white focus:ring-primary-500"
                >
                  {searchData.departureDate ? format(parseISO(searchData.departureDate), 'MMM d, yyyy') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={searchData.departureDate ? parseISO(searchData.departureDate) : undefined}
                  onSelect={(d) => setSearchData({ ...searchData, departureDate: d ? d.toISOString().split('T')[0] : '' })}
                  disabled={{ before: today }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className={`space-y-1 transition-opacity duration-300 ${tripType === 'one-way' ? 'opacity-50' : ''}`}>
            <Label htmlFor="returnDate" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700">
              <Calendar className="h-3.5 w-3.5 text-primary-600" />
              Return
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="returnDate"
                  variant="outline"
                  className="w-full h-11 justify-start text-left font-normal text-sm bg-white/85 border-neutral-300 hover:bg-white focus:ring-primary-500"
                  disabled={tripType === 'one-way'}
                >
                  {searchData.returnDate ? format(parseISO(searchData.returnDate), 'MMM d, yyyy') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={searchData.returnDate ? parseISO(searchData.returnDate) : undefined}
                  onSelect={(d) => setSearchData({ ...searchData, returnDate: d ? d.toISOString().split('T')[0] : '' })}
                  disabled={{ before: searchData.departureDate ? parseISO(searchData.departureDate) : today }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Passengers & Class */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700">
              <Users className="h-3.5 w-3.5 text-primary-600" />
              Passengers
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full h-11 justify-start text-left font-normal text-sm bg-white/85 border-neutral-300 hover:bg-white focus:ring-primary-500">
                  {searchData.adults + searchData.children + searchData.infants} Traveler(s)
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 space-y-4 bg-white/90 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <Label htmlFor="adults">Adults</Label>
                  <Input 
                    id="adults" 
                    type="number" 
                    className="w-20 h-9" 
                    min={1} 
                    value={searchData.adults} 
                    onChange={e => setSearchData({...searchData, adults: parseInt(e.target.value, 10)})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="children">Children</Label>
                  <Input 
                    id="children" 
                    type="number" 
                    className="w-20 h-9" 
                    min={0} 
                    value={searchData.children} 
                    onChange={e => setSearchData({...searchData, children: parseInt(e.target.value, 10)})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="infants">Infants</Label>
                  <Input 
                    id="infants" 
                    type="number" 
                    className="w-20 h-9" 
                    min={0} 
                    value={searchData.infants} 
                    onChange={e => setSearchData({...searchData, infants: parseInt(e.target.value, 10)})}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-1">
            <Label htmlFor="cabinClass" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700">
              <Users className="h-3.5 w-3.5 text-primary-600" />
              Class
            </Label>
            <Select
              value={searchData.cabinClass}
              onValueChange={(v) => setSearchData({ ...searchData, cabinClass: v })}
            >
              <SelectTrigger id="cabinClass" className="h-11 text-sm bg-white/85 border-neutral-300 focus:ring-primary-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ECONOMY">Economy</SelectItem>
                <SelectItem value="BUSINESS">Business</SelectItem>
                <SelectItem value="FIRST">First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-end sm:col-span-2 lg:col-span-1">
          <Button type="submit" className="group w-full h-11 bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-400 hover:to-primary-400 text-white font-bold text-base gap-2 shadow-lg shadow-accent-200/50 transition-all duration-500 ease-out hover:shadow-[0_8px_30px_rgba(20,184,166,0.5)] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0">
            <Search className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            Search
          </Button>
        </div>
      </div>
    </form>
  )
}