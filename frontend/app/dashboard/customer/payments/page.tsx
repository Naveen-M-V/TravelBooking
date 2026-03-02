'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { enquiryAPI } from '@/lib/api/enquiries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, CreditCard, AlertCircle, RefreshCw, CheckCircle, Clock } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  PENDING:   'bg-yellow-100 text-yellow-800',
  QUOTED:    'bg-blue-100 text-blue-800',
  ACCEPTED:  'bg-purple-100 text-purple-800',
  BOOKED:    'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export default function CustomerPaymentsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const [enquiries, setEnquiries] = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const [paying, setPaying]       = useState<string | null>(null)

  const load = async () => {
    setLoading(true); setError(null)
    try {
      const res = await enquiryAPI.getMine()
      // Only show enquiries that have a quote or are booked
      setEnquiries((res.enquiries || []).filter((e: any) => ['QUOTED', 'ACCEPTED', 'BOOKED'].includes(e.status)))
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load payment history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && user) load()
    else if (!authLoading && !user) router.push('/login')
  }, [authLoading, user]) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePay = async (id: string) => {
    setPaying(id)
    try {
      const { enquiryAPI: api, paymentAPI } = await import('@/lib/api/enquiries')
      const data = await paymentAPI.initiate(id)
      router.push(`/payment?enquiryId=${id}&encRequest=${encodeURIComponent(data.encRequest)}&accessCode=${data.accessCode}&gatewayUrl=${encodeURIComponent(data.gatewayUrl)}`)
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to initiate payment')
    } finally {
      setPaying(null)
    }
  }

  const fmt = (amount: number, currency = 'SAR') =>
    new Intl.NumberFormat('en-SA', { style: 'currency', currency }).format(amount)

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500 mt-1">Quotes ready for payment and completed bookings</p>
        </div>
        <Button onClick={load} variant="outline" size="sm" disabled={loading} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600 mr-3" />
          <span className="text-gray-500">Loading…</span>
        </div>
      ) : enquiries.length === 0 ? (
        <Card className="border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl bg-violet-50 ring-2 ring-violet-100 flex items-center justify-center mb-4">
              <CreditCard className="h-8 w-8 text-violet-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No payments yet</h2>
            <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
              Once you receive a quote for a package enquiry, you can pay for it here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {enquiries.map(enq => (
            <Card key={enq.id} className="border-gray-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900 truncate">{enq.packageName}</p>
                      <Badge className={`text-xs flex-shrink-0 ${STATUS_COLORS[enq.status] ?? ''}`}>{enq.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">{enq.packageDestination}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Enquiry {new Date(enq.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>

                    {enq.totalPrice && (
                      <p className="mt-2 text-lg font-bold text-teal-700">
                        {fmt(Number(enq.totalPrice), enq.quotedCurrency ?? 'SAR')}
                      </p>
                    )}
                    {enq.quoteValidUntil && (
                      <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        Quote valid until {new Date(enq.quoteValidUntil).toLocaleDateString('en-GB')}
                      </p>
                    )}
                    {enq.adminNotes && (
                      <p className="text-sm text-gray-600 mt-2 bg-gray-50 rounded-lg px-3 py-2">{enq.adminNotes}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {enq.status === 'BOOKED' ? (
                      <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                        <CheckCircle className="h-4 w-4" />
                        Paid & Booked
                      </div>
                    ) : enq.status === 'ACCEPTED' && enq.totalPrice ? (
                      <Button
                        size="sm"
                        onClick={() => handlePay(enq.id)}
                        disabled={paying === enq.id}
                        className="gap-2 bg-teal-600 hover:bg-teal-500"
                      >
                        {paying === enq.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                        Pay Now
                      </Button>
                    ) : enq.status === 'QUOTED' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push('/dashboard/customer/enquiries')}
                      >
                        View Quote
                      </Button>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
