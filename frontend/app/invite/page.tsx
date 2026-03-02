'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Lock, User, ShieldCheck, CheckCircle } from 'lucide-react'
import Link from 'next/link'

function InviteContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') || ''

  const [form, setForm] = useState({ firstName: '', lastName: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true); setError(null)
    try {
      const result = await authAPI.acceptInvite({
        token,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
      })
      // Persist session
      if (result.user && result.token) {
        localStorage.setItem('auth_token', result.token)
        localStorage.setItem('auth_user', JSON.stringify(result.user))
      }
      setDone(true)
      setTimeout(() => router.push('/dashboard/admin'), 2000)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to accept invite')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-500">Invalid invite link. Please ask an admin to resend the invite.</p>
          <Link href="/login" className="mt-4 inline-block text-teal-600 hover:underline text-sm">Back to login</Link>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 ring-2 ring-emerald-200">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Account activated!</h1>
          <p className="text-gray-500 mb-4">Redirecting to admin dashboard…</p>
          <Loader2 className="h-5 w-5 animate-spin text-teal-500 mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(20,184,166,0.07),transparent)]" />

      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
          <div className="px-8 pt-10 pb-4 text-center">
            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 ring-1 ring-teal-200">
              <ShieldCheck className="h-5 w-5 text-teal-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Accept Admin Invite</h1>
            <p className="text-gray-500 text-sm mt-1">Set your name and password to activate your admin account.</p>
          </div>

          <div className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">First Name</Label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="Ahmed" required className="h-11 pl-10" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Last Name</Label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Al-Rashid" required className="h-11 pl-10" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min. 8 characters" required minLength={8} className="h-11 pl-10" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Confirm Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)} placeholder="Repeat password" required className="h-11 pl-10" />
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              )}

              <Button type="submit" disabled={loading} className="w-full h-11 bg-teal-600 hover:bg-teal-500 gap-2">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Activating…</> : <><ShieldCheck className="h-4 w-4" /> Activate Admin Account</>}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function InvitePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    }>
      <InviteContent />
    </Suspense>
  )
}
