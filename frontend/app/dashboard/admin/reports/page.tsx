'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { BarChart2, Clock } from 'lucide-react'

export default function AdminReportsPage() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push('/login')
  }, [loading, user, isAdmin, router])

  if (loading || !user) return null

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500 mt-1">Platform analytics and reports</p>
      </div>

      <Card className="border-gray-200">
        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-teal-50 ring-2 ring-teal-100 flex items-center justify-center mb-4">
            <BarChart2 className="h-8 w-8 text-teal-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Coming Soon</h2>
          <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
            Analytics dashboards, booking trends, and revenue reports will be available here soon.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm text-gray-400">
            <Clock className="h-4 w-4" />
            <span>Under development</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
