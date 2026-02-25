'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            Halal Travels
          </Link>

          <div className="flex gap-6 items-center">
            <Link href="/flights" className="hover:text-primary-600">
              Flights
            </Link>
            <Link href="/packages" className="hover:text-primary-600">
              Packages
            </Link>
            <Link
              href="/login"
              className="border border-primary-600 text-primary-600 px-4 py-2 rounded hover:bg-primary-50"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
