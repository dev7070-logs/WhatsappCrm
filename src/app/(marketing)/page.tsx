import type { Metadata } from "next";
import {
  Bot,
  Building2,
  CheckCircle2,
  GitBranch,
  GraduationCap,
  MessageSquare,
  Radio,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Stethoscope,
  Users,
  UserPlus,
  Zap,
} from "lucide-react";

import { HeroInbox, ShowcaseTabs } from "@/components/marketing/product-mocks";
import { CountUp, Reveal } from "@/components/marketing/reveal";
import {
  Container,
  CtaBand,
  FeatureCard,
  PrimaryCta,
  SecondaryCta,
  SectionHeading,
} from "@/components/marketing/sections";

export const metadata: Metadata = {
  title: "WhatsApp CRM — shared inbox, pipelines & automations",
  description:
    "Self-hostable CRM for WhatsApp: shared team inbox, contacts, sales pipelines, broadcasts, no-code automations and an AI reply assistant.",
};

const HIGHLIGHTS = [
  "Shared team inbox",
  "Kanban pipelines",
  "Bulk broadcasts",
  "Read receipts",
  "AI-drafted replies",
  "No-code automations",
  "CSV import",
  "Team roles",
  "Webhooks",
  "4 languages",
];

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Shared team inbox",
    href: "/features#inbox",
    body: "Many agents, one WhatsApp number. Assign chats, add private notes, track status and never double-reply.",
  },
  {
    icon: Users,
    title: "Contacts & tags",
    href: "/features#contacts",
    body: "Custom fields, tags, CSV import and automatic de-duplication — a clean customer list from day one.",
  },
  {
    icon: GitBranch,
    title: "Sales pipelines",
    href: "/features#pipelines",
    body: "Drag-and-drop Kanban deals linked straight to the conversation that created them.",
  },
  {
    icon: Radio,
    title: "Broadcasts",
    href: "/features#broadcasts",
    body: "Send Meta-approved templates to thousands with per-recipient variables and live read tracking.",
  },
  {
    icon: Zap,
    title: "No-code automations",
    href: "/features#automations",
    body: "Trigger on keywords, new contacts or schedules. Branch, wait, tag and call webhooks visually.",
  },
  {
    icon: Bot,
    title: "AI reply assistant",
    href: "/features#ai",
    body: "One-click AI-drafted replies and an optional auto-reply bot, answering from your own FAQs and policies.",
  },
];

const STEPS = [
  {
    icon: Smartphone,
    title: "Connect your number",
    body: "Paste your WhatsApp Business API credentials. Tokens are encrypted at rest.",
  },
  {
    icon: UserPlus,
    title: "Invite your team",
    body: "Owner, admin, agent or viewer roles — share one inbox with everyone.",
  },
  {
    icon: Zap,
    title: "Automate & grow",
    body: "Launch broadcasts, build flows and let AI handle the repetitive questions.",
  },
];

const USE_CASES = [
  { icon: ShoppingBag, title: "Retail & D2C", body: "Catalogue requests, order updates and abandoned-cart nudges." },
  { icon: Building2, title: "Real estate", body: "Qualify leads from ads and move them through viewing → deal." },
  { icon: GraduationCap, title: "Education", body: "Admissions enquiries, fee reminders and batch announcements." },
  { icon: Stethoscope, title: "Clinics", body: "Appointment booking, reminders and follow-ups in one thread." },
];

export default function HomePage() {
  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-70 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-primary-soft" />
        <Container className="relative grid items-center gap-14 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-28">
          <div className="text-center lg:text-left">
            <h1
              className="animate-rise-in font-heading text-[42px] font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-[68px]"
              style={{ animationDelay: "100ms" }}
            >
              Turn WhatsApp chats into{" "}
              <span className="relative whitespace-nowrap text-primary">
                closed deals
                <svg
                  viewBox="0 0 300 12"
                  className="absolute -bottom-2 left-0 h-3 w-full text-primary/40"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 9C60 3 140 2 298 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </h1>
            <p
              className="mx-auto mt-6 max-w-xl animate-rise-in text-lg leading-relaxed text-muted-foreground lg:mx-0"
              style={{ animationDelay: "200ms" }}
            >
              A shared inbox, sales pipelines, broadcasts and no-code
              automations for your whole team — self-hosted, so your customer
              data never leaves your hands.
            </p>
            <div
              className="mt-9 flex animate-rise-in flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
              style={{ animationDelay: "300ms" }}
            >
              <PrimaryCta href="/signup">Start for free</PrimaryCta>
              <SecondaryCta href="/features">Explore features</SecondaryCta>
            </div>
            <ul
              className="mt-8 flex animate-rise-in flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground lg:justify-start"
              style={{ animationDelay: "400ms" }}
            >
              {["No per-seat fees", "Your data stays yours", "Sign in with Google"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-rise-in" style={{ animationDelay: "250ms" }}>
            <HeroInbox />
          </div>
        </Container>
      </section>

      {/* ---------------- STACK MARQUEE ---------------- */}
      <section className="border-y border-border bg-card py-6">
        <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max animate-marquee gap-3 group-hover:[animation-play-state:paused]">
            {[...HIGHLIGHTS, ...HIGHLIGHTS].map((item, i) => (
              <span
                key={i}
                className="whitespace-nowrap rounded-full border border-border bg-background px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- STATS ---------------- */}
      <section className="py-16">
        <Container>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { to: 6, suffix: "", label: "Modules in one app" },
              { to: 4, suffix: "", label: "UI languages built in" },
              { to: 100, suffix: "%", label: "Data ownership" },
              { to: 0, suffix: "", prefix: "₹", label: "Per-seat fees, ever" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 90}>
                <div className="rounded-3xl border border-border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-elev-2">
                  <p className="font-heading text-4xl font-extrabold text-primary sm:text-5xl">
                    <CountUp to={s.to} suffix={s.suffix} prefix={s.prefix} />
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- FEATURES ---------------- */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Everything in one place"
            title="One app for every WhatsApp conversation"
            description="Stop juggling phones, spreadsheets and copy-paste. WaFlow gives sales and support a single, organised workspace."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} icon={f.icon} title={f.title} href={f.href} delay={i * 80}>
                {f.body}
              </FeatureCard>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- SHOWCASE ---------------- */}
      <section className="bg-card-2 py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="See it in action"
            title="Built for the way your team actually works"
            description="Click through the main surfaces — every card here mirrors a real screen in the app."
          />
          <Reveal className="mt-10">
            <ShowcaseTabs />
          </Reveal>
        </Container>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="Live in an afternoon"
            description="No infra team required. Deploy, connect, invite — done."
          />
          <div className="relative mt-14 grid gap-6 md:grid-cols-3">
            <div className="pointer-events-none absolute left-[16%] right-[16%] top-8 hidden h-0.5 border-t-2 border-dashed border-border md:block" />
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 120}>
                <div className="group relative text-center">
                  <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-elev-2 transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-6">
                    <Icon className="h-7 w-7" />
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-foreground text-xs font-bold text-background">
                      {i + 1}
                    </span>
                  </span>
                  <h3 className="mt-6 font-heading text-xl font-bold">{title}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-muted-foreground">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- USE CASES ---------------- */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.3fr]">
            <SectionHeading
              align="left"
              eyebrow="Who it's for"
              title="Any business that sells on WhatsApp"
              description="From a two-person shop to a 50-agent support desk, the same inbox scales with you."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {USE_CASES.map(({ icon: Icon, title, body }, i) => (
                <Reveal key={title} delay={i * 90}>
                  <div className="group flex h-full gap-4 rounded-3xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:bg-primary-soft hover:shadow-elev-2">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-semibold">{title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------- SECURITY STRIP ---------------- */}
      <section className="pb-4">
        <Container>
          <Reveal>
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-6 text-center sm:flex-row sm:text-left">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft-2 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Secure by default.</strong>{" "}
                Every account&apos;s data is isolated, credentials are encrypted,
                incoming webhooks are verified and every endpoint is rate
                limited — out of the box.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
