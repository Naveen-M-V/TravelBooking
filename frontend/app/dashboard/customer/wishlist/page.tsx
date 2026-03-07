'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Loader2, MapPin, Trash2, Eye, RefreshCw } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { wishlistAPI } from '@/lib/api/wishlist'
import { Button } from '@/components/ui/button'

export default function CustomerWishlistPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await wishlistAPI.getMine()
      setItems(res.items || [])
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to load wishlist')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }
    if (!authLoading && user) load()
  }, [authLoading, user])

  const removeFromWishlist = async (packageId: string) => {
    setRemovingId(packageId)
    try {
      await wishlistAPI.remove(packageId)
      setItems((prev) => prev.filter((item) => item.packageId !== packageId))
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to remove from wishlist')
    } finally {
      setRemovingId(null)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600 mr-3" />
        <span className="text-gray-600">Loading your wishlist...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-sm text-gray-500 mt-1">Your saved packages in one place.</p>
        </div>
        <Button variant="outline" size="sm" onClick={load}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">No saved packages yet</h2>
          <p className="text-sm text-gray-500 mb-5">Tap the heart icon on any package to save it here.</p>
          <Button onClick={() => router.push('/packages')}>Explore Packages</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => {
            const pkg = item.package || {}
            const image = pkg.coverImage || (Array.isArray(pkg.images) && pkg.images[0]) || 'https://picsum.photos/seed/wishlist/800/600'

            return (
              <div key={item.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <img src={image} alt={pkg.name || 'Package'} className="w-full h-44 object-cover" />
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">{pkg.name || item.packageId}</h3>
                    <p className="text-sm text-gray-500 inline-flex items-center gap-1 mt-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {pkg.destination || pkg.country || 'Destination unavailable'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-teal-700">
                      {pkg.price ? `${Number(pkg.price).toLocaleString()} ${pkg.currency || 'SAR'}` : 'Price on request'}
                    </p>
                    <p className="text-xs text-gray-400">{pkg.duration || ''}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.push(`/packages/${item.packageId}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => removeFromWishlist(item.packageId)}
                      disabled={removingId === item.packageId}
                    >
                      {removingId === item.packageId ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 mr-1" />}
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
