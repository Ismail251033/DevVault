# DevVault

DevVault is a minimalist personal developer workspace for managing projects, tasks, snippets, notes, command references, and workspace analytics.

## Features

- Supabase Auth with protected routes, registration, password reset, and session persistence
- Supabase-backed CRUD for projects, tasks, snippets, and notes
- Dashboard and analytics calculated from live workspace data
- Searchable project, task, snippet, note, and command views
- Responsive app shell, collapsible sidebar, theme preferences, toast feedback, and Ctrl/Cmd + K command palette
- Installable PWA shell with a conservative static-asset service worker

## Stack

React, Vite, JavaScript, Tailwind CSS, React Router, Lucide React, and Supabase JavaScript.

## Install and run

```bash
npm install
npm run dev
```

Create `.env.local` from `.env.example` and add the public project credentials:

```ini
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

The app uses the existing Supabase tables `projects`, `tasks`, `snippets`, and `notes`. It makes RLS-compatible client requests using the signed-in user's ID for inserts. No service-role secret, migrations, or database changes are required.

## Production

```bash
npm run build
npm run preview
```

Deploy the generated `dist/` directory to any static hosting service. Keep `.env.local` private; configure the same Vite environment variables in the deployment platform.
