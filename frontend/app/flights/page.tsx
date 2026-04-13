'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plane, MapPin, Calendar, Users, Briefcase, ArrowRight } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { format, parseISO } from 'date-fns'

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

  const today = new Date()

  return (
    <div className="min-h-screen page-ivory relative">
      <div className="ivory-pattern-overlay" />
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#f8f6f0]/90">
        {/* Decorative background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] islamic-pattern" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 pt-16 pb-12 md:pt-20 md:pb-16">
          <div className="max-w-3xl pt-10 mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-100 to-cyan-100 border border-teal-200 px-5 py-2 mb-4 shadow-sm animate-fade-in">
              <Plane className="h-4 w-4 text-teal-600 animate-bounce" />
              <span className="text-xs font-bold tracking-wider uppercase text-teal-700">Flight Booking</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-relaxed mb-8 pb-2 px-4 animate-fade-in-up">
              <span className="bg-gradient-to-r from-gray-900 via-teal-900 to-cyan-900 bg-clip-text text-transparent block">
                Find Your Flight
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="relative container mx-auto px-4 pt-8 pb-16 md:pb-20">
        <div className="relative overflow-hidden rounded-3xl ivory-panel backdrop-blur-sm shadow-[0_20px_80px_-20px_rgba(0,0,0,0.15)] border hover:shadow-[0_30px_100px_-20px_rgba(6,182,212,0.3)] transition-all duration-500 animate-fade-in-up">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-100/50 to-cyan-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-float" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-cyan-100/50 to-teal-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-float-slow" />
          
          <div className="relative p-6 md:p-10">
            <Tabs value={tripType} onValueChange={setTripType} className="w-full">
              <div className="flex justify-center md:justify-start mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-2 rounded-2xl bg-gray-100 p-1.5 ring-1 ring-gray-200">
                  <TabsTrigger value="round-trip" className="rounded-xl text-gray-700 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
                    Round Trip
                  </TabsTrigger>
                  <TabsTrigger value="one-way" className="rounded-xl text-gray-700 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
                    One Way
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="round-trip" className="mt-0">
                <form onSubmit={handleSearch} className="space-y-6">
                  {/* Origin and Destination */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="from" className="flex items-center gap-2 mb-3 text-gray-800 font-semibold text-sm">
                        <MapPin className="h-4 w-4 text-teal-600" />
                        From
                      </Label>
                      <Input
                        id="from"
                        placeholder="e.g., JED, RUH, DXB"
                        value={from}
                        onChange={(e) => setFrom(e.target.value.toUpperCase())}
                        required
                        className="h-12 bg-white/60 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-teal-500 focus-visible:border-teal-500 rounded-xl font-medium"
                      />
                      <p className="text-xs text-gray-500 mt-2 ml-1">Enter airport code</p>
                    </div>
                    <div>
                      <Label htmlFor="to" className="flex items-center gap-2 mb-3 text-gray-800 font-semibold text-sm">
                        <MapPin className="h-4 w-4 text-cyan-600" />
                        To
                      </Label>
                      <Input
                        id="to"
                        placeholder="e.g., IST, KUL, CAI"
                        value={to}
                        onChange={(e) => setTo(e.target.value.toUpperCase())}
                        required
                        className="h-12 bg-white/60 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 rounded-xl font-medium"
                      />
                      <p className="text-xs text-gray-500 mt-2 ml-1">Enter airport code</p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="departure" className="flex items-center gap-2 mb-3 text-gray-800 font-semibold text-sm">
                        <Calendar className="h-4 w-4 text-teal-600" />
                        Departure Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-12 w-full justify-start text-left font-medium bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100 hover:border-teal-300 rounded-xl"
                          >
                            <Calendar className="mr-2 h-4 w-4 text-teal-600" />
                            {departure ? format(parseISO(departure), 'MMM dd, yyyy') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={departure ? parseISO(departure) : undefined}
                            onSelect={(date) => {
                              if (!date) return
                              const next = format(date, 'yyyy-MM-dd')
                              setDeparture(next)
                              if (returnDate && returnDate < next) setReturnDate('')
                            }}
                            disabled={(date) => date < today}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor="return" className="flex items-center gap-2 mb-3 text-gray-800 font-semibold text-sm">
                        <Calendar className="h-4 w-4 text-cyan-600" />
                        Return Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            disabled={!departure}
                            className="h-12 w-full justify-start text-left font-medium bg-white/60 border-gray-200 text-gray-900 hover:bg-white/80 hover:border-cyan-300 rounded-xl disabled:opacity-50"
                          >
                            <Calendar className="mr-2 h-4 w-4 text-cyan-600" />
                            {returnDate ? format(parseISO(returnDate), 'MMM dd, yyyy') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={returnDate ? parseISO(returnDate) : undefined}
                            onSelect={(date) => {
                              if (!date) return
                              setReturnDate(format(date, 'yyyy-MM-dd'))
                            }}
                            disabled={(date) => date < (departure ? parseISO(departure) : today)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Passengers & Cabin Class */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <Label htmlFor="adults" className="flex items-center gap-2 mb-3 text-gray-800 font-semibold text-sm">
                        <Users className="h-4 w-4 text-teal-600" />
                        Adults
                      </Label>
                      <Select value={adults} onValueChange={setAdults}>
                        <SelectTrigger id="adults" className="h-12 bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100 rounded-xl">
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
                      <Label htmlFor="children" className="text-gray-800 font-semibold text-sm mb-3 block">Children (2–11)</Label>
                      <Select value={children} onValueChange={setChildren}>
                        <SelectTrigger id="children" className="h-12 bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100 rounded-xl">
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
                      <Label htmlFor="infants" className="text-gray-800 font-semibold text-sm mb-3 block">Infants (under 2)</Label>
                      <Select value={infants} onValueChange={setInfants}>
                        <SelectTrigger id="infants" className="h-12 bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 1, 2].map(num => (
                            <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cabin" className="flex items-center gap-2 mb-3 text-gray-800 font-semibold text-sm">
                        <Briefcase className="h-4 w-4 text-cyan-600" />
                        Cabin Class
                      </Label>
                      <Select value={cabin} onValueChange={setCabin}>
                        <SelectTrigger id="cabin" className="h-12 bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100 rounded-xl">
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
                  <div className="pt-4">
                    <Button type="submit" size="lg" className="w-full h-14 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 hover:from-teal-600 hover:via-cyan-600 hover:to-teal-700 text-white font-bold text-base shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all rounded-2xl">
                      <Plane className="h-5 w-5 mr-2" />
                      Search Flights
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="one-way" className="mt-0">
                  <form onSubmit={handleSearch} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="from" className="flex items-center gap-2 mb-3 text-gray-800 font-semibold text-sm">
                          <MapPin className="h-4 w-4 text-teal-600" />
                          From
                        </Label>
                        <Input
                          id="from"
                          placeholder="e.g., JED, RUH, DXB"
                          value={from}
                          onChange={(e) => setFrom(e.target.value.toUpperCase())}
                          required
                          className="h-12 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-teal-500 focus-visible:border-teal-500 rounded-xl font-medium"
                        />
                        <p className="text-xs text-gray-500 mt-2 ml-1">Enter airport code</p>
                      </div>
                      <div>
                        <Label htmlFor="to" className="flex items-center gap-2 mb-3 text-gray-800 font-semibold text-sm">
                          <MapPin className="h-4 w-4 text-cyan-600" />
                          To
                        </Label>
                        <Input
                          id="to"
                          placeholder="e.g., IST, KUL, CAI"
                          value={to}
                          onChange={(e) => setTo(e.target.value.toUpperCase())}
                          required
                          className="h-12 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 rounded-xl font-medium"
                        />
                        <p className="text-xs text-gray-500 mt-2 ml-1">Enter airport code</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                      <div>
                        <Label htmlFor="departure" className="flex items-center gap-2 mb-3 text-gray-800 font-semibold text-sm">
                          <Calendar className="h-4 w-4 text-teal-600" />
                          Departure Date
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="h-12 w-full justify-start text-left font-medium bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100 hover:border-teal-300 rounded-xl"
                            >
                              <Calendar className="mr-2 h-4 w-4 text-teal-600" />
                              {departure ? format(parseISO(departure), 'MMM dd, yyyy') : 'Pick a date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={departure ? parseISO(departure) : undefined}
                              onSelect={(date) => {
                                if (!date) return
                                setDeparture(format(date, 'yyyy-MM-dd'))
                              }}
                              disabled={(date) => date < today}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* Passengers & Cabin Class */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div>
                        <Label htmlFor="adults" className="flex items-center gap-2 mb-3 text-gray-800 font-semibold text-sm">
                          <Users className="h-4 w-4 text-teal-600" />
                          Adults
                        </Label>
                        <Select value={adults} onValueChange={setAdults}>
                          <SelectTrigger id="adults" className="h-12 bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100 rounded-xl">
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
                        <Label htmlFor="children" className="text-gray-800 font-semibold text-sm mb-3 block">Children (2–11)</Label>
                        <Select value={children} onValueChange={setChildren}>
                          <SelectTrigger id="children" className="h-12 bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100 rounded-xl">
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
                        <Label htmlFor="infants" className="text-gray-800 font-semibold text-sm mb-3 block">Infants (under 2)</Label>
                        <Select value={infants} onValueChange={setInfants}>
                          <SelectTrigger id="infants" className="h-12 bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100 rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2].map(num => (
                              <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="cabin" className="flex items-center gap-2 mb-3 text-gray-800 font-semibold text-sm">
                          <Briefcase className="h-4 w-4 text-cyan-600" />
                          Cabin Class
                        </Label>
                        <Select value={cabin} onValueChange={setCabin}>
                          <SelectTrigger id="cabin" className="h-12 bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100 rounded-xl">
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

                    <div className="pt-4">
                      <Button type="submit" size="lg" className="w-full h-14 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 hover:from-teal-600 hover:via-cyan-600 hover:to-teal-700 text-white font-bold text-base shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all rounded-2xl">
                        <Plane className="h-5 w-5 mr-2" />
                        Search Flights
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </div>

        {/* Popular Routes */}
        <div className="mt-16">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-100 to-cyan-100 border border-teal-200 px-4 py-1.5 mb-3">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 animate-pulse" />
                <span className="text-teal-700 text-xs font-bold uppercase tracking-[0.15em]">Quick Search</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-teal-800 bg-clip-text text-transparent">Popular Routes</h2>
              <p className="text-gray-600 mt-2">One-tap presets to get you searching faster</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { from: 'JED', to: 'IST', city: 'Jeddah → Istanbul', price: 'SAR 1,200', gradient: 'from-teal-500 to-cyan-500' },
              { from: 'RUH', to: 'DXB', city: 'Riyadh → Dubai', price: 'SAR 800', gradient: 'from-cyan-500 to-blue-500' },
              { from: 'DXB', to: 'KUL', city: 'Dubai → Kuala Lumpur', price: 'SAR 1,500', gradient: 'from-teal-500 to-emerald-500' },
            ].map((route) => (
              <button
                key={route.city}
                type="button"
                onClick={() => {
                  setFrom(route.from)
                  setTo(route.to)
                }}
                className="group text-left"
              >
                <Card className="border-2 border-teal-100 bg-white hover:border-teal-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className={`h-1.5 bg-gradient-to-r ${route.gradient}`} />
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-gray-900 font-bold text-lg mb-2 group-hover:text-teal-700 transition-colors">{route.city}</div>
                        <div className="text-sm text-gray-600">
                          Starting from <span className={`font-bold text-transparent bg-gradient-to-r ${route.gradient} bg-clip-text`}>{route.price}</span>
                        </div>
                      </div>
                      <div className={`flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br ${route.gradient} group-hover:scale-110 transition-transform shadow-lg`}>
                        <ArrowRight className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
