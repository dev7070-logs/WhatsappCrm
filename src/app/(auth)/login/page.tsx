"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, Lock, Mail, UsersRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthField, FormAlert, SubmitButton } from "@/components/auth/auth-field";
import { GoogleButton, OrDivider } from "@/components/auth/google-button";
import { useCaptcha } from "@/components/auth/captcha";
import { useAuthErrorMessage } from "@/components/auth/use-auth-error";

// `useSearchParams` opts the component out of static prerendering
// unless it sits under a Suspense boundary. We split the form into
// a child component so the outer page can prerender the chrome
// (background, card frame) while the form hydrates with the query
// string on the client.
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const searchParams = useSearchParams();
  // Forwarded from `/join/<token>` when the visitor already has an
  // account. After a successful sign-in we send them to the join
  // page to accept rather than to /dashboard.
  const inviteToken = searchParams.get("invite");
  const t = useTranslations("LoginPage");
  // Set by /auth/callback when an emailed link (confirmation, password
  // reset) could not be turned into a session — see src/lib/auth/callback.ts.
  const linkError = searchParams.get("error");
  const linkErrorMessage =
    linkError === "link_expired"
      ? t("linkExpired")
      : linkError === "link_invalid"
        ? t("linkInvalid")
        : null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const captcha = useCaptcha();
  const authMessage = useAuthErrorMessage();

  const destination = inviteToken
    ? `/join/${encodeURIComponent(inviteToken)}`
    : "/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await createClient().auth.signInWithPassword({
      email,
      password,
      options: { captchaToken: captcha.token },
    });

    if (error) {
      // Fixed message per category — never Supabase's raw text, which
      // could reveal whether the email has an account.
      setError(authMessage(error));
      captcha.reset();
      setLoading(false);
      return;
    }

    // Full-page navigation (not router.push) so the browser issues a
    // fresh top-level request that carries the just-written Supabase
    // auth cookies to the middleware gating /dashboard. A soft
    // client-side navigation can reach the protected route before the
    // server observes the new session, so the middleware bounces it
    // back to /login — which looks like the page "just refreshing"
    // instead of signing in (issue #365). Mirrors the deliberate full
    // reload the invite-accept flow already uses in join/[token].
    window.location.href = destination;
  };

  return (
    <AuthShell
      icon={inviteToken ? <UsersRound className="h-6 w-6" /> : undefined}
      title={inviteToken ? t("titleAccept") : t("titleWelcome")}
      description={inviteToken ? t("descAccept") : t("descWelcome")}
      footer={
        <>
          {t("noAccount")}{" "}
          <Link
            href={
              inviteToken
                ? `/signup?invite=${encodeURIComponent(inviteToken)}`
                : "/signup"
            }
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            {t("createAccount")}
          </Link>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {linkErrorMessage && !error && (
          <FormAlert tone="warning">{linkErrorMessage}</FormAlert>
        )}
        {error && <FormAlert tone="error">{error}</FormAlert>}
      </div>

      <div className={error || linkErrorMessage ? "mt-4" : ""}>
        <GoogleButton
          next={destination}
          label={t("continueWithGoogle")}
          onError={setError}
        />
      </div>

      <OrDivider label={t("orEmail")} />

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
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

        <AuthField
          id="password"
          type="password"
          icon={Lock}
          label={t("passwordLabel")}
          placeholder={t("passwordPlaceholder")}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          trailingLabel={
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          }
        />

        {captcha.widget}

        <SubmitButton
          loading={loading}
          disabled={!captcha.ready}
          loadingLabel={t("signingIn")}
        >
          {t("signIn")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
