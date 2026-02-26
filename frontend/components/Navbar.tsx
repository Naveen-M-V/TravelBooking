'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const navItems = [
    { href: '/flights', label: 'Flights' },
    { href: '/packages', label: 'Packages' },
  ]

  return (
    <header className="sticky top-0 z-50">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
      <div className="border-b border-white/10 bg-slate-950/45 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="group inline-flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                <span className="h-2 w-2 rounded-full bg-teal-300" />
              </span>
              <span className="text-sm font-semibold tracking-[0.22em] uppercase text-white/90 group-hover:text-white transition-colors">
                Halal Travels
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const active = pathname?.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      active ? 'text-white' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {active && (
                      <span className="absolute inset-0 -z-10 rounded-full bg-white/10 ring-1 ring-white/15" />
                    )}
                    {item.label}
                  </Link>
                )
              })}

              <Link
                href="/login"
                className="ml-2 inline-flex items-center justify-center rounded-full bg-white text-slate-900 px-5 py-2 text-sm font-semibold shadow-sm shadow-black/30 hover:bg-white/90 transition-colors"
              >
                Login
              </Link>
            </nav>

            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 text-white"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-white/10">
            <div className="container mx-auto px-4 py-4">
              <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-2">
                {navItems.map((item) => {
                  const active = pathname?.startsWith(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        active ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                })}
                <div className="p-2">
                  <Link
                    href="/login"
                    className="flex items-center justify-center rounded-xl bg-white text-slate-900 px-4 py-3 text-sm font-semibold"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
