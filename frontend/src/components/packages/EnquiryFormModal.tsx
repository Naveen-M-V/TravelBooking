'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, MapPin, Calendar, Users, BedDouble, Plus, Minus, Info } from 'lucide-react'
import { enquiryAPI } from '@/lib/api/enquiries'
import type { FeaturedPackage } from '@/mocks/featured-packages'
import { useAuth } from '@/context/AuthContext'

interface EnquiryFormModalProps {
  package: any
  isOpen: boolean
  onClose: () => void
}

export function EnquiryFormModal({ package: pkg, isOpen, onClose }: EnquiryFormModalProps) {
  const { user } = useAuth()
  const maxChildrenForAdults = (adults: number) => Math.max(0, 4 - adults)

  const [form, setForm] = useState({
    customerName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
    customerEmail: user?.email || '',
    customerPhone: '',
    nationality: '',
    travelDate: '',
    flexibleDates: false,
    rooms: [{ adults: 2, children: 0 }],
    specialRequests: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (field: string, value: any) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const totalAdults = form.rooms.reduce((sum, room) => sum + room.adults, 0)
  const totalChildren = form.rooms.reduce((sum, room) => sum + room.children, 0)

  const updateRoomAdults = (index: number, nextAdults: number) => {
    const boundedAdults = Math.max(1, Math.min(3, nextAdults))
    update('rooms', form.rooms.map((room, i) => {
      if (i !== index) return room
      const nextChildrenCap = maxChildrenForAdults(boundedAdults)
      return {
        adults: boundedAdults,
        children: Math.min(room.children, nextChildrenCap),
      }
    }))
  }

  const updateRoomChildren = (index: number, nextChildren: number) => {
    update('rooms', form.rooms.map((room, i) => {
      if (i !== index) return room
      const childCap = maxChildrenForAdults(room.adults)
      return {
        ...room,
        children: Math.max(0, Math.min(childCap, nextChildren)),
      }
    }))
  }

  const addRoom = () => {
    update('rooms', [...form.rooms, { adults: 1, children: 0 }])
  }

  const removeRoom = (index: number) => {
    if (form.rooms.length === 1) return
    update('rooms', form.rooms.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pkg) return

    setSubmitting(true)
    setError(null)

    try {
      const guestSummary = form.rooms
        .map((room, i) => `Room ${i + 1}: ${room.adults} Adult(s), ${room.children} Children`)
        .join(' | ')

      const mergedSpecialRequests = form.specialRequests
        ? `Rooms: ${guestSummary}\n${form.specialRequests}`
        : `Rooms: ${guestSummary}`

      await enquiryAPI.submit({
        packageId: pkg.id,
        packageName: pkg.name,
        packageDestination: pkg.destination,
        packageDetails: {
          ...(pkg as any),
          enquiryGuests: {
            rooms: form.rooms,
            totalAdults,
            totalChildren,
            totalGuests: totalAdults + totalChildren,
          },
        },
        ...form,
        adults: totalAdults,
        children: totalChildren,
        infants: 0,
        specialRequests: mergedSpecialRequests,
      })
      setSubmitted(true)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit enquiry. Please try again.')
    } finally {
      setSubmitting(false)
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
              <div className="space-y-3">
                {form.rooms.map((room, idx) => {
                  const childCap = maxChildrenForAdults(room.adults)
                  const reachedChildCap = room.children >= childCap

                  return (
                    <div key={idx} className="rounded-lg border border-gray-200 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-800 inline-flex items-center gap-1.5">
                          <BedDouble className="h-4 w-4 text-primary" /> Room {idx + 1}
                        </span>
                        {form.rooms.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRoom(idx)}
                            className="text-xs text-gray-500 hover:text-red-600"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Adults (12+)</Label>
                          <div className="mt-1 flex items-center justify-between rounded-md border border-gray-200 px-2 py-1.5">
                            <button
                              type="button"
                              onClick={() => updateRoomAdults(idx, room.adults - 1)}
                              className="p-1 text-gray-600 hover:text-primary"
                              disabled={room.adults <= 1}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-sm font-semibold">{room.adults}</span>
                            <button
                              type="button"
                              onClick={() => updateRoomAdults(idx, room.adults + 1)}
                              className="p-1 text-gray-600 hover:text-primary"
                              disabled={room.adults >= 3}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-1">
                            <Label>Children (0-12)</Label>
                            {reachedChildCap && (
                              <span className="inline-flex text-amber-500" title="Add another room to add more guests">
                                <Info className="h-3.5 w-3.5" />
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex items-center justify-between rounded-md border border-gray-200 px-2 py-1.5">
                            <button
                              type="button"
                              onClick={() => updateRoomChildren(idx, room.children - 1)}
                              className="p-1 text-gray-600 hover:text-primary"
                              disabled={room.children <= 0}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-sm font-semibold">{room.children}</span>
                            <button
                              type="button"
                              onClick={() => updateRoomChildren(idx, room.children + 1)}
                              className="p-1 text-gray-600 hover:text-primary"
                              disabled={room.children >= childCap}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-gray-500">Max 4 members per room. Adults: 1-3. Children allowed now: 0-{childCap}.</p>
                      {reachedChildCap && <p className="text-[11px] text-amber-600">Add another room to add more guests.</p>}
                    </div>
                  )
                })}

                <button
                  type="button"
                  onClick={addRoom}
                  className="w-full rounded-md border border-dashed border-primary/40 py-2 text-sm font-medium text-primary hover:bg-primary/5"
                >
                  Add Room
                </button>

                <p className="text-xs text-gray-500">
                  Total: {totalAdults} Adult(s), {totalChildren} Children · {form.rooms.length} Room(s)
                </p>
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
