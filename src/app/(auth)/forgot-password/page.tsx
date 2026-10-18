"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthField, FormAlert, SubmitButton } from "@/components/auth/auth-field";
import { ArrowLeft, CheckCircle, KeyRound, Mail } from "lucide-react";
import { useCaptcha } from "@/components/auth/captcha";
import { useAuthErrorMessage } from "@/components/auth/use-auth-error";
import { classifyAuthError } from "@/lib/auth/auth-errors";

export default function ForgotPasswordPage() {
  const t = useTranslations("ForgotPasswordPage");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const captcha = useCaptcha();
  const authMessage = useAuthErrorMessage();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // The emailed link returns to /auth/callback, which exchanges it
    // for a recovery session and forwards to /reset-password (issue
    // #592). Supabase must allow this origin under Authentication →
    // URL Configuration → Redirect URLs, or it silently falls back to
    // its Site URL; see docs/auth-emails.md.
    const { error } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/reset-password")}`,
      captchaToken: captcha.token,
    });
    captcha.reset();

    // Only errors the visitor can act on (slow down / redo the bot
    // check) are shown. Everything else — including "no such user" —
    // falls through to the same neutral "if an account exists…"
    // screen, so this form can't reveal who has an account.
    const kind = error ? classifyAuthError(error) : null;
    if (kind === "rate_limited" || kind === "captcha_failed") {
      setError(authMessage(error));
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  const backLink = (
    <Link
      href="/login"
      className="group inline-flex items-center gap-2 font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
      {t("backToSignIn")}
    </Link>
  );

  if (success) {
    return (
      <AuthShell
        icon={<CheckCircle className="h-6 w-6" />}
        title={t("checkEmailTitle")}
        description={t.rich("checkEmailDesc", {
          email,
          strong: (chunks) => (
            <span className="font-medium text-foreground">{chunks}</span>
          ),
        })}
        footer={backLink}
      >
        {null}
      </AuthShell>
    );
  }

  return (
    <AuthShell
      icon={<KeyRound className="h-6 w-6" />}
      title={t("title")}
      description={t("desc")}
      footer={backLink}
    >
      <form onSubmit={handleReset} className="flex flex-col gap-4">
        {error && <FormAlert tone="error">{error}</FormAlert>}

        <AuthField
          id="email"
          type="email"
          icon={Mail}
          label={t("emailLabel")}
          placeholder={t("emailPlaceholder")}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {captcha.widget}

        <SubmitButton
          loading={loading}
          disabled={!captcha.ready}
          loadingLabel={t("sending")}
        >
          {t("sendLink")}
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
