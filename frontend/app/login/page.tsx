'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, LogIn, Lock, Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const { signIn } = useAuth()
  const router = useRouter()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [remember, setRemember] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const user = await signIn(email, password)
      if (user.role === 'admin') router.push('/dashboard/admin')
      else router.push('/dashboard/customer')
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      {/* Subtle background tint */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(20,184,166,0.07),transparent)]" />

      {/* Back to home */}
      <div className="relative w-full max-w-md mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md">
        <div className="relative rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
          <div className="px-8 pt-10 pb-4 text-center">
            {/* Brand */}
            <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 ring-1 ring-teal-200 group-hover:bg-teal-100 transition-colors">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-600" />
              </span>
              <span className="text-sm font-bold tracking-[0.22em] uppercase text-gray-700 group-hover:text-gray-900 transition-colors">
                Halal Travels
              </span>
            </Link>

            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 ring-1 ring-teal-200">
              <Lock className="h-5 w-5 text-teal-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to continue your journey</p>
          </div>

          <div className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-gray-600 text-xs font-semibold uppercase tracking-[0.12em]">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="h-11 pl-10 rounded-xl"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-600 text-xs font-semibold uppercase tracking-[0.12em]">Password</Label>
                  <Link href="/register" className="text-xs text-gray-400 hover:text-teal-600 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-11 rounded-xl"
                />
              </div>

              {/* Remember me */}
              <label className="inline-flex items-center gap-2.5 text-sm text-gray-500 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 accent-teal-600"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-11 gap-2 bg-teal-600 text-white hover:bg-teal-500 rounded-xl font-semibold mt-2"
                disabled={loading}
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>
                ) : (
                  <><LogIn className="h-4 w-4" /> Sign In</>
                )}
              </Button>
            </form>

            <div className="h-px bg-gray-100 my-6" />

            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-teal-600 hover:text-teal-500 font-semibold transition-colors">
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
