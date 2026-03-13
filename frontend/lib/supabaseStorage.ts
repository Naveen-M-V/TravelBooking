import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const SUPABASE_STORAGE_CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

function getSupabase() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase is not configured — add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.')
  }

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

export async function uploadImageToSupabase(params: {
  bucket: string
  folder: string
  file: File
  upsert?: boolean
}) {
  const { bucket, folder, file, upsert = false } = params

  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file.')
  }

  const extension = file.name.includes('.') ? file.name.split('.').pop() : 'jpg'
  const sanitizedFolder = folder.replace(/^\/+|\/+$/g, '')
  const path = `${sanitizedFolder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`

  const supabase = getSupabase()
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert,
  })

  if (error) {
    throw error
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)

  return {
    path,
    publicUrl: data.publicUrl,
  }
}
