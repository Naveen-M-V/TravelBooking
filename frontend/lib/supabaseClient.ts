import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Lazy singleton — createClient is only called the first time getSupabase() is
// invoked (i.e. in the browser), never during Next.js static prerendering at
// build time when NEXT_PUBLIC_* vars may not be present.
let _client: SupabaseClient | null = null

function getSupabase(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set')
    _client = createClient(url, key)
  }
  return _client
}

// Proxy forwards every property access to the lazily-created client.
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return Reflect.get(getSupabase(), prop)
  },
})
