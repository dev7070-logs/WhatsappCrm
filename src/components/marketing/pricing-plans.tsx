"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";

import { Reveal } from "@/components/marketing/reveal";
import { cn } from "@/lib/utils";

// EXAMPLE PRICING — placeholder tiers.
// These tiers are placeholder copy for operators who resell a hosted
// version; edit the numbers and features to match your own offer.
const PLANS = [
  {
    name: "Self-hosted",
    tagline: "Run it on your own server",
    monthly: 0,
    yearly: 0,
    cta: "Get started",
    href: "/signup",
    features: [
      "Every module included",
      "Unlimited agents & contacts",
      "Bring your own AI key",
      "Community support",
    ],
  },
  {
    name: "Starter",
    tagline: "We host it for you",
    monthly: 999,
    yearly: 799,
    cta: "Start 14-day trial",
    href: "/signup",
    features: [
      "Managed hosting & backups",
      "Up to 3 agents",
      "1 WhatsApp number",
      "5,000 broadcast messages / mo",
      "Email support",
    ],
  },
  {
    name: "Growth",
    tagline: "For busy sales teams",
    monthly: 2499,
    yearly: 1999,
    popular: true,
    cta: "Start 14-day trial",
    href: "/signup",
    features: [
      "Everything in Starter",
      "Up to 15 agents",
      "3 WhatsApp numbers",
      "AI auto-reply & knowledge base",
      "Automations & flows",
      "Priority chat support",
    ],
  },
  {
    name: "Enterprise",
    tagline: "Custom setup & SLAs",
    monthly: null,
    yearly: null,
    cta: "Contact sales",
    href: "/about#contact",
    features: [
      "Unlimited agents & numbers",
      "Dedicated onboarding",
      "Custom integrations",
      "99.9% uptime SLA",
    ],
  },
];

export function PricingPlans() {
  const [yearly, setYearly] = useState(true);

  return (
    <div>
      <div className="flex items-center justify-center gap-3">
        <span className={cn("text-sm font-medium", !yearly ? "text-foreground" : "text-muted-foreground")}>
          Monthly
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={yearly}
          aria-label="Bill yearly"
          onClick={() => setYearly((v) => !v)}
          className={cn(
            "relative h-8 w-14 cursor-pointer rounded-full transition-colors duration-300",
            yearly ? "bg-primary" : "bg-input",
          )}
        >
          <span
            className={cn(
              "absolute top-1 left-1 h-6 w-6 rounded-full bg-background shadow-elev-1 transition-transform duration-300",
              yearly && "translate-x-6",
            )}
          />
        </button>
        <span className={cn("text-sm font-medium", yearly ? "text-foreground" : "text-muted-foreground")}>
          Yearly
        </span>
        <span className="rounded-full bg-primary-soft-2 px-2.5 py-1 text-xs font-bold text-primary">
          Save 20%
        </span>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((plan, i) => {
          const price = yearly ? plan.yearly : plan.monthly;
          return (
            <Reveal key={plan.name} delay={i * 90} className="h-full">
              <div
                className={cn(
                  "group relative flex h-full flex-col rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-2",
                  plan.popular
                    ? "border-2 border-primary bg-card shadow-elev-2 hover:shadow-elev-3"
                    : "border-border bg-card hover:border-primary/30 hover:shadow-elev-3",
                )}
              >
                {plan.popular ? (
                  <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-elev-1">
                    <Sparkles className="h-3.5 w-3.5" /> Most popular
                  </span>
                ) : null}
                <h3 className="font-heading text-xl font-bold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>

                <div className="mt-6 flex items-end gap-1">
                  {price === null ? (
                    <span className="font-heading text-4xl font-extrabold">Custom</span>
                  ) : price === 0 ? (
                    <span className="font-heading text-4xl font-extrabold">Free</span>
                  ) : (
                    <>
                      <span key={price} className="animate-rise-in font-heading text-4xl font-extrabold">
                        ₹{price.toLocaleString("en-IN")}
                      </span>
                      <span className="mb-1.5 text-sm text-muted-foreground">/ month</span>
                    </>
                  )}
                </div>
                <p className="mt-1 h-5 text-xs text-muted-foreground">
                  {price && yearly ? "billed yearly" : price === 0 ? "free forever" : ""}
                </p>

                <Link
                  href={plan.href}
                  className={cn(
                    "group/btn mt-6 inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-200",
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary-hover hover:shadow-elev-2"
                      : "border border-input hover:border-primary/40 hover:bg-primary-soft hover:text-primary",
                  )}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>

                <ul className="mt-7 flex flex-col gap-3 border-t border-border pt-6 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={3} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
