import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
export const isSupabaseConfigured = Boolean(url && key)

let client

export function getSupabase() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured for this deployment.')
  }

  if (!client) {
    client = createClient(url, key)
  }

  return client
}
