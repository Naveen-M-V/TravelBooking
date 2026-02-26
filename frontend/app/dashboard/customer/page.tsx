'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import {
  MessageSquare, Plane, User, CreditCard,
  ArrowRight, Sparkles, CheckCircle2, Clock,
  MapPin, Calendar
} from 'lucide-react'

const mockStats = [
  { label: 'Package Enquiries', value: '3', sub: '1 awaiting quote',    icon: MessageSquare, color: 'teal' },
  { label: 'Flight Bookings',   value: '2', sub: 'Next: Mar 15, 2026',  icon: Plane,         color: 'sky' },
  { label: 'Total Spent',       value: 'SAR 12,400', sub: 'Lifetime',   icon: CreditCard,    color: 'violet' },
  { label: 'Profile',           value: '80%',  sub: 'Complete your profile', icon: User,     color: 'amber' },
]

const mockActivity = [
  { icon: CheckCircle2, color: 'text-emerald-400', title: 'Enquiry confirmed', desc: 'Makkah & Madinah Spiritual Journey', time: '2 days ago' },
  { icon: Plane,        color: 'text-sky-400',     title: 'Flight booked',     desc: 'DXB → KUL · Mar 15, Economy',       time: '5 days ago' },
  { icon: Clock,        color: 'text-amber-400',   title: 'Quote received',    desc: 'Istanbul Heritage Package',          time: '1 week ago' },
  { icon: CheckCircle2, color: 'text-emerald-400', title: 'Payment completed', desc: 'SAR 4,200 — Istanbul Package',       time: '1 week ago' },
]

const mockRecommended = [
  { dest: 'Maldives',  country: 'Maldives',   price: 'SAR 6,800', nights: '5 nights', seed: 'maldives-pkg' },
  { dest: 'Bali',      country: 'Indonesia',  price: 'SAR 4,100', nights: '7 nights', seed: 'bali-pkg' },
  { dest: 'Sarajevo',  country: 'Bosnia',     price: 'SAR 3,400', nights: '6 nights', seed: 'sarajevo-pkg' },
]

const colorMap: Record<string, string> = {
  teal:   'bg-teal-100   ring-teal-300   text-teal-600',
  sky:    'bg-sky-100    ring-sky-300    text-sky-600',
  violet: 'bg-violet-100 ring-violet-300 text-violet-600',
  amber:  'bg-amber-100  ring-amber-300  text-amber-600',
}

export default function CustomerDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [loading, user, router])

  if (loading || !user) return null

  const firstName = user.firstName || user.email.split('@')[0]

  return (
    <div className="max-w-6xl space-y-8">

      {/* ── Welcome header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.18em] mb-1">Dashboard</p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back, <span className="text-teal-600">{firstName}</span>
          </h1>
          <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with your travels.</p>
        </div>
        <button
          onClick={() => router.push('/packages')}
          className="hidden sm:inline-flex items-center gap-2 rounded-full bg-teal-500 text-white px-5 py-2.5 text-sm font-semibold hover:bg-teal-400 transition-colors flex-shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          Explore Packages
        </button>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {mockStats.map(({ label, value, sub, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 hover:border-teal-400/50 hover:shadow-md transition-all"
          >
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${colorMap[color]} mb-4`}>
              <Icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm font-medium text-gray-600 mt-0.5">{label}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Quick actions ── */}
      <div>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.18em] mb-4">Quick Actions</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'My Enquiries',    href: '/dashboard/customer/enquiries', icon: MessageSquare, desc: 'Track package quotes' },
            { label: 'Flight Bookings', href: '/dashboard/customer/bookings',  icon: Plane,         desc: 'View & manage flights' },
            { label: 'Payments',        href: '/dashboard/customer/payments',  icon: CreditCard,    desc: 'History & receipts' },
            { label: 'My Profile',      href: '/dashboard/customer/profile',   icon: User,          desc: 'Update your details' },
          ].map(({ label, href, icon: Icon, desc }) => (
            <button
              key={href}
              onClick={() => router.push(href)}
              className="group flex flex-col items-start gap-3 rounded-2xl border border-gray-200 bg-white shadow-sm p-5 text-left hover:border-teal-400/50 hover:bg-teal-50/50 transition-all"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 ring-1 ring-gray-200 group-hover:bg-teal-100 group-hover:ring-teal-300 transition-colors">
                <Icon className="w-4 h-4 text-gray-500 group-hover:text-teal-600 transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all mt-auto self-end" />
            </button>
          ))}
        </div>
      </div>

      {/* ── Two-column lower section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Recent activity */}
        <div className="lg:col-span-3 rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-bold text-gray-900">Recent Activity</p>
            <span className="text-xs text-gray-400">Last 30 days</span>
          </div>
          <div className="space-y-4">
            {mockActivity.map(({ icon: Icon, color, title, desc, time }, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700">{title}</p>
                  <p className="text-xs text-gray-400 truncate">{desc}</p>
                </div>
                <span className="text-xs text-gray-300 flex-shrink-0">{time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended packages */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-bold text-gray-900">Recommended</p>
            <button onClick={() => router.push('/packages')} className="text-xs text-teal-600 hover:text-teal-500 transition-colors">
              View all
            </button>
          </div>
          <div className="space-y-3">
            {mockRecommended.map(({ dest, country, price, nights, seed }) => (
              <button
                key={dest}
                onClick={() => router.push('/packages')}
                className="w-full flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 hover:border-teal-300 hover:bg-teal-50/30 transition-all text-left group"
              >
                <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={`https://picsum.photos/seed/${seed}/100/100`}
                    alt={dest}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <MapPin className="w-3 h-3 text-teal-400 flex-shrink-0" />
                    <span className="text-sm font-semibold text-gray-700 truncate">{dest}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {nights}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-teal-600">{price}</p>
                  <p className="text-[10px] text-gray-400">from</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
