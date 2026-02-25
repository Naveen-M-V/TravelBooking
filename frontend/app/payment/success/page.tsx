'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const enquiryId = searchParams.get('enquiryId')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md w-full mx-4">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
        <p className="text-gray-600 mb-2">
          Your booking has been confirmed. You'll receive a confirmation email shortly.
        </p>
        {enquiryId && (
          <p className="text-sm text-gray-400 mb-8">
            Booking Reference: <strong>{enquiryId.slice(0, 8).toUpperCase()}</strong>
          </p>
        )}
        <div className="flex flex-col gap-3">
          <Button onClick={() => router.push('/dashboard/customer/enquiries')}>
            View My Bookings
          </Button>
          <Button variant="outline" onClick={() => router.push('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <PaymentSuccessContent />
    </Suspense>
  )
}
