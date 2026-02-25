'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CreditCard, Smartphone, Building, Lock, Check, Plane, Hotel, User, Calendar, Shield, AlertCircle } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingType = searchParams.get('type') || 'flight'
  
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  })
  const [processing, setProcessing] = useState(false)

  // Mock booking data
  const booking = {
    type: bookingType,
    reference: 'HT' + Date.now(),
    details: bookingType === 'flight' 
      ? {
          route: 'RUH → DXB',
          date: '2026-03-15',
          passengers: 1,
          airline: 'Saudi Arabian Airlines',
          flightCode: 'SV1234'
        }
      : {
          hotel: 'Raffles Makkah Palace',
          checkIn: '2026-03-15',
          checkOut: '2026-03-22',
          nights: 7,
          guests: 2,
          roomType: 'Deluxe Twin Room'
        },
    price: {
      subtotal: 2200,
      tax: 300,
      serviceFee: 50,
      total: 2550,
      currency: 'SAR'
    }
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false)
      router.push(`/confirmation?bookingId=${booking.reference}`)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">Booking Reference: <span className="font-mono font-semibold text-primary">{booking.reference}</span></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Summary Card */}
            <Card className="border-2 border-primary/20">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                <CardTitle className="flex items-center gap-2">
                  {booking.type === 'flight' ? (
                    <Plane className="h-5 w-5 text-primary" />
                  ) : (
                    <Hotel className="h-5 w-5 text-primary" />
                  )}
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {booking.type === 'flight' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Route</p>
                      <p className="font-semibold">{booking.details.route}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold">{booking.details.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Airline</p>
                      <p className="font-semibold">{booking.details.airline}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Flight</p>
                      <p className="font-semibold">{booking.details.flightCode}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Passengers</p>
                      <p className="font-semibold">{booking.details.passengers} Adult</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Hotel</p>
                      <p className="font-semibold text-lg">{booking.details.hotel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Check-in</p>
                      <p className="font-semibold">{booking.details.checkIn}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Check-out</p>
                      <p className="font-semibold">{booking.details.checkOut}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-semibold">{booking.details.nights} Nights</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Guests</p>
                      <p className="font-semibold">{booking.details.guests} Adults</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Room Type</p>
                      <p className="font-semibold">{booking.details.roomType}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Select Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <p className="font-semibold">Credit / Debit Card</p>
                        <p className="text-xs text-gray-600">Visa, Mastercard, American Express</p>
                      </div>
                    </Label>
                    <div className="flex gap-1">
                      <img src="/visa.svg" alt="Visa" className="h-6" />
                      <img src="/mastercard.svg" alt="Mastercard" className="h-6" />
                    </div>
                  </div>
                  <div className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'mada' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                    <RadioGroupItem value="mada" id="mada" />
                    <Label htmlFor="mada" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <p className="font-semibold">Mada</p>
                        <p className="text-xs text-gray-600">Saudi local payment</p>
                      </div>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'stc' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                    <RadioGroupItem value="stc" id="stc" />
                    <Label htmlFor="stc" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Smartphone className="h-5 w-5" />
                      <div>
                        <p className="font-semibold">STC Pay</p>
                        <p className="text-xs text-gray-600">Pay with STC Pay wallet</p>
                      </div>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'bank' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Building className="h-5 w-5" />
                      <div>
                        <p className="font-semibold">Bank Transfer</p>
                        <p className="text-xs text-gray-600">Direct bank transfer</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Card Details Form */}
            {(paymentMethod === 'card' || paymentMethod === 'mada') && (
              <Card>
                <CardHeader>
                  <CardTitle>Card Details</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handlePayment} className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardName">Cardholder Name *</Label>
                      <Input
                        id="cardName"
                        placeholder="Name as shown on card"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date *</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          type="password"
                          maxLength={4}
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                      <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900 text-sm">Secure Payment</p>
                        <p className="text-xs text-blue-700 mt-1">Your payment information is encrypted and secure. We never store your card details.</p>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={processing}
                    >
                      {processing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <Lock className="h-5 w-5 mr-2" />
                          Pay {formatPrice(booking.price.total, booking.price.currency)}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Price Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-2">
              <CardHeader className="bg-gradient-to-br from-primary to-primary/80 text-white">
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">{formatPrice(booking.price.subtotal, booking.price.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-semibold">{formatPrice(booking.price.tax, booking.price.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-semibold">{formatPrice(booking.price.serviceFee, booking.price.currency)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(booking.price.total, booking.price.currency)}</span>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                      <div className="space-y-2 text-sm">
                        <p className="font-semibold text-green-900">What's Included</p>
                        <ul className="text-green-700 space-y-1">
                          <li className="flex items-center gap-2">
                            <Check className="h-3 w-3" />
                            Instant Confirmation
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-3 w-3" />
                            E-Ticket via Email
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-3 w-3" />
                            24/7 Customer Support
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-3 w-3" />
                            Secure Payment
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-yellow-900 text-sm">Cancellation Policy</p>
                        <p className="text-xs text-yellow-700 mt-1">Free cancellation up to 24 hours before departure</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Shield className="h-4 w-4" />
                      <span>Secured by SSL encryption</span>
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

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  )
}
