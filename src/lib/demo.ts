import { isSupabaseConfigured } from '@/lib/supabase/config'

// Demo preview: browse the signed-in app (dashboard, inbox, settings…)
// on a fresh clone before any Supabase project exists.
//
// It is only ever on when ALL of these hold:
//   1. a development server (`next dev`) — never in a production build,
//   2. NEXT_PUBLIC_DEMO_PREVIEW=true in .env.local,
//   3. no real Supabase keys are configured.
// With real keys present it switches itself off, so it can't bypass
// auth on a working install. Nothing is saved: data requests go to a fake
// in-app endpoint, so pages show their empty states.
export function isDemoPreview(): boolean {
  return (
    process.env.NODE_ENV !== 'production' &&
    process.env.NEXT_PUBLIC_DEMO_PREVIEW === 'true' &&
    !isSupabaseConfigured()
  )
}

/**
 * The demo's Supabase client talks to a fake in-app endpoint
 * (src/app/api/demo-supabase) that answers "no rows" plus sample
 * dashboard numbers. Some client components create the client while
 * server-rendering, where there's no `window`; the placeholder origin
 * is never fetched there because queries run in effects.
 */
export function demoSupabaseUrl(): string {
  const origin =
    typeof window === 'undefined' ? 'http://localhost' : window.location.origin
  return `${origin}/api/demo-supabase`
}
export const DEMO_SUPABASE_KEY = 'demo-preview-anon-key'
