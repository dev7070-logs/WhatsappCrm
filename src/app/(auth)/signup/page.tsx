"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  CheckCircle,
  Lock,
  Mail,
  User,
  UsersRound,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthField, FormAlert, SubmitButton } from "@/components/auth/auth-field";
import { GoogleButton, OrDivider } from "@/components/auth/google-button";
import { cn } from "@/lib/utils";
import { useCaptcha } from "@/components/auth/captcha";
import { useAuthErrorMessage } from "@/components/auth/use-auth-error";
import { classifyAuthError, MIN_PASSWORD_LENGTH } from "@/lib/auth/auth-errors";

// `useSearchParams` opts the component out of static prerendering
// unless wrapped in Suspense — same pattern as /login.
export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupPageInner />
    </Suspense>
  );
}

/** 0–4: length, mixed case, digit, symbol. Display-only, not a policy. */
function passwordScore(pw: string): number {
  if (!pw) return 0;
  let score = pw.length >= 8 ? 1 : 0;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.max(score, 1);
}

function SignupPageInner() {
  const searchParams = useSearchParams();
  // When the user lands here from `/join/<token>` we carry the
  // invite token in the query so it survives the signup → email
  // verification → redirect round-trip. `emailRedirectTo` below
  // sends the verified user to /join/<token> so they land on the
  // redeem step instead of being dropped on /dashboard.
  const inviteToken = searchParams.get("invite");
  const t = useTranslations("SignupPage");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const captcha = useCaptcha();
  const authMessage = useAuthErrorMessage();

  const next = inviteToken
    ? `/join/${encodeURIComponent(inviteToken)}`
    : "/dashboard";
  const loginHref = inviteToken
    ? `/login?invite=${encodeURIComponent(inviteToken)}`
    : "/login";

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t("passwordsMismatch"));
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(t("passwordTooShort"));
      return;
    }

    setLoading(true);

    // Always name our own origin as the place the confirmation link
    // returns to. Previously this was left unset unless an invite was
    // involved, so Supabase fell back to its Site URL — which on a
    // freshly-created or self-hosted project is `http://localhost:3000`
    // (issue #595) — and even when the Site URL was right the link
    // landed on `/` with an unexchanged `?code=`, so the user had to
    // sign in again after verifying. /auth/callback exchanges the link
    // for a session and forwards to `next` (issue #592). Supabase still
    // has to allow this origin under Authentication → URL Configuration
    // → Redirect URLs; see docs/auth-emails.md.
    const emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

    const { error } = await createClient().auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo,
        captchaToken: captcha.token,
      },
    });
    captcha.reset();

    // An already-registered email gets the same "check your inbox"
    // screen as a new one, so sign-up can't be used to discover which
    // emails have accounts.
    if (error && classifyAuthError(error) !== "account_exists") {
      setError(authMessage(error));
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

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
      >
        <Link
          href={loginHref}
          className="flex h-12 w-full items-center justify-center rounded-full border border-input text-[15px] font-medium text-foreground transition-all hover:bg-muted hover:shadow-elev-1"
        >
          {t("backToSignIn")}
        </Link>
      </AuthShell>
    );
  }

  const score = passwordScore(password);
  const strengthLabels = [
    "",
    t("strengthWeak"),
    t("strengthFair"),
    t("strengthGood"),
    t("strengthStrong"),
  ];
  const strengthColors = [
    "bg-border",
    "bg-red-500",
    "bg-amber-500",
    "bg-lime-500",
    "bg-primary",
  ];
  const mismatch = confirmPassword.length > 0 && confirmPassword !== password;

  return (
    <AuthShell
      icon={inviteToken ? <UsersRound className="h-6 w-6" /> : undefined}
      title={inviteToken ? t("titleJoin") : t("title")}
      description={inviteToken ? t("descJoin") : t("desc")}
      footer={
        <>
          {t("haveAccount")}{" "}
          <Link
            href={loginHref}
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            {t("signIn")}
          </Link>
        </>
      }
    >
      {error && (
        <div className="mb-4">
          <FormAlert tone="error">{error}</FormAlert>
        </div>
      )}

      <GoogleButton next={next} label={t("signUpWithGoogle")} onError={setError} />

      <OrDivider label={t("orEmail")} />

      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <AuthField
          id="fullName"
          icon={User}
          label={t("fullNameLabel")}
          placeholder={t("fullNamePlaceholder")}
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

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

        <div className="flex flex-col gap-2">
          <AuthField
            id="password"
            type="password"
            icon={Lock}
            label={t("passwordLabel")}
            placeholder={t("passwordPlaceholder")}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {password ? (
            <div className="flex items-center gap-3" aria-live="polite">
              <div className="grid flex-1 grid-cols-4 gap-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 rounded-full transition-colors duration-300",
                      i <= score ? strengthColors[score] : "bg-border",
                    )}
                  />
                ))}
              </div>
              <span className="w-14 text-right text-xs font-medium text-muted-foreground">
                {strengthLabels[score]}
              </span>
            </div>
          ) : null}
        </div>

        <AuthField
          id="confirmPassword"
          type="password"
          icon={Lock}
          label={t("confirmPasswordLabel")}
          placeholder={t("confirmPasswordPlaceholder")}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          aria-invalid={mismatch}
          className={mismatch ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/15" : undefined}
          required
        />

        {captcha.widget}

        <SubmitButton
          loading={loading}
          disabled={!captcha.ready}
          loadingLabel={t("creating")}
        >
          {t("submit")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </SubmitButton>

        <p className="text-center text-xs text-muted-foreground">{t("terms")}</p>
      </form>
    </AuthShell>
  );
}
