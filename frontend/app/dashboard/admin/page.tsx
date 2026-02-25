'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { MessageSquare, Users, Package, BarChart2, ArrowRight } from 'lucide-react'

export default function AdminDashboard() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push('/login')
  }, [loading, user, isAdmin])

  if (loading || !user) return null

  const cards = [
    {
      title: 'Package Enquiries',
      description: 'Review customer enquiries, send price quotes and track bookings.',
      icon: <MessageSquare className="w-8 h-8 text-primary" />,
      href: '/dashboard/admin/enquiries',
      highlight: true,
    },
    {
      title: 'Users',
      description: 'Manage all registered customers and vendors.',
      icon: <Users className="w-8 h-8 text-blue-500" />,
      href: '/dashboard/admin/users',
    },
    {
      title: 'Packages',
      description: 'Manage holiday packages and pricing.',
      icon: <Package className="w-8 h-8 text-orange-500" />,
      href: '/dashboard/admin/packages',
    },
    {
      title: 'Reports',
      description: 'View system reports and analytics.',
      icon: <BarChart2 className="w-8 h-8 text-green-500" />,
      href: '/dashboard/admin/reports',
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage the Halal Travels platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Card
            key={card.href}
            className={`cursor-pointer hover:shadow-md transition-shadow group ${card.highlight ? 'border-primary/30 bg-primary-50/30' : ''}`}
            onClick={() => router.push(card.href)}
          >
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm flex-shrink-0">{card.icon}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{card.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{card.description}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

