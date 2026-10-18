// Server-side input caps. Client-side checks are UX only; these are
// the actual boundary, and keep a single request from fanning out into
// thousands of paid WhatsApp / AI-provider calls or huge DB rows.

/** Same cap the public API's broadcast core already enforces. */
export const MAX_BROADCAST_RECIPIENTS = 1000
/** Template body variables per recipient (Meta allows far fewer). */
export const MAX_TEMPLATE_PARAMS = 50
export const MAX_TEMPLATE_PARAM_CHARS = 1024

/** One AI playground turn. */
export const MAX_AI_MESSAGE_CHARS = 4000
/** AI knowledge-base document (≈ 60 pages of text). */
export const MAX_KB_TITLE_CHARS = 200
export const MAX_KB_CONTENT_CHARS = 200_000

/** Tags on one contact via the public API. */
export const MAX_TAGS_PER_REQUEST = 50
export const MAX_TAG_CHARS = 50

/** Free-text contact fields via the public API. */
export const MAX_CONTACT_FIELD_CHARS = 200
