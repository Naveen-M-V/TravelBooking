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
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="sticky top-0 z-50">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" />
      <div className="border-b border-gray-200 bg-white/95 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="group inline-flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 ring-1 ring-teal-200">
                <span className="h-2 w-2 rounded-full bg-teal-600" />
              </span>
              <span className="text-sm font-semibold tracking-[0.22em] uppercase text-gray-800 group-hover:text-gray-900 transition-colors">
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
                      active ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {active && (
                      <span className="absolute inset-0 -z-10 rounded-full bg-gray-100 ring-1 ring-gray-200" />
                    )}
                    {item.label}
                  </Link>
                )
              })}

              <Link
                href="/login"
                className="ml-2 inline-flex items-center justify-center rounded-full bg-teal-600 text-white px-5 py-2 text-sm font-semibold shadow-sm hover:bg-teal-500 transition-colors"
              >
                Login
              </Link>
            </nav>

            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 ring-1 ring-gray-200 text-gray-700"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="container mx-auto px-4 py-4">
                <div className="rounded-2xl bg-gray-50 ring-1 ring-gray-200 p-2">
                {navItems.map((item) => {
                  const active = pathname?.startsWith(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                })}
                <div className="p-2">
                  <Link
                    href="/login"
                    className="flex items-center justify-center rounded-xl bg-teal-600 text-white px-4 py-3 text-sm font-semibold hover:bg-teal-500 transition-colors"
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
