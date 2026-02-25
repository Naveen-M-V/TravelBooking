'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { HalalRatingBadge } from '@/components/ui/halal-rating-badge'
import { Button } from '@/components/ui/button'
import { 
  MapPin, 
  Calendar, 
  Star, 
  Check, 
  Clock,
  Users,
  Sparkles,
  MessageSquare
} from 'lucide-react'
import type { FeaturedPackage } from '@/mocks/featured-packages'
import { EnquiryFormModal } from './EnquiryFormModal'

interface PackageDetailsModalProps {
  package: FeaturedPackage | null
  isOpen: boolean
  onClose: () => void
}

export function PackageDetailsModal({ package: pkg, isOpen, onClose }: PackageDetailsModalProps) {
  const [showEnquiry, setShowEnquiry] = useState(false)

  if (!pkg) return null

  const handleEnquireNow = () => {
    setShowEnquiry(true)
  }

  const handleEnquiryClose = () => {
    setShowEnquiry(false)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold pr-8">{pkg.name}</DialogTitle>
          </DialogHeader>

          {/* Header Image & Info */}
          <div className="relative h-64 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg overflow-hidden -mt-2">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-6">
                <MapPin className="w-16 h-16 text-primary-600 mx-auto mb-2" />
                <h3 className="text-2xl font-semibold text-primary-700">
                  {pkg.destination}
                </h3>
                <p className="text-primary-600 mt-1">{pkg.country}</p>
              </div>
            </div>

            {/* Badges */}
            <div className="absolute top-4 right-4">
              <HalalRatingBadge
                rating={{
                  score: pkg.halalRating,
                  features: pkg.features.slice(0, 2),
                }}
              />
            </div>

          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y">
            <div className="text-center">
              <Calendar className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-xs text-gray-500">Duration</p>
              <p className="font-semibold text-sm">{pkg.duration}</p>
            </div>
            <div className="text-center">
              <Star className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
              <p className="text-xs text-gray-500">Rating</p>
              <p className="font-semibold text-sm">{pkg.rating} ({pkg.reviews})</p>
            </div>
            <div className="text-center">
              <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-xs text-gray-500">Group Size</p>
              <p className="font-semibold text-sm">2-15 people</p>
            </div>
            <div className="text-center">
              <Sparkles className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-xs text-gray-500">Halal Rating</p>
              <p className="font-semibold text-sm">{pkg.halalRating}/5</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="mt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="included">What's Included</TabsTrigger>
              <TabsTrigger value="highlights">Highlights</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 mt-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">About This Package</h3>
                <p className="text-gray-700">{pkg.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {pkg.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="px-3 py-1">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-primary-50 p-4 rounded-lg">
                <Button size="lg" onClick={handleEnquireNow} className="w-full gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Enquire Now
                </Button>
              </div>
            </TabsContent>

            {/* Itinerary Tab */}
            <TabsContent value="itinerary" className="mt-4">
              {pkg.itinerary && pkg.itinerary.length > 0 ? (
                <div className="space-y-4">
                  {pkg.itinerary.map((day) => (
                    <div key={day.day} className="border-l-4 border-primary pl-4 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                          {day.day}
                        </div>
                        <h4 className="font-semibold text-lg">{day.title}</h4>
                      </div>
                      <p className="text-gray-700 mb-3">{day.description}</p>
                      <div className="space-y-1">
                        {day.activities.map((activity, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Detailed itinerary coming soon!</p>
                  <p className="text-sm mt-1">Contact us for more information</p>
                </div>
              )}
            </TabsContent>

            {/* What's Included Tab */}
            <TabsContent value="included" className="mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-green-700">âœ“ Included</h3>
                  <ul className="space-y-2">
                    {pkg.included.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-lg mb-3 text-red-700">âœ— Not Included</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">âœ—</span>
                      <span>Personal expenses and shopping</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">âœ—</span>
                      <span>Tips and gratuities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">âœ—</span>
                      <span>Travel visa fees (if applicable)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">âœ—</span>
                      <span>Optional activities and excursions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* Highlights Tab */}
            <TabsContent value="highlights" className="mt-4">
              <div>
                <h3 className="font-semibold text-lg mb-4">Experience Highlights</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pkg.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-gray-700 pt-1">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-semibold text-amber-900 mb-2">Why This Package?</h4>
                <p className="text-sm text-amber-800">
                  This carefully curated package combines cultural immersion with comfort, 
                  ensuring you experience the best of {pkg.destination} while maintaining 
                  your Islamic values and dietary requirements.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer CTA */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t mt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button size="lg" onClick={handleEnquireNow} className="gap-2">
              <MessageSquare className="w-5 h-5" />
              Enquire Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enquiry Form Modal */}
      <EnquiryFormModal
        package={pkg}
        isOpen={showEnquiry}
        onClose={handleEnquiryClose}
      />
    </>
  )
}
