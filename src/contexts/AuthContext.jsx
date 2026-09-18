import { createContext, useContext, useEffect, useState } from 'react'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return undefined
    }
    const supabase = getSupabase()
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.error('[AUTH] Unable to restore session', { message: error.message, status: error.status, code: error.code })
      setUser(data.session?.user ?? null)
      setLoading(false)
    }).catch((error) => {
      console.error('[AUTH] Unable to restore session', { message: error?.message })
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  const authCall = async (label, operation) => {
    try {
      const supabase = getSupabase()
      const result = await operation(supabase)
      if (result.error) console.error('[AUTH] Supabase Auth request failed', { operation: label, message: result.error.message, status: result.error.status, code: result.error.code })
      return result
    } catch (error) {
      console.error('[AUTH] Supabase Auth request failed', { operation: label, message: error?.message, status: error?.status, code: error?.code })
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
