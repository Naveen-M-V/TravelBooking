'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, LogIn, Lock, Mail } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const { signIn } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [remember, setRemember] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const user = await signIn(email, password)
      // Redirect based on role
      if (user.role === 'admin') router.push('/dashboard/admin')
      else router.push('/dashboard/customer')
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 flex items-center justify-center px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-slate-950 to-black" />
      <div className="pointer-events-none absolute -top-28 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-teal-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-teal-500/25 via-white/10 to-emerald-500/25 blur-2xl opacity-60" />

        <Card className="relative w-full rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_50px_120px_-60px_rgba(0,0,0,0.95)]">
          <CardHeader className="text-center pt-10">
            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <Lock className="h-5 w-5 text-teal-200" />
            </div>
            <CardTitle className="text-2xl md:text-3xl text-white tracking-tight">Welcome back</CardTitle>
            <CardDescription className="text-white/60">
              Sign in to continue to Halal Travels
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-10">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="h-11 pl-10 bg-white/10 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-teal-400/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/80">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-11 bg-white/10 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-teal-400/40"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/20 bg-white/10"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember me
                </label>
                <Link href="/register" className="text-sm text-white/70 hover:text-white transition-colors">
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full h-11 gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-white/55 mt-6">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-teal-200 hover:text-teal-100 font-semibold transition-colors">
                Create one
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

