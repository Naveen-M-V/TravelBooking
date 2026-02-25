'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, Users, Star, Wifi, Coffee, Utensils, Waves, Heart } from 'lucide-react'
import { HalalRatingBadge } from '@/components/ui/halal-rating-badge'
import Image from 'next/image'

interface PackageResultCardProps {
  package: any
  onSelect: (pkg: any) => void
}

export function PackageResultCard({ package: pkg, onSelect }: PackageResultCardProps) {
  const {
    hotelName,
    location,
    rating,
    halalRating,
    nights,
    price,
    images,
    amenities,
    roomType,
    boardType,
    checkIn,
    checkOut
  } = pkg

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
        {/* Image Section */}
        <div className="md:col-span-4 relative h-64 md:h-full overflow-hidden">
          <Image
            src={images[0] || '/placeholder-hotel.jpg'}
            alt={hotelName}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <HalalRatingBadge rating={halalRating} />
            {rating >= 4.5 && (
              <Badge className="bg-yellow-500 text-white border-0">
                <Star className="h-3 w-3 mr-1 fill-white" />
                Top Rated
              </Badge>
            )}
          </div>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors group/heart">
            <Heart className="h-5 w-5 text-gray-600 group-hover/heart:text-red-500 group-hover/heart:fill-red-500 transition-all" />
          </button>
        </div>

        {/* Content Section */}
        <div className="md:col-span-8">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {hotelName}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{rating}</span>
                    <span className="text-gray-400">(1,234 reviews)</span>
                  </div>
                </div>
                
                {/* Package Details */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-gray-700">{nights} Nights</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-gray-700">{roomType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Utensils className="h-4 w-4 text-primary" />
                    <span className="text-gray-700">{boardType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-gray-700">{checkIn} to {checkOut}</span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {amenities.slice(0, 6).map((amenity: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {amenity === 'WiFi' && <Wifi className="h-3 w-3 mr-1" />}
                      {amenity === 'Breakfast' && <Coffee className="h-3 w-3 mr-1" />}
                      {amenity === 'Restaurant' && <Utensils className="h-3 w-3 mr-1" />}
                      {amenity === 'Pool' && <Waves className="h-3 w-3 mr-1" />}
                      {amenity}
                    </Badge>
                  ))}
                  {amenities.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{amenities.length - 6} more
                    </Badge>
                  )}
                </div>

                {/* Free Cancellation Badge */}
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    Free Cancellation
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    Instant Confirmation
                  </Badge>
                </div>
              </div>

              {/* CTA */}
              <div className="ml-6 border-l pl-6 min-w-[160px] flex flex-col justify-center">
                <Button
                  onClick={() => onSelect(pkg)}
                  className="w-full"
                  size="lg"
                >
                  Enquire Now
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}
