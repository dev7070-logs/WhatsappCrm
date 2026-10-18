import type { Metadata } from "next";
import {
  Code2,
  HeartHandshake,
  Layers,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Rocket,
} from "lucide-react";

import { ContactForm } from "@/components/marketing/contact-form";
import { CONTACT_EMAIL } from "@/lib/site";
import { Reveal } from "@/components/marketing/reveal";
import {
  Container,
  CtaBand,
  FeatureCard,
  PageHero,
  SectionHeading,
} from "@/components/marketing/sections";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why we built a self-hostable WhatsApp CRM — and how to get in touch.",
};

const VALUES = [
  {
    icon: Lock,
    title: "You own your data",
    body: "Your workspace, your domain, your customers. Conversations are never shared, mined or sold.",
  },
  {
    icon: Code2,
    title: "Built to connect",
    body: "A clean API and webhooks so WaFlow fits into the tools your team already uses.",
  },
  {
    icon: HeartHandshake,
    title: "Fair pricing",
    body: "No per-seat fees, no AI mark-up. Add the whole team without watching the meter.",
  },
];

const TIMELINE = [
  { icon: MessageSquare, title: "Shared inbox", body: "One WhatsApp number, many agents, zero chaos." },
  { icon: Layers, title: "CRM modules", body: "Contacts, pipelines, broadcasts and automations joined in." },
  { icon: Rocket, title: "AI & API", body: "AI-drafted replies, a developer API and webhooks." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={
          <>
            Customer conversations deserve{" "}
            <span className="text-primary">better tools</span>
          </>
        }
        description="Billions of people talk to businesses on WhatsApp. Most teams still run it from one shared phone. We built WaFlow to fix that — and to keep it in your hands."
      />

      {/* ---------------- STORY ---------------- */}
      <section className="py-20 sm:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
              From one shared phone to a real sales desk
            </h2>
            <div className="mt-6 flex flex-col gap-4 text-lg leading-relaxed text-muted-foreground">
              <p>
                Small teams sell on WhatsApp every day, but the tools were
                either a single phone passed around the office or an expensive
                SaaS charging per seat while holding your customer data.
              </p>
              <p>
                WaFlow is a different deal: a complete WhatsApp CRM with the
                features of the big platforms — on your own terms, without
                per-seat pricing.
              </p>
            </div>
          </Reveal>
          <div className="relative flex flex-col gap-4">
            <div className="absolute bottom-8 left-7 top-8 w-0.5 bg-border" />
            {TIMELINE.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 140}>
                <div className="group relative flex items-start gap-5 rounded-3xl p-3 transition-colors hover:bg-card">
                  <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-elev-1 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Step {i + 1}
                    </p>
                    <h3 className="font-heading text-lg font-bold">{title}</h3>
                    <p className="text-muted-foreground">{body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- VALUES ---------------- */}
      <section className="bg-card-2 py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="What we believe" title="Three principles behind every feature" />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <FeatureCard key={v.title} icon={v.icon} title={v.title} delay={i * 90}>
                {v.body}
              </FeatureCard>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- CONTACT ---------------- */}
      <section id="contact" className="scroll-mt-20 py-20 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Contact"
              title="Let's talk"
              description="Questions about setup, hosting or a custom plan? Send us a note and we'll reply within one business day."
            />
            <div className="mt-8 flex flex-col gap-3">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-elev-2"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft-2 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{CONTACT_EMAIL}</p>
                </div>
              </a>
              <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft-2 text-primary">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">Based in</p>
                  <p className="font-semibold">Remote-first · India</p>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-elev-2 sm:p-8">
              <ContactForm />
            </div>
          </Reveal>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
