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
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/flight-runway/1600/800')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-slate-950/35 to-slate-950" />
        <div className="pointer-events-none absolute -top-28 left-1/2 h-80 w-[46rem] -translate-x-1/2 rounded-full bg-teal-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/2 h-80 w-[46rem] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative container mx-auto px-4 pt-16 pb-10 md:pt-20 md:pb-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/15 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
              <span className="text-xs font-semibold tracking-[0.18em] uppercase text-white/80">Flights</span>
            </div>

            <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight text-white leading-[1.05]">
              Search flights with confidence
            </h1>
            <p className="mt-4 text-base md:text-lg text-white/70 max-w-2xl">
              Halal-friendly routes, premium support, and transparent pricing.
            </p>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="relative container mx-auto px-4 -mt-10 md:-mt-14 pb-14">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-400/30 via-white/10 to-emerald-400/30 p-[1px] shadow-[0_60px_140px_-75px_rgba(0,0,0,0.95)]">
          <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.28)_1px,rgba(0,0,0,0)_0)] [background-size:14px_14px]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-teal-300/70 to-transparent" />

            <div className="relative p-5 md:p-7">
              <Tabs value={tripType} onValueChange={setTripType} className="w-full">
                <div className="flex justify-center md:justify-start">
                  <TabsList className="grid w-full max-w-md grid-cols-2 rounded-2xl bg-white/5 p-1 ring-1 ring-white/10">
                    <TabsTrigger value="round-trip" className="rounded-xl text-white/75 data-[state=active]:bg-white/10 data-[state=active]:text-white">
                      Round Trip
                    </TabsTrigger>
                    <TabsTrigger value="one-way" className="rounded-xl text-white/75 data-[state=active]:bg-white/10 data-[state=active]:text-white">
                      One Way
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="round-trip" className="mt-6">
                  <form onSubmit={handleSearch} className="space-y-6">
              {/* Origin and Destination */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from" className="flex items-center gap-2 mb-2 text-white/80">
                    <MapPin className="h-4 w-4 text-teal-200" />
                    From
                  </Label>
                  <Input
                    id="from"
                    placeholder="e.g., JED, RUH, DXB"
                    value={from}
                    onChange={(e) => setFrom(e.target.value.toUpperCase())}
                    required
                    className="h-11 bg-white/10 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-teal-400/40"
                  />
                  <p className="text-xs text-white/45 mt-1">Enter airport code</p>
                </div>
                <div>
                  <Label htmlFor="to" className="flex items-center gap-2 mb-2 text-white/80">
                    <MapPin className="h-4 w-4 text-teal-200" />
                    To
                  </Label>
                  <Input
                    id="to"
                    placeholder="e.g., IST, KUL, CAI"
                    value={to}
                    onChange={(e) => setTo(e.target.value.toUpperCase())}
                    required
                    className="h-11 bg-white/10 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-teal-400/40"
                  />
                  <p className="text-xs text-white/45 mt-1">Enter airport code</p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departure" className="flex items-center gap-2 mb-2 text-white/80">
                    <Calendar className="h-4 w-4 text-teal-200" />
                    Departure Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 w-full justify-start text-left font-normal bg-white/10 border-white/10 text-white hover:bg-white/10"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
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
                  <Label htmlFor="return" className="flex items-center gap-2 mb-2 text-white/80">
                    <Calendar className="h-4 w-4 text-teal-200" />
                    Return Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={!departure}
                        className="h-11 w-full justify-start text-left font-normal bg-white/10 border-white/10 text-white hover:bg-white/10 disabled:opacity-50"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
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

              {/* Passengers and Class */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2 mb-2 text-white/80">
                    <Users className="h-4 w-4 text-teal-200" />
                    Passengers
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="adults" className="text-xs text-white/55">Adults</Label>
                      <Select value={adults} onValueChange={setAdults}>
                        <SelectTrigger id="adults" className="bg-white/10 border-white/10 text-white">
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
                      <Label htmlFor="children" className="text-xs text-white/55">Children (2-11)</Label>
                      <Select value={children} onValueChange={setChildren}>
                        <SelectTrigger id="children" className="bg-white/10 border-white/10 text-white">
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
                      <Label htmlFor="infants" className="text-xs text-white/55">Infants (&lt;2)</Label>
                      <Select value={infants} onValueChange={setInfants}>
                        <SelectTrigger id="infants" className="bg-white/10 border-white/10 text-white">
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
                  <Label htmlFor="cabin" className="flex items-center gap-2 mb-2 text-white/80">
                    <Briefcase className="h-4 w-4 text-teal-200" />
                    Cabin Class
                  </Label>
                  <Select value={cabin} onValueChange={setCabin}>
                    <SelectTrigger id="cabin" className="h-11 bg-white/10 border-white/10 text-white">
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
              <Button type="submit" size="lg" className="w-full h-12">
                <Plane className="h-5 w-5 mr-2" />
                Search Flights
              </Button>
                  </form>
                </TabsContent>

                <TabsContent value="one-way" className="mt-6">
                  <form onSubmit={handleSearch} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="from" className="flex items-center gap-2 mb-2 text-white/80">
                          <MapPin className="h-4 w-4 text-teal-200" />
                          From
                        </Label>
                        <Input
                          id="from"
                          placeholder="e.g., JED, RUH, DXB"
                          value={from}
                          onChange={(e) => setFrom(e.target.value.toUpperCase())}
                          required
                          className="h-11 bg-white/10 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-teal-400/40"
                        />
                        <p className="text-xs text-white/45 mt-1">Enter airport code</p>
                      </div>
                      <div>
                        <Label htmlFor="to" className="flex items-center gap-2 mb-2 text-white/80">
                          <MapPin className="h-4 w-4 text-teal-200" />
                          To
                        </Label>
                        <Input
                          id="to"
                          placeholder="e.g., IST, KUL, CAI"
                          value={to}
                          onChange={(e) => setTo(e.target.value.toUpperCase())}
                          required
                          className="h-11 bg-white/10 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-teal-400/40"
                        />
                        <p className="text-xs text-white/45 mt-1">Enter airport code</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="departure" className="flex items-center gap-2 mb-2 text-white/80">
                          <Calendar className="h-4 w-4 text-teal-200" />
                          Departure Date
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="h-11 w-full justify-start text-left font-normal bg-white/10 border-white/10 text-white hover:bg-white/10"
                            >
                              <Calendar className="mr-2 h-4 w-4" />
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
                      <div>
                        <Label htmlFor="cabin" className="flex items-center gap-2 mb-2 text-white/80">
                          <Briefcase className="h-4 w-4 text-teal-200" />
                          Cabin Class
                        </Label>
                        <Select value={cabin} onValueChange={setCabin}>
                          <SelectTrigger id="cabin" className="h-11 bg-white/10 border-white/10 text-white">
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

                    <div>
                      <Label className="flex items-center gap-2 mb-2 text-white/80">
                        <Users className="h-4 w-4 text-teal-200" />
                        Passengers
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label htmlFor="adults" className="text-xs text-white/55">Adults</Label>
                          <Select value={adults} onValueChange={setAdults}>
                            <SelectTrigger id="adults" className="bg-white/10 border-white/10 text-white">
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
                          <Label htmlFor="children" className="text-xs text-white/55">Children (2-11)</Label>
                          <Select value={children} onValueChange={setChildren}>
                            <SelectTrigger id="children" className="bg-white/10 border-white/10 text-white">
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
                          <Label htmlFor="infants" className="text-xs text-white/55">Infants (&lt;2)</Label>
                          <Select value={infants} onValueChange={setInfants}>
                            <SelectTrigger id="infants" className="bg-white/10 border-white/10 text-white">
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

                    <Button type="submit" size="lg" className="w-full h-12">
                      <Plane className="h-5 w-5 mr-2" />
                      Search Flights
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Popular Routes */}
        <div className="mt-12">
          <div className="flex items-end justify-between gap-6 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Popular routes</h2>
              <p className="text-white/60 mt-1">One-tap presets to get you searching faster.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { from: 'JED', to: 'IST', city: 'Jeddah → Istanbul', price: 'SAR 1,200' },
              { from: 'RUH', to: 'DXB', city: 'Riyadh → Dubai', price: 'SAR 800' },
              { from: 'DXB', to: 'KUL', city: 'Dubai → Kuala Lumpur', price: 'SAR 1,500' },
            ].map((route) => (
              <button
                key={route.city}
                type="button"
                onClick={() => {
                  setFrom(route.from)
                  setTo(route.to)
                }}
                className="text-left"
              >
                <Card className="border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-semibold">{route.city}</div>
                        <div className="text-sm text-white/60 mt-1">
                          From <span className="text-teal-200 font-semibold">{route.price}</span>
                        </div>
                      </div>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                        <ArrowRight className="h-4 w-4 text-white/80" />
                      </span>
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
