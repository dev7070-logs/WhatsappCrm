import {
  MAX_CONTACT_FIELD_CHARS,
  MAX_TAG_CHARS,
  MAX_TAGS_PER_REQUEST,
} from '@/lib/api/limits';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate the free-text contact fields and `tags` of a public-API
 * contact write. Returns an error message for a 400, or null if the
 * body is acceptable. Only checks fields that are present.
 */
export function validateContactInput(body: Record<string, unknown>): string | null {
  for (const field of ['name', 'email', 'company'] as const) {
    const value = body[field];
    if (typeof value === 'string' && value.length > MAX_CONTACT_FIELD_CHARS) {
      return `'${field}' must be at most ${MAX_CONTACT_FIELD_CHARS} characters`;
    }
  }
  if (typeof body.email === 'string' && body.email.trim() && !EMAIL_RE.test(body.email.trim())) {
    return "'email' must be a valid email address";
  }
  if ('tags' in body && body.tags !== undefined) {
    if (!Array.isArray(body.tags)) return "'tags' must be an array of tag names";
    if (body.tags.length > MAX_TAGS_PER_REQUEST) {
      return `'tags' accepts at most ${MAX_TAGS_PER_REQUEST} names`;
    }
    if (body.tags.some((t) => typeof t !== 'string' || t.trim().length === 0 || t.length > MAX_TAG_CHARS)) {
      return `each tag must be a non-empty string of at most ${MAX_TAG_CHARS} characters`;
    }
  }
  return null;
}
