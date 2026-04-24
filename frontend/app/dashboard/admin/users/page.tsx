'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { authAPI } from '@/lib/api/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Loader2, Users, AlertCircle, RefreshCw, Search, CheckCircle, XCircle, ShieldCheck } from 'lucide-react'

const ROLE_COLORS: Record<string, string> = {
  admin:    'bg-purple-100 text-purple-800',
  vendor:   'bg-blue-100 text-blue-800',
  customer: 'bg-gray-100 text-gray-700',
}

const TRAVEL_AGENT_COLORS = 'bg-teal-100 text-teal-800'

export default function AdminUsersPage() {
  const { user, loading: authLoading, isAdmin } = useAuth()
  const router = useRouter()

  const [users, setUsers]         = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const [search, setSearch]       = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [agentFilter, setAgentFilter] = useState('all')
  const [updating, setUpdating]   = useState<string | null>(null)
  const [updateMsg, setUpdateMsg] = useState<{ id: string; ok: boolean; text: string } | null>(null)
  const [total, setTotal]         = useState(0)

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin) { router.push('/login'); return }
      load()
    }
  }, [authLoading, user, isAdmin])

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const params: any = {}
      if (roleFilter !== 'all') params.role = roleFilter
      const res = await authAPI.listUsers(params)
      setUsers(res.users || [])
      setTotal(res.total ?? (res.users?.length ?? 0))
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && user && isAdmin) load()
  }, [roleFilter]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (userId === user?.id && newRole !== 'admin') {
      alert('You cannot remove your own admin role.')
      return
    }
    setUpdating(userId)
    setUpdateMsg(null)
    try {
      await authAPI.updateUserRole(userId, newRole)
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
      setUpdateMsg({ id: userId, ok: true, text: 'Role updated' })
    } catch (err: any) {
      setUpdateMsg({ id: userId, ok: false, text: err.response?.data?.error || 'Failed to update role' })
    } finally {
      setUpdating(null)
      setTimeout(() => setUpdateMsg(null), 3000)
    }
  }

  const filtered = users.filter(u =>
    search === '' ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    `${u.firstName ?? ''} ${u.lastName ?? ''}`.toLowerCase().includes(search.toLowerCase())
  ).filter(u => {
    if (agentFilter === 'all') return true
    if (agentFilter === 'travel') return Boolean(u.isTravelAgent)
    if (agentFilter === 'non-travel') return !u.isTravelAgent
    return true
  })

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1">{total} registered users</p>
        </div>
        <Button onClick={load} variant="outline" size="sm" disabled={loading} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[160px] h-10">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="customer">Customers</SelectItem>
            <SelectItem value="vendor">Vendors</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>
        <Select value={agentFilter} onValueChange={setAgentFilter}>
          <SelectTrigger className="w-[190px] h-10">
            <SelectValue placeholder="Travel agent filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="travel">Travel Agents</SelectItem>
            <SelectItem value="non-travel">Non-Travel Agents</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600 mr-3" />
          <span className="text-gray-500">Loading users…</span>
        </div>
      ) : (
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-700 flex items-center gap-2">
              <Users className="h-4 w-4" />
              {filtered.length} {search ? 'matching' : 'total'} users
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>No users found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filtered.map(u => (
                  <div key={u.id} className="flex items-center gap-4 px-6 py-4">
                    {/* Avatar */}
                    <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-teal-700">
                        {(u.firstName?.[0] ?? u.email[0]).toUpperCase()}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {u.firstName || u.lastName
                            ? `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim()
                            : '—'}
                        </p>
                        <Badge className={`text-xs ${ROLE_COLORS[u.role] ?? 'bg-gray-100 text-gray-700'}`}>
                          {u.role}
                        </Badge>
                        {u.isTravelAgent && (
                          <Badge className={`text-xs ${TRAVEL_AGENT_COLORS}`}>
                            Travel Agent
                          </Badge>
                        )}
                        {u.emailVerified ? (
                          <span title="Email verified" className="text-emerald-500"><CheckCircle className="h-3.5 w-3.5" /></span>
                        ) : (
                          <span title="Email not verified" className="text-amber-400"><XCircle className="h-3.5 w-3.5" /></span>
                        )}
                        {u.id === user?.id && (
                          <span className="text-xs text-gray-400 italic">(you)</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{u.email}</p>
                      {u.isTravelAgent && (u.companyName || u.website) && (
                        <p className="text-xs text-teal-700 mt-0.5 truncate">
                          {u.companyName || 'Travel agent'}{u.website ? ` · ${u.website}` : ''}
                        </p>
                      )}
                      <p className="text-xs text-gray-300 mt-0.5">
                        Joined {new Date(u.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    {/* Role change */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {updateMsg?.id === u.id && updateMsg && (
                        <span className={`text-xs font-medium ${updateMsg.ok ? 'text-emerald-600' : 'text-red-600'}`}>
                          {updateMsg.text}
                        </span>
                      )}
                      {updating === u.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
                      ) : (
                        <Select
                          value={u.role}
                          onValueChange={(newRole) => handleRoleChange(u.id, newRole)}
                        >
                          <SelectTrigger className="w-[120px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="customer">Customer</SelectItem>
                            <SelectItem value="vendor">Vendor</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
