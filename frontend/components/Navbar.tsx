'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Menu,
  X,
  LogOut,
  Home,
  PlaneTakeoff,
  Briefcase,
  Sparkles,
  MessageCircle,
  LayoutDashboard,
  LogIn,
  User,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface NavItem {
  href: string
  label: string
  Icon: LucideIcon
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    signOut()
    router.push('/')
    setUserMenuOpen(false)
  }

  const dashboardHref = user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/customer'
  const isHome = pathname === '/'

  const navItems: NavItem[] = [
    { href: '/', label: 'Home', Icon: Home },
    { href: '/flights', label: 'Flights', Icon: PlaneTakeoff },
    { href: '/packages', label: 'Packages', Icon: Briefcase },
    { href: '/about', label: 'About', Icon: Sparkles },
    { href: '/contact', label: 'Contact', Icon: MessageCircle },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname?.startsWith(href)
  }

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled || !isHome ? 'py-3' : 'py-4 sm:py-5'
      }`}
    >
      {/* Premium floating nav container */}
      <div className="container mx-auto px-4 sm:px-6">
        <div 
          className={`relative mx-auto max-w-5xl rounded-[2rem] sm:rounded-[2.5rem] transition-all duration-500 ${
            scrolled || !isHome
              ? 'bg-white/85 backdrop-blur-xl shadow-[0_8px_40px_rgba(196,154,98,0.15)] ring-1 ring-neutral-200/80'
              : 'bg-white/70 backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.08)] ring-1 ring-white/60'
          }`}
        >
          {/* Solid green border */}
          <div className="absolute -inset-[1px] rounded-[2rem] sm:rounded-[2.5rem] bg-primary-300/60 opacity-0 hover:opacity-100 transition-opacity duration-700" />
          
          {/* Inner glow */}
          <div className="absolute inset-0 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-white/50 via-transparent to-primary-50/30 pointer-events-none" />

          <div className="relative flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
            {/* Logo */}
            <Link 
              href="/" 
              className="group flex items-center gap-2 transition-transform duration-300 hover:scale-[1.02]"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary-400 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                <img
                  src="/Halal-Logo-White-BR.svg"
                  alt="Halal Travels Club"
                  className={`relative object-contain transition-all duration-300 ${
                    scrolled || !isHome ? 'h-8 sm:h-10 w-28 sm:w-36' : 'h-9 sm:h-11 w-32 sm:w-40'
                  }`}
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(196,154,98,0.2))',
                  }}
                  loading="eager"
                />
              </div>
            </Link>

            {/* Desktop Navigation - Premium Pill Style */}
            <nav className="hidden lg:flex items-center">
              <div className="flex items-center gap-1 p-1.5 rounded-full bg-neutral-100/80 ring-1 ring-neutral-200/60">
                {navItems.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                        active
                          ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                          : 'text-neutral-600 hover:text-primary-700 hover:bg-white/80'
                      }`}
                    >
                      <item.Icon className={`h-4 w-4 transition-transform duration-300 ${active ? 'scale-110' : ''}`} />
                      <span>{item.label}</span>
                      {active && (
                        <span className="absolute inset-0 rounded-full bg-primary-500 animate-pulse opacity-20" />
                      )}
                    </Link>
                  )
                })}
              </div>
            </nav>

            {/* Desktop Auth Section */}
            <div className="hidden lg:flex items-center gap-3">
              {!loading && user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-full bg-neutral-100/80 hover:bg-white ring-1 ring-neutral-200/60 hover:ring-primary-300 transition-all duration-300 group"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {(user.firstName?.charAt(0) || user.email.charAt(0)).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-neutral-700 group-hover:text-primary-700">
                      {user.firstName || 'Account'}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] ring-1 ring-neutral-200/80 p-2 animate-in fade-in slide-in-from-top-2">
                      <Link
                        href={dashboardHref}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : !loading ? (
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-500 text-white text-sm font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.02] transition-all duration-300"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
              ) : (
                <div className="h-10 w-24 rounded-full bg-neutral-200/60 animate-pulse" />
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="lg:hidden flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100/80 text-primary-600 hover:bg-white hover:text-primary-700 transition-all duration-300 ring-1 ring-neutral-200/60"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="lg:hidden absolute top-full left-4 right-4 mt-3">
              <div className="rounded-2xl bg-white/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] ring-1 ring-neutral-200/80 p-3">
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => {
                    const active = isActive(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all ${
                          active
                            ? 'bg-primary-500 text-white shadow-md'
                            : 'text-neutral-700 hover:bg-neutral-100 hover:text-primary-700'
                        }`}
                      >
                        <item.Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>

                <div className="mt-3 pt-3 border-t border-neutral-200/60">
                  {!loading && user ? (
                    <div className="flex flex-col gap-1">
                      <Link
                        href={dashboardHref}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      >
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                      </button>
                    </div>
                  ) : !loading ? (
                    <Link
                      href="/login"
                      className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-primary-500 text-white font-semibold shadow-md"
                    >
                      <LogIn className="h-5 w-5" />
                      Sign In
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
