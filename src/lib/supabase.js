import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('[DEVVAULT ENV]', {
  urlPresent: Boolean(url),
  keyPresent: Boolean(key),
  urlLength: url?.length ?? 0,
  keyLength: key?.length ?? 0,
})

export const isSupabaseConfigured = Boolean(
  url?.trim() && key?.trim()
)

let client

export function getSupabase() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured for this deployment.'
    )
  }

  if (!client) {
    client = createClient(url, key)
  }

  return client
}