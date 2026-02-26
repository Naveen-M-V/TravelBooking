'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import {
  MessageSquare, Plane, User, CreditCard,
  ArrowRight, Sparkles, CheckCircle2, Clock,
  MapPin, Calendar, Star
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
  { dest: 'Maldives',  country: 'Maldives',   price: 'SAR 6,800', rating: 5.0, nights: '5 nights', seed: 'maldives-pkg' },
  { dest: 'Bali',      country: 'Indonesia',  price: 'SAR 4,100', rating: 4.8, nights: '7 nights', seed: 'bali-pkg' },
  { dest: 'Sarajevo',  country: 'Bosnia',     price: 'SAR 3,400', rating: 4.9, nights: '6 nights', seed: 'sarajevo-pkg' },
]

const colorMap: Record<string, string> = {
  teal:   'bg-teal-500/15   ring-teal-500/20   text-teal-300',
  sky:    'bg-sky-500/15    ring-sky-500/20    text-sky-300',
  violet: 'bg-violet-500/15 ring-violet-500/20 text-violet-300',
  amber:  'bg-amber-500/15  ring-amber-500/20  text-amber-300',
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
          <p className="text-white/40 text-xs font-bold uppercase tracking-[0.18em] mb-1">Dashboard</p>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome back, <span className="text-teal-300">{firstName}</span> 👋
          </h1>
          <p className="text-white/50 mt-1">Here&apos;s what&apos;s happening with your travels.</p>
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
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-teal-500/20 transition-colors"
          >
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${colorMap[color]} mb-4`}>
              <Icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-sm font-medium text-white/70 mt-0.5">{label}</p>
            <p className="text-xs text-white/35 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Quick actions ── */}
      <div>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.18em] mb-4">Quick Actions</p>
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
              className="group flex flex-col items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left hover:border-teal-500/25 hover:bg-teal-500/[0.04] transition-all"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 group-hover:bg-teal-500/15 group-hover:ring-teal-500/20 transition-colors">
                <Icon className="w-4 h-4 text-white/60 group-hover:text-teal-400 transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/85 group-hover:text-white transition-colors">{label}</p>
                <p className="text-xs text-white/35 mt-0.5">{desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all mt-auto self-end" />
            </button>
          ))}
        </div>
      </div>

      {/* ── Two-column lower section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Recent activity */}
        <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-bold text-white">Recent Activity</p>
            <span className="text-xs text-white/35">Last 30 days</span>
          </div>
          <div className="space-y-4">
            {mockActivity.map(({ icon: Icon, color, title, desc, time }, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/80">{title}</p>
                  <p className="text-xs text-white/40 truncate">{desc}</p>
                </div>
                <span className="text-xs text-white/30 flex-shrink-0">{time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended packages */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-bold text-white">Recommended</p>
            <button onClick={() => router.push('/packages')} className="text-xs text-teal-400 hover:text-teal-300 transition-colors">
              View all
            </button>
          </div>
          <div className="space-y-3">
            {mockRecommended.map(({ dest, country, price, rating, nights, seed }) => (
              <button
                key={dest}
                onClick={() => router.push('/packages')}
                className="w-full flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 hover:border-teal-500/20 hover:bg-teal-500/[0.04] transition-all text-left group"
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
                    <span className="text-sm font-semibold text-white/85 truncate">{dest}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {nights}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {rating}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-teal-300">{price}</p>
                  <p className="text-[10px] text-white/30">from</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
