'use client'

import { Suspense, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2, Shield } from 'lucide-react'

/**
 * Payment gateway redirect page.
 * Receives encRequest + accessCode from our backend after accepting a quote,
 * then auto-submits a POST form to the CCAvenue gateway.
 */
function PaymentPageContent() {
  const searchParams = useSearchParams()
  const formRef = useRef<HTMLFormElement>(null)

  const encRequest = searchParams.get('encRequest') || ''
  const accessCode = searchParams.get('accessCode') || ''
  const gatewayUrl = searchParams.get('gatewayUrl') || 'https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction'
  const enquiryId = searchParams.get('enquiryId') || ''

  useEffect(() => {
    if (encRequest && accessCode && formRef.current) {
      // Auto-submit after a short delay so user sees the loading screen
      const timer = setTimeout(() => {
        formRef.current?.submit()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [encRequest, accessCode])

  if (!encRequest || !accessCode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Invalid payment session.</p>
          <a href="/" className="text-primary hover:underline mt-2 block">Return to home</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-sm w-full mx-4">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Shield className="w-6 h-6 text-green-600" />
          <span className="font-semibold text-gray-700">Secure Payment</span>
        </div>
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Redirecting to Payment</h2>
        <p className="text-gray-500 text-sm">
          You are being securely redirected to the CCAvenue payment gateway.
          Please do not close or refresh this page.
        </p>
        <p className="text-xs text-gray-400 mt-4">Powered by CCAvenue</p>

        {/* Hidden auto-submit form */}
        <form ref={formRef} method="POST" action={gatewayUrl} className="hidden">
          <input type="hidden" name="encRequest" value={encRequest} />
          <input type="hidden" name="access_code" value={accessCode} />
        </form>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense>
      <PaymentPageContent />
    </Suspense>
  )
}
