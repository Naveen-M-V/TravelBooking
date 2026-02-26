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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold pr-8 text-white">{pkg.name}</DialogTitle>
          </DialogHeader>

          {/* Header Image & Info */}
          <div className="relative h-64 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-xl overflow-hidden -mt-2">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(20,184,166,0.18),transparent)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-6">
                <MapPin className="w-16 h-16 text-teal-400 mx-auto mb-2" />
                <h3 className="text-2xl font-semibold text-white">
                  {pkg.destination}
                </h3>
                <p className="text-white/55 mt-1">{pkg.country}</p>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-white/10">
            <div className="text-center">
              <Calendar className="w-5 h-5 mx-auto mb-1 text-teal-400" />
              <p className="text-xs text-white/45">Duration</p>
              <p className="font-semibold text-sm text-white/80">{pkg.duration}</p>
            </div>
            <div className="text-center">
              <Star className="w-5 h-5 mx-auto mb-1 text-amber-400" />
              <p className="text-xs text-white/45">Rating</p>
              <p className="font-semibold text-sm text-white/80">{pkg.rating} ({pkg.reviews})</p>
            </div>
            <div className="text-center">
              <Users className="w-5 h-5 mx-auto mb-1 text-teal-400" />
              <p className="text-xs text-white/45">Group Size</p>
              <p className="font-semibold text-sm text-white/80">2-15 people</p>
            </div>
            <div className="text-center">
              <Sparkles className="w-5 h-5 mx-auto mb-1 text-teal-400" />
              <p className="text-xs text-white/45">Halal Rating</p>
              <p className="font-semibold text-sm text-white/80">{pkg.halalRating}/5</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="mt-4">
            <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10">
              <TabsTrigger value="overview" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white text-white/60">Overview</TabsTrigger>
              <TabsTrigger value="itinerary" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white text-white/60">Itinerary</TabsTrigger>
              <TabsTrigger value="included" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white text-white/60">What&apos;s Included</TabsTrigger>
              <TabsTrigger value="highlights" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white text-white/60">Highlights</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 mt-4">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-white">About This Package</h3>
                <p className="text-white/65">{pkg.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3 text-white">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {pkg.features.map((feature) => (
                    <span key={feature} className="rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 px-3 py-1 text-sm font-medium">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-teal-500/10 border border-teal-500/20 p-4 rounded-xl">
                <Button size="lg" onClick={handleEnquireNow} className="w-full gap-2 bg-teal-500 text-white hover:bg-teal-400">
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
                    <div key={day.day} className="border-l-4 border-teal-500/40 pl-4 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-teal-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {day.day}
                        </div>
                        <h4 className="font-semibold text-lg text-white">{day.title}</h4>
                      </div>
                      <p className="text-white/65 mb-3">{day.description}</p>
                      <div className="space-y-1">
                        {day.activities.map((activity, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Clock className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-white/55">{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-white/50">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-40" />
                  <p>Detailed itinerary coming soon!</p>
                  <p className="text-sm mt-1 text-white/35">Contact us for more information</p>
                </div>
              )}
            </TabsContent>

            {/* What's Included Tab */}
            <TabsContent value="included" className="mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-emerald-400">✔ Included</h3>
                  <ul className="space-y-2">
                    {pkg.included.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/70">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <h3 className="font-semibold text-lg mb-3 text-rose-400">âœ— Not Included</h3>
                  <ul className="space-y-2 text-white/55">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">âœ—</span>
                      <span>Personal expenses and shopping</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">âœ—</span>
                      <span>Tips and gratuities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">âœ—</span>
                      <span>Travel visa fees (if applicable)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">âœ—</span>
                      <span>Optional activities and excursions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* Highlights Tab */}
            <TabsContent value="highlights" className="mt-4">
              <div>
                <h3 className="font-semibold text-lg mb-4 text-white">Experience Highlights</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pkg.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/[0.07]">
                      <div className="w-8 h-8 rounded-full bg-teal-500/15 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-teal-400" />
                      </div>
                      <span className="text-white/70 pt-1">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl">
                <h4 className="font-semibold text-white mb-2">Why This Package?</h4>
                <p className="text-sm text-white/60">
                  This carefully curated package combines cultural immersion with comfort,
                  ensuring you experience the best of {pkg.destination} while maintaining
                  your Islamic values and dietary requirements.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer CTA */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-4">
            <Button variant="outline" onClick={onClose} className="border-white/15 text-white/70 hover:bg-white/5 hover:text-white">
              Close
            </Button>
            <Button size="lg" onClick={handleEnquireNow} className="gap-2 bg-teal-500 text-white hover:bg-teal-400">
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
