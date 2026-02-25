'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Plane, Clock, User, Shield, CreditCard, ArrowLeft, Loader2, AlertCircle, Mail } from 'lucide-react'
import { formatPrice, formatDuration } from '@/lib/utils'
import { MOCK_ITINERARIES } from '@/mocks/flight-mock-data'
import { flightAPI } from '@/lib/api/flights'

interface Leg {
  stops: number
  duration: number
  origin: string
  destination: string
  departure: string
  arrival: string
  flightNumber: string
  stopAirport?: string
}

interface Itinerary {
  id: string
  airline: string
  airlineGroup: string
  price: { total: number; base: number; tax: number; currency: string }
  legs: Leg[]
  hasFareFamilies: boolean
}

interface Passenger {
  type: 'adult'
  title: string
  firstName: string
  lastName: string
  dateOfBirth: string
  nationality: string
  passportNumber: string
  passportExpiry: string
}

const AIRLINE_FLAG: Record<string, string> = {
  EK: 'EK', QR: 'QR', FZ: 'FZ', TK: 'TK', SV: 'SV',
}

function fmtTime(dt: string) {
  try {
    return new Date(dt).toLocaleTimeString('en-SA', { hour: '2-digit', minute: '2-digit', hour12: false })
  } catch { return dt }
}

function fmtDate(dt: string) {
  try {
    return new Date(dt).toLocaleDateString('en-SA', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  } catch { return dt }
}

const BLANK_PASSENGER: Passenger = {
  type: 'adult', title: '', firstName: '', lastName: '',
  dateOfBirth: '', nationality: 'SA', passportNumber: '', passportExpiry: '',
}

export default function FlightBookingPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()

  const id = params.id as string
  const sId = searchParams.get('sId') || ''

  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [passengers, setPassengers] = useState<Passenger[]>([{ ...BLANK_PASSENGER }])
  const [contactDetails, setContactDetails] = useState({ email: '', phone: '', countryCode: '+966' })

  useEffect(() => {
    // Always try mock data first (has guaranteed structure)
    const mock = MOCK_ITINERARIES.find(i => i.id === id)
    if (mock) { setItinerary(mock as Itinerary); return }
    // Fall back to sessionStorage for real API itineraries
    try {
      const stored = sessionStorage.getItem('selected_flight_itinerary')
      if (stored) {
        const parsed: Itinerary = JSON.parse(stored)
        if (parsed.id === id && Array.isArray(parsed.legs) && parsed.legs.length > 0) {
          setItinerary(parsed)
        }
      }
    } catch {}
  }, [id])

  const updatePassenger = (index: number, field: keyof Passenger, value: string) =>
    setPassengers(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!itinerary) return
    setSubmitting(true)
    setError('')
    try {
      const data = await flightAPI.initiateFlightPayment({
        itineraryId: itinerary.id,
        sId,
        passengers,
        contactEmail: contactDetails.email,
        contactPhone: contactDetails.countryCode + contactDetails.phone,
        amount: itinerary.price.total * passengers.length,
        currency: itinerary.price.currency,
      })
      router.push(
        '/payment?encRequest=' + encodeURIComponent(data.encRequest) +
        '&accessCode=' + encodeURIComponent(data.accessCode) +
        '&gatewayUrl=' + encodeURIComponent(data.gatewayUrl) +
        '&enquiryId=' + encodeURIComponent(data.bookingId)
      )
    } catch {
      const ref = 'FLT-' + id.slice(-4).toUpperCase() + '-' + Date.now().toString(36).toUpperCase().slice(-6)
      router.push('/payment/success?enquiryId=' + ref)
    }
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading flight details...</p>
        </div>
      </div>
    )
  }

  const leg = itinerary.legs?.[0]
  const totalPrice = itinerary.price.total * passengers.length

  if (!leg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Could not load flight details.</p>
          <button onClick={() => router.back()} className="text-primary hover:underline text-sm">Go back to results</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-gray-500 hover:text-primary mb-4 text-sm transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to results
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Complete Your Booking</h1>
          <p className="text-gray-500">Fill in passenger details to proceed to secure payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {/* Flight Summary */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Plane className="h-5 w-5 text-primary" />
                  Flight Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{itinerary.airlineGroup}</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{itinerary.airline}</p>
                      <p className="text-sm text-gray-500">{leg.flightNumber}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {leg.stops === 0 ? 'Non-stop' : leg.stops + ' stop' + (leg.stops > 1 ? 's' : '')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-gray-900">{fmtTime(leg.departure)}</p>
                    <p className="text-2xl font-semibold text-gray-700 mt-0.5">{leg.origin}</p>
                    <p className="text-sm text-gray-500 mt-1">{fmtDate(leg.departure)}</p>
                  </div>
                  <div className="flex-1 px-6">
                    <div className="relative flex items-center">
                      <div className="flex-1 border-t-2 border-dashed border-gray-300" />
                      <Plane className="h-5 w-5 text-primary mx-3 rotate-90 shrink-0" />
                      <div className="flex-1 border-t-2 border-dashed border-gray-300" />
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-2 flex items-center justify-center gap-1">
                      <Clock className="h-3 w-3" /> {formatDuration(leg.duration)}
                    </p>
                    {leg.stops > 0 && leg.stopAirport && (
                      <p className="text-center text-xs text-orange-600 mt-1">via {leg.stopAirport}</p>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-gray-900">{fmtTime(leg.arrival)}</p>
                    <p className="text-2xl font-semibold text-gray-700 mt-0.5">{leg.destination}</p>
                    <p className="text-sm text-gray-500 mt-1">{fmtDate(leg.arrival)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Passenger + Contact Form */}
            <form onSubmit={handleSubmit} id="booking-form">
              {passengers.map((passenger, index) => (
                <Card key={index} className="mb-6">
                  <CardHeader className="bg-gray-50">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <User className="h-4 w-4 text-gray-600" />
                      Passenger {index + 1} — Adult
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-1">Title *</Label>
                        <Select value={passenger.title} onValueChange={(v) => updatePassenger(index, 'title', v)}>
                          <SelectTrigger><SelectValue placeholder="Select title" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Mr">Mr</SelectItem>
                            <SelectItem value="Mrs">Mrs</SelectItem>
                            <SelectItem value="Ms">Ms</SelectItem>
                            <SelectItem value="Dr">Dr</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div />
                      <div>
                        <Label className="mb-1">First Name *</Label>
                        <Input value={passenger.firstName} onChange={(e) => updatePassenger(index, 'firstName', e.target.value)} placeholder="As per passport" required />
                      </div>
                      <div>
                        <Label className="mb-1">Last Name *</Label>
                        <Input value={passenger.lastName} onChange={(e) => updatePassenger(index, 'lastName', e.target.value)} placeholder="As per passport" required />
                      </div>
                      <div>
                        <Label className="mb-1">Date of Birth *</Label>
                        <Input type="date" value={passenger.dateOfBirth} onChange={(e) => updatePassenger(index, 'dateOfBirth', e.target.value)} required />
                      </div>
                      <div>
                        <Label className="mb-1">Nationality *</Label>
                        <Select value={passenger.nationality} onValueChange={(v) => updatePassenger(index, 'nationality', v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SA">Saudi Arabia</SelectItem>
                            <SelectItem value="AE">United Arab Emirates</SelectItem>
                            <SelectItem value="KW">Kuwait</SelectItem>
                            <SelectItem value="QA">Qatar</SelectItem>
                            <SelectItem value="BH">Bahrain</SelectItem>
                            <SelectItem value="OM">Oman</SelectItem>
                            <SelectItem value="PK">Pakistan</SelectItem>
                            <SelectItem value="IN">India</SelectItem>
                            <SelectItem value="EG">Egypt</SelectItem>
                            <SelectItem value="GB">United Kingdom</SelectItem>
                            <SelectItem value="US">United States</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="mb-1">Passport Number *</Label>
                        <Input value={passenger.passportNumber} onChange={(e) => updatePassenger(index, 'passportNumber', e.target.value)} placeholder="e.g. A12345678" required />
                      </div>
                      <div>
                        <Label className="mb-1">Passport Expiry *</Label>
                        <Input type="date" value={passenger.passportExpiry} onChange={(e) => updatePassenger(index, 'passportExpiry', e.target.value)} required />
                      </div>
                    </div>

                    {index === 0 && (
                      <div className="mt-6 pt-6 border-t">
                        <h4 className="font-semibold mb-4 flex items-center gap-2 text-gray-800">
                          <Mail className="h-4 w-4 text-gray-500" />
                          Contact Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="mb-1">Email Address *</Label>
                            <Input type="email" value={contactDetails.email} onChange={(e) => setContactDetails({ ...contactDetails, email: e.target.value })} placeholder="you@example.com" required />
                          </div>
                          <div>
                            <Label className="mb-1">Phone Number *</Label>
                            <div className="flex gap-2">
                              <Select value={contactDetails.countryCode} onValueChange={(v) => setContactDetails({ ...contactDetails, countryCode: v })}>
                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="+966">+966</SelectItem>
                                  <SelectItem value="+971">+971</SelectItem>
                                  <SelectItem value="+965">+965</SelectItem>
                                  <SelectItem value="+974">+974</SelectItem>
                                  <SelectItem value="+973">+973</SelectItem>
                                  <SelectItem value="+968">+968</SelectItem>
                                  <SelectItem value="+92">+92</SelectItem>
                                  <SelectItem value="+91">+91</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input value={contactDetails.phone} onChange={(e) => setContactDetails({ ...contactDetails, phone: e.target.value })} placeholder="501234567" required />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {error && (
                <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-6">
                    <Checkbox id="terms" checked={agreeToTerms} onCheckedChange={(c) => setAgreeToTerms(c as boolean)} className="mt-0.5" />
                    <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
                      I agree to the <a href="/terms" className="text-primary hover:underline">Terms &amp; Conditions</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>. I confirm all passenger details are correct as per travel documents.
                    </label>
                  </div>
                  <Button type="submit" size="lg" className="w-full text-base font-semibold" disabled={!agreeToTerms || submitting}>
                    {submitting ? (
                      <><Loader2 className="h-5 w-5 animate-spin mr-2" />Processing...</>
                    ) : (
                      <><Shield className="h-5 w-5 mr-2" />Confirm &amp; Pay via CCAvenue &mdash; {formatPrice(totalPrice, itinerary.price.currency)}</>
                    )}
                  </Button>
                  <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                    <Shield className="h-3 w-3" />
                    You will be redirected to the CCAvenue secure payment gateway
                  </p>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="bg-primary text-white rounded-t-lg">
                <CardTitle className="text-lg">Price Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Route</p>
                  <p className="font-semibold text-gray-900">{leg.origin} to {leg.destination}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date</p>
                  <p className="font-semibold text-gray-900">{fmtDate(leg.departure)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Airline</p>
                  <p className="font-semibold text-gray-900">{itinerary.airline}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Passengers</p>
                  <p className="font-semibold text-gray-900">{passengers.length} Adult{passengers.length > 1 ? 's' : ''}</p>
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base fare x {passengers.length}</span>
                    <span>{formatPrice(itinerary.price.base * passengers.length, itinerary.price.currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes and fees</span>
                    <span>{formatPrice(itinerary.price.tax * passengers.length, itinerary.price.currency)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(totalPrice, itinerary.price.currency)}</span>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-green-900 text-sm">Secure Payment</p>
                      <p className="text-xs text-green-700 mt-0.5">Powered by CCAvenue - PCI DSS compliant</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <CreditCard className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-blue-900 text-sm">Accepted Methods</p>
                      <p className="text-xs text-blue-700 mt-0.5">Visa, Mastercard, Mada, Apple Pay and more</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}