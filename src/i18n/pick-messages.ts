import type { AbstractIntlMessages } from 'next-intl';

/**
 * Subset of the message catalogue to ship to a client subtree.
 *
 * Every NextIntlClientProvider serialises its `messages` into the page
 * HTML. Public pages (landing, auth) only need a few namespaces, so
 * they get just those instead of the whole app's catalogue.
 */
export function pickMessages(
  messages: AbstractIntlMessages,
  namespaces: readonly string[],
): AbstractIntlMessages {
  const out: AbstractIntlMessages = {};
  for (const ns of namespaces) {
    if (ns in messages) out[ns] = messages[ns];
  }
  return out;
}
