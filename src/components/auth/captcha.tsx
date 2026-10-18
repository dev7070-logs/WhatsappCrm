"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ============================================================
// Optional bot protection for the auth forms (Cloudflare Turnstile).
//
// Off unless NEXT_PUBLIC_TURNSTILE_SITE_KEY is set. When on, the
// widget's token is passed to Supabase Auth as `captchaToken`, and
// Supabase verifies it SERVER-side (Authentication → Attack Protection
// → Enable CAPTCHA, provider Turnstile, with your Turnstile secret).
// The browser check alone is not the security boundary — Supabase's
// verification is.
// ============================================================

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface TurnstileApi {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      theme?: "auto" | "light" | "dark";
      callback: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
    },
  ) => string;
  remove: (id: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;
function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  scriptPromise ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("captcha script failed to load"));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

function TurnstileWidget({
  siteKey,
  onToken,
}: {
  siteKey: string;
  onToken: (token: string | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let widgetId: string | null = null;
    let cancelled = false;
    loadTurnstile()
      .then(() => {
        if (cancelled || !ref.current || !window.turnstile) return;
        widgetId = window.turnstile.render(ref.current, {
          sitekey: siteKey,
          theme: "auto",
          callback: (token) => onToken(token),
          "expired-callback": () => onToken(null),
          "error-callback": () => onToken(null),
        });
      })
      .catch(() => onToken(null));
    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [siteKey, onToken]);

  return <div ref={ref} className="flex min-h-[65px] justify-center" />;
}

/**
 * `widget` — render it inside the form (null when CAPTCHA is off).
 * `token`  — pass as `options.captchaToken` to Supabase Auth.
 * `ready`  — false while a required token is still missing.
 * `reset`  — call after every attempt; Turnstile tokens are single-use.
 */
export function useCaptcha() {
  const [token, setToken] = useState<string | null>(null);
  const [generation, setGeneration] = useState(0);
  const onToken = useCallback((t: string | null) => setToken(t), []);

  const reset = useCallback(() => {
    setToken(null);
    setGeneration((g) => g + 1);
  }, []);

  return {
    widget: SITE_KEY ? (
      <TurnstileWidget key={generation} siteKey={SITE_KEY} onToken={onToken} />
    ) : null,
    token: token ?? undefined,
    ready: !SITE_KEY || !!token,
    reset,
  };
}
