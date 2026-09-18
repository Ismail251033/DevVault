import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
export const isSupabaseConfigured = Boolean(url?.trim() && key?.trim())

let client

export function getSupabase() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured for this deployment. VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be available during the Vite build.')
  }

  if (!client) {
    client = createClient(url, key)
  }

  return client
}
