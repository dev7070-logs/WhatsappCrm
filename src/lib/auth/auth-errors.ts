// ============================================================
// Map Supabase Auth errors to a small set of SAFE categories.
//
// The auth pages used to print `error.message` verbatim. Some of
// those messages leak whether an account exists ("User already
// registered", "Email not found") — account enumeration — or expose
// internals. The pages now show one fixed, translated message per
// category instead, and never the raw text.
// ============================================================

export type AuthErrorKind =
  /** Too many attempts — Supabase's server-side rate limit tripped. */
  | 'rate_limited'
  /** Wrong email OR password — deliberately not saying which. */
  | 'invalid_credentials'
  /** Correct password, email not verified yet (no enumeration: it
   *  only appears after the password matched). */
  | 'email_not_confirmed'
  /** Password rejected by the server-side policy. */
  | 'weak_password'
  /** Sign-up for an email that already has an account. Callers treat
   *  this exactly like success so the response reveals nothing. */
  | 'account_exists'
  /** Bot check (CAPTCHA) missing or failed. */
  | 'captcha_failed'
  /** Anything else — shown as a generic "something went wrong". */
  | 'generic'

interface AuthErrorLike {
  code?: string | null
  status?: number | null
  message?: string | null
}

export function classifyAuthError(error: AuthErrorLike | null | undefined): AuthErrorKind {
  if (!error) return 'generic'
  const code = error.code ?? ''
  const message = (error.message ?? '').toLowerCase()

  if (
    error.status === 429 ||
    code === 'over_request_rate_limit' ||
    code === 'over_email_send_rate_limit' ||
    message.includes('rate limit')
  ) {
    return 'rate_limited'
  }
  if (code === 'captcha_failed' || message.includes('captcha')) return 'captcha_failed'
  if (code === 'email_not_confirmed') return 'email_not_confirmed'
  if (code === 'weak_password' || message.includes('password should')) return 'weak_password'
  if (
    code === 'user_already_exists' ||
    code === 'email_exists' ||
    message.includes('already registered')
  ) {
    return 'account_exists'
  }
  if (
    code === 'invalid_credentials' ||
    code === 'user_not_found' ||
    message.includes('invalid login credentials')
  ) {
    return 'invalid_credentials'
  }
  return 'generic'
}

/** Minimum password length enforced in the forms (UX). The real
 *  boundary is Supabase Auth's own policy — set it to the same value
 *  under Authentication → Providers → Email → Minimum password length. */
export const MIN_PASSWORD_LENGTH = 8
