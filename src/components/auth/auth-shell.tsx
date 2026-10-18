"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  Bot,
  CheckCheck,
  MessageSquare,
  Radio,
  ShieldCheck,
  Users,
} from "lucide-react";

import { ModeToggle } from "@/components/layout/mode-toggle";
import { PersonAvatar } from "@/components/marketing/person-avatar";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isDemoPreview } from "@/lib/demo";

/**
 * Two-pane layout shared by every auth page (login, signup, forgot /
 * reset password). Left: a flat, primary-coloured brand panel with an
 * animated chat preview (hidden below lg). Right: the form column.
 */
export function AuthShell({
  title,
  description,
  icon,
  children,
  footer,
}: {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const configured = isSupabaseConfigured();

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.05fr_1fr]">
      <BrandPanel />

      <div className="relative flex min-h-screen flex-col">
        <div className="flex items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Home
          </Link>
          <ModeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-5 pb-12 sm:px-8">
          <div className="w-full max-w-[420px] animate-rise-in">
            <Link href="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
              <LogoMark />
              <span className="font-heading text-lg font-bold tracking-tight">
                WaFlow
              </span>
            </Link>

            {icon ? (
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft-2 text-primary">
                {icon}
              </div>
            ) : null}
            <h1 className="font-heading text-[28px] font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-2 text-[15px] text-muted-foreground">
                {description}
              </p>
            ) : null}

            {!configured ? (
              <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
                <strong className="font-semibold">Setup needed:</strong> add your
                Supabase keys to <code className="font-mono">.env.local</code>{" "}
                and restart the server to enable sign-in.
                {isDemoPreview() ? (
                  <Link
                    href="/dashboard"
                    className="mt-2 block font-semibold underline underline-offset-4"
                  >
                    Open the demo preview →
                  </Link>
                ) : null}
              </div>
            ) : null}

            <div className="mt-8">{children}</div>

            {footer ? (
              <div className="mt-8 text-center text-sm text-muted-foreground">
                {footer}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-elev-1 ${className}`}
    >
      <MessageSquare className="h-5 w-5" />
    </span>
  );
}

const PERKS = [
  { icon: Users, text: "One shared WhatsApp inbox for the whole team" },
  { icon: Radio, text: "Broadcasts with delivery & read tracking" },
  { icon: Bot, text: "AI replies trained on your own knowledge base" },
  { icon: ShieldCheck, text: "Private by design — your data stays yours" },
];

function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex lg:h-screen lg:flex-col lg:justify-between lg:p-10 xl:p-14 lg:sticky lg:top-0">
      {/* Flat geometric decoration — solid shapes, no gradients. */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary-foreground/10" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-primary-foreground/[0.07]" />
      <div className="pointer-events-none absolute right-16 bottom-40 h-24 w-24 animate-spin-slow rounded-3xl border-2 border-dashed border-primary-foreground/20" />

      <Link href="/" className="relative flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground text-primary">
          <MessageSquare className="h-5 w-5" />
        </span>
        <span className="font-heading text-xl font-bold tracking-tight">WaFlow</span>
      </Link>

      <div className="relative my-6 max-w-md">
        <h2 className="font-heading text-4xl font-extrabold leading-[1.1] tracking-tight xl:text-[44px]">
          Every WhatsApp conversation, one calm inbox.
        </h2>
        <p className="mt-4 text-lg opacity-85">
          Sell, support and automate — together with your whole team.
        </p>

        <ChatPreview />
      </div>

      <ul className="relative grid grid-cols-2 gap-x-4 gap-y-3 text-[13px] leading-snug">
        {PERKS.map(({ icon: Icon, text }, i) => (
          <li
            key={text}
            className="flex animate-rise-in items-center gap-3"
            style={{ animationDelay: `${400 + i * 120}ms` }}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15">
              <Icon className="h-4 w-4" />
            </span>
            <span className="opacity-90">{text}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function ChatPreview() {
  return (
    <div className="mt-8 animate-float rounded-3xl bg-background p-4 text-foreground shadow-elev-3">
      <div className="flex items-center gap-3 border-b border-border pb-3">
        <PersonAvatar person="aisha" size={38} online />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Aisha Khan</p>
          <p className="text-xs text-primary">online</p>
        </div>
        <span className="rounded-full bg-primary-soft-2 px-2 py-0.5 text-[11px] font-semibold text-primary">
          New lead
        </span>
      </div>
      <div className="flex flex-col gap-2 pt-3 text-sm">
        <p
          className="max-w-[80%] animate-bubble self-start rounded-2xl rounded-tl-sm bg-muted px-3 py-2"
          style={{ animationDelay: "300ms" }}
        >
          Hi! Is the summer collection still on sale? 👗
        </p>
        <p
          className="flex max-w-[80%] animate-bubble items-end gap-1 self-end rounded-2xl rounded-tr-sm bg-primary-soft-2 px-3 py-2"
          style={{ animationDelay: "1100ms" }}
        >
          Yes — 20% off until Sunday. Want the catalogue?
          <CheckCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
        </p>
        <span
          className="flex animate-bubble items-center gap-1 self-start rounded-2xl bg-muted px-3 py-2.5"
          style={{ animationDelay: "1900ms" }}
        >
          <i className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground" />
          <i className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground [animation-delay:150ms]" />
          <i className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground [animation-delay:300ms]" />
        </span>
      </div>
    </div>
  );
}
