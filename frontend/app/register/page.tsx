'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, User, UserPlus, Mail, Lock, Phone } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const router = useRouter()

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', telephone: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signUp({ ...form, role: 'customer' })
      router.push('/dashboard/customer')
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Registration failed')
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
              <UserPlus className="h-5 w-5 text-teal-200" />
            </div>
            <CardTitle className="text-2xl md:text-3xl text-white tracking-tight">Create your account</CardTitle>
            <CardDescription className="text-white/60">
              Join Halal Travels in minutes
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-10">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white/80">First Name</Label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
                    <Input
                      id="firstName"
                      value={form.firstName}
                      onChange={(e) => update('firstName', e.target.value)}
                      placeholder="Ahmed"
                      required
                      className="h-11 pl-10 bg-white/10 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-teal-400/40"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white/80">Last Name</Label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
                    <Input
                      id="lastName"
                      value={form.lastName}
                      onChange={(e) => update('lastName', e.target.value)}
                      placeholder="Al-Rashidi"
                      required
                      className="h-11 pl-10 bg-white/10 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-teal-400/40"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="h-11 pl-10 bg-white/10 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-teal-400/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tel" className="text-white/80">Phone Number</Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
                  <Input
                    id="tel"
                    type="tel"
                    value={form.telephone}
                    onChange={(e) => update('telephone', e.target.value)}
                    placeholder="+966 5XX XXX XXXX"
                    className="h-11 pl-10 bg-white/10 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-teal-400/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/80">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    placeholder="Min. 8 characters"
                    required
                    minLength={8}
                    className="h-11 pl-10 bg-white/10 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-teal-400/40"
                  />
                </div>
                <p className="text-xs text-white/45">Use at least 8 characters.</p>
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
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-white/55 mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-teal-200 hover:text-teal-100 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

