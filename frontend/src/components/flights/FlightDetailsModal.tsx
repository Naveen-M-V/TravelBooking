'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Plane, Clock, Calendar, Briefcase, Coffee, X } from 'lucide-react'
import { formatPrice, formatTime, formatDuration } from '@/lib/utils'
import type { Itinerary } from '@/types/flights'

interface FlightDetailsModalProps {
  itinerary: Itinerary | null
  open: boolean
  onClose: () => void
  onSelect: (itinerary: Itinerary) => void
}

export function FlightDetailsModal({ itinerary, open, onClose, onSelect }: FlightDetailsModalProps) {
  if (!itinerary) return null

  // Mock detailed flight data
  const flightDetails = {
    outbound: {
      segments: [
        {
          airline: 'Saudi Arabian Airlines',
          flightNumber: 'SV1234',
          aircraft: 'Boeing 787-9',
          departure: {
            airport: 'King Khalid International Airport',
            code: 'RUH',
            city: 'Riyadh',
            terminal: 'Terminal 1',
            time: '08:00',
            date: '2026-03-15'
          },
          arrival: {
            airport: 'Dubai International Airport',
            code: 'DXB',
            city: 'Dubai',
            terminal: 'Terminal 3',
            time: '11:30',
            date: '2026-03-15'
          },
          duration: 210,
          cabin: 'Economy',
          baggage: {
            checkedIn: '23kg',
            carryOn: '7kg'
          }
        }
      ]
    },
    fareBreakdown: {
      basePrice: itinerary.price.base || itinerary.price.total * 0.85,
      taxes: itinerary.price.tax || itinerary.price.total * 0.15,
      total: itinerary.price.total
    },
    amenities: [
      'In-flight Entertainment',
      'USB Power',
      'WiFi Available',
      'Meals Included',
      'Priority Boarding'
    ],
    baggagePolicy: {
      checkedBaggage: '1 piece up to 23kg',
      carryOnBaggage: '1 piece up to 7kg',
      personalItem: 'Allowed'
    },
    cancellationPolicy: 'Free cancellation up to 24 hours before departure'
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold">Flight Details</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Outbound Flight */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Plane className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Outbound Flight</h3>
            </div>

            {flightDetails.outbound.segments.map((segment, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-600">{segment.airline}</p>
                    <p className="font-semibold">{segment.flightNumber} • {segment.aircraft}</p>
                    <Badge variant="secondary" className="mt-2">{segment.cabin}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Flight Duration</p>
                    <p className="font-semibold">{formatDuration(segment.duration)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  {/* Departure */}
                  <div>
                    <p className="text-3xl font-bold mb-1">{segment.departure.time}</p>
                    <p className="text-lg font-semibold mb-1">{segment.departure.code}</p>
                    <p className="text-sm text-gray-600 mb-1">{segment.departure.airport}</p>
                    <p className="text-sm text-gray-600">{segment.departure.city}</p>
                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{segment.departure.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{segment.departure.terminal}</p>
                  </div>

                  {/* Arrival */}
                  <div>
                    <p className="text-3xl font-bold mb-1">{segment.arrival.time}</p>
                    <p className="text-lg font-semibold mb-1">{segment.arrival.code}</p>
                    <p className="text-sm text-gray-600 mb-1">{segment.arrival.airport}</p>
                    <p className="text-sm text-gray-600">{segment.arrival.city}</p>
                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{segment.arrival.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{segment.arrival.terminal}</p>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Baggage */}
                <div className="flex gap-8">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium">Checked Baggage</p>
                      <p className="text-sm text-gray-600">{segment.baggage.checkedIn}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium">Carry-on</p>
                      <p className="text-sm text-gray-600">{segment.baggage.carryOn}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Amenities */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Amenities & Services</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {flightDetails.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Baggage Policy */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Baggage Policy</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Checked Baggage:</span>
                <span className="font-medium">{flightDetails.baggagePolicy.checkedBaggage}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Carry-on Baggage:</span>
                <span className="font-medium">{flightDetails.baggagePolicy.carryOnBaggage}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Personal Item:</span>
                <span className="font-medium">{flightDetails.baggagePolicy.personalItem}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Fare Breakdown */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Fare Breakdown</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span>Base Fare</span>
                <span className="font-medium">{formatPrice(flightDetails.fareBreakdown.basePrice, itinerary.price.currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxes & Fees</span>
                <span className="font-medium">{formatPrice(flightDetails.fareBreakdown.taxes, itinerary.price.currency)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(flightDetails.fareBreakdown.total, itinerary.price.currency)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Cancellation Policy */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Cancellation Policy</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-900">{flightDetails.cancellationPolicy}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={() => onSelect(itinerary)}
              size="lg"
              className="flex-1"
            >
              Select This Flight
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              size="lg"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
