'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  MapPin, Calendar, Users, Clock, MessageSquare, Loader2,
  AlertCircle, RefreshCw, ChevronDown, ChevronUp, Send, X
} from 'lucide-react'
import { enquiryAPI } from '@/lib/api/enquiries'
import { useAuth } from '@/context/AuthContext'

const STATUS_COLORS: Record<string, string> = {
  PENDING:   'bg-yellow-100 text-yellow-800',
  QUOTED:    'bg-blue-100 text-blue-800',
  ACCEPTED:  'bg-purple-100 text-purple-800',
  BOOKED:    'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export default function AdminEnquiriesPage() {
  const { user, loading: authLoading, isAdmin } = useAuth()
  const router = useRouter()

  const [enquiries, setEnquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [quoteForms, setQuoteForms] = useState<Record<string, { basePrice: string; markup: string; notes: string }>>({})
  const [submitting, setSubmitting] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {}
      const res = await enquiryAPI.getAll(params)
      setEnquiries(res.enquiries || [])
    } catch {
      // Backend unavailable — show empty state gracefully
      setEnquiries([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin) { router.push('/login'); return }
      load()
    }
  }, [authLoading, user, isAdmin, statusFilter])

  const getQuoteForm = (id: string) =>
    quoteForms[id] || { basePrice: '', markup: '0', notes: '' }

  const updateQuoteForm = (id: string, field: string, value: string) => {
    setQuoteForms(prev => ({
      ...prev,
      [id]: { ...getQuoteForm(id), [field]: value },
    }))
  }

  const calcTotal = (id: string) => {
    const form = getQuoteForm(id)
    const base = parseFloat(form.basePrice || '0')
    const markup = parseFloat(form.markup || '0')
    if (!base) return null
    const total = base * (1 + markup / 100)
    return total.toFixed(2)
  }

  const handleSendQuote = async (id: string) => {
    const form = getQuoteForm(id)
    if (!form.basePrice) { alert('Please enter a base price'); return }

    setSubmitting(id)
    try {
      await enquiryAPI.submitQuote(id, {
        basePrice: parseFloat(form.basePrice),
        markupPercentage: parseFloat(form.markup || '0'),
        adminNotes: form.notes || undefined,
      })
      await load()
      setExpandedId(null)
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to send quote')
    } finally {
      setSubmitting(null)
    }
  }

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this enquiry?')) return
    setCancelling(id)
    try {
      await enquiryAPI.cancel(id)
      await load()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to cancel')
    } finally {
      setCancelling(null)
    }
  }

  const formatCurrency = (amount: number, currency = 'SAR') =>
    new Intl.NumberFormat('en-SA', { style: 'currency', currency }).format(amount)

  const statusCounts = enquiries.reduce((acc: Record<string, number>, e) => {
    acc[e.status] = (acc[e.status] || 0) + 1
    return acc
  }, {})

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
        <span className="text-gray-600">Loading enquiries...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={load} variant="outline"><RefreshCw className="h-4 w-4 mr-2" />Retry</Button>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Package Enquiries</h1>
          <p className="text-gray-500 text-sm mt-1">Review and quote customer package enquiries</p>
        </div>
        <Button variant="outline" size="sm" onClick={load}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {['PENDING', 'QUOTED', 'ACCEPTED', 'BOOKED', 'CANCELLED'].map(s => (
          <Card
            key={s}
            className={`cursor-pointer transition-all ${statusFilter === s ? 'ring-2 ring-primary' : 'hover:shadow-sm'}`}
            onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
          >
            <CardContent className="p-3 text-center">
              <p className={`text-2xl font-bold ${statusFilter === s ? 'text-primary' : 'text-gray-700'}`}>
                {statusCounts[s] || 0}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{s.charAt(0) + s.slice(1).toLowerCase()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-3 mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Enquiries</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="QUOTED">Quoted</SelectItem>
            <SelectItem value="ACCEPTED">Accepted</SelectItem>
            <SelectItem value="BOOKED">Booked</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500">{enquiries.length} enquiry(ies)</p>
      </div>

      {/* Enquiry list */}
      {enquiries.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No enquiries found</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq) => {
            const isExpanded = expandedId === enq.id
            const qForm = getQuoteForm(enq.id)
            const total = calcTotal(enq.id)
            const canQuote = enq.status === 'PENDING' || enq.status === 'QUOTED'

            return (
              <Card key={enq.id} className={`overflow-hidden ${enq.status === 'PENDING' ? 'border-yellow-300' : ''}`}>
                <CardHeader className="pb-3 bg-gray-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-base">{enq.packageName}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[enq.status] || 'bg-gray-100 text-gray-700'}`}>
                          {enq.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {enq.packageDestination}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {enq.status !== 'CANCELLED' && enq.status !== 'BOOKED' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancel(enq.id)}
                          disabled={cancelling === enq.id}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                        >
                          {cancelling === enq.id
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <X className="h-4 w-4" />
                          }
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedId(isExpanded ? null : enq.id)}
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-4 pb-4">
                  {/* Customer info row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Customer</p>
                      <p className="font-medium truncate">{enq.customerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium truncate">{enq.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium">{enq.customerPhone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Travel Date</p>
                      <p className="font-medium">
                        {enq.travelDate ? new Date(enq.travelDate).toLocaleDateString() : 'Flexible'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {enq.adults}A {enq.children > 0 ? `${enq.children}C` : ''} {enq.infants > 0 ? `${enq.infants}I` : ''}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-gray-400 text-xs">#{enq.id.slice(0, 8).toUpperCase()}</span>
                  </div>

                  {enq.specialRequests && (
                    <div className="bg-gray-50 rounded p-2 text-sm text-gray-600 mb-4">
                      <strong>Special Requests:</strong> {enq.specialRequests}
                    </div>
                  )}

                  {/* Existing quote */}
                  {(enq.status === 'QUOTED' || enq.status === 'ACCEPTED' || enq.status === 'BOOKED') && enq.totalPrice && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm">
                      <p className="font-semibold text-blue-900 mb-1">Current Quote</p>
                      <p>Base: {formatCurrency(Number(enq.basePrice), enq.currency)} + {enq.markupPercentage}% markup = <strong>{formatCurrency(Number(enq.totalPrice), enq.currency)}</strong></p>
                      {enq.adminNotes && <p className="text-blue-700 italic mt-1">"{enq.adminNotes}"</p>}
                    </div>
                  )}

                  {/* Expanded content + Quote form */}
                  {isExpanded && (
                    <div className="border-t pt-4 mt-2 space-y-4">
                      {/* Package snapshot details */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Package Details</h4>
                        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                          <p><strong>Package:</strong> {enq.packageName}</p>
                          <p><strong>Destination:</strong> {enq.packageDestination}</p>
                        </div>
                      </div>

                      {/* Quote form */}
                      {canQuote && (
                        <div className="bg-white border-2 border-primary/20 rounded-xl p-4">
                          <h4 className="font-bold text-base mb-4 text-primary">
                            {enq.status === 'QUOTED' ? 'Update Quote' : 'Send Quote to Customer'}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor={`base-${enq.id}`}>Base Price (SAR) *</Label>
                              <Input
                                id={`base-${enq.id}`}
                                type="number"
                                min="0"
                                step="0.01"
                                value={qForm.basePrice}
                                onChange={e => updateQuoteForm(enq.id, 'basePrice', e.target.value)}
                                placeholder="e.g. 5000"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`markup-${enq.id}`}>Markup %</Label>
                              <Input
                                id={`markup-${enq.id}`}
                                type="number"
                                min="0"
                                max="100"
                                step="0.5"
                                value={qForm.markup}
                                onChange={e => updateQuoteForm(enq.id, 'markup', e.target.value)}
                                placeholder="e.g. 10"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>Total Price</Label>
                              <div className="mt-1 h-10 px-3 bg-primary-50 border border-primary-200 rounded-md flex items-center">
                                <span className="text-primary font-bold text-lg">
                                  {total ? `SAR ${Number(total).toLocaleString()}` : '—'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <Label htmlFor={`notes-${enq.id}`}>Notes for Customer (optional)</Label>
                            <Textarea
                              id={`notes-${enq.id}`}
                              value={qForm.notes}
                              onChange={e => updateQuoteForm(enq.id, 'notes', e.target.value)}
                              placeholder="Any notes or special inclusions..."
                              rows={2}
                              className="mt-1"
                            />
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button
                              onClick={() => handleSendQuote(enq.id)}
                              disabled={submitting === enq.id || !qForm.basePrice}
                              className="gap-2"
                            >
                              {submitting === enq.id
                                ? <><Loader2 className="h-4 w-4 animate-spin" />Sending...</>
                                : <><Send className="h-4 w-4" />Send Quote to Customer</>
                              }
                            </Button>
                          </div>
                        </div>
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
