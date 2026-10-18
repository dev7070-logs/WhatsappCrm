"use client";

import { useTranslations } from "next-intl";

import { classifyAuthError, type AuthErrorKind } from "@/lib/auth/auth-errors";

const KEY: Record<AuthErrorKind, string> = {
  rate_limited: "tooManyAttempts",
  invalid_credentials: "invalidCredentials",
  email_not_confirmed: "emailNotConfirmed",
  weak_password: "weakPassword",
  captcha_failed: "captchaFailed",
  // Sign-up treats this as success before it ever reaches a message;
  // anywhere else it must not confirm the account exists.
  account_exists: "generic",
  generic: "generic",
};

/** Translate any Supabase Auth error into a fixed, non-leaking message. */
export function useAuthErrorMessage() {
  const t = useTranslations("AuthErrors");
  return (error: Parameters<typeof classifyAuthError>[0]) =>
    t(KEY[classifyAuthError(error)]);
}
