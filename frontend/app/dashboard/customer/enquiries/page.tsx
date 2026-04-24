'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  MapPin, Calendar, Users, Clock, CheckCircle, CreditCard,
  Loader2, AlertCircle, RefreshCw, MessageSquare, ChevronDown, ChevronUp
} from 'lucide-react'
import { enquiryAPI, paymentAPI } from '@/lib/api/enquiries'
import { useAuth } from '@/context/AuthContext'

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING:   { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" /> },
  QUOTED:    { label: 'Quote Ready',    color: 'bg-blue-100 text-blue-800',     icon: <MessageSquare className="w-4 h-4" /> },
  ACCEPTED:  { label: 'Accepted',       color: 'bg-purple-100 text-purple-800', icon: <CheckCircle className="w-4 h-4" /> },
  BOOKED:    { label: 'Booked & Paid',  color: 'bg-green-100 text-green-800',   icon: <CheckCircle className="w-4 h-4" /> },
  CANCELLED: { label: 'Cancelled',      color: 'bg-red-100 text-red-800',       icon: <AlertCircle className="w-4 h-4" /> },
}

export default function CustomerEnquiriesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const [enquiries, setEnquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [payingId, setPayingId] = useState<string | null>(null)
  const [acceptingId, setAcceptingId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await enquiryAPI.getMine()
      setEnquiries(res.enquiries || [])
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load your enquiries. Please try again.')
      setEnquiries([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && user) load()
    else if (!authLoading && !user) router.push('/login')
  }, [authLoading, user])

  const handleAcceptQuote = async (id: string) => {
    setAcceptingId(id)
    try {
      await enquiryAPI.acceptQuote(id)
      await load()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to accept quote')
    } finally {
      setAcceptingId(null)
    }
  }

  const handlePayNow = async (id: string) => {
    setPayingId(id)
    try {
      const data = await paymentAPI.initiate(id)
      // Redirect to CCAvenue via our payment page
      router.push(`/payment?enquiryId=${id}&encRequest=${encodeURIComponent(data.encRequest)}&accessCode=${data.accessCode}&gatewayUrl=${encodeURIComponent(data.gatewayUrl)}`)
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to initiate payment')
    } finally {
      setPayingId(null)
    }
  }

  const formatCurrency = (amount: number, currency = 'SAR') =>
    new Intl.NumberFormat('en-SA', { style: 'currency', currency }).format(amount)

  const renderPackageDetails = (details: any) => {
    if (!details || typeof details !== 'object') return null

    const highlights = Array.isArray(details.highlights) ? details.highlights : []
    const included = Array.isArray(details.included) ? details.included : []
    const features = Array.isArray(details.features) ? details.features : []
    const itinerary = Array.isArray(details.itinerary) ? details.itinerary : []
    const enquiryGuests = details.enquiryGuests

    return (
      <div className="space-y-4 rounded-xl bg-gray-50 border border-gray-200 p-4">
        <div>
          <h5 className="font-semibold text-gray-900">Package Snapshot</h5>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
            <p><strong>Name:</strong> {details.name || 'N/A'}</p>
            <p><strong>Destination:</strong> {details.destination || 'N/A'}</p>
            <p><strong>Country:</strong> {details.country || 'N/A'}</p>
            <p><strong>Duration:</strong> {details.duration || 'N/A'}</p>
          </div>
          {details.description && <p className="mt-3 text-sm text-gray-600">{details.description}</p>}
        </div>

        {enquiryGuests && (
          <div>
            <h5 className="font-semibold text-gray-900">Traveller Summary</h5>
            <p className="mt-1 text-sm text-gray-600">
              {enquiryGuests.totalAdults} adult(s), {enquiryGuests.totalChildren} child(ren), {enquiryGuests.totalGuests} total guest(s)
            </p>
          </div>
        )}

        {highlights.length > 0 && (
          <div>
            <h5 className="font-semibold text-gray-900 mb-2">Highlights</h5>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              {highlights.slice(0, 6).map((item: string) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        )}

        {included.length > 0 && (
          <div>
            <h5 className="font-semibold text-gray-900 mb-2">Included</h5>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              {included.slice(0, 6).map((item: string) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        )}

        {features.length > 0 && (
          <div>
            <h5 className="font-semibold text-gray-900 mb-2">Features</h5>
            <div className="flex flex-wrap gap-2">
              {features.slice(0, 8).map((item: string) => (
                <span key={item} className="rounded-full bg-teal-50 border border-teal-200 text-teal-700 px-3 py-1 text-xs font-medium">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {itinerary.length > 0 && (
          <div>
            <h5 className="font-semibold text-gray-900 mb-2">Itinerary</h5>
            <div className="space-y-2 text-sm text-gray-600">
              {itinerary.slice(0, 5).map((day: any) => (
                <div key={day.day ?? day.title} className="rounded-lg bg-white border border-gray-200 p-3">
                  <p className="font-medium text-gray-800">{day.day ? `Day ${day.day}` : 'Day'} {day.title ? `- ${day.title}` : ''}</p>
                  {day.description && <p className="mt-1">{day.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
        <span className="text-gray-600">Loading your enquiries...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={load} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" /> Retry
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Package Enquiries</h1>
        <Button variant="outline" size="sm" onClick={load}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      {enquiries.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Enquiries Yet</h3>
          <p className="text-gray-500 mb-6">Browse our packages and click "Enquire Now" to get started.</p>
          <Button onClick={() => router.push('/')}>Browse Packages</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq) => {
            const statusCfg = STATUS_CONFIG[enq.status] || STATUS_CONFIG.PENDING
            const isExpanded = expandedId === enq.id
            const hasQuote = enq.status === 'QUOTED' || enq.status === 'ACCEPTED' || enq.status === 'BOOKED'

            return (
              <Card key={enq.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate">{enq.packageName}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{enq.packageDestination}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusCfg.color}`}>
                        {statusCfg.icon}
                        {statusCfg.label}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Quick info row */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{enq.travelDate ? new Date(enq.travelDate).toLocaleDateString() : 'Flexible dates'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{enq.adults}A {enq.children > 0 ? `${enq.children}C` : ''} {enq.infants > 0 ? `${enq.infants}I` : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(enq.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span className="text-xs text-gray-400">Ref: {enq.id.slice(0, 8).toUpperCase()}</span>
                  </div>

                  {/* Quote section */}
                  {hasQuote && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Your Quote</h4>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-2xl font-bold text-blue-900 mt-1">
                            {formatCurrency(Number(enq.totalPrice), enq.currency)}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">Total price for this enquiry</p>
                          {enq.quoteValidUntil && enq.status === 'QUOTED' && (
                            <p className="text-xs text-gray-500">
                              Valid until {new Date(enq.quoteValidUntil).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {enq.status === 'QUOTED' && (
                            <Button
                              onClick={() => handleAcceptQuote(enq.id)}
                              disabled={acceptingId === enq.id}
                              variant="outline"
                              size="sm"
                            >
                              {acceptingId === enq.id
                                ? <><Loader2 className="h-4 w-4 animate-spin mr-1" />Accepting...</>
                                : 'Accept Quote'
                              }
                            </Button>
                          )}
                          {enq.status === 'ACCEPTED' && (
                            <Button
                              onClick={() => handlePayNow(enq.id)}
                              disabled={payingId === enq.id}
                              size="sm"
                              className="gap-2"
                            >
                              {payingId === enq.id
                                ? <><Loader2 className="h-4 w-4 animate-spin" />Processing...</>
                                : <><CreditCard className="h-4 w-4" />Pay Now</>
                              }
                            </Button>
                          )}
                          {enq.status === 'BOOKED' && (
                            <Badge className="bg-green-100 text-green-800 px-3 py-1">
                              <CheckCircle className="h-4 w-4 mr-1" />Paid
                            </Badge>
                          )}
                        </div>
                      </div>
                      {enq.adminNotes && (
                        <p className="text-sm text-blue-700 mt-2 italic">"{enq.adminNotes}"</p>
                      )}
                    </div>
                  )}

                  {/* Expand/collapse details */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : enq.id)}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    {isExpanded ? (
                      <><ChevronUp className="w-4 h-4" /> Hide Details</>
                    ) : (
                      <><ChevronDown className="w-4 h-4" /> View Details</>
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t space-y-2 text-sm text-gray-600">
                      {renderPackageDetails(enq.packageDetails)}
                      {enq.specialRequests && (
                        <p><strong>Special Requests:</strong> {enq.specialRequests}</p>
                      )}
                      <p><strong>Submitted:</strong> {new Date(enq.createdAt).toLocaleString()}</p>
                      {enq.status === 'PENDING' && (
                        <p className="text-yellow-700 bg-yellow-50 px-3 py-2 rounded">
                          ⏳ Our team is reviewing your enquiry. You'll receive a quote within 24 hours.
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
