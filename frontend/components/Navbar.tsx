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

type NavVariant = 'style1' | 'style2'

interface NavItem {
  href: string
  label: string
  Icon: LucideIcon
  hue: number
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [navVariant, setNavVariant] = useState<NavVariant>('style2')

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('htc_nav_variant') as NavVariant | null
      if (saved === 'style1' || saved === 'style2') setNavVariant(saved)
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('htc_nav_variant', navVariant)
    } catch {}
  }, [navVariant])

  const handleLogout = () => {
    signOut()
    router.push('/')
  }

  const toggleNavVariant = () => {
    setNavVariant((prev) => (prev === 'style2' ? 'style1' : 'style2'))
  }

  const dashboardHref = user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/customer'
  const isHome = pathname === '/'

  const navItems: NavItem[] = [
    { href: '/', label: 'Home', Icon: Home, hue: 190 },
    { href: '/flights', label: 'Flights', Icon: PlaneTakeoff, hue: 250 },
    { href: '/packages', label: 'Packages', Icon: Briefcase, hue: 320 },
    { href: '/about', label: 'About', Icon: Sparkles, hue: 35 },
    { href: '/contact', label: 'Contact', Icon: MessageCircle, hue: 155 },
  ]

  const authNavItem: NavItem | null = !loading
    ? (user
      ? { href: dashboardHref, label: 'Dashboard', Icon: LayoutDashboard, hue: 120 }
      : { href: '/login', label: 'Login', Icon: LogIn, hue: 46 })
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

  const renderNavStyleTwo = () => (
    <nav className={styles.navTwo} aria-label="Primary navigation style 2">
      {displayNavItems.map((item) => {
        const active = isActive(item.href)
        const hueStyle = { ['--hue' as string]: `${item.hue}deg` }
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navTwoItem} ${active ? styles.navTwoItemActive : ''}`}
            style={hueStyle}
          >
            <span className={styles.iconWrap}>
              <span className={`${styles.iconLayer} ${styles.iconGlow}`} aria-hidden>
                <item.Icon className={styles.iconSvg} />
              </span>
              <span className={`${styles.iconLayer} ${styles.iconPrimary}`} aria-hidden>
                <item.Icon className={styles.iconSvg} />
              </span>
            </span>
            <span className={styles.itemLabel}>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )

  return (
    <header className={`${isHome ? 'absolute top-3 sm:top-4' : 'sticky top-0'} inset-x-0 z-50`}>
      <div className="relative overflow-visible">
        {!isHome && (
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.76),rgba(245,240,255,0.60))] border-b border-white/60 backdrop-blur-xl pointer-events-none shadow-[0_8px_32px_rgba(168,228,255,0.22),0_2px_12px_rgba(216,180,254,0.14)]" />
        )}

        <div className="container mx-auto px-3 sm:px-4 relative z-10">
          <div className={`flex ${isHome ? 'h-24 items-start pt-3' : 'h-20 items-center'} justify-between gap-3`}>
            <Link href="/" className={`group inline-flex items-center transition-all hover:scale-[1.02] shrink-0 ${isHome ? 'ml-0 sm:-ml-1 mt-1' : 'ml-0 mt-0'}`}>
              <img
                src="/Halal-Logo-White-BR.svg"
                alt="Halal Travels Club"
                className={`${isHome ? 'h-16 w-44 sm:h-20 sm:w-52 md:h-[5.3rem] md:w-60' : 'h-12 w-36 sm:h-14 sm:w-40'} object-contain group-hover:scale-[1.03] transition-all duration-300`}
                style={{
                  filter:
                    'drop-shadow(0 1px 3px rgba(100,160,210,0.28)) drop-shadow(0 2px 8px rgba(160,120,220,0.14))',
                }}
                loading="eager"
              />
            </Link>

            <div className="hidden lg:flex flex-1 justify-center min-w-0 px-2">
              {navVariant === 'style2' ? renderNavStyleTwo() : renderNavStyleOne()}
            </div>

            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={toggleNavVariant}
                className="inline-flex items-center justify-center rounded-full border border-white/72 bg-white/58 backdrop-blur-xl text-sky-600 px-3 py-2 text-xs font-bold uppercase tracking-wide hover:bg-white/80 transition-colors shadow-[0_8px_22px_rgba(168,228,255,0.28),0_2px_10px_rgba(216,180,254,0.18)]"
              >
                {navVariant === 'style2' ? 'Switch: Navbar 1' : 'Switch: Navbar 2'}
              </button>

              {!loading && user && (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/58 text-sky-600 px-4 py-2 text-sm font-medium hover:bg-white/80 transition-colors backdrop-blur-sm border border-white/70 shadow-[0_4px_14px_rgba(168,228,255,0.22)]"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              )}
            </div>

            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/60 backdrop-blur-xl text-sky-600 hover:bg-white/80 transition-colors ring-1 ring-white/72 shadow-[0_4px_14px_rgba(168,228,255,0.22),0_1px_6px_rgba(216,180,254,0.16)]"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10">
            <div className="container mx-auto px-4 py-4">
              <div className="rounded-2xl bg-[linear-gradient(145deg,rgba(255,255,255,0.9),rgba(248,240,255,0.82))] backdrop-blur-2xl ring-1 ring-white/70 p-2 shadow-[0_18px_44px_rgba(168,228,255,0.28),0_4px_18px_rgba(216,180,254,0.18)]">
                <div className="p-2 pb-3">
                  <button
                    type="button"
                    onClick={toggleNavVariant}
                    className="w-full inline-flex items-center justify-center rounded-xl border border-white/75 bg-white/70 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-sky-600 hover:bg-white transition-colors shadow-[0_3px_12px_rgba(168,228,255,0.22)]"
                  >
                    {navVariant === 'style2' ? 'Use Navbar 1 Style' : 'Use Navbar 2 Style'}
                  </button>
                </div>

                {displayNavItems.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between rounded-xl px-5 py-4 text-base font-medium transition-colors ${
                        active ? 'bg-white/80 text-sky-700 ring-1 ring-white/80 shadow-[0_3px_14px_rgba(168,228,255,0.28)]' : 'text-sky-600 hover:bg-white/75 hover:text-sky-700'
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
