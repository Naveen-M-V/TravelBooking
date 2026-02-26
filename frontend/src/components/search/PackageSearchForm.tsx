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

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Destination */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="destination" className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Destination
          </Label>
          <Select
            value={searchData.destination}
            onValueChange={(value: string) => setSearchData({ ...searchData, destination: value })}
            required
          >
            <SelectTrigger id="destination">
              <SelectValue placeholder="Select destination" />
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

        {/* Check-in Date */}
        <div className="space-y-2">
          <Label htmlFor="checkIn" className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Check-in
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {searchData.checkIn ? format(parseISO(searchData.checkIn), 'MMM dd, yyyy') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={searchData.checkIn ? parseISO(searchData.checkIn) : undefined}
                onSelect={(date) => {
                  if (!date) return
                  const next = format(date, 'yyyy-MM-dd')
                  setSearchData((prev) => ({
                    ...prev,
                    checkIn: next,
                    ...(prev.checkOut && prev.checkOut < next ? { checkOut: '' } : null),
                  }))
                }}
                disabled={(date) => date < today}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <input type="hidden" name="checkIn" value={searchData.checkIn} />
        </div>

        {/* Check-out Date */}
        <div className="space-y-2">
          <Label htmlFor="checkOut" className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Check-out
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  !searchData.checkIn ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {searchData.checkOut ? format(parseISO(searchData.checkOut), 'MMM dd, yyyy') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={searchData.checkOut ? parseISO(searchData.checkOut) : undefined}
                onSelect={(date) => {
                  if (!date) return
                  setSearchData({ ...searchData, checkOut: format(date, 'yyyy-MM-dd') })
                }}
                disabled={(date) =>
                  date < (searchData.checkIn ? parseISO(searchData.checkIn) : today)
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <input type="hidden" name="checkOut" value={searchData.checkOut} />
        </div>

        {/* Rooms */}
        <div className="space-y-2">
          <Label htmlFor="rooms">Rooms</Label>
          <Input
            id="rooms"
            type="number"
            min="1"
            max="5"
            value={searchData.rooms}
            onChange={(e) => setSearchData({ ...searchData, rooms: parseInt(e.target.value) })}
          />
        </div>

        {/* Guests */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Guests
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="adults" className="text-xs text-gray-600">
                Adults
              </Label>
              <Input
                id="adults"
                type="number"
                min="1"
                max="9"
                value={searchData.adults}
                onChange={(e) => setSearchData({ ...searchData, adults: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="children" className="text-xs text-gray-600">
                Children (0-17)
              </Label>
              <Input
                id="children"
                type="number"
                min="0"
                max="9"
                value={searchData.children}
                onChange={(e) => setSearchData({ ...searchData, children: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg">
        <Search className="mr-2 h-5 w-5" />
        Search Packages
      </Button>
    </form>
  )
}
