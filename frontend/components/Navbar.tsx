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
  type LucideIcon,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import styles from '@/components/navbars/NavbarDesigns.module.css'

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

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const handleLogout = () => {
    signOut()
    router.push('/')
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

  const authNavItem: NavItem | null = !loading
    ? (user
      ? { href: dashboardHref, label: 'Dashboard', Icon: LayoutDashboard }
      : { href: '/login', label: 'Login', Icon: LogIn })
    : null

  const displayNavItems = authNavItem ? [...navItems, authNavItem] : navItems

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname?.startsWith(href)
  }

  const renderNavStyleOne = () => (
    <nav className={styles.navOne} aria-label="Primary navigation style 1">
      <ul className={styles.navOneList}>
        {displayNavItems.map((item) => {
          const active = isActive(item.href)
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.navOneLink} ${active ? styles.navOneLinkActive : ''}`}
              >
                <item.Icon className={styles.navOneIcon} aria-hidden />
                <span>{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )

  return (
    <header className={`${isHome ? 'absolute top-0' : 'sticky top-0'} inset-x-0 z-50`}>
      <div className="relative overflow-visible">
        {!isHome && (
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.76),rgba(245,240,255,0.60))] border-b border-white/60 backdrop-blur-xl pointer-events-none shadow-[0_8px_32px_rgba(168,228,255,0.22),0_2px_12px_rgba(216,180,254,0.14)]" />
        )}

        <div className={`container mx-auto px-3 sm:px-4 relative z-10 ${isHome ? 'pt-3 sm:pt-4' : ''}`}>
          <div className={`${isHome ? 'min-h-[88px] sm:min-h-[96px]' : 'h-20'} grid grid-cols-[auto,1fr,auto] items-center gap-3 lg:grid-cols-[minmax(220px,260px),1fr,minmax(220px,260px)]`}>
            <Link href="/" className="group inline-flex items-center self-center transition-all hover:scale-[1.02] shrink-0">
              <img
                src="/Halal-Logo-White-BR.svg"
                alt="Halal Travels Club"
                className={`${isHome ? 'h-14 w-40 sm:h-[4.5rem] sm:w-52 md:h-[5rem] md:w-60' : 'h-12 w-36 sm:h-14 sm:w-40'} object-contain object-left group-hover:scale-[1.03] transition-all duration-300`}
                style={{
                  filter:
                    'drop-shadow(0 1px 3px rgba(100,160,210,0.28)) drop-shadow(0 2px 8px rgba(160,120,220,0.14))',
                }}
                loading="eager"
              />
            </Link>

            <div className="hidden lg:flex justify-center min-w-0 px-2 self-center">
              {renderNavStyleOne()}
            </div>

            <div className="hidden lg:flex items-center justify-end gap-2 shrink-0 self-center min-h-[44px]">
              {!loading && user && (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/58 text-cyan-600 px-4 py-2 text-sm font-medium hover:bg-white/80 transition-colors backdrop-blur-sm border border-white/70 shadow-[0_4px_14px_rgba(48,201,211,0.22)]"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              )}
            </div>

            <div className="flex justify-end lg:hidden">
              <button
                type="button"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/60 backdrop-blur-xl text-cyan-600 hover:bg-white/80 transition-colors ring-1 ring-white/72 shadow-[0_4px_14px_rgba(48,201,211,0.22),0_1px_6px_rgba(216,180,254,0.16)]"
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10">
            <div className="container mx-auto px-4 py-4">
              <div className="rounded-2xl bg-[linear-gradient(145deg,rgba(255,255,255,0.9),rgba(248,240,255,0.82))] backdrop-blur-2xl ring-1 ring-white/70 p-2 shadow-[0_18px_44px_rgba(168,228,255,0.28),0_4px_18px_rgba(216,180,254,0.18)]">
                {displayNavItems.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between rounded-xl px-5 py-4 text-base font-medium transition-colors ${
                        active ? 'bg-white/80 text-cyan-700 ring-1 ring-white/80 shadow-[0_3px_14px_rgba(48,201,211,0.28)]' : 'text-cyan-600 hover:bg-white/75 hover:text-cyan-700'
                      }`}
                    >
                      <span className="inline-flex items-center gap-2.5">
                        <item.Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </span>
                    </Link>
                  )
                })}
                <div className="p-2 flex flex-col gap-3">
                  {!loading && user && (
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 rounded-xl bg-white/70 text-cyan-700 px-4 py-3 text-sm font-semibold hover:bg-white transition-colors backdrop-blur-sm border border-cyan-300/50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
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
