'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Calendar, Users, MapPin } from 'lucide-react'
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
import { popularDestinations } from '@/mocks/destinations'
import { format, parseISO } from 'date-fns'

export function PackageSearchForm() {
  const router = useRouter()
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    rooms: 1,
    adults: 2,
    children: 0,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams({
      destination: searchData.destination,
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      rooms: searchData.rooms.toString(),
      adults: searchData.adults.toString(),
      children: searchData.children.toString(),
    })

    router.push(`/packages/results?${params.toString()}`)
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr,1.5fr,1.5fr,1fr] gap-3 items-end">
        {/* Destination */}
        <div className="space-y-1">
          <Label htmlFor="destination" className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <MapPin className="h-3.5 w-3.5 text-teal-600" />
            Destination
          </Label>
          <Select
            value={searchData.destination}
            onValueChange={(value: string) => setSearchData({ ...searchData, destination: value })}
            required
          >
            <SelectTrigger id="destination" className="h-11 text-sm bg-white/70 border-slate-300 focus:ring-teal-500">
              <SelectValue placeholder="e.g., Mecca, Saudi Arabia" />
            </SelectTrigger>
            <SelectContent>
              {popularDestinations.map((dest) => (
                <SelectItem key={dest.id} value={dest.id}>
                  {dest.name}, {dest.country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="checkIn" className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Calendar className="h-3.5 w-3.5 text-teal-600" />
              Check-in
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 justify-start text-left font-normal text-sm bg-white/70 border-slate-300 hover:bg-white focus:ring-teal-500"
                >
                  {searchData.checkIn ? format(parseISO(searchData.checkIn), 'MMM d, yyyy') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={searchData.checkIn ? parseISO(searchData.checkIn) : undefined}
                  onSelect={(date) => {
                    if (!date) return
                    const next = format(date, 'yyyy-MM-dd')
                    setSearchData({ ...searchData, checkIn: next })
                  }}
                  disabled={{ before: today }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-1">
            <Label htmlFor="checkOut" className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Calendar className="h-3.5 w-3.5 text-teal-600" />
              Check-out
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 justify-start text-left font-normal text-sm bg-white/70 border-slate-300 hover:bg-white focus:ring-teal-500"
                  disabled={!searchData.checkIn}
                >
                  {searchData.checkOut ? format(parseISO(searchData.checkOut), 'MMM d, yyyy') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={searchData.checkOut ? parseISO(searchData.checkOut) : undefined}
                  onSelect={(date) => {
                    if (!date) return
                    const next = format(date, 'yyyy-MM-dd')
                    setSearchData({ ...searchData, checkOut: next })
                  }}
                  disabled={{ before: searchData.checkIn ? parseISO(searchData.checkIn) : today }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Guests */}
        <div className="space-y-1">
          <Label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Users className="h-3.5 w-3.5 text-teal-600" />
            Guests & Rooms
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full h-11 justify-start text-left font-normal text-sm bg-white/70 border-slate-300 hover:bg-white focus:ring-teal-500">
                {searchData.adults + searchData.children} Guests, {searchData.rooms} Room(s)
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4 space-y-4 bg-white/90 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <Label htmlFor="rooms">Rooms</Label>
                <Input 
                  id="rooms" 
                  type="number" 
                  className="w-20 h-9" 
                  min={1} 
                  value={searchData.rooms} 
                  onChange={e => setSearchData({...searchData, rooms: parseInt(e.target.value, 10)})}
                />
              </div>
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
            </PopoverContent>
          </Popover>
        </div>

        {/* Search Button */}
        <div className="flex items-end sm:col-span-2 lg:col-span-1">
          <Button type="submit" className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-bold text-base gap-2 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300">
            <Search className="h-5 w-5" />
            Search
          </Button>
        </div>
      </div>
    </form>
  )
}
