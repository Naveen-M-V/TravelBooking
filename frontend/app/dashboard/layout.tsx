'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard, MessageSquare, Plane, User, LogOut,
  Package, Users, BarChart2, CreditCard
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
    { href: '/dashboard/admin', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/dashboard/admin/enquiries', label: 'Enquiries', icon: <MessageSquare className="w-4 h-4" /> },
    { href: '/dashboard/admin/packages', label: 'Packages', icon: <Package className="w-4 h-4" /> },
    { href: '/dashboard/admin/users', label: 'Users', icon: <Users className="w-4 h-4" /> },
    { href: '/dashboard/admin/reports', label: 'Reports', icon: <BarChart2 className="w-4 h-4" /> },
  ]

  const customerLinks = [
    { href: '/dashboard/customer', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/dashboard/customer/enquiries', label: 'My Enquiries', icon: <MessageSquare className="w-4 h-4" /> },
    { href: '/dashboard/customer/bookings', label: 'Flights', icon: <Plane className="w-4 h-4" /> },
    { href: '/dashboard/customer/payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
    { href: '/dashboard/customer/profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  ]

  const links = isAdmin ? adminLinks : customerLinks

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md min-h-screen p-4 flex flex-col">
          <div className="mb-6 px-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              {isAdmin ? 'Admin Panel' : 'My Account'}
            </p>
            <p className="font-semibold text-gray-900 truncate">
              {user?.firstName || user?.email}
            </p>
          </div>

          <nav className="flex-1 space-y-1">
            {links.map(({ href, label, icon }) => {
              const isActive = pathname === href
              return (
                <button
                  key={href}
                  onClick={() => router.push(href)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {icon}
                  {label}
                </button>
              )
            })}
          </nav>

          <div className="border-t pt-4 mt-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  )
}

