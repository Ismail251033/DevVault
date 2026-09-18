import { createContext, useContext, useEffect, useState } from 'react'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'
const AuthContext = createContext()
export function AuthProvider({ children }) { const [user, setUser] = useState(null); const [loading, setLoading] = useState(true)
  useEffect(() => { if (!isSupabaseConfigured) { setLoading(false); return }; const supabase = getSupabase(); supabase.auth.getSession().then(({ data }) => { setUser(data.session?.user ?? null); setLoading(false) }); const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => { setUser(s?.user ?? null); setLoading(false) }); return () => subscription.unsubscribe() }, [])
  const authCall = async (operation) => { try { return await operation(getSupabase()) } catch (error) { return { data: null, error } } }
  const value = { user, loading, isConfigured: isSupabaseConfigured, signIn: (email, password) => authCall(supabase => supabase.auth.signInWithPassword({ email, password })), signUp: (email, password) => authCall(supabase => supabase.auth.signUp({ email, password })), signOut: () => authCall(supabase => supabase.auth.signOut()), reset: email => authCall(supabase => supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/reset-password` })), updatePassword: password => authCall(supabase => supabase.auth.updateUser({ password })) }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider> }
export const useAuth = () => useContext(AuthContext)
