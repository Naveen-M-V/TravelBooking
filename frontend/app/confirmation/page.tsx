'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckCircle2, Download, Mail, Plane, Hotel, Calendar, Users, MapPin, Clock, CreditCard, Share2, Printer } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId') || 'HT123456789'

  // Mock booking data
  const booking = {
    id: bookingId,
    status: 'CONFIRMED',
    type: 'flight',
    createdAt: new Date().toISOString(),
    details: {
      airline: 'Saudi Arabian Airlines',
      flightCode: 'SV1234',
      from: { code: 'RUH', city: 'Riyadh', terminal: 'Terminal 1', time: '08:00' },
      to: { code: 'DXB', city: 'Dubai', terminal: 'Terminal 3', time: '11:30' },
      date: '2026-03-15',
      cabinClass: 'Economy',
      pnr: 'ABC123'
    },
    passengers: [
      {
        name: 'Ahmed Al-Rashid',
        type: 'Adult',
        ticketNumber: '6071234567890'
      }
    ],
    contactEmail: 'ahmed@example.com',
    contactPhone: '+966501234567',
    price: {
      total: 543,
      currency: 'SAR'
    }
  }

  const handleDownloadTicket = () => {
    // Implement ticket download
    alert('Ticket download would start here')
  }

  const handleEmailTicket = () => {
    // Implement email ticket
    alert('Ticket would be emailed to ' + booking.contactEmail)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8 animate-in fade-in duration-500">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-green-900">Booking Confirmed!</h1>
          <p className="text-xl text-gray-600">Your booking has been successfully processed</p>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Booking Reference</p>
            <p className="text-3xl font-mono font-bold text-primary mt-1">{booking.id}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Button size="lg" onClick={handleDownloadTicket} className="gap-2">
            <Download className="h-5 w-5" />
            Download E-Ticket
          </Button>
          <Button size="lg" variant="outline" onClick={handleEmailTicket} className="gap-2">
            <Mail className="h-5 w-5" />
            Email Ticket
          </Button>
          <Button size="lg" variant="outline" className="gap-2">
            <Printer className="h-5 w-5" />
            Print
          </Button>
          <Button size="lg" variant="outline" className="gap-2">
            <Share2 className="h-5 w-5" />
            Share
          </Button>
        </div>

        {/* Booking Details */}
        <Card className="mb-6 border-2">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Flight Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Flight Route */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-3xl font-bold">{booking.details.from.code}</p>
                  <p className="text-sm text-gray-600">{booking.details.from.city}</p>
                  <p className="text-xs text-gray-500">{booking.details.from.terminal}</p>
                  <p className="text-lg font-semibold mt-2">{booking.details.from.time}</p>
                </div>
                <div className="px-6">
                  <div className="text-center">
                    <Plane className="h-8 w-8 text-primary mx-auto mb-2" />
                    <Badge>{booking.details.cabinClass}</Badge>
                  </div>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-3xl font-bold">{booking.details.to.code}</p>
                  <p className="text-sm text-gray-600">{booking.details.to.city}</p>
                  <p className="text-xs text-gray-500">{booking.details.to.terminal}</p>
                  <p className="text-lg font-semibold mt-2">{booking.details.to.time}</p>
                </div>
              </div>

              <Separator />

              {/* Flight Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Airline</p>
                  <p className="font-semibold">{booking.details.airline}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Flight Number</p>
                  <p className="font-semibold">{booking.details.flightCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date</p>
                  <p className="font-semibold">{booking.details.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">PNR</p>
                  <p className="font-semibold font-mono">{booking.details.pnr}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Passenger Details */}
        <Card className="mb-6">
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Passenger Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {booking.passengers.map((passenger, index) => (
              <div key={index} className={index > 0 ? 'mt-4 pt-4 border-t' : ''}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Passenger Name</p>
                    <p className="font-semibold">{passenger.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Type</p>
                    <p className="font-semibold">{passenger.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">E-Ticket Number</p>
                    <p className="font-semibold font-mono">{passenger.ticketNumber}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact & Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{booking.contactEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{booking.contactPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Amount Paid</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPrice(booking.price.total, booking.price.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Information */}
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-base">Important Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span>Please arrive at the airport at least <strong>3 hours before departure</strong> for international flights.</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span>Check-in opens <strong>4 hours before</strong> and closes <strong>60 minutes before</strong> departure.</span>
              </li>
              <li className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span>Ensure all travel documents (passport, visa) are valid for at least 6 months.</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span>A confirmation email with your e-ticket has been sent to <strong>{booking.contactEmail}</strong></span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="mt-8 text-center space-y-4">
          <h3 className="text-xl font-semibold mb-4">What's Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <Download className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Download</h4>
              <p className="text-sm text-gray-600">Save your e-ticket for easy access</p>
            </Card>
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Web Check-in</h4>
              <p className="text-sm text-gray-600">Opens 24 hours before departure</p>
            </Card>
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Track Flight</h4>
              <p className="text-sm text-gray-600">Get real-time updates</p>
            </Card>
          </div>
        </div>

        {/* Action Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link href="/dashboard/customer">
            <Button variant="outline" size="lg">View My Bookings</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg">Book Another Trip</Button>
          </Link>
        </div>

        {/* Support */}
        <Card className="mt-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-4">Our 24/7 customer support team is here to assist you</p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                support@halaltravels.com
              </Button>
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                +966 12 345 6789
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense>
      <ConfirmationContent />
    </Suspense>
  )
}

function Phone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}
