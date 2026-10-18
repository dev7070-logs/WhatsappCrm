"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  Bot,
  CheckCheck,
  Clock,
  GitBranch,
  MessageSquare,
  Paperclip,
  Radio,
  Search,
  Send,
  Sparkles,
  Tags,
  TrendingUp,
  Zap,
} from "lucide-react";

import { PEOPLE, PersonAvatar, type PersonId } from "@/components/marketing/person-avatar";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------
 * Hero inbox — a looping, scripted conversation inside an app frame.
 * ------------------------------------------------------------------ */

const CHATS: {
  person: PersonId;
  last: string;
  tag: string;
  time: string;
  unread: number;
}[] = [
  { person: "aisha", last: "Is the summer sale still on?", tag: "Lead", time: "now", unread: 2 },
  { person: "rahul", last: "Payment done ✅", tag: "Won", time: "2m", unread: 0 },
  { person: "sofia", last: "Can I reschedule?", tag: "Support", time: "9m", unread: 1 },
  { person: "daniel", last: "Thanks for the quick reply!", tag: "VIP", time: "1h", unread: 0 },
];

type Msg = { from: "them" | "us" | "ai"; text: string };

const SCRIPT: Msg[] = [
  { from: "them", text: "Hi! Is the summer collection still on sale? 👗" },
  { from: "ai", text: "AI draft: “Yes! 20% off until Sunday. Shall I send the catalogue?”" },
  { from: "us", text: "Yes! 20% off until Sunday. Shall I send the catalogue?" },
  { from: "them", text: "Please do 🙌 and do you ship to Pune?" },
  { from: "us", text: "We do — free shipping over ₹999. Catalogue on its way 📎" },
];

export function HeroInbox() {
  const [shown, setShown] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setShown((n) => (n >= SCRIPT.length + 2 ? 1 : n + 1));
    }, 1600);
    return () => clearInterval(id);
  }, []);

  const visible = SCRIPT.slice(0, Math.min(shown, SCRIPT.length));
  const typing = shown < SCRIPT.length && SCRIPT[shown]?.from === "them";

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-elev-3">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-border bg-card-2 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-amber-400/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
          <div className="ml-3 flex h-7 flex-1 items-center gap-2 rounded-full bg-background px-3 text-xs text-muted-foreground">
            <Search className="h-3.5 w-3.5" /> Search conversations
          </div>
        </div>

        <div className="grid h-[380px] grid-cols-1 sm:grid-cols-[210px_1fr]">
          {/* conversation list */}
          <ul className="hidden flex-col border-r border-border sm:flex">
            {CHATS.map((c, i) => (
              <li
                key={c.person}
                className={cn(
                  "flex cursor-default items-center gap-2.5 px-3 py-3 transition-colors",
                  i === 0 ? "bg-primary-soft" : "hover:bg-muted",
                )}
              >
                <PersonAvatar person={c.person} size={34} online={i === 0} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="truncate text-[13px] font-semibold">{PEOPLE[c.person].name}</p>
                    <span className="text-[10px] text-muted-foreground">{c.time}</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{c.last}</p>
                </div>
                {c.unread ? (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {c.unread}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>

          {/* thread */}
          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-2.5 border-b border-border px-4 py-2.5">
              <PersonAvatar person="aisha" size={36} online />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">Aisha Khan</p>
                <p className="text-[11px] text-primary">online · assigned to you</p>
              </div>
              <span className="hidden items-center gap-1 rounded-full bg-primary-soft-2 px-2 py-1 text-[11px] font-semibold text-primary sm:inline-flex">
                <Tags className="h-3 w-3" /> Lead
              </span>
            </div>

            <div className="flex flex-1 flex-col justify-end gap-2 overflow-hidden bg-dot-grid px-4 py-3 text-[13px]">
              {visible.map((m, i) =>
                m.from === "ai" ? (
                  <p
                    key={i}
                    className="flex max-w-[88%] animate-bubble items-start gap-1.5 self-end rounded-2xl border border-dashed border-primary/50 bg-background px-3 py-2 text-xs text-muted-foreground"
                  >
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    {m.text}
                  </p>
                ) : (
                  <p
                    key={i}
                    className={cn(
                      "max-w-[80%] animate-bubble rounded-2xl px-3 py-2 shadow-elev-1",
                      m.from === "them"
                        ? "self-start rounded-tl-sm bg-background"
                        : "flex items-end gap-1 self-end rounded-tr-sm bg-primary text-primary-foreground",
                    )}
                  >
                    {m.text}
                    {m.from === "us" ? (
                      <CheckCheck className="h-3.5 w-3.5 shrink-0 opacity-80" />
                    ) : null}
                  </p>
                ),
              )}
              {typing ? (
                <span className="flex animate-bubble items-center gap-1 self-start rounded-2xl bg-background px-3 py-2.5 shadow-elev-1">
                  <i className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  <i className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground [animation-delay:150ms]" />
                  <i className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground [animation-delay:300ms]" />
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-2 border-t border-border px-3 py-2.5">
              <Paperclip className="h-4 w-4 text-muted-foreground" />
              <div className="h-8 flex-1 rounded-full bg-muted px-3 text-xs leading-8 text-muted-foreground">
                Type a message…
              </div>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Send className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* floating chips */}
      <FloatChip className="-left-6 top-20 hidden md:flex" delay="0s">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft-2 text-primary">
          <TrendingUp className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs text-muted-foreground">Deal won</p>
          <p className="text-sm font-bold">₹48,000</p>
        </div>
      </FloatChip>
      <FloatChip className="-right-6 bottom-16 hidden md:flex" delay="1.5s">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/15 text-sky-500">
          <Radio className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs text-muted-foreground">Broadcast read rate</p>
          <p className="text-sm font-bold">92% · 4,310 sent</p>
        </div>
      </FloatChip>
      <FloatChip className="-right-4 -top-5 hidden lg:flex" delay="3s">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
          <Clock className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs text-muted-foreground">Avg. first reply</p>
          <p className="text-sm font-bold">1m 42s</p>
        </div>
      </FloatChip>
    </div>
  );
}

function FloatChip({
  children,
  className,
  delay,
}: {
  children: ReactNode;
  className?: string;
  delay: string;
}) {
  return (
    <div
      className={cn(
        "absolute z-10 animate-float items-center gap-3 rounded-2xl border border-border bg-card px-3.5 py-2.5 shadow-elev-3",
        className,
      )}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------
 * Showcase tabs — switch between three product surfaces.
 * ------------------------------------------------------------------ */

const TABS = [
  { id: "inbox", label: "Inbox", icon: MessageSquare },
  { id: "pipeline", label: "Pipelines", icon: GitBranch },
  { id: "automation", label: "Automations", icon: Zap },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ShowcaseTabs() {
  const [tab, setTab] = useState<TabId>("pipeline");

  return (
    <div>
      <div
        role="tablist"
        className="mx-auto flex w-fit gap-1 rounded-full border border-border bg-card p-1 shadow-elev-1"
      >
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 sm:px-5",
              tab === id
                ? "bg-primary text-primary-foreground shadow-elev-1"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-elev-2 sm:p-6">
        <div key={tab} className="animate-rise-in">
          {tab === "inbox" && <InboxMock />}
          {tab === "pipeline" && <PipelineMock />}
          {tab === "automation" && <AutomationMock />}
        </div>
      </div>
    </div>
  );
}

function InboxMock() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {CHATS.map((c) => (
        <div
          key={c.person}
          className="rounded-2xl border border-border bg-background p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-elev-2"
        >
          <div className="flex items-center gap-2.5">
            <PersonAvatar person={c.person} size={40} />
            <p className="text-sm font-semibold">{PEOPLE[c.person].name}</p>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{c.last}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="rounded-full bg-primary-soft-2 px-2 py-0.5 text-[11px] font-semibold text-primary">
              {c.tag}
            </span>
            <span className="text-xs text-muted-foreground">{c.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

const STAGES = [
  { name: "New", tone: "bg-sky-500", deals: [["Aisha K.", "₹12,000"], ["Nordic Co.", "₹64,000"]] },
  { name: "Qualified", tone: "bg-amber-500", deals: [["Sofia L.", "₹22,500"]] },
  { name: "Proposal", tone: "bg-violet-500", deals: [["Daniel W.", "₹1,10,000"], ["Mehta & Sons", "₹38,000"]] },
  { name: "Won", tone: "bg-primary", deals: [["Rahul M.", "₹48,000"]] },
];

function PipelineMock() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {STAGES.map((s) => (
        <div key={s.name} className="rounded-2xl bg-muted/60 p-3">
          <div className="mb-3 flex items-center gap-2 px-1">
            <span className={cn("h-2.5 w-2.5 rounded-full", s.tone)} />
            <p className="text-sm font-semibold">{s.name}</p>
            <span className="ml-auto text-xs text-muted-foreground">{s.deals.length}</span>
          </div>
          <div className="flex flex-col gap-2">
            {s.deals.map(([who, value]) => (
              <div
                key={who}
                className="cursor-grab rounded-xl border border-border bg-card p-3 shadow-elev-1 transition-all duration-300 hover:-translate-y-1 hover:rotate-[-1deg] hover:shadow-elev-3"
              >
                <p className="text-sm font-medium">{who}</p>
                <p className="mt-1 text-xs text-muted-foreground">via WhatsApp</p>
                <p className="mt-2 text-sm font-bold text-primary">{value}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const STEPS = [
  { icon: MessageSquare, title: "When a message contains “price”", tone: "bg-sky-500/15 text-sky-500" },
  { icon: Tags, title: "Tag contact as Hot lead", tone: "bg-amber-500/15 text-amber-600" },
  { icon: Bot, title: "AI replies from your price list", tone: "bg-primary-soft-2 text-primary" },
  { icon: Clock, title: "Wait 1 day, then follow up", tone: "bg-violet-500/15 text-violet-500" },
];

function AutomationMock() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center">
      {STEPS.map(({ icon: Icon, title, tone }, i) => (
        <div key={title} className="flex w-full flex-col items-center">
          <div
            className="flex w-full animate-rise-in items-center gap-3 rounded-2xl border border-border bg-background p-3.5 shadow-elev-1 transition-all duration-300 hover:scale-[1.02] hover:shadow-elev-2"
            style={{ animationDelay: `${i * 140}ms` }}
          >
            <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", tone)}>
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {i === 0 ? "Trigger" : `Step ${i}`}
              </p>
              <p className="text-sm font-medium">{title}</p>
            </div>
          </div>
          {i < STEPS.length - 1 ? <span className="h-6 w-0.5 bg-border" /> : null}
        </div>
      ))}
    </div>
  );
}
