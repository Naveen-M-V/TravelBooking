'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { authAPI } from '@/lib/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, User, UserPlus, Mail, Lock, Phone, MailCheck, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  const { signUp } = useAuth()

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', telephone: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verificationSent, setVerificationSent] = useState(false)
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const result = await signUp({ ...form, role: 'customer' })
      if (result.requiresVerification) {
        setVerificationSent(true)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await authAPI.resendVerification(form.email)
      setResent(true)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to resend')
    } finally {
      setResending(false)
    }
  }

  // â”€â”€ Check-email success state â”€â”€
  if (verificationSent) {
    return (
      <div className="relative min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 ring-2 ring-teal-200">
            <MailCheck className="h-8 w-8 text-teal-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your inbox</h1>
          <p className="text-gray-500 mb-2">
            We sent a verification link to{' '}
            <span className="font-semibold text-gray-700">{form.email}</span>.
          </p>
          <p className="text-gray-400 text-sm mb-8">
            Click the link in the email to activate your account. The link expires in 24 hours.
          </p>
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}
          {resent ? (
            <p className="text-sm text-teal-600 font-medium">âœ“ Verification email resent!</p>
          ) : (
            <Button
              variant="outline"
              onClick={handleResend}
              disabled={resending}
              className="gap-2"
            >
              {resending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Resend verification email
            </Button>
          )}
          <p className="text-center text-sm text-gray-400 mt-6">
            Already verified?{' '}
            <Link href="/login" className="text-teal-600 hover:text-teal-500 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(20,184,166,0.07),transparent)]" />

      <div className="relative w-full max-w-md">
        <Card className="relative w-full rounded-2xl border border-gray-200 bg-white shadow-xl">
          <CardHeader className="text-center pt-10">
            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 ring-1 ring-teal-200">
              <UserPlus className="h-5 w-5 text-teal-600" />
            </div>
            <CardTitle className="text-2xl md:text-3xl text-gray-900 tracking-tight">Create your account</CardTitle>
            <CardDescription className="text-gray-500">
              Join Halal Travels in minutes
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-10">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="firstName"
                      value={form.firstName}
                      onChange={(e) => update('firstName', e.target.value)}
                      placeholder="Ahmed"
                      required
                      className="h-11 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="lastName"
                      value={form.lastName}
                      onChange={(e) => update('lastName', e.target.value)}
                      placeholder="Al-Rashidi"
                      required
                      className="h-11 pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tel" className="text-gray-700">Phone Number</Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="tel"
                    type="tel"
                    value={form.telephone}
                    onChange={(e) => update('telephone', e.target.value)}
                    placeholder="+966 5XX XXX XXXX"
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    placeholder="Min. 8 characters"
                    required
                    minLength={8}
                    className="h-11 pl-10"
                  />
                </div>
                <p className="text-xs text-gray-400">Use at least 8 characters.</p>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full h-11 gap-2 bg-teal-600 hover:bg-teal-500" disabled={loading}>
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Creating account...</>
                ) : (
                  <><UserPlus className="h-4 w-4" />Create Account</>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-teal-600 hover:text-teal-500 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
