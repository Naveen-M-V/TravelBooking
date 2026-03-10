'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X, LayoutDashboard, LogOut, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const handleLogout = () => {
    signOut()
    router.push('/')
  }

  const dashboardHref = user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/customer'

  const navItems = [
    { href: '/flights', label: 'Flights' },
    { href: '/packages', label: 'Packages' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="sticky top-0 z-50">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/60 to-transparent animate-pulse" />
      <div className="border-b border-teal-700/30 bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-600 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 via-cyan-400/20 to-teal-400/20 animate-shimmer" />
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="group inline-flex items-center transition-all hover:scale-110">
              <img src="/htc%20logo.png" alt="Halal Travels Club" className="h-10 w-24 sm:h-12 sm:w-32 object-contain filter brightness-0 invert drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] transition-all duration-300" loading="eager" />
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const active = pathname?.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 hover:scale-105 ${
                      active ? 'text-white' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {active && (
                      <span className="absolute inset-0 -z-10 rounded-full bg-white/20 ring-2 ring-white/30 shadow-lg" />
                    )}
                    {item.label}
                  </Link>
                )
              })}

              {!loading && (
                user ? (
                  <div className="ml-2 flex items-center gap-2">
                    <Link
                      href={dashboardHref}
                      className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 text-teal-700 px-4 py-2 text-sm font-medium shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      {user.firstName || 'Dashboard'}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/20 text-white px-4 py-2 text-sm font-medium hover:bg-white/30 transition-colors backdrop-blur-sm"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="ml-2 inline-flex items-center justify-center rounded-full bg-gray-50 text-teal-700 px-5 py-2 text-sm font-semibold shadow-lg hover:bg-gray-100 hover:scale-105 hover:shadow-xl transition-all duration-300"
                  >
                    Login
                  </Link>
                )
              )}
            </nav>

            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-white/10">
            <div className="container mx-auto px-4 py-4">
                <div className="rounded-2xl bg-white/10 backdrop-blur-xl ring-1 ring-white/20 p-2">
                {navItems.map((item) => {
                  const active = pathname?.startsWith(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between rounded-xl px-5 py-4 text-base font-medium transition-colors ${
                        active ? 'bg-white/20 text-white ring-1 ring-white/30' : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                })}
                <div className="p-2 flex flex-col gap-3">
                  {!loading && (
                    user ? (
                      <>
                        <Link
                          href={dashboardHref}
                          className="flex items-center gap-2 rounded-xl bg-white text-teal-700 px-4 py-3 text-sm font-semibold shadow-lg hover:bg-gray-50 transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          {user.firstName ? `${user.firstName}'s Dashboard` : 'Dashboard'}
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 rounded-xl bg-white/20 text-white px-4 py-3 text-sm font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/login"
                        className="flex items-center justify-center rounded-xl bg-white text-teal-700 px-4 py-3 text-sm font-semibold shadow-lg hover:bg-gray-50 transition-colors"
                      >
                        Login
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
