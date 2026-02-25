'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, UserPlus } from 'lucide-react'
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join Halal Travels today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={form.firstName} onChange={e => update('firstName', e.target.value)} placeholder="Ahmed" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={form.lastName} onChange={e => update('lastName', e.target.value)} placeholder="Al-Rashidi" required className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="tel">Phone Number</Label>
              <Input id="tel" type="tel" value={form.telephone} onChange={e => update('telephone', e.target.value)} placeholder="+966 5XX XXX XXXX" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="Min. 8 characters" required minLength={8} className="mt-1" />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm">{error}</div>
            )}

            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading
                ? <><Loader2 className="h-4 w-4 animate-spin" />Creating account...</>
                : <><UserPlus className="h-4 w-4" />Create Account</>
              }
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

