'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plane, MapPin, Calendar, Users, Briefcase } from 'lucide-react'

export default function FlightsPage() {
  const router = useRouter()
  const [tripType, setTripType] = useState('round-trip')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [departure, setDeparture] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [adults, setAdults] = useState('1')
  const [children, setChildren] = useState('0')
  const [infants, setInfants] = useState('0')
  const [cabin, setCabin] = useState('ECONOMY')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams({
      from,
      to,
      departure,
      ...(tripType === 'round-trip' && returnDate && { return: returnDate }),
      adults,
      children,
      infants,
      cabin
    })

    router.push(`/flights/results?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Plane className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Search Flights</h1>
          </div>
          <p className="text-lg text-white/90">Find the best halal-friendly flights for your journey</p>
        </div>
      </div>

      {/* Search Form */}
      <div className="container mx-auto px-4 -mt-8">
        <Card className="shadow-xl">
          <CardHeader className="bg-gray-50 border-b">
            <Tabs value={tripType} onValueChange={setTripType} className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="round-trip">Round Trip</TabsTrigger>
                <TabsTrigger value="one-way">One Way</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Origin and Destination */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from" className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    From
                  </Label>
                  <Input
                    id="from"
                    placeholder="e.g., JED, RUH, DXB"
                    value={from}
                    onChange={(e) => setFrom(e.target.value.toUpperCase())}
                    required
                    className="text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter airport code</p>
                </div>
                <div>
                  <Label htmlFor="to" className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    To
                  </Label>
                  <Input
                    id="to"
                    placeholder="e.g., IST, KUL, CAI"
                    value={to}
                    onChange={(e) => setTo(e.target.value.toUpperCase())}
                    required
                    className="text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter airport code</p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departure" className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Departure Date
                  </Label>
                  <Input
                    id="departure"
                    type="date"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="text-lg"
                  />
                </div>
                {tripType === 'round-trip' && (
                  <div>
                    <Label htmlFor="return" className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Return Date
                    </Label>
                    <Input
                      id="return"
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      min={departure || new Date().toISOString().split('T')[0]}
                      className="text-lg"
                    />
                  </div>
                )}
              </div>

              {/* Passengers and Class */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-primary" />
                    Passengers
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="adults" className="text-xs text-gray-600">Adults</Label>
                      <Select value={adults} onValueChange={setAdults}>
                        <SelectTrigger id="adults">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="children" className="text-xs text-gray-600">Children (2-11)</Label>
                      <Select value={children} onValueChange={setChildren}>
                        <SelectTrigger id="children">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 1, 2, 3, 4].map(num => (
                            <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="infants" className="text-xs text-gray-600">Infants (&lt;2)</Label>
                      <Select value={infants} onValueChange={setInfants}>
                        <SelectTrigger id="infants">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 1, 2].map(num => (
                            <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="cabin" className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    Cabin Class
                  </Label>
                  <Select value={cabin} onValueChange={setCabin}>
                    <SelectTrigger id="cabin" className="text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ECONOMY">Economy</SelectItem>
                      <SelectItem value="PREMIUM_ECONOMY">Premium Economy</SelectItem>
                      <SelectItem value="BUSINESS">Business Class</SelectItem>
                      <SelectItem value="FIRST">First Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" size="lg" className="w-full text-lg py-6">
                <Plane className="h-5 w-5 mr-2" />
                Search Flights
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Popular Routes */}
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-bold mb-6">Popular Routes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { from: 'JED', to: 'IST', city: 'Jeddah → Istanbul', price: 'SAR 1,200' },
              { from: 'RUH', to: 'DXB', city: 'Riyadh → Dubai', price: 'SAR 800' },
              { from: 'DXB', to: 'KUL', city: 'Dubai → Kuala Lumpur', price: 'SAR 1,500' },
            ].map((route) => (
              <Card key={route.city} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
                setFrom(route.from)
                setTo(route.to)
              }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-lg">{route.city}</span>
                    <Plane className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm text-gray-600">From <span className="text-primary font-semibold">{route.price}</span></p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
