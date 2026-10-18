"use client";

// ============================================================
// /reset-password — the form the password-reset email leads to.
//
// The emailed link lands on /auth/callback, which exchanges it for a
// session and 303s here. So on arrival the visitor either has a
// recovery session (show the form) or doesn't (the link was spent,
// expired, or opened in a browser without the PKCE verifier cookie —
// say so, with a way to request a new one). Bouncing to /login with
// no explanation was the locked-out experience issue #592 describes.
//
// Not gated by the middleware on purpose: the "expired" state must be
// reachable signed-out, and a signed-in visitor must not be redirected
// away from the very page they need.
// ============================================================

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthField, FormAlert, SubmitButton } from "@/components/auth/auth-field";
import { CheckCircle, KeyRound, Loader2, Lock, MailX } from "lucide-react";
import { useAuthErrorMessage } from "@/components/auth/use-auth-error";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/auth-errors";

type Status = "checking" | "ready" | "expired" | "done";

export default function ResetPasswordPage() {
  const t = useTranslations("ResetPasswordPage");

  // Without Supabase keys there is no session to check — show the
  // "expired" state (with links back) instead of hanging on "checking".
  const [status, setStatus] = useState<Status>(() =>
    isSupabaseConfigured() ? "checking" : "expired",
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const authMessage = useAuthErrorMessage();

  useEffect(() => {
    let cancelled = false;
    if (!isSupabaseConfigured()) return;
    // The callback wrote the session cookies server-side; the browser
    // client reads them here. No user → the link didn't yield a session.
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => {
        if (!cancelled) setStatus(user ? "ready" : "expired");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t("passwordsMismatch"));
      return;
    }
    // Same floor as /signup.
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(t("passwordTooShort"));
      return;
    }

    setSaving(true);
    const { error } = await createClient().auth.updateUser({ password });
    setSaving(false);

    if (error) {
      setError(authMessage(error));
      return;
    }
    setStatus("done");
  };

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("checking")}
        </div>
      </div>
    );
  }

  const primaryLinkClass =
    "flex h-12 w-full items-center justify-center rounded-full bg-primary text-[15px] font-semibold text-primary-foreground transition-all hover:bg-primary-hover hover:shadow-elev-2";
  const outlineLinkClass =
    "flex h-12 w-full items-center justify-center rounded-full border border-input text-[15px] font-medium text-foreground transition-all hover:bg-muted";

  if (status === "expired") {
    return (
      <AuthShell
        icon={<MailX className="h-6 w-6" />}
        title={t("expiredTitle")}
        description={t("expiredDesc")}
      >
        <div className="flex flex-col gap-3">
          <Link href="/forgot-password" className={primaryLinkClass}>
            {t("requestNewLink")}
          </Link>
          <Link href="/login" className={outlineLinkClass}>
            {t("backToSignIn")}
          </Link>
        </div>
      </AuthShell>
    );
  }

  if (status === "done") {
    return (
      <AuthShell
        icon={<CheckCircle className="h-6 w-6" />}
        title={t("successTitle")}
        description={t("successDesc")}
      >
        <button
          type="button"
          className={primaryLinkClass}
          onClick={() => {
            // Full-page navigation, like /login: the middleware
            // gating /dashboard must see the session cookies on a
            // fresh top-level request, which a soft router.push
            // can race (issue #365).
            // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- deliberate full reload so the auth cookies reach the middleware
            window.location.href = "/dashboard";
          }}
        >
          {t("continueToDashboard")}
        </button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      icon={<KeyRound className="h-6 w-6" />}
      title={t("title")}
      description={t("desc")}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <FormAlert tone="error">{error}</FormAlert>}

        <AuthField
          id="password"
          type="password"
          icon={Lock}
          autoComplete="new-password"
          label={t("passwordLabel")}
          placeholder={t("passwordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <AuthField
          id="confirmPassword"
          type="password"
          icon={Lock}
          autoComplete="new-password"
          label={t("confirmPasswordLabel")}
          placeholder={t("confirmPasswordPlaceholder")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <SubmitButton loading={saving} loadingLabel={t("saving")}>
          {t("submit")}
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
