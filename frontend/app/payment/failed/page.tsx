'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

function PaymentFailedContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const enquiryId = searchParams.get('enquiryId')
  const status = searchParams.get('status') || 'FAILED'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md w-full mx-4">
        <XCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {status === 'CANCELLED' ? 'Payment Cancelled' : 'Payment Failed'}
        </h1>
        <p className="text-gray-600 mb-8">
          {status === 'CANCELLED'
            ? 'You cancelled the payment. Your enquiry is still active — you can try again from your dashboard.'
            : 'Your payment could not be processed. Please try again or contact support.'}
        </p>
        <div className="flex flex-col gap-3">
          {enquiryId && (
            <Button onClick={() => router.push('/dashboard/customer/enquiries')}>
              Try Again
            </Button>
          )}
          <Button variant="outline" onClick={() => router.push('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function PaymentFailedPage() {
  return (
    <Suspense>
      <PaymentFailedContent />
    </Suspense>
  )
}
