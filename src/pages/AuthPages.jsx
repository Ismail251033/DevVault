import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const errorMessage = (error, fallback) => import.meta.env.DEV && error?.message ? error.message : fallback

export function AuthPage({ mode }) {
  const { user, signIn, signUp, reset } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const nav = useNavigate()
  if (user) return <Navigate to="/dashboard" replace />
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setMessage('')
    const result = mode === 'login' ? await signIn(email, password) : mode === 'register' ? await signUp(email, password) : await reset(email)
    setBusy(false)
    if (result.error) setMessage(errorMessage(result.error, 'Unable to complete that request. Please check your details and try again.'))
    else if (mode === 'forgot') setMessage('Check your email for a password reset link.')
    else if (mode === 'register') setMessage('Check your email to confirm your account.')
    else nav('/dashboard')
  }
  const title = mode === 'login' ? 'Welcome back' : mode === 'register' ? 'Create your vault' : 'Reset your password'
  return <div className="auth"><div className="auth-card"><div className="brand"><span className="brand-mark">D</span>DEVVAULT</div><h1>{title}</h1><p>{mode === 'login' ? 'Your developer workspace is waiting.' : mode === 'register' ? 'A calm place for your work.' : 'We’ll send a secure reset link.'}</p><form onSubmit={submit}><label>Email<input type="email" required value={email} onChange={event => setEmail(event.target.value)} /></label>{mode !== 'forgot' && <label>Password<input type="password" minLength="6" required value={password} onChange={event => setPassword(event.target.value)} /></label>}<button className="primary" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : mode === 'register' ? 'Create account' : 'Send reset link'}</button></form>{message && <div className="form-message">{message}</div>}<div className="auth-links">{mode === 'login' ? <><Link to="/forgot-password">Forgot password?</Link><span>New here? <Link to="/register">Create account</Link></span></> : <Link to="/login">Back to sign in</Link>}</div></div></div>
}

export function ResetPassword() {
  const { updatePassword, user, loading } = useAuth()
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  if (loading) return <div className="auth"><div className="auth-card"><p>Validating your password-reset link…</p></div></div>
  if (!user) return <Navigate to="/login" replace />
  const submit = async (event) => { event.preventDefault(); setBusy(true); const { error } = await updatePassword(password); setBusy(false); setMessage(error ? errorMessage(error, 'Unable to update your password. Please request a new reset link.') : 'Password updated successfully. You can now sign in with it.') }
  return <div className="auth"><div className="auth-card"><h1>Choose a new password</h1><p>Set a new password for your DevVault account.</p><form onSubmit={submit}><label>New password<input type="password" minLength="6" required value={password} onChange={event => setPassword(event.target.value)} /></label><button className="primary" disabled={busy}>{busy ? 'Updating…' : 'Update password'}</button></form>{message && <div className="form-message">{message}</div>}</div></div>
}
