'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { packagesAPI } from '@/lib/api/packages'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Plus, Pencil, Trash2, X, Save, Loader2, Package,
  ChevronDown, ChevronUp, Globe, Clock, DollarSign,
  AlertCircle, Eye, EyeOff
} from 'lucide-react'

const CATEGORIES = ['best', 'popular', 'top-destination', 'family']
const CURRENCIES = ['SAR', 'USD', 'EUR', 'GBP', 'AED', 'KWD']

const EMPTY_FORM = {
  name: '', destination: '', country: '', duration: '',
  price: '', originalPrice: '', currency: 'SAR', category: 'best',
  description: '', coverImage: '',
  features: '',     // newline-separated for UI
  highlights: '',
  included: '',
  images: '',       // newline-separated URLs
  isActive: true, sortOrder: '0',
  itinerary: [] as { day: number; title: string; description: string; activities: string }[],
}

type FormState = typeof EMPTY_FORM

export default function AdminPackagesPage() {
  const { user, loading: authLoading, isAdmin } = useAuth()
  const router = useRouter()

  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState('all')

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin) { router.push('/login'); return }
      load()
    }
  }, [authLoading, user, isAdmin])

  const load = async () => {
    setLoading(true)
    try {
      const res = await packagesAPI.getAll()
      setPackages(res.packages || [])
    } catch { setPackages([]) }
    finally { setLoading(false) }
  }

  // ── helpers ──────────────────────────────────────────────
  const lines = (s: string) => s.split('\n').map(l => l.trim()).filter(Boolean)

  const openNew = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true) }

  const openEdit = (pkg: any) => {
    setForm({
      name: pkg.name ?? '',
      destination: pkg.destination ?? '',
      country: pkg.country ?? '',
      duration: pkg.duration ?? '',
      price: String(pkg.price ?? ''),
      originalPrice: String(pkg.originalPrice ?? ''),
      currency: pkg.currency ?? 'SAR',
      category: pkg.category ?? 'best',
      description: pkg.description ?? '',
      coverImage: pkg.coverImage ?? '',
      features: (pkg.features ?? []).join('\n'),
      highlights: (pkg.highlights ?? []).join('\n'),
      included: (pkg.included ?? []).join('\n'),
      images: (pkg.images ?? []).join('\n'),
      isActive: pkg.isActive ?? true,
      sortOrder: String(pkg.sortOrder ?? 0),
      itinerary: (pkg.itinerary ?? []).map((d: any) => ({
        ...d,
        activities: Array.isArray(d.activities) ? d.activities.join('\n') : d.activities,
      })),
    })
    setEditingId(pkg.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeForm = () => { setShowForm(false); setEditingId(null) }

  const setField = (k: keyof FormState, v: any) => setForm(f => ({ ...f, [k]: v }))

  const addItineraryDay = () =>
    setForm(f => ({
      ...f,
      itinerary: [...f.itinerary, { day: f.itinerary.length + 1, title: '', description: '', activities: '' }],
    }))

  const removeItineraryDay = (idx: number) =>
    setForm(f => ({ ...f, itinerary: f.itinerary.filter((_, i) => i !== idx) }))

  const setItinerary = (idx: number, k: string, v: string) =>
    setForm(f => ({
      ...f,
      itinerary: f.itinerary.map((d, i) => i === idx ? { ...d, [k]: v } : d),
    }))

  const handleSave = async () => {
    if (!form.name || !form.destination || !form.country || !form.price || !form.description) {
      alert('Please fill in: Name, Destination, Country, Price, Description')
      return
    }
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        destination: form.destination,
        country: form.country,
        duration: form.duration,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        currency: form.currency,
        category: form.category,
        description: form.description,
        coverImage: form.coverImage,
        features: lines(form.features),
        highlights: lines(form.highlights),
        included: lines(form.included),
        images: lines(form.images),
        isActive: form.isActive,
        sortOrder: parseInt(form.sortOrder) || 0,
        itinerary: form.itinerary.map(d => ({
          day: d.day,
          title: d.title,
          description: d.description,
          activities: d.activities.split('\n').map((a: string) => a.trim()).filter(Boolean),
        })),
      }

      if (editingId) {
        await packagesAPI.update(editingId, payload)
      } else {
        await packagesAPI.create(payload)
      }
      await load()
      closeForm()
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to save package')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await packagesAPI.delete(id)
      setPackages(p => p.filter(x => x.id !== id))
    } catch { alert('Failed to delete package') }
    finally { setDeleting(null) }
  }

  const handleToggleActive = async (pkg: any) => {
    try {
      const updated = await packagesAPI.update(pkg.id, { isActive: !pkg.isActive })
      setPackages(p => p.map(x => x.id === pkg.id ? { ...x, isActive: !x.isActive } : x))
    } catch { alert('Failed to update status') }
  }

  const filtered = filterCategory === 'all' ? packages : packages.filter(p => p.category === filterCategory)

  if (authLoading || !user) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Packages</h1>
          <p className="text-sm text-gray-500 mt-0.5">{packages.length} package{packages.length !== 1 ? 's' : ''} total</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="w-4 h-4" /> Add Package
        </Button>
      </div>

      {/* ── Package Form ────────────────────────────────── */}
      {showForm && (
        <Card className="border-teal-200 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">{editingId ? 'Edit Package' : 'New Package'}</CardTitle>
            <button onClick={closeForm} className="p-1 rounded hover:bg-gray-100">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Core Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Package Name *</Label>
                <Input placeholder="e.g. Best of Spain – 7 Nights 8 Days" value={form.name} onChange={e => setField('name', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Destination *</Label>
                <Input placeholder="e.g. Madrid · Seville · Granada" value={form.destination} onChange={e => setField('destination', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Country *</Label>
                <Input placeholder="e.g. Spain" value={form.country} onChange={e => setField('country', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Duration</Label>
                <Input placeholder="e.g. 8 Days / 7 Nights" value={form.duration} onChange={e => setField('duration', e.target.value)} />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Price (per person) *</Label>
                <Input type="number" placeholder="8500" value={form.price} onChange={e => setField('price', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Original Price</Label>
                <Input type="number" placeholder="9500" value={form.originalPrice} onChange={e => setField('originalPrice', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Currency</Label>
                <Select value={form.currency} onValueChange={v => setField('currency', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            {/* Category + Sort + Active */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setField('category', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Sort Order</Label>
                <Input type="number" value={form.sortOrder} onChange={e => setField('sortOrder', e.target.value)} />
              </div>
              <div className="flex items-end pb-0.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e => setField('isActive', e.target.checked)} className="w-4 h-4 accent-teal-600" />
                  <span className="text-sm font-medium text-gray-700">Active (visible on site)</span>
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label>Description *</Label>
              <Textarea rows={3} placeholder="A brief overview of this package…" value={form.description} onChange={e => setField('description', e.target.value)} />
            </div>

            {/* Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Highlights <span className="text-gray-400 font-normal">(one per line)</span></Label>
                <Textarea rows={4} placeholder="Visit Alhambra Palace&#10;Guided tour of the Mezquita" value={form.highlights} onChange={e => setField('highlights', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>What's Included <span className="text-gray-400 font-normal">(one per line)</span></Label>
                <Textarea rows={4} placeholder="Return international flights&#10;7 nights hotel" value={form.included} onChange={e => setField('included', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Features / Tags <span className="text-gray-400 font-normal">(one per line)</span></Label>
                <Textarea rows={3} placeholder="Halal Food&#10;Private Guided Tours" value={form.features} onChange={e => setField('features', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Image URLs <span className="text-gray-400 font-normal">(one URL per line)</span></Label>
                <Textarea rows={3} placeholder="https://…/image1.jpg&#10;https://…/image2.jpg" value={form.images} onChange={e => setField('images', e.target.value)} />
              </div>
            </div>

            {/* Cover Image */}
            <div className="space-y-1.5">
              <Label>Cover Image URL</Label>
              <Input placeholder="https://…/cover.jpg" value={form.coverImage} onChange={e => setField('coverImage', e.target.value)} />
              {form.coverImage && (
                <img src={form.coverImage} alt="Cover preview" className="mt-2 h-32 w-full object-cover rounded-lg border" onError={e => (e.currentTarget.style.display = 'none')} />
              )}
            </div>

            {/* Itinerary */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base">Day-by-Day Itinerary</Label>
                <Button variant="outline" size="sm" onClick={addItineraryDay} className="gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Day
                </Button>
              </div>
              {form.itinerary.map((day, idx) => (
                <div key={idx} className="border rounded-xl p-4 space-y-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-teal-700">Day {day.day}</span>
                    <button onClick={() => removeItineraryDay(idx)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <Input placeholder="Title, e.g. Arrival in Madrid" value={day.title} onChange={e => setItinerary(idx, 'title', e.target.value)} />
                  <Textarea rows={2} placeholder="Description of the day…" value={day.description} onChange={e => setItinerary(idx, 'description', e.target.value)} />
                  <Textarea rows={2} placeholder="Activities (one per line)" value={day.activities} onChange={e => setItinerary(idx, 'activities', e.target.value)} />
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editingId ? 'Save Changes' : 'Create Package'}
              </Button>
              <Button variant="outline" onClick={closeForm}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Filter Bar ──────────────────────────────────── */}
      <div className="flex gap-2 flex-wrap">
        {['all', ...CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filterCategory === cat ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300'
            }`}
          >
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Package List ─────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading packages…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No packages yet</p>
          <p className="text-sm">Click "Add Package" to create your first one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(pkg => (
            <Card key={pkg.id} className={`transition-all ${!pkg.isActive ? 'opacity-60' : ''}`}>
              <CardContent className="p-0">
                {/* Header row */}
                <div className="flex items-center gap-4 p-4">
                  {pkg.coverImage ? (
                    <img src={pkg.coverImage} alt={pkg.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border" onError={e => (e.currentTarget.style.display = 'none')} />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-7 h-7 text-teal-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 truncate">{pkg.name}</h3>
                      <Badge variant="outline" className="text-[10px] py-0 capitalize">{pkg.category}</Badge>
                      {!pkg.isActive && <Badge variant="secondary" className="text-[10px] py-0">Hidden</Badge>}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5 truncate">{pkg.destination} · {pkg.country}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-bold text-teal-700">{pkg.currency} {Number(pkg.price).toLocaleString()}</span>
                      {pkg.originalPrice && <span className="text-xs text-gray-400 line-through">{pkg.currency} {Number(pkg.originalPrice).toLocaleString()}</span>}
                      {pkg.duration && <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" />{pkg.duration}</span>}
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleToggleActive(pkg)}
                      title={pkg.isActive ? 'Hide from site' : 'Show on site'}
                      className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    >
                      {pkg.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => openEdit(pkg)} className="p-2 rounded-lg text-gray-400 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id, pkg.name)}
                      disabled={deleting === pkg.id}
                      className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      {deleting === pkg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setExpandedId(expandedId === pkg.id ? null : pkg.id)}
                      className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                    >
                      {expandedId === pkg.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded detail */}
                {expandedId === pkg.id && (
                  <div className="border-t px-4 pb-4 pt-3 text-sm text-gray-600 space-y-3 bg-gray-50 rounded-b-xl">
                    <p>{pkg.description}</p>
                    {pkg.highlights?.length > 0 && (
                      <div>
                        <p className="font-semibold text-gray-700 mb-1">Highlights</p>
                        <ul className="list-disc list-inside space-y-0.5">{pkg.highlights.map((h: string, i: number) => <li key={i}>{h}</li>)}</ul>
                      </div>
                    )}
                    {pkg.itinerary?.length > 0 && (
                      <div>
                        <p className="font-semibold text-gray-700 mb-1">Itinerary ({pkg.itinerary.length} days)</p>
                        <div className="space-y-1">{pkg.itinerary.map((d: any) => (
                          <div key={d.day} className="text-xs"><span className="font-medium text-teal-700">Day {d.day}:</span> {d.title}</div>
                        ))}</div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
