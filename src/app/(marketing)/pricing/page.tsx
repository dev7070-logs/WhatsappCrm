import type { Metadata } from "next";
import { Check, ChevronDown, Minus } from "lucide-react";

import { PricingPlans } from "@/components/marketing/pricing-plans";
import { Reveal } from "@/components/marketing/reveal";
import {
  Container,
  CtaBand,
  PageHero,
  SectionHeading,
} from "@/components/marketing/sections";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Self-host WaFlow free forever, or choose a managed plan. No per-seat AI fees.",
};

type Cell = boolean | string;
const COMPARISON: { feature: string; cells: [Cell, Cell, Cell, Cell] }[] = [
  { feature: "Shared inbox", cells: [true, true, true, true] },
  { feature: "Contacts, tags & custom fields", cells: [true, true, true, true] },
  { feature: "Sales pipelines", cells: [true, true, true, true] },
  { feature: "Agents", cells: ["Unlimited", "3", "15", "Unlimited"] },
  { feature: "WhatsApp numbers", cells: ["Unlimited", "1", "3", "Unlimited"] },
  { feature: "Broadcasts / month", cells: ["Unlimited", "5,000", "50,000", "Custom"] },
  { feature: "No-code automations", cells: [true, "Basic", true, true] },
  { feature: "AI auto-reply & knowledge base", cells: [true, false, true, true] },
  { feature: "Developer API & webhooks", cells: [true, true, true, true] },
  { feature: "Managed hosting & backups", cells: [false, true, true, true] },
  { feature: "Uptime SLA", cells: [false, false, false, "99.9%"] },
];

const FAQ = [
  {
    q: "Is WaFlow really free?",
    a: "Yes — the Self-hosted plan is free forever. You only pay for your own server and Meta's per-conversation WhatsApp fees.",
  },
  {
    q: "Do I need the official WhatsApp Business API?",
    a: "Yes. WaFlow uses the official WhatsApp Business Platform, so you need a Meta Business account and a phone number registered for WhatsApp Business. That keeps your number safe from bans that unofficial tools risk.",
  },
  {
    q: "How does AI pricing work?",
    a: "Connect your own AI provider key. You pay the provider directly at their rates — there are no per-seat AI fees, and the key is stored encrypted.",
  },
  {
    q: "Can I sign in with Google?",
    a: "Yes. Teammates can sign in with their Google account in one click, or use email and password.",
  },
  {
    q: "Can I move from a hosted plan to self-hosting later?",
    a: "Absolutely. Your data is yours — export it any time and move it wherever you like. No lock-in.",
  },
];

function CellValue({ value }: { value: Cell }) {
  if (value === true)
    return (
      <span className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-primary-soft-2 text-primary">
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    );
  if (value === false) return <Minus className="mx-auto h-4 w-4 text-muted-foreground/50" />;
  return <span className="font-medium">{value}</span>;
}

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title={
          <>
            Simple pricing. <span className="text-primary">No per-seat surprises.</span>
          </>
        }
        description="Self-host for free forever, or let us run it for you. Every plan includes every core module."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <PricingPlans />
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Prices exclude GST and Meta&apos;s WhatsApp conversation charges.
          </p>
        </Container>
      </section>

      {/* ---------------- COMPARISON ---------------- */}
      <section className="bg-card-2 py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Compare" title="Compare plans in detail" />
          <Reveal className="mt-12">
            <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-elev-1">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="p-5 font-semibold">Feature</th>
                    {["Self-hosted", "Starter", "Growth", "Enterprise"].map((p) => (
                      <th
                        key={p}
                        className={`p-5 text-center font-semibold ${p === "Growth" ? "text-primary" : ""}`}
                      >
                        {p}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row) => (
                    <tr
                      key={row.feature}
                      className="border-b border-border transition-colors last:border-0 hover:bg-primary-soft"
                    >
                      <td className="p-5 text-muted-foreground">{row.feature}</td>
                      {row.cells.map((c, i) => (
                        <td key={i} className="p-5 text-center">
                          <CellValue value={c} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="py-20 sm:py-24">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Questions, answered" />
          <div className="mt-12 flex flex-col gap-3">
            {FAQ.map((item, i) => (
              <Reveal key={item.q} delay={i * 60}>
                <details className="group rounded-2xl border border-border bg-card transition-all duration-300 open:shadow-elev-2 hover:border-primary/30">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted transition-all duration-300 group-open:rotate-180 group-open:bg-primary group-open:text-primary-foreground">
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </summary>
                  <p className="px-5 pb-5 leading-relaxed text-muted-foreground">{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
