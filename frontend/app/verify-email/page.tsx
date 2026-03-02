'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api/auth'
import { useAuth } from '@/context/AuthContext'
import { Loader2, CheckCircle, XCircle, RefreshCw, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  // Access persist via a workaround — call signIn after verify auto-logs in via returned token
  const { signOut } = useAuth()

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'no-token'>('loading')
  const [error, setError] = useState('')
  const [resendEmail, setResendEmail] = useState('')
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  useEffect(() => {
    if (!token) { setStatus('no-token'); return }

    authAPI.verifyEmail(token)
      .then((result) => {
        // Persist the returned session so user is logged in
        if (result.user && result.token) {
          localStorage.setItem('auth_token', result.token)
          localStorage.setItem('auth_user', JSON.stringify(result.user))
        }
        setStatus('success')
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push(result.user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/customer')
        }, 2000)
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Verification failed')
        setStatus('error')
      })
  }, [token, router])

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    setResending(true)
    try {
      await authAPI.resendVerification(resendEmail)
      setResent(true)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to resend')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">

        {/* Loading */}
        {status === 'loading' && (
          <>
            <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 ring-2 ring-teal-200">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying your email…</h1>
            <p className="text-gray-400 text-sm">Please wait a moment.</p>
          </>
        )}

        {/* Success */}
        {status === 'success' && (
          <>
            <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 ring-2 ring-emerald-200">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Email verified!</h1>
            <p className="text-gray-500 mb-6">Your account is active. Redirecting you to your dashboard…</p>
            <Loader2 className="h-5 w-5 animate-spin text-teal-500 mx-auto" />
          </>
        )}

        {/* No token */}
        {status === 'no-token' && (
          <>
            <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 ring-2 ring-amber-200">
              <Mail className="h-8 w-8 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">No verification token</h1>
            <p className="text-gray-500 mb-8">Enter your email below to resend the verification link.</p>
            <form onSubmit={handleResend} className="flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                required
                className="h-11"
              />
              <Button type="submit" disabled={resending} className="h-11 bg-teal-600 hover:bg-teal-500 px-5">
                {resending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
            </form>
            {resent && <p className="text-sm text-teal-600 font-medium mt-4">✓ Verification email sent!</p>}
          </>
        )}

        {/* Error */}
        {status === 'error' && (
          <>
            <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 ring-2 ring-red-200">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification failed</h1>
            <p className="text-red-500 mb-6 text-sm">{error}</p>
            <p className="text-gray-500 text-sm mb-6">Enter your email to get a new verification link:</p>
            <form onSubmit={handleResend} className="flex gap-2 mb-6">
              <Input
                type="email"
                placeholder="your@email.com"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                required
                className="h-11"
              />
              <Button type="submit" disabled={resending} className="h-11 bg-teal-600 hover:bg-teal-500 px-5">
                {resending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
            </form>
            {resent && <p className="text-sm text-teal-600 font-medium">✓ New verification email sent!</p>}
          </>
        )}

        <p className="text-sm text-gray-400 mt-8">
          <Link href="/login" className="text-teal-600 hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
