'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { flightMarkupAPI } from '@/lib/api/flightMarkup'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Percent, DollarSign, Plus, Pencil, Trash2, CheckCircle, X, Save, Loader2, AlertCircle, TrendingUp } from 'lucide-react'

const EMPTY_FORM = { name: 'Default Markup', markupType: 'PERCENT' as 'PERCENT' | 'FIXED', markupValue: '', currency: 'SAR', notes: '', isActive: true }
type FormState = typeof EMPTY_FORM

export default function AdminFlightMarkupPage() {
  const { user, loading: authLoading, isAdmin } = useAuth()
  const router = useRouter()

  const [rules, setRules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [activating, setActivating] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin) { router.push('/login'); return }
      load()
    }
  }, [authLoading, user, isAdmin])

  const load = async () => {
    setLoading(true)
    try {
      const res = await flightMarkupAPI.getAll()
      setRules(res.rules || [])
    } catch { setRules([]) }
    finally { setLoading(false) }
  }

  const setField = (k: keyof FormState, v: any) => setForm(f => ({ ...f, [k]: v }))

  const openNew = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); setError(null) }

  const openEdit = (r: any) => {
    setForm({
      name: r.name ?? '',
      markupType: r.markupType ?? 'PERCENT',
      markupValue: String(r.markupValue ?? ''),
      currency: r.currency ?? 'SAR',
      notes: r.notes ?? '',
      isActive: r.isActive ?? false,
    })
    setEditingId(r.id); setShowForm(true); setError(null)
  }

  const closeForm = () => { setShowForm(false); setEditingId(null); setError(null) }

  const handleSave = async () => {
    if (!form.markupValue || isNaN(parseFloat(form.markupValue))) {
      setError('Markup value is required and must be a number'); return
    }
    setSaving(true); setError(null)
    try {
      const payload = {
        name: form.name,
        markupType: form.markupType,
        markupValue: parseFloat(form.markupValue),
        currency: form.currency,
        notes: form.notes,
        isActive: form.isActive,
      }
      if (editingId) {
        await flightMarkupAPI.update(editingId, payload)
      } else {
        await flightMarkupAPI.create(payload)
      }
      await load(); closeForm()
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to save')
    } finally { setSaving(false) }
  }

  const handleActivate = async (id: string) => {
    setActivating(id)
    try {
      await flightMarkupAPI.activate(id)
      await load()
    } catch { alert('Failed to activate') }
    finally { setActivating(null) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this markup rule?')) return
    setDeleting(id)
    try {
      await flightMarkupAPI.delete(id)
      setRules(prev => prev.filter(r => r.id !== id))
    } catch { alert('Failed to delete') }
    finally { setDeleting(null) }
  }

  const activeRule = rules.find(r => r.isActive)

  if (authLoading || !user) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Flight Markup Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Set a profit margin that is added on top of all Almosafer flight prices shown to customers.
          </p>
        </div>
        <Button onClick={openNew} className="gap-2 bg-teal-600 hover:bg-teal-700">
          <Plus className="w-4 h-4" /> Add Markup Rule
        </Button>
      </div>

      {/* Active markup summary */}
      <Card className={`border-2 ${activeRule ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
        <CardContent className="pt-5 flex items-center gap-4">
          <div className={`rounded-full p-3 ${activeRule ? 'bg-green-100' : 'bg-amber-100'}`}>
            <TrendingUp className={`w-6 h-6 ${activeRule ? 'text-green-600' : 'text-amber-600'}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Currently Active Markup</p>
            {activeRule ? (
              <p className="text-xl font-bold text-gray-900">
                {activeRule.markupType === 'PERCENT'
                  ? `+${activeRule.markupValue}% on all flight prices`
                  : `+${activeRule.currency} ${activeRule.markupValue} fixed per booking`}
                <span className="ml-2 text-sm font-normal text-gray-500">— {activeRule.name}</span>
              </p>
            ) : (
              <p className="text-base font-medium text-amber-700">No active markup — flights shown at Almosafer base prices</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      {showForm && (
        <Card className="border-teal-200 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg">{editingId ? 'Edit Markup Rule' : 'New Markup Rule'}</CardTitle>
            <button onClick={closeForm} className="p-1 rounded hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Rule Name</Label>
                <Input placeholder="e.g. Standard 15% Markup" value={form.name} onChange={e => setField('name', e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <Label>Markup Type</Label>
                <Select value={form.markupType} onValueChange={v => setField('markupType', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENT">Percentage (%)</SelectItem>
                    <SelectItem value="FIXED">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>
                  {form.markupType === 'PERCENT' ? 'Markup Percentage (%)' : 'Fixed Markup Amount'}
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
                    {form.markupType === 'PERCENT' ? <Percent className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                  </span>
                  <Input className="pl-9" type="number" min="0" step="0.01" placeholder={form.markupType === 'PERCENT' ? '15' : '50'} value={form.markupValue} onChange={e => setField('markupValue', e.target.value)} />
                </div>
                {form.markupValue && (
                  <p className="text-xs text-teal-700 mt-1">
                    Example: SAR 1,000 flight → customer sees SAR {form.markupType === 'PERCENT'
                      ? (1000 * (1 + parseFloat(form.markupValue || '0') / 100)).toFixed(2)
                      : (1000 + parseFloat(form.markupValue || '0')).toFixed(2)}
                  </p>
                )}
              </div>

              {form.markupType === 'FIXED' && (
                <div className="space-y-1.5">
                  <Label>Currency</Label>
                  <Select value={form.currency} onValueChange={v => setField('currency', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['SAR', 'AED', 'USD', 'EUR', 'GBP', 'KWD'].map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-1.5 md:col-span-2">
                <Label>Internal Notes <span className="text-gray-400 font-normal text-xs">(optional)</span></Label>
                <Input placeholder="e.g. Approved by management on Jan 2026" value={form.notes} onChange={e => setField('notes', e.target.value)} />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setField('isActive', e.target.checked)} className="w-4 h-4 accent-teal-600" />
                <Label htmlFor="isActive" className="cursor-pointer">Activate immediately (deactivates all other rules)</Label>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <Button onClick={handleSave} disabled={saving} className="gap-2 bg-teal-600 hover:bg-teal-700">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editingId ? 'Save Changes' : 'Create Rule'}
              </Button>
              <Button variant="outline" onClick={closeForm}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rules list */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading…
        </div>
      ) : rules.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No markup rules yet</p>
          <p className="text-sm mt-1">Create one to start adding a profit margin to flight prices.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map(rule => (
            <Card key={rule.id} className={`transition-all ${rule.isActive ? 'border-green-300 shadow-sm' : 'border-gray-200'}`}>
              <CardContent className="pt-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`rounded-full p-2 flex-shrink-0 ${rule.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {rule.markupType === 'PERCENT'
                      ? <Percent className={`w-4 h-4 ${rule.isActive ? 'text-green-600' : 'text-gray-500'}`} />
                      : <DollarSign className={`w-4 h-4 ${rule.isActive ? 'text-green-600' : 'text-gray-500'}`} />
                    }
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">{rule.name}</span>
                      {rule.isActive && <Badge className="bg-green-500 text-white text-[10px] py-0">ACTIVE</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {rule.markupType === 'PERCENT' ? `+${rule.markupValue}% added to flight price` : `+${rule.currency} ${rule.markupValue} fixed per booking`}
                    </p>
                    {rule.notes && <p className="text-xs text-gray-400 mt-0.5 truncate">{rule.notes}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!rule.isActive && (
                    <Button
                      size="sm" variant="outline"
                      className="gap-1 text-green-700 border-green-300 hover:bg-green-50"
                      disabled={activating === rule.id}
                      onClick={() => handleActivate(rule.id)}
                    >
                      {activating === rule.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                      Activate
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => openEdit(rule)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm" variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    disabled={deleting === rule.id}
                    onClick={() => handleDelete(rule.id)}
                  >
                    {deleting === rule.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">ℹ️ How Flight Markup Works</p>
        <ul className="list-disc list-inside space-y-1 text-blue-700">
          <li>Markup is applied server-side on every flight search/pricing response</li>
          <li>Customers see the marked-up price — they never see the Almosafer base price</li>
          <li>The full marked-up amount is collected via CCAvenue and goes to your account</li>
          <li>Only one markup rule can be active at a time</li>
          <li>Setting markup to 0% shows base prices with no profit margin</li>
        </ul>
      </div>
    </div>
  )
}
