import { createContext, useContext, useState } from 'react'
const ToastContext = createContext()
export function ToastProvider({ children }) { const [toasts, setToasts] = useState([]); const toast = (message, type = 'success') => { const id = crypto.randomUUID(); setToasts(v => [...v, { id, message, type }]); setTimeout(() => setToasts(v => v.filter(t => t.id !== id)), 3500) }; return <ToastContext.Provider value={toast}>{children}<div className="toasts">{toasts.map(t => <div className={`toast ${t.type}`} key={t.id}>{t.message}</div>)}</div></ToastContext.Provider> }
export const useToast = () => useContext(ToastContext)
