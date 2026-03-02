'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { authAPI } from '@/lib/api/auth'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, Users, Package, BarChart2, ArrowRight, Tag, Image, UserCircle, TrendingUp, ShieldPlus, Loader2, CheckCircle, X } from 'lucide-react'

export default function AdminDashboard() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push('/login')
  }, [loading, user, isAdmin])

  if (loading || !user) return null

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviting(true); setInviteError(null)
    try {
      await authAPI.inviteAdmin(inviteEmail)
      setInviteSuccess(true)
    } catch (err: any) {
      setInviteError(err.response?.data?.error || 'Failed to send invite')
    } finally {
      setInviting(false)
    }
  }

  const cards = [
    {
      title: 'Enquiries',
      description: 'Review customer enquiries, send price quotes and track bookings.',
      icon: <MessageSquare className="w-8 h-8 text-teal-600" />,
      href: '/dashboard/admin/enquiries',
      highlight: true,
    },
    {
      title: 'Packages',
      description: 'Create, edit and manage all tour packages shown on the site.',
      icon: <Package className="w-8 h-8 text-orange-500" />,
      href: '/dashboard/admin/packages',
    },
    {
      title: 'Coupons',
      description: 'Create discount codes for flights and package bookings.',
      icon: <Tag className="w-8 h-8 text-purple-500" />,
      href: '/dashboard/admin/coupons',
    },
    {
      title: 'Hero Images',
      description: 'Upload and manage the background images on the landing page.',
      icon: <Image className="w-8 h-8 text-sky-500" />,
      href: '/dashboard/admin/hero-images',
    },
    {
      title: 'Flight Markup',
      description: 'Set a profit margin added on top of all flight prices shown to customers.',
      icon: <TrendingUp className="w-8 h-8 text-emerald-600" />,
      href: '/dashboard/admin/flight-markup',
    },
    {
      title: 'Users',
      description: 'Manage all registered customers and vendors.',
      icon: <Users className="w-8 h-8 text-blue-500" />,
      href: '/dashboard/admin/users',
    },
    {
      title: 'Reports',
      description: 'View system reports and analytics.',
      icon: <BarChart2 className="w-8 h-8 text-green-500" />,
      href: '/dashboard/admin/reports',
    },
    {
      title: 'My Profile',
      description: 'Update your name, contact details and password.',
      icon: <UserCircle className="w-8 h-8 text-gray-500" />,
      href: '/dashboard/admin/profile',
    },
  ]

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage the Halal Travels platform</p>
        </div>
        <Button
          onClick={() => { setShowInvite(true); setInviteSuccess(false); setInviteError(null); setInviteEmail('') }}
          className="gap-2 bg-teal-600 hover:bg-teal-500"
        >
          <ShieldPlus className="h-4 w-4" />
          Invite Admin
        </Button>
      </div>

      {/* Invite Admin modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-2xl p-6">
            <button
              onClick={() => setShowInvite(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            {inviteSuccess ? (
              <div className="text-center py-4">
                <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                <h2 className="text-lg font-bold text-gray-900 mb-1">Invite sent!</h2>
                <p className="text-sm text-gray-500">
                  An invite link was emailed to <strong>{inviteEmail}</strong>. They'll set their password using that link.
                </p>
                <Button className="mt-4 w-full" variant="outline" onClick={() => setShowInvite(false)}>Close</Button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center">
                    <ShieldPlus className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Invite Admin</h2>
                    <p className="text-xs text-gray-500">They'll receive an email to set their password.</p>
                  </div>
                </div>

                <form onSubmit={handleInvite} className="space-y-3">
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                  {inviteError && (
                    <p className="text-sm text-red-600">{inviteError}</p>
                  )}
                  <Button type="submit" disabled={inviting} className="w-full h-11 bg-teal-600 hover:bg-teal-500 gap-2">
                    {inviting ? <><Loader2 className="h-4 w-4 animate-spin" /> Sendingâ€¦</> : <><ShieldPlus className="h-4 w-4" /> Send Invite</>}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Card
            key={card.href}
            className={`cursor-pointer hover:shadow-md transition-shadow group ${card.highlight ? 'border-teal-200 bg-teal-50/30' : ''}`}
            onClick={() => router.push(card.href)}
          >
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm flex-shrink-0">{card.icon}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{card.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{card.description}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors flex-shrink-0 mt-0.5" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
