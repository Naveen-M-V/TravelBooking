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
    <div className="relative min-h-screen overflow-hidden bg-slate-950 flex flex-col items-center justify-center px-4 py-16">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-slate-950 to-black" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(20,184,166,0.12),transparent)]" />
      <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" />

      {/* Back to home */}
      <div className="relative w-full max-w-md mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-white/45 hover:text-white/80 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md">
        {/* Glow border */}
        <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-b from-teal-500/30 via-white/5 to-transparent pointer-events-none" />

        <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-[0_50px_120px_-60px_rgba(0,0,0,0.9)] overflow-hidden">
          {/* Top accent stripe */}
          <div className="h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />

          <div className="px-8 pt-10 pb-4 text-center">
            {/* Brand */}
            <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 group-hover:bg-teal-500/20 transition-colors">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-400" />
              </span>
              <span className="text-sm font-bold tracking-[0.22em] uppercase text-white/70 group-hover:text-white transition-colors">
                Halal Travels
              </span>
            </Link>

            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/8 ring-1 ring-white/12">
              <Lock className="h-5 w-5 text-teal-300" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
            <p className="text-white/50 text-sm mt-1">Sign in to continue your journey</p>
          </div>

          <div className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-white/65 text-xs font-semibold uppercase tracking-[0.12em]">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="h-11 pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-teal-400/40 focus-visible:border-teal-400/40 rounded-xl"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white/65 text-xs font-semibold uppercase tracking-[0.12em]">Password</Label>
                  <Link href="/register" className="text-xs text-white/40 hover:text-teal-300 transition-colors">
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
                  className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-teal-400/40 focus-visible:border-teal-400/40 rounded-xl"
                />
              </div>

              {/* Remember me */}
              <label className="inline-flex items-center gap-2.5 text-sm text-white/55 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/20 bg-white/10 accent-teal-500"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-11 gap-2 bg-teal-500 text-white hover:bg-teal-400 rounded-xl font-semibold mt-2"
                disabled={loading}
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>
                ) : (
                  <><LogIn className="h-4 w-4" /> Sign In</>
                )}
              </Button>
            </form>

            <div className="h-px bg-white/[0.07] my-6" />

            <p className="text-center text-sm text-white/45">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-teal-300 hover:text-teal-200 font-semibold transition-colors">
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
