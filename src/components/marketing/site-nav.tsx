"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, MessageSquare, X } from "lucide-react";

import { ModeToggle } from "@/components/layout/mode-toggle";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function SiteLogo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-elev-1 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
        <MessageSquare className="h-[18px] w-[18px]" />
      </span>
      <span className="font-heading text-lg font-extrabold tracking-tight">
        WaFlow
      </span>
    </Link>
  );
}

export function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // The menu is "open for a pathname": navigating elsewhere closes it
  // without an effect resetting state.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-border bg-background/85 shadow-elev-1 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <SiteLogo />

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary-soft-2 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1 sm:gap-2">
          <ModeToggle />
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="group hidden items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-hover hover:shadow-elev-2 sm:inline-flex"
          >
            Get started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <button
            type="button"
            onClick={() => setOpenOn(open ? null : pathname)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-300 md:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0">
          <ul className="flex flex-col gap-1 px-4 pb-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "block rounded-2xl px-4 py-3 text-base font-medium",
                    pathname === link.href
                      ? "bg-primary-soft-2 text-primary"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 grid grid-cols-2 gap-2">
              <Link
                href="/login"
                className="rounded-full border border-input py-3 text-center text-sm font-semibold"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-primary py-3 text-center text-sm font-semibold text-primary-foreground"
              >
                Get started
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
