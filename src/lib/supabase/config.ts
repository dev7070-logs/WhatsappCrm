// Whether real Supabase credentials are present.
//
// The marketing site and the auth pages should render on a fresh clone
// before anyone has filled in `.env.local` — so the middleware and the
// auth forms check this instead of crashing on `createClient(undefined)`.
// The values are inlined at build time (NEXT_PUBLIC_*), so this works in
// both server and browser bundles.

const PLACEHOLDER_HINTS = ['your-project', 'your-anon-key']

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return false
  if (PLACEHOLDER_HINTS.some((hint) => url.includes(hint) || key.includes(hint))) {
    return false
  }
  return /^https?:\/\//.test(url)
}
