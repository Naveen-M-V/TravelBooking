'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  LayoutDashboard, MessageSquare, Plane, User, LogOut,
  Package, Users, BarChart2, CreditCard, ChevronRight
} from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = () => {
    signOut()
    router.push('/')
  }

  const adminLinks = [
    { href: '/dashboard/admin',            label: 'Overview',   icon: LayoutDashboard },
    { href: '/dashboard/admin/enquiries',  label: 'Enquiries',  icon: MessageSquare },
    { href: '/dashboard/admin/packages',   label: 'Packages',   icon: Package },
    { href: '/dashboard/admin/users',      label: 'Users',      icon: Users },
    { href: '/dashboard/admin/reports',    label: 'Reports',    icon: BarChart2 },
  ]

  const customerLinks = [
    { href: '/dashboard/customer',              label: 'Overview',      icon: LayoutDashboard },
    { href: '/dashboard/customer/enquiries',    label: 'My Enquiries',  icon: MessageSquare },
    { href: '/dashboard/customer/bookings',     label: 'Flights',       icon: Plane },
    { href: '/dashboard/customer/payments',     label: 'Payments',      icon: CreditCard },
    { href: '/dashboard/customer/profile',      label: 'Profile',       icon: User },
  ]

  const links = isAdmin ? adminLinks : customerLinks
  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : (user?.email?.[0] ?? 'U').toUpperCase()

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" />

      <div className="flex">
        {/* ── Sidebar ── */}
        <aside className="w-64 min-h-screen bg-slate-900/60 border-r border-white/[0.07] flex flex-col backdrop-blur-xl">

          {/* Brand */}
          <div className="px-5 py-6 border-b border-white/[0.07]">
            <button onClick={() => router.push('/')} className="inline-flex items-center gap-2 group">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                <span className="h-2 w-2 rounded-full bg-teal-400" />
              </span>
              <span className="text-xs font-bold tracking-[0.22em] uppercase text-white/80 group-hover:text-white transition-colors">
                Halal Travels
              </span>
            </button>
          </div>

          {/* User chip */}
          <div className="px-4 py-4 border-b border-white/[0.07]">
            <div className="flex items-center gap-3 rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-3">
              <div className="h-9 w-9 rounded-full bg-teal-500/20 ring-1 ring-teal-400/30 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-teal-300">{initials}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : user?.email}
                </p>
                <p className="text-[10px] font-medium text-white/40 uppercase tracking-[0.14em]">
                  {isAdmin ? 'Administrator' : 'Customer'}
                </p>
              </div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-3 py-4 space-y-0.5">
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
              {isAdmin ? 'Admin Panel' : 'My Account'}
            </p>
            {links.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <button
                  key={href}
                  onClick={() => router.push(href)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-500/15 text-teal-300 ring-1 ring-teal-500/20'
                      : 'text-white/55 hover:bg-white/5 hover:text-white/90'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-teal-400" />}
                </button>
              )
            })}
          </nav>

          {/* Sign out */}
          <div className="px-3 pb-6 border-t border-white/[0.07] pt-4">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 p-8 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
