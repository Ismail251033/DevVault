import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
const AuthContext = createContext()
export function AuthProvider({ children }) { const [user, setUser] = useState(null); const [loading, setLoading] = useState(true)
  useEffect(() => { if (!supabase) { setLoading(false); return }; supabase.auth.getSession().then(({ data }) => { setUser(data.session?.user ?? null); setLoading(false) }); const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => { setUser(s?.user ?? null); setLoading(false) }); return () => subscription.unsubscribe() }, [])
  const value = { user, loading, signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }), signUp: (email, password) => supabase.auth.signUp({ email, password }), signOut: () => supabase.auth.signOut(), reset: email => supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/reset-password` }), updatePassword: password => supabase.auth.updateUser({ password }) }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider> }
export const useAuth = () => useContext(AuthContext)
