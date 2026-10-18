import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  BarChart3,
  Bot,
  Check,
  CheckCheck,
  Clock,
  Code2,
  GitBranch,
  KeyRound,
  Languages,
  Lock,
  MessageSquare,
  Plug,
  Radio,
  ShieldCheck,
  Sparkles,
  Tags,
  Upload,
  Users,
  Webhook,
  Zap,
} from "lucide-react";

import { PEOPLE, PersonAvatar, type PersonId } from "@/components/marketing/person-avatar";
import { Reveal } from "@/components/marketing/reveal";
import {
  Container,
  CtaBand,
  FeatureCard,
  PageHero,
  PrimaryCta,
  SectionHeading,
} from "@/components/marketing/sections";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Shared inbox, contacts, Kanban pipelines, broadcasts, no-code automations, AI replies and a developer API — everything in WaFlow.",
};

type Module = {
  id: string;
  icon: typeof MessageSquare;
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  visual: ReactNode;
};

const MODULES: Module[] = [
  {
    id: "inbox",
    icon: MessageSquare,
    eyebrow: "Shared inbox",
    title: "Your whole team on one WhatsApp number",
    body: "Every agent sees the same live WhatsApp inbox, with clear ownership so nobody double-replies.",
    bullets: [
      "Per-conversation assignment, status and private notes",
      "Quick replies, templates, media, voice notes and reactions",
      "Real-time updates and browser notifications",
    ],
    visual: <InboxVisual />,
  },
  {
    id: "contacts",
    icon: Users,
    eyebrow: "Contacts",
    title: "A tidy customer list that builds itself",
    body: "Every new chat becomes a contact. Enrich them with tags and custom fields, or import thousands at once.",
    bullets: [
      "Tags and unlimited custom fields",
      "CSV import with automatic de-duplication",
      "Full timeline of every conversation and deal",
    ],
    visual: <ContactsVisual />,
  },
  {
    id: "pipelines",
    icon: GitBranch,
    eyebrow: "Sales pipelines",
    title: "Drag deals from “hello” to “paid”",
    body: "Kanban boards with deals linked to the conversation they came from — so context is always one click away.",
    bullets: [
      "Multiple pipelines with custom stages",
      "Deal values, currencies and win-rate analytics",
      "Open the chat straight from any card",
    ],
    visual: <PipelineVisual />,
  },
  {
    id: "broadcasts",
    icon: Radio,
    eyebrow: "Broadcasts",
    title: "Reach thousands — personally",
    body: "Send Meta-approved template messages to segments of your contacts with per-recipient variables.",
    bullets: [
      "Four-step wizard: template → audience → personalise → send",
      "Delivery and read tracking per recipient",
      "Schedule for later, resume failed sends",
    ],
    visual: <BroadcastVisual />,
  },
  {
    id: "automations",
    icon: Zap,
    eyebrow: "Automations",
    title: "No-code workflows that never sleep",
    body: "A visual builder for the repetitive work: trigger on inbound messages, new contacts, keywords or a schedule.",
    bullets: [
      "Conditional branches, waits and tags",
      "Webhooks to connect any other tool",
      "Run logs for every execution",
    ],
    visual: <AutomationVisual />,
  },
  {
    id: "ai",
    icon: Bot,
    eyebrow: "AI assistant",
    title: "AI replies grounded in your own docs",
    body: "Connect the AI provider of your choice with your own key, stored encrypted. No per-seat AI fees and your data stays yours.",
    bullets: [
      "One-click drafted replies inside the inbox",
      "Optional auto-reply bot with clean human hand-off",
      "Knowledge base that answers from your own documents",
    ],
    visual: <AiVisual />,
  },
];

const PLATFORM = [
  { icon: BarChart3, title: "Real-time dashboard", body: "Response times, daily volume, pipeline value and a cross-module activity feed." },
  { icon: KeyRound, title: "Roles & team accounts", body: "Owner, admin, agent and viewer roles. Invite by link, transfer ownership." },
  { icon: Languages, title: "Multilingual UI", body: "English, Korean, Brazilian Portuguese and Spanish out of the box." },
  { icon: ShieldCheck, title: "Secure by default", body: "Isolated account data, encrypted credentials, verified webhooks and rate limiting built in." },
  { icon: Lock, title: "Your data, your control", body: "Customer conversations stay in your own private workspace — never shared or sold." },
  { icon: Sparkles, title: "Light & dark themes", body: "A clean, modern design with six accent colours in light and dark mode." },
];

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        title={
          <>
            Everything your team needs to{" "}
            <span className="text-primary">sell on WhatsApp</span>
          </>
        }
        description="Six modules that work together — plus a developer API for when you want to build on top."
      >
        <div className="flex flex-wrap justify-center gap-2">
          {MODULES.map((m) => (
            <a
              key={m.id}
              href={`#${m.id}`}
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-elev-1"
            >
              <m.icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
              {m.eyebrow}
            </a>
          ))}
        </div>
      </PageHero>

      {MODULES.map((m, i) => (
        <section
          key={m.id}
          id={m.id}
          className={cn("scroll-mt-20 py-20 sm:py-24", i % 2 === 1 && "bg-card-2")}
        >
          <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal className={cn(i % 2 === 1 && "lg:order-2")}>
              <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-soft-2">
                  <m.icon className="h-4 w-4" />
                </span>
                {m.eyebrow}
              </span>
              <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                {m.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {m.body}
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {m.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={150} className={cn(i % 2 === 1 && "lg:order-1")}>
              <div className="rounded-3xl border border-border bg-card p-5 shadow-elev-2 transition-all duration-500 hover:-translate-y-1 hover:shadow-elev-3 sm:p-7">
                {m.visual}
              </div>
            </Reveal>
          </Container>
        </section>
      ))}

      {/* ---------------- PLATFORM ---------------- */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="And the rest"
            title="Platform features included"
            description="The boring-but-critical parts are already done for you."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PLATFORM.map((p, i) => (
              <FeatureCard key={p.title} icon={p.icon} title={p.title} delay={i * 70}>
                {p.body}
              </FeatureCard>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- DEVELOPERS ---------------- */}
      <section id="developers" className="scroll-mt-20 py-20 sm:py-24">
        <Container>
          <Reveal>
            <div className="grid overflow-hidden rounded-[2rem] border border-border bg-card lg:grid-cols-2">
              <div className="p-8 sm:p-12">
                <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
                  <Code2 className="h-4 w-4" /> For developers
                </span>
                <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Build on top of your CRM
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  A REST API with scoped, revocable keys and signed outbound
                  webhooks, so your own tools and workflows can work with your
                  CRM data.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    { icon: Code2, t: "REST /api/v1" },
                    { icon: Webhook, t: "Signed webhooks" },
                    { icon: Plug, t: "Integrations" },
                    { icon: KeyRound, t: "Scoped API keys" },
                  ].map(({ icon: Icon, t }) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm font-medium transition-colors hover:bg-primary-soft-2 hover:text-primary"
                    >
                      <Icon className="h-4 w-4" /> {t}
                    </span>
                  ))}
                </div>
                <PrimaryCta href="/signup" className="mt-8">
                  Get your API key
                </PrimaryCta>
              </div>
              <div className="bg-[oklch(0.17_0.01_200)] p-6 font-mono text-[13px] leading-relaxed text-[oklch(0.9_0.01_200)] sm:p-10">
                <p className="text-[oklch(0.6_0.02_200)]"># send a WhatsApp message</p>
                <p>
                  <span className="text-[oklch(0.78_0.14_160)]">curl</span> -X POST \
                </p>
                <p className="pl-4">https://crm.example.com/api/v1/messages \</p>
                <p className="pl-4">
                  -H <span className="text-[oklch(0.82_0.12_80)]">&quot;Authorization: Bearer YOUR_API_KEY&quot;</span> \
                </p>
                <p className="pl-4">-d &apos;{"{"}</p>
                <p className="pl-8">
                  <span className="text-[oklch(0.78_0.12_250)]">&quot;to&quot;</span>:{" "}
                  <span className="text-[oklch(0.82_0.12_80)]">&quot;+919876543210&quot;</span>,
                </p>
                <p className="pl-8">
                  <span className="text-[oklch(0.78_0.12_250)]">&quot;text&quot;</span>:{" "}
                  <span className="text-[oklch(0.82_0.12_80)]">&quot;Your order has shipped 🚚&quot;</span>
                </p>
                <p className="pl-4">{"}"}&apos;</p>
                <p className="mt-4 text-[oklch(0.6_0.02_200)]"># → 201 Created</p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <CtaBand title="Ready to see it with your own number?" />
    </>
  );
}

/* ----------------------------- visuals ----------------------------- */

function Row({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-border bg-background p-3 transition-all duration-300 hover:translate-x-1 hover:border-primary/30",
        className,
      )}
    >
      {children}
    </div>
  );
}

function InboxVisual() {
  return (
    <div className="flex flex-col gap-2.5">
      {(
        [
          ["aisha", "Is the summer sale still on?", "You"],
          ["rahul", "Payment done ✅", "Priya"],
          ["sofia", "Can I reschedule to Friday?", "Unassigned"],
          ["daniel", "Thanks for the quick reply!", "Arjun"],
        ] as [PersonId, string, string][]
      ).map(([person, msg, who]) => (
        <Row key={person}>
          <PersonAvatar person={person} size={36} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{PEOPLE[person].name}</p>
            <p className="truncate text-xs text-muted-foreground">{msg}</p>
          </div>
          <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
            {who}
          </span>
        </Row>
      ))}
    </div>
  );
}

function ContactsVisual() {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-dashed border-primary/40 bg-primary-soft p-3 text-sm">
        <Upload className="h-4 w-4 text-primary" />
        <span className="font-medium">customers.csv</span>
        <span className="ml-auto text-xs text-muted-foreground">2,148 rows · 37 duplicates merged</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {(
          [
            ["aisha", ["VIP", "Mumbai"]],
            ["emma", ["Wholesale"]],
            ["sofia", ["Lead", "Instagram ad"]],
          ] as [PersonId, string[]][]
        ).map(([person, tags]) => (
          <Row key={person}>
            <PersonAvatar person={person} size={32} />
            <p className="flex-1 text-sm font-semibold">{PEOPLE[person].name}</p>
            {(tags as string[]).map((t) => (
              <span key={t} className="rounded-full bg-primary-soft-2 px-2 py-0.5 text-[11px] font-semibold text-primary">
                {t}
              </span>
            ))}
          </Row>
        ))}
      </div>
    </div>
  );
}

function PipelineVisual() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        ["New", "bg-sky-500", ["₹12k", "₹64k"]],
        ["Proposal", "bg-violet-500", ["₹1.1L"]],
        ["Won", "bg-primary", ["₹48k", "₹22k"]],
      ].map(([stage, tone, deals]) => (
        <div key={stage as string} className="rounded-2xl bg-muted/70 p-2.5">
          <p className="mb-2 flex items-center gap-1.5 px-1 text-xs font-semibold">
            <span className={cn("h-2 w-2 rounded-full", tone as string)} />
            {stage as string}
          </p>
          {(deals as string[]).map((d) => (
            <div
              key={d}
              className="mb-2 rounded-xl border border-border bg-card p-2.5 shadow-elev-1 transition-all duration-300 hover:-translate-y-1 hover:rotate-[-2deg] hover:shadow-elev-3"
            >
              <div className="h-1.5 w-10 rounded-full bg-muted" />
              <p className="mt-2 text-sm font-bold text-primary">{d}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function BroadcastVisual() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-semibold">Diwali offer 🎉</p>
        <span className="rounded-full bg-primary-soft-2 px-2.5 py-1 text-xs font-semibold text-primary">Sending</span>
      </div>
      {[
        ["Sent", 100, "4,310"],
        ["Delivered", 97, "4,180"],
        ["Read", 92, "3,965"],
        ["Replied", 31, "1,336"],
      ].map(([label, pct, n]) => (
        <div key={label as string} className="mt-4">
          <div className="mb-1.5 flex justify-between text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <CheckCheck className="h-4 w-4" /> {label as string}
            </span>
            <span className="font-semibold">{n as string}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AutomationVisual() {
  return (
    <div className="flex flex-col items-center gap-0">
      {[
        [MessageSquare, "Inbound message contains “price”", "bg-sky-500/15 text-sky-500"],
        [Tags, "Add tag: Hot lead", "bg-amber-500/15 text-amber-600"],
        [Clock, "Wait 24 hours", "bg-violet-500/15 text-violet-500"],
        [Webhook, "POST to Google Sheets", "bg-primary-soft-2 text-primary"],
      ].map(([Icon, label, tone], i, arr) => {
        const I = Icon as typeof Tags;
        return (
          <div key={label as string} className="flex w-full flex-col items-center">
            <Row className="w-full">
              <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", tone as string)}>
                <I className="h-4 w-4" />
              </span>
              <span className="text-sm font-medium">{label as string}</span>
            </Row>
            {i < arr.length - 1 ? <span className="h-4 w-0.5 bg-border" /> : null}
          </div>
        );
      })}
    </div>
  );
}

function AiVisual() {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <p className="max-w-[85%] self-start rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5">
        What&apos;s your return policy for sale items?
      </p>
      <div className="self-end rounded-2xl border border-dashed border-primary/50 bg-primary-soft p-3.5">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" /> AI draft · from “Returns policy.pdf”
        </p>
        <p className="mt-1.5">
          Sale items can be exchanged within 14 days in original condition 😊
        </p>
        <div className="mt-3 flex gap-2">
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Send</span>
          <span className="rounded-full border border-border px-3 py-1 text-xs font-medium">Edit</span>
        </div>
      </div>
    </div>
  );
}
