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
  const [couponCode, setCouponCode] = useState('')

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

    const coupon = couponCode.trim()
    if (coupon) params.set('coupon', coupon.toUpperCase())

    router.push(`/packages?${params.toString()}`)
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr,1.5fr,1.5fr,1fr] gap-3 items-end">
        {/* Destination */}
        <div className="space-y-1">
          <Label htmlFor="destination" className="flex items-center gap-1.5 text-xs font-semibold text-white">
            <MapPin className="h-3.5 w-3.5 text-primary-600" />
            Destination
          </Label>
          <Select
            value={searchData.destination}
            onValueChange={(value: string) => setSearchData({ ...searchData, destination: value })}
            required
          >
            <SelectTrigger id="destination" className="h-11 text-sm bg-white/85 border-neutral-300 focus:ring-primary-500">
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
            <Label htmlFor="checkIn" className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <Calendar className="h-3.5 w-3.5 text-primary-600" />
              Check-in
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 justify-start text-left font-normal text-sm bg-white/85 border-neutral-300 hover:bg-white focus:ring-primary-500"
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
            <Label htmlFor="checkOut" className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <Calendar className="h-3.5 w-3.5 text-primary-600" />
              Check-out
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 justify-start text-left font-normal text-sm bg-white/85 border-neutral-300 hover:bg-white focus:ring-primary-500"
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
          <Label className="flex items-center gap-1.5 text-xs font-semibold text-white">
            <Users className="h-3.5 w-3.5 text-primary-600" />
            Guests & Rooms
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full h-11 justify-start text-left font-normal text-sm bg-white/85 border-neutral-300 hover:bg-white focus:ring-primary-500">
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
          <Button
            type="submit"
            className="group w-full h-11 bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-700 text-white font-bold text-base gap-2 shadow-lg shadow-teal-800/30 transition-all duration-500 ease-out hover:shadow-[0_8px_30px_rgba(0,75,69,0.35)] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0"
          >
            <Search className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            Search
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr,1fr] gap-3 items-end">
        <div className="space-y-1">
          <Label htmlFor="package-coupon" className="text-xs font-semibold text-white">Coupon Code</Label>
          <Input
            id="package-coupon"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="e.g., RAMADAN20"
            className="h-11 text-sm bg-white/85 border-neutral-300 focus:ring-primary-500"
          />
        </div>
      </div>
    </form>
  )
}
