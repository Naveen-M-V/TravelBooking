'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { couponsAPI } from '@/lib/api/coupons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, X, Save, Loader2, Tag, ToggleLeft, ToggleRight, Copy, Check } from 'lucide-react'

const EMPTY_FORM = {
  code: '', description: '',
  type: 'BOTH',           // PACKAGE | FLIGHT | BOTH
  discountType: 'PERCENT', // PERCENT | FIXED
  discountValue: '',
  minOrderValue: '', maxDiscount: '',
  usageLimit: '', perUserLimit: '1',
  isActive: true,
  validFrom: new Date().toISOString().split('T')[0],
  validUntil: '',
}

type FormState = typeof EMPTY_FORM

const TYPE_LABELS: Record<string, string> = { PACKAGE: 'Packages', FLIGHT: 'Flights', BOTH: 'Flights & Packages' }
const TYPE_COLORS: Record<string, string> = {
  PACKAGE: 'bg-orange-100 text-orange-800',
  FLIGHT: 'bg-blue-100 text-blue-800',
  BOTH: 'bg-teal-100 text-teal-800',
}

export default function AdminCouponsPage() {
  const { user, loading: authLoading, isAdmin } = useAuth()
  const router = useRouter()

  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin) { router.push('/login'); return }
      load()
    }
  }, [authLoading, user, isAdmin])

  const load = async () => {
    setLoading(true)
    try {
      const res = await couponsAPI.getAll()
      setCoupons(res.coupons || [])
    } catch { setCoupons([]) }
    finally { setLoading(false) }
  }

  const setField = (k: keyof FormState, v: any) => setForm(f => ({ ...f, [k]: v }))

  const openNew = () => {
    setForm({ ...EMPTY_FORM, validFrom: new Date().toISOString().split('T')[0] })
    setEditingId(null); setShowForm(true)
  }

  const openEdit = (c: any) => {
    setForm({
      code: c.code ?? '',
      description: c.description ?? '',
      type: c.type ?? 'BOTH',
      discountType: c.discountType ?? 'PERCENT',
      discountValue: String(c.discountValue ?? ''),
      minOrderValue: String(c.minOrderValue ?? ''),
      maxDiscount: String(c.maxDiscount ?? ''),
      usageLimit: String(c.usageLimit ?? ''),
      perUserLimit: String(c.perUserLimit ?? 1),
      isActive: c.isActive ?? true,
      validFrom: c.validFrom ? c.validFrom.split('T')[0] : new Date().toISOString().split('T')[0],
      validUntil: c.validUntil ? c.validUntil.split('T')[0] : '',
    })
    setEditingId(c.id); setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeForm = () => { setShowForm(false); setEditingId(null) }

  const handleSave = async () => {
    if (!form.code || !form.discountValue) {
      alert('Coupon code and discount value are required')
      return
    }
    setSaving(true)
    try {
      const payload: any = {
        code: form.code.trim().toUpperCase(),
        description: form.description,
        type: form.type,
        discountType: form.discountType,
        discountValue: parseFloat(form.discountValue),
        isActive: form.isActive,
        validFrom: form.validFrom ? new Date(form.validFrom) : undefined,
        validUntil: form.validUntil ? new Date(form.validUntil) : null,
        perUserLimit: parseInt(form.perUserLimit) || 1,
      }
      if (form.minOrderValue) payload.minOrderValue = parseFloat(form.minOrderValue)
      if (form.maxDiscount) payload.maxDiscount = parseFloat(form.maxDiscount)
      if (form.usageLimit) payload.usageLimit = parseInt(form.usageLimit)

      if (editingId) {
        await couponsAPI.update(editingId, payload)
      } else {
        await couponsAPI.create(payload)
      }
      await load(); closeForm()
    } catch (e: any) {
      const msg = e.response?.data?.error || 'Failed to save'
      alert(msg)
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return
    setDeleting(id)
    try {
      await couponsAPI.delete(id)
      setCoupons(c => c.filter(x => x.id !== id))
    } catch { alert('Failed to delete') }
    finally { setDeleting(null) }
  }

  const handleToggleActive = async (c: any) => {
    try {
      await couponsAPI.update(c.id, { isActive: !c.isActive })
      setCoupons(prev => prev.map(x => x.id === c.id ? { ...x, isActive: !x.isActive } : x))
    } catch { alert('Failed to update') }
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 1500)
  }

  const filtered = filterType === 'all' ? coupons : coupons.filter(c => c.type === filterType)

  const isExpired = (c: any) => c.validUntil && new Date(c.validUntil) < new Date()
  const isExhausted = (c: any) => c.usageLimit && c.usageCount >= c.usageLimit

  if (authLoading || !user) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-sm text-gray-500 mt-0.5">{coupons.length} coupon{coupons.length !== 1 ? 's' : ''} total</p>
        </div>
        <Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" /> Create Coupon</Button>
      </div>

      {/* ── Form ─────────────────────────────────────────── */}
      {showForm && (
        <Card className="border-teal-200 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">{editingId ? 'Edit Coupon' : 'New Coupon'}</CardTitle>
            <button onClick={closeForm} className="p-1 rounded hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Code + Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Coupon Code *</Label>
                <Input
                  placeholder="e.g. SUMMER25"
                  value={form.code}
                  onChange={e => setField('code', e.target.value.toUpperCase())}
                  className="font-mono tracking-widest uppercase"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Input placeholder="e.g. 25% off packages" value={form.description} onChange={e => setField('description', e.target.value)} />
              </div>
            </div>

            {/* Type + Discount */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Applies To</Label>
                <Select value={form.type} onValueChange={v => setField('type', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BOTH">Flights &amp; Packages</SelectItem>
                    <SelectItem value="PACKAGE">Packages Only</SelectItem>
                    <SelectItem value="FLIGHT">Flights Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Discount Type</Label>
                <Select value={form.discountType} onValueChange={v => setField('discountType', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENT">Percentage (%)</SelectItem>
                    <SelectItem value="FIXED">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Discount Value *</Label>
                <div className="relative">
                  <Input
                    type="number" min="0"
                    placeholder={form.discountType === 'PERCENT' ? '25' : '100'}
                    value={form.discountValue}
                    onChange={e => setField('discountValue', e.target.value)}
                    className="pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    {form.discountType === 'PERCENT' ? '%' : 'SAR'}
                  </span>
                </div>
              </div>
            </div>

            {/* Limits */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label>Min Order Value</Label>
                <Input type="number" min="0" placeholder="0" value={form.minOrderValue} onChange={e => setField('minOrderValue', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Max Discount <span className="text-gray-400 font-normal text-xs">(% coupons)</span></Label>
                <Input type="number" min="0" placeholder="No cap" value={form.maxDiscount} onChange={e => setField('maxDiscount', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Total Usage Limit</Label>
                <Input type="number" min="1" placeholder="Unlimited" value={form.usageLimit} onChange={e => setField('usageLimit', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Per User Limit</Label>
                <Input type="number" min="1" placeholder="1" value={form.perUserLimit} onChange={e => setField('perUserLimit', e.target.value)} />
              </div>
            </div>

            {/* Validity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Valid From</Label>
                <Input type="date" value={form.validFrom} onChange={e => setField('validFrom', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Valid Until <span className="text-gray-400 font-normal text-xs">(leave blank = no expiry)</span></Label>
                <Input type="date" value={form.validUntil} onChange={e => setField('validUntil', e.target.value)} />
              </div>
              <div className="flex items-end pb-0.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e => setField('isActive', e.target.checked)} className="w-4 h-4 accent-teal-600" />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editingId ? 'Save Changes' : 'Create Coupon'}
              </Button>
              <Button variant="outline" onClick={closeForm}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Filter ───────────────────────────────────────── */}
      <div className="flex gap-2">
        {['all', 'BOTH', 'PACKAGE', 'FLIGHT'].map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filterType === t ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300'
            }`}
          >
            {t === 'all' ? 'All' : TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {/* ── Coupon List ───────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading coupons…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No coupons yet</p>
          <p className="text-sm">Click "Create Coupon" to add your first discount code.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(c => {
            const expired = isExpired(c)
            const exhausted = isExhausted(c)
            const status = !c.isActive ? 'Inactive' : expired ? 'Expired' : exhausted ? 'Exhausted' : 'Active'
            const statusColor = status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'

            return (
              <Card key={c.id} className={`transition-all ${!c.isActive || expired || exhausted ? 'opacity-70' : ''}`}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-lg tracking-widest text-gray-900">{c.code}</span>
                      <button onClick={() => copyCode(c.code)} className="text-gray-400 hover:text-teal-600 transition-colors" title="Copy code">
                        {copied === c.code ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => handleToggleActive(c)} title={c.isActive ? 'Deactivate' : 'Activate'} className="p-1.5 rounded hover:bg-gray-100">
                        {c.isActive ? <ToggleRight className="w-5 h-5 text-teal-600" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                      </button>
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded hover:bg-teal-50 text-gray-400 hover:text-teal-700">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(c.id, c.code)} disabled={deleting === c.id} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600">
                        {deleting === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {c.description && <p className="text-sm text-gray-500">{c.description}</p>}

                  <div className="flex flex-wrap gap-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor}`}>{status}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[c.type] || ''}`}>{TYPE_LABELS[c.type] || c.type}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-800">
                      {c.discountType === 'PERCENT' ? `${c.discountValue}% off` : `${c.discountValue} SAR off`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500 pt-1">
                    {c.minOrderValue && <span>Min order: {c.minOrderValue}</span>}
                    {c.maxDiscount && <span>Max discount: {c.maxDiscount}</span>}
                    <span>Uses: {c.usageCount}{c.usageLimit ? ` / ${c.usageLimit}` : ' / ∞'}</span>
                    <span>Per user: {c.perUserLimit}</span>
                    {c.validFrom && <span>From: {new Date(c.validFrom).toLocaleDateString()}</span>}
                    {c.validUntil && <span className={expired ? 'text-red-500' : ''}>Until: {new Date(c.validUntil).toLocaleDateString()}</span>}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
