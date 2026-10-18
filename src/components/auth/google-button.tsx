"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { useAuthErrorMessage } from "@/components/auth/use-auth-error";
import { classifyAuthError } from "@/lib/auth/auth-errors";
import { useTranslations } from "next-intl";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * "Continue with Google" — Supabase OAuth. Google redirects back to
 * /auth/callback with `?code=`, which the existing callback route
 * exchanges for a session (PKCE) and then forwards to `next`.
 *
 * Needs the Google provider enabled in Supabase (Authentication →
 * Providers → Google) with a Google Cloud OAuth client ID + secret.
 */
export function GoogleButton({
  next,
  label,
  onError,
}: {
  /** Same-origin path to land on after sign-in (validated server-side). */
  next: string;
  label: string;
  onError: (message: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const configured = isSupabaseConfigured();
  const tErr = useTranslations("AuthErrors");
  const authMessage = useAuthErrorMessage();

  const handleClick = async () => {
    setLoading(true);
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        // Always show the account chooser so people with several
        // Gmail accounts can pick the right one.
        queryParams: { prompt: "select_account" },
      },
    });
    // On success the browser is already navigating to Google.
    if (error) {
      // Provider errors can name config internals — show a fixed message.
      onError(
        classifyAuthError(error) === "rate_limited"
          ? authMessage(error)
          : tErr("googleFailed"),
      );
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || !configured}
      className="group relative flex h-12 w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full border border-input bg-card text-[15px] font-medium text-foreground transition-all duration-200 hover:border-foreground/25 hover:shadow-elev-2 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
    >
      {loading ? (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      ) : (
        <GoogleIcon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
      )}
      {label}
    </button>
  );
}

export function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

export function OrDivider({ label }: { label: string }) {
  return (
    <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      {label}
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
