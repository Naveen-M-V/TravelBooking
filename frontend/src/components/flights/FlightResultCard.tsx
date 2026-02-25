'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plane, Clock, Calendar } from 'lucide-react'
import { formatPrice, formatTime, formatDuration } from '@/lib/utils'
import type { Itinerary } from '@/types/flights'

interface FlightResultCardProps {
  itinerary: Itinerary
  onSelect: (itinerary: Itinerary) => void
  onViewDetails?: (itinerary: Itinerary) => void
}

export function FlightResultCard({ itinerary, onSelect, onViewDetails }: FlightResultCardProps) {
  // For now, use mock display data - will be replaced with actual segment lookup
  const mockSegment = {
    airline: { code: itinerary.airline, name: { en: itinerary.airline } },
    departure: { date: '2026-03-15T08:00:00Z', airport: { code: 'RUH', city: 'Riyadh' } },
    arrival: { date: '2026-03-15T11:30:00Z', airport: { code: 'DXB', city: 'Dubai' } },
    totalTime: 210
  }
  
  const firstSegment = mockSegment
  const lastSegment = mockSegment
  const stops = 0
  const totalDuration = 210

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Airline Logo & Info */}
          <div className="lg:col-span-2 flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Plane className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="font-semibold">{firstSegment.airline.name.en}</p>
              <p className="text-xs text-gray-500">{firstSegment.airline.code}</p>
            </div>
          </div>

          {/* Flight Details */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between">
              {/* Departure */}
              <div>
                <p className="text-2xl font-bold">{formatTime(firstSegment.departure.date)}</p>
                <p className="text-sm text-gray-600">{firstSegment.departure.airport.code}</p>
                <p className="text-xs text-gray-500">{firstSegment.departure.airport.city}</p>
              </div>

              {/* Flight Path */}
              <div className="flex-1 px-6">
                <div className="relative">
                  <div className="border-t-2 border-gray-300 border-dashed"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                    <Plane className="h-5 w-5 text-gray-400 rotate-90" />
                  </div>
                </div>
                <div className="text-center mt-2">
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDuration(totalDuration)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stops === 0 ? 'Direct' : `${stops} stop${stops > 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>

              {/* Arrival */}
              <div className="text-right">
                <p className="text-2xl font-bold">{formatTime(lastSegment.arrival.date)}</p>
                <p className="text-sm text-gray-600">{lastSegment.arrival.airport.code}</p>
                <p className="text-xs text-gray-500">{lastSegment.arrival.airport.city}</p>
              </div>
            </div>

            {/* Baggage Info */}
            <div className="mt-4 flex gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 12h18M3 18h18" />
                </svg>
                <span>1 × 23kg</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Carry-on: 7kg</span>
              </div>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="lg:col-span-3 text-right lg:border-l lg:pl-6">
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Total Price</p>
              <p className="text-3xl font-bold text-primary">
                {formatPrice(itinerary.price.total, itinerary.price.currency)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {itinerary.price.base ? formatPrice(itinerary.price.base, itinerary.price.currency) : formatPrice(itinerary.price.total * 0.85, itinerary.price.currency)} base + taxes
              </p>
            </div>
            <Button 
              onClick={() => onSelect(itinerary)} 
              className="w-full"
              size="lg"
            >
              Select Flight
            </Button>
            {onViewDetails && (
              <Button 
                onClick={() => onViewDetails(itinerary)} 
                variant="outline"
                className="w-full mt-2"
                size="sm"
              >
                View Details
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
