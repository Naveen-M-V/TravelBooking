'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Calendar, Users, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { popularDestinations } from '@/mocks/destinations'

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
          <Input
            id="checkIn"
            type="date"
            value={searchData.checkIn}
            onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        {/* Check-out Date */}
        <div className="space-y-2">
          <Label htmlFor="checkOut" className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Check-out
          </Label>
          <Input
            id="checkOut"
            type="date"
            value={searchData.checkOut}
            onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
            min={searchData.checkIn || new Date().toISOString().split('T')[0]}
            required
          />
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
