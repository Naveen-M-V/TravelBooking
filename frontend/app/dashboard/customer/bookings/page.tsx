'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plane, Search } from 'lucide-react'

export default function CustomerBookingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [loading, user, router])

  if (loading || !user) return null

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Flights</h1>
        <p className="text-gray-500 mt-1">Your flight bookings will appear here</p>
      </div>

      <Card className="border-gray-200">
        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-sky-50 ring-2 ring-sky-100 flex items-center justify-center mb-4">
            <Plane className="h-8 w-8 text-sky-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No flight bookings yet</h2>
          <p className="text-gray-500 max-w-sm text-sm leading-relaxed mb-6">
            Search for flights and book them to see your trip history here.
          </p>
          <Button onClick={() => router.push('/flights')} className="gap-2 bg-teal-600 hover:bg-teal-500">
            <Search className="h-4 w-4" />
            Search Flights
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
