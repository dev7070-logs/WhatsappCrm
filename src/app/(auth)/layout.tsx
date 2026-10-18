import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { pickMessages } from "@/i18n/pick-messages";

// Shared metadata for auth pages (login / signup / forgot-password).
// None of these should be indexed — they'd compete with the marketing
// landing in SERPs and offer nothing to a searcher who hasn't already
// signed up. Each page still gets its own <title> via its own
// metadata.title override below the route group layout.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

const AUTH_NAMESPACES = [
  "ModeToggle",
  "LoginPage",
  "SignupPage",
  "ForgotPasswordPage",
  "ResetPasswordPage",
  "AuthErrors",
] as const;

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={pickMessages(messages, AUTH_NAMESPACES)}>
      {children}
    </NextIntlClientProvider>
  );
}
