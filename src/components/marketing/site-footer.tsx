import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SiteLogo } from "@/components/marketing/site-nav";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/features#inbox", label: "Shared inbox" },
      { href: "/features#pipelines", label: "Sales pipelines" },
      { href: "/features#broadcasts", label: "Broadcasts" },
      { href: "/features#automations", label: "Automations" },
      { href: "/features#ai", label: "AI assistant" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/pricing", label: "Pricing" },
      { href: "/about#contact", label: "Contact" },
    ],
  },
  {
    title: "Get started",
    links: [
      { href: "/signup", label: "Create account" },
      { href: "/login", label: "Sign in" },
      { href: "/features#developers", label: "Developer API" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <SiteLogo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The CRM for WhatsApp. Shared inbox, pipelines, broadcasts and
              automations — in one calm workspace.
            </p>
            <Link
              href="/signup"
              className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              Start for free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} WaFlow. All rights reserved.</p>
          <p>
            WhatsApp is a trademark of Meta Platforms, Inc. This product is not
            affiliated with Meta.
          </p>
        </div>
      </div>
    </footer>
  );
}
