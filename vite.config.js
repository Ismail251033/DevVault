import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  // Only gate the production build (Vercel runs `vite build`). Local `vite dev`
  // is left untouched so contributors without a .env.local can still see the
  // app's own "Authentication unavailable" fallback screen instead of a hard crash.
  if (command === 'build') {
    const env = loadEnv(mode, process.cwd()) // defaults to VITE_-prefixed vars
    const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']
    const missing = required.filter((key) => !env[key]?.trim())
    if (missing.length) {
      throw new Error(
        `[build] Missing required environment variable(s): ${missing.join(', ')}.\n` +
        `These must be set for the target environment (Production/Preview) in Vercel > Project Settings > Environment Variables, ` +
        `and a NEW deployment must be triggered afterwards — adding or editing variables does not patch a build that already ran.`
      )
    }
  }

  return { plugins: [react()], server: { port: 5173 } }
})
