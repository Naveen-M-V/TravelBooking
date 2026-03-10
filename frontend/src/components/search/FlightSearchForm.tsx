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
              ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
              : 'bg-white/70 text-slate-600 border-slate-300 hover:border-cyan-600 hover:text-cyan-700'
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
              ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
              : 'bg-white/70 text-slate-600 border-slate-300 hover:border-cyan-600 hover:text-cyan-700'
          }`}
        >
          <ArrowRight className="h-3.5 w-3.5" />
          One Way
        </button>
      </div>

      {/* Single line layout - all fields in one row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-[2fr,1.5fr,1.5fr,1fr] gap-3 items-end">
        {/* Origin & Destination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="origin" className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <MapPin className="h-3.5 w-3.5 text-cyan-600" />
              From
            </Label>
            <Select
              value={searchData.origin}
              onValueChange={(v) => setSearchData({ ...searchData, origin: v })}
              required
            >
              <SelectTrigger id="origin" className="h-11 text-sm bg-white/70 border-slate-300 focus:ring-cyan-500">
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
            <Label htmlFor="destination" className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <MapPin className="h-3.5 w-3.5 text-cyan-600" />
              To
            </Label>
            <Select
              value={searchData.destination}
              onValueChange={(v) => setSearchData({ ...searchData, destination: v })}
              required
            >
              <SelectTrigger id="destination" className="h-11 text-sm bg-white/70 border-slate-300 focus:ring-cyan-500">
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
            <Label htmlFor="departureDate" className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Calendar className="h-3.5 w-3.5 text-cyan-600" />
              Departure
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="departureDate"
                  variant="outline"
                  className="w-full h-11 justify-start text-left font-normal text-sm bg-white/70 border-slate-300 hover:bg-white focus:ring-cyan-500"
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
            <Label htmlFor="returnDate" className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Calendar className="h-3.5 w-3.5 text-cyan-600" />
              Return
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="returnDate"
                  variant="outline"
                  className="w-full h-11 justify-start text-left font-normal text-sm bg-white/70 border-slate-300 hover:bg-white focus:ring-cyan-500"
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
            <Label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Users className="h-3.5 w-3.5 text-cyan-600" />
              Passengers
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full h-11 justify-start text-left font-normal text-sm bg-white/70 border-slate-300 hover:bg-white focus:ring-cyan-500">
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
            <Label htmlFor="cabinClass" className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Users className="h-3.5 w-3.5 text-cyan-600" />
              Class
            </Label>
            <Select
              value={searchData.cabinClass}
              onValueChange={(v) => setSearchData({ ...searchData, cabinClass: v })}
            >
              <SelectTrigger id="cabinClass" className="h-11 text-sm bg-white/70 border-slate-300 focus:ring-cyan-500">
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
        <div className="flex items-end">
          <Button type="submit" className="w-full h-11 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-base gap-2 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300">
            <Search className="h-5 w-5" />
            <span className="hidden xl:inline">Search</span>
          </Button>
        </div>
      </div>
    </form>
  )
}