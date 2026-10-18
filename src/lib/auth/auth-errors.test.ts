import { describe, expect, it } from 'vitest'

import { classifyAuthError } from './auth-errors'

describe('classifyAuthError', () => {
  it('never distinguishes "no such user" from "wrong password"', () => {
    expect(classifyAuthError({ code: 'invalid_credentials', message: 'Invalid login credentials' })).toBe(
      'invalid_credentials',
    )
    expect(classifyAuthError({ code: 'user_not_found', message: 'User not found' })).toBe(
      'invalid_credentials',
    )
  })

  it('flags an existing account on sign-up so the page can treat it as success', () => {
    expect(classifyAuthError({ code: 'user_already_exists', message: 'User already registered' })).toBe(
      'account_exists',
    )
    expect(classifyAuthError({ message: 'User already registered' })).toBe('account_exists')
  })

  it('recognises rate limiting by status or code', () => {
    expect(classifyAuthError({ status: 429, message: 'x' })).toBe('rate_limited')
    expect(classifyAuthError({ code: 'over_email_send_rate_limit' })).toBe('rate_limited')
  })

  it('maps the remaining known codes', () => {
    expect(classifyAuthError({ code: 'email_not_confirmed' })).toBe('email_not_confirmed')
    expect(classifyAuthError({ code: 'weak_password' })).toBe('weak_password')
    expect(classifyAuthError({ code: 'captcha_failed' })).toBe('captcha_failed')
  })

  it('falls back to generic for anything unknown (including internals)', () => {
    expect(classifyAuthError({ message: 'relation "profiles" does not exist' })).toBe('generic')
    expect(classifyAuthError(null)).toBe('generic')
  })
})
