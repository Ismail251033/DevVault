import { createContext, useContext, useEffect, useState } from 'react'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.info('[AUTH] SUPABASE CLIENT', { configured: isSupabaseConfigured })
    if (!isSupabaseConfigured) {
      console.error('[AUTH] SUPABASE CLIENT UNAVAILABLE: required VITE variables are missing')
      setLoading(false)
      return undefined
    }
    const supabase = getSupabase()
    supabase.auth.getSession().then(({ data, error }) => {
      console.info('[AUTH] INITIAL SESSION RESULT', { hasSession: Boolean(data.session), errorMessage: error?.message })
      setUser(data.session?.user ?? null)
      setLoading(false)
    }).catch((error) => {
      console.error('[AUTH] INITIAL SESSION ERROR', { errorMessage: error?.message })
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.info('[AUTH] STATE CHANGE', { event, hasSession: Boolean(session) })
      setUser(session?.user ?? null)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  const authCall = async (label, operation) => {
    try {
      console.info('[AUTH] SUPABASE CLIENT', { configured: isSupabaseConfigured })
      console.info('[AUTH] CALLING SUPABASE AUTH', { operation: label })
      const result = await operation(getSupabase())
      console.info('[AUTH] SUPABASE AUTH RESULT', { operation: label, hasSession: Boolean(result.data?.session), hasError: Boolean(result.error), errorMessage: result.error?.message })
      return result
    } catch (error) {
      console.error('[AUTH] SUPABASE AUTH ERROR', { operation: label, errorMessage: error?.message })
      return { data: null, error }
    }
  }

  const resetRedirectUrl = `${window.location.origin}/reset-password`
  const value = {
    user, loading, isConfigured: isSupabaseConfigured,
    signIn: (email, password) => authCall('signInWithPassword', (supabase) => supabase.auth.signInWithPassword({ email, password })),
    signUp: (email, password) => authCall('signUp', (supabase) => supabase.auth.signUp({ email, password })),
    signOut: () => authCall('signOut', (supabase) => supabase.auth.signOut()),
    reset: (email) => authCall('resetPasswordForEmail', (supabase) => supabase.auth.resetPasswordForEmail(email, { redirectTo: resetRedirectUrl })),
    updatePassword: (password) => authCall('updateUser', (supabase) => supabase.auth.updateUser({ password })),
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
