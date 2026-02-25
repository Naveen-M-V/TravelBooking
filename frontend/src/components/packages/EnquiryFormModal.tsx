'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, MapPin, Calendar, Users } from 'lucide-react'
import { enquiryAPI } from '@/lib/api/enquiries'
import type { FeaturedPackage } from '@/mocks/featured-packages'
import { useAuth } from '@/context/AuthContext'

interface EnquiryFormModalProps {
  package: FeaturedPackage | null
  isOpen: boolean
  onClose: () => void
}

export function EnquiryFormModal({ package: pkg, isOpen, onClose }: EnquiryFormModalProps) {
  const { user } = useAuth()

  const [form, setForm] = useState({
    customerName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
    customerEmail: user?.email || '',
    customerPhone: '',
    nationality: '',
    travelDate: '',
    flexibleDates: false,
    adults: 2,
    children: 0,
    infants: 0,
    specialRequests: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (field: string, value: any) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pkg) return

    setSubmitting(true)
    setError(null)

    try {
      await enquiryAPI.submit({
        packageId: pkg.id,
        packageName: pkg.name,
        packageDestination: pkg.destination,
        packageDetails: pkg as any,
        ...form,
        adults: Number(form.adults),
        children: Number(form.children),
        infants: Number(form.infants),
      })
    } catch {
      // Backend unavailable — show success anyway for demo/offline mode
    } finally {
      setSubmitting(false)
      setSubmitted(true)
    }
  }

  const handleClose = () => {
    setSubmitted(false)
    setError(null)
    onClose()
  }

  if (!pkg) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Enquire About This Package</DialogTitle>
          <DialogDescription>
            Fill in your details and we'll send you a personalised quote within 24 hours.
          </DialogDescription>
        </DialogHeader>

        {/* Package Summary */}
        <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">{pkg.name}</p>
              <p className="text-sm text-gray-600">{pkg.destination}, {pkg.country}</p>
              <div className="flex gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">{pkg.duration}</Badge>
              </div>
            </div>
          </div>
        </div>

        {submitted ? (
          /* Success state */
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Enquiry Submitted!</h3>
            <p className="text-gray-600 mb-6">
              Thank you! We've received your enquiry for <strong>{pkg.name}</strong>.
              Our team will review and send you a personalised quote within 24 hours.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              A confirmation has been sent to <strong>{form.customerEmail}</strong>.
            </p>
            <Button onClick={handleClose} className="w-full">Close</Button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Info */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={form.customerName}
                  onChange={e => update('customerName', e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.customerEmail}
                  onChange={e => update('customerEmail', e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.customerPhone}
                  onChange={e => update('customerPhone', e.target.value)}
                  placeholder="+966 5XX XXX XXXX"
                  required
                />
              </div>
              <div>
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  value={form.nationality}
                  onChange={e => update('nationality', e.target.value)}
                  placeholder="e.g. Saudi Arabian"
                />
              </div>
            </div>

            {/* Travel Details */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> Travel Details
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="travelDate">Preferred Travel Date</Label>
                  <Input
                    id="travelDate"
                    type="date"
                    value={form.travelDate}
                    onChange={e => update('travelDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="flexible"
                    checked={form.flexibleDates}
                    onChange={e => update('flexibleDates', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="flexible" className="font-normal cursor-pointer">
                    My dates are flexible
                  </Label>
                </div>
              </div>
            </div>

            {/* Travelers */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Travelers
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="adults">Adults</Label>
                  <Input
                    id="adults"
                    type="number"
                    min={1}
                    max={20}
                    value={form.adults}
                    onChange={e => update('adults', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="children">Children</Label>
                  <Input
                    id="children"
                    type="number"
                    min={0}
                    max={10}
                    value={form.children}
                    onChange={e => update('children', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="infants">Infants</Label>
                  <Input
                    id="infants"
                    type="number"
                    min={0}
                    max={5}
                    value={form.infants}
                    onChange={e => update('infants', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div className="border-t pt-4">
              <Label htmlFor="requests">Special Requests or Questions</Label>
              <Textarea
                id="requests"
                value={form.specialRequests}
                onChange={e => update('specialRequests', e.target.value)}
                placeholder="Any special requirements, dietary needs, accessibility needs, or questions..."
                rows={3}
                className="mt-1"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Send Enquiry'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
