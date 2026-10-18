import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { DEMO_SUPABASE_KEY, demoSupabaseUrl, isDemoPreview } from '@/lib/demo'

// Singleton instance — one client shared across the whole browser session.
// Creating multiple clients causes auth-lock contention ("Lock was released
// because another request stole it") and intermittent fetch failures.
let browserClient: SupabaseClient | undefined

export function createClient() {
  if (browserClient) return browserClient

  // Demo preview (dev-only, no keys): a client aimed at the fake
  // in-app endpoint, so pages render their empty states.
  const demo = isDemoPreview()
  browserClient = createBrowserClient(
    demo ? demoSupabaseUrl() : process.env.NEXT_PUBLIC_SUPABASE_URL!,
    demo ? DEMO_SUPABASE_KEY : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return browserClient
}
