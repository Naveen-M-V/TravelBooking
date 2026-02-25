'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, Plane, User, CreditCard, ArrowRight } from 'lucide-react'

export default function CustomerDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [loading, user])

  if (loading || !user) return null

  const cards = [
    {
      title: 'Package Enquiries',
      description: 'View your package enquiries, check quotes and proceed to payment.',
      icon: <MessageSquare className="w-8 h-8 text-primary" />,
      href: '/dashboard/customer/enquiries',
      count: null,
    },
    {
      title: 'Flight Bookings',
      description: 'View and manage your flight bookings.',
      icon: <Plane className="w-8 h-8 text-blue-500" />,
      href: '/dashboard/customer/bookings',
      count: null,
    },
    {
      title: 'Profile',
      description: 'Update your personal information and preferences.',
      icon: <User className="w-8 h-8 text-gray-500" />,
      href: '/dashboard/customer/profile',
      count: null,
    },
    {
      title: 'Payment History',
      description: 'Review past payments and download receipts.',
      icon: <CreditCard className="w-8 h-8 text-green-500" />,
      href: '/dashboard/customer/payments',
      count: null,
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.firstName || user.email}!
        </h1>
        <p className="text-gray-500 mt-1">Manage your bookings and enquiries from here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Card
            key={card.href}
            className="cursor-pointer hover:shadow-md transition-shadow group"
            onClick={() => router.push(card.href)}
          >
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 bg-gray-50 rounded-xl flex-shrink-0">{card.icon}</div>
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

