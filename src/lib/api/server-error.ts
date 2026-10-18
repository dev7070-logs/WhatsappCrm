import { NextResponse } from 'next/server'

import { getT } from '@/lib/i18n/translate'

const t = getT('Api')

/**
 * 500 response that never leaks internals.
 *
 * Database / PostgREST error text names tables, columns and
 * constraints ("duplicate key value violates unique constraint
 * automation_steps_pkey"), which helps an attacker map the schema.
 * Log the real error server-side and send the client a fixed message.
 */
export function serverError(detail: unknown, status = 500): NextResponse {
  console.error('[api] internal error:', detail)
  return NextResponse.json({ error: t('common.internalServerError') }, { status })
}
