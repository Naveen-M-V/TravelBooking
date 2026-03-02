'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { heroImagesAPI } from '@/lib/api/heroImages'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Plus, Trash2, X, Save, Loader2, Image as ImageIcon,
  Eye, EyeOff, Upload, Link, GripVertical, AlertCircle
} from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const BUCKET = 'hero-images'

// NEXT_PUBLIC_* vars are inlined at build time — safe to read on the client.
const SUPABASE_CONFIGURED = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// Lazily create the Supabase client only when an upload is triggered (client
// side), so this module is safe to import during Next.js static prerendering.
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase is not configured — add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.')
  return createClient(url, key)
}

const EMPTY_FORM = { url: '', altText: '', caption: '', sortOrder: '0', isActive: true }
type FormState = typeof EMPTY_FORM

export default function AdminHeroImagesPage() {
  const { user, loading: authLoading, isAdmin } = useAuth()
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  // Default to URL mode when Supabase storage isn't configured yet
  const [inputMode, setInputMode] = useState<'url' | 'upload'>(SUPABASE_CONFIGURED ? 'upload' : 'url')

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin) { router.push('/login'); return }
      load()
    }
  }, [authLoading, user, isAdmin])

  const load = async () => {
    setLoading(true)
    try {
      const res = await heroImagesAPI.getAll()
      setImages(res.images || [])
    } catch { setImages([]) }
    finally { setLoading(false) }
  }

  const setField = (k: keyof FormState, v: any) => setForm(f => ({ ...f, [k]: v }))

  const openNew = () => {
    setForm({ ...EMPTY_FORM, sortOrder: String(images.length) })
    setEditingId(null); setShowForm(true); setUploadError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openEdit = (img: any) => {
    setForm({
      url: img.url ?? '',
      altText: img.altText ?? '',
      caption: img.caption ?? '',
      sortOrder: String(img.sortOrder ?? 0),
      isActive: img.isActive ?? true,
    })
    setEditingId(img.id); setShowForm(true); setUploadError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeForm = () => { setShowForm(false); setEditingId(null); setUploadError(null) }

  // ── Supabase Storage Upload ─────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setUploadError('Please select an image file (JPG, PNG, WebP)'); return }
    if (file.size > 10 * 1024 * 1024) { setUploadError('File must be under 10 MB'); return }

    setUploading(true); setUploadError(null)
    try {
      const sb = getSupabase()
      const ext = file.name.split('.').pop()
      const path = `hero/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await sb.storage.from(BUCKET).upload(path, file, { cacheControl: '3600', upsert: false })
      if (error) throw error
      const { data } = sb.storage.from(BUCKET).getPublicUrl(path)
      setField('url', data.publicUrl)
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleSave = async () => {
    if (!form.url) { setUploadError('Please provide an image URL or upload a file'); return }
    setSaving(true)
    try {
      const payload = {
        url: form.url.trim(),
        altText: form.altText,
        caption: form.caption,
        sortOrder: parseInt(form.sortOrder) || 0,
        isActive: form.isActive,
      }
      if (editingId) {
        await heroImagesAPI.update(editingId, payload)
      } else {
        await heroImagesAPI.create(payload)
      }
      await load(); closeForm()
    } catch (e: any) {
      setUploadError(e.response?.data?.error || 'Failed to save')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this hero image? The file in storage will remain.')) return
    setDeleting(id)
    try {
      await heroImagesAPI.delete(id)
      setImages(prev => prev.filter(x => x.id !== id))
    } catch { alert('Failed to delete') }
    finally { setDeleting(null) }
  }

  const handleToggleActive = async (img: any) => {
    try {
      await heroImagesAPI.update(img.id, { isActive: !img.isActive })
      setImages(prev => prev.map(x => x.id === img.id ? { ...x, isActive: !x.isActive } : x))
    } catch { alert('Failed to update') }
  }

  if (authLoading || !user) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hero Images</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            These images appear behind the search box on the landing page. {images.filter(i => i.isActive).length} active.
          </p>
        </div>
        <Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" /> Add Image</Button>
      </div>

      {/* ── Form ─────────────────────────────────────────── */}
      {showForm && (
        <Card className="border-teal-200 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">{editingId ? 'Edit Image' : 'Add Hero Image'}</CardTitle>
            <button onClick={closeForm} className="p-1 rounded hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
          </CardHeader>
          <CardContent className="space-y-5">

            {/* Supabase not-configured notice */}
            {!SUPABASE_CONFIGURED && (
              <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
                <div>
                  <p className="font-semibold">Supabase storage not configured</p>
                  <p className="text-amber-700 mt-0.5">File upload is disabled. You can still add images by pasting a public URL below. To enable uploads, add <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your environment variables.</p>
                </div>
              </div>
            )}

            {/* Upload vs URL toggle — only show Upload tab when Supabase is ready */}
            <div className="flex rounded-xl overflow-hidden border border-gray-200 w-fit">
              {SUPABASE_CONFIGURED && (
                <button
                  onClick={() => setInputMode('upload')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${inputMode === 'upload' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Upload className="w-4 h-4" /> Upload File
                </button>
              )}
              <button
                onClick={() => setInputMode('url')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${inputMode === 'url' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Link className="w-4 h-4" /> Paste URL
              </button>
            </div>

            {inputMode === 'upload' ? (
              <div className="space-y-2">
                <Label>Upload Image <span className="text-gray-400 font-normal text-xs">(JPG, PNG, WebP — max 10 MB)</span></Label>
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-teal-400 hover:bg-teal-50/30 transition-colors">
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2 text-teal-600">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <span className="text-sm">Uploading…</span>
                    </div>
                  ) : form.url && inputMode === 'upload' ? (
                    <div className="flex flex-col items-center gap-1 text-teal-700">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">✓</div>
                      <span className="text-sm font-medium">Uploaded!</span>
                      <span className="text-xs text-gray-400 truncate max-w-xs">{form.url.split('/').pop()}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Upload className="w-8 h-8" />
                      <span className="text-sm">Click to choose a file</span>
                      <span className="text-xs">or drag & drop here</span>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label>Image URL *</Label>
                <Input placeholder="https://…/hero.jpg" value={form.url} onChange={e => setField('url', e.target.value)} />
              </div>
            )}

            {uploadError && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />{uploadError}
              </div>
            )}

            {/* Preview */}
            {form.url && (
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Preview</Label>
                <img
                  src={form.url}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl border"
                  onError={e => { (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/800x400?text=Invalid+URL' }}
                />
              </div>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Alt Text <span className="text-gray-400 font-normal text-xs">(for accessibility)</span></Label>
                <Input placeholder="Beautiful mosque at sunset" value={form.altText} onChange={e => setField('altText', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Caption <span className="text-gray-400 font-normal text-xs">(optional, shown on slide)</span></Label>
                <Input placeholder="Discover the world halal" value={form.caption} onChange={e => setField('caption', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Sort Order</Label>
                <Input type="number" value={form.sortOrder} onChange={e => setField('sortOrder', e.target.value)} />
              </div>
              <div className="flex items-end pb-0.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e => setField('isActive', e.target.checked)} className="w-4 h-4 accent-teal-600" />
                  <span className="text-sm font-medium text-gray-700">Show on landing page</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <Button onClick={handleSave} disabled={saving || uploading} className="gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editingId ? 'Save Changes' : 'Add to Hero'}
              </Button>
              <Button variant="outline" onClick={closeForm}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Image Grid ───────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading images…
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No hero images yet</p>
          <p className="text-sm mt-1">Upload your first image to display on the landing page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.sort((a, b) => a.sortOrder - b.sortOrder).map((img, idx) => (
            <div
              key={img.id}
              className={`group relative rounded-xl overflow-hidden border shadow-sm transition-all ${!img.isActive ? 'opacity-50 grayscale' : ''}`}
            >
              <img
                src={img.url}
                alt={img.altText || `Hero ${idx + 1}`}
                className="w-full h-44 object-cover"
                onError={e => { (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/800x400?text=Image+Error' }}
              />
              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => openEdit(img)} className="p-2 bg-white/90 rounded-lg text-gray-700 hover:bg-white transition-colors" title="Edit">
                  <Save className="w-4 h-4" />
                </button>
                <button onClick={() => handleToggleActive(img)} className="p-2 bg-white/90 rounded-lg text-gray-700 hover:bg-white transition-colors" title={img.isActive ? 'Hide' : 'Show'}>
                  {img.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => handleDelete(img.id)} disabled={deleting === img.id} className="p-2 bg-white/90 rounded-lg text-red-600 hover:bg-white transition-colors" title="Delete">
                  {deleting === img.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
              {/* Status pill */}
              <div className="absolute top-2 left-2">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${img.isActive ? 'bg-green-500 text-white' : 'bg-gray-600 text-white'}`}>
                  {img.isActive ? 'Active' : 'Hidden'}
                </span>
              </div>
              <div className="absolute top-2 right-2">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/50 text-white">#{img.sortOrder}</span>
              </div>
              {/* Caption */}
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                  <p className="text-white text-xs truncate">{img.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-gray-400 text-center">
          Tip: adjust the Sort Order on each image to control the display sequence on the landing page.
        </p>
      )}
    </div>
  )
}
