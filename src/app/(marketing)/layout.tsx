import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteNav } from "@/components/marketing/site-nav";

// The public marketing pages are the only routes meant to be indexed —
// the root layout defaults everything else to noindex.
export const metadata: Metadata = {
  robots: { index: true, follow: true },
};

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
