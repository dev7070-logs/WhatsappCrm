import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, type LucideIcon } from "lucide-react";

import { Reveal } from "@/components/marketing/reveal";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary-soft px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}

/** Material card that lifts on hover; the icon tile flips to solid primary. */
export function FeatureCard({
  icon: Icon,
  title,
  children,
  href,
  delay = 0,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  href?: string;
  delay?: number;
}) {
  const body = (
    <>
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft-2 text-primary transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-6deg] group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-5 font-heading text-lg font-bold text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
        {children}
      </p>
      {href ? (
        <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
          Learn more
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      ) : null}
      {/* bottom accent bar grows on hover */}
      <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100" />
    </>
  );

  const className =
    "group relative block h-full overflow-hidden rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-elev-3 sm:p-7";

  return (
    <Reveal delay={delay} className="h-full">
      {href ? (
        <Link href={href} className={className}>
          {body}
        </Link>
      ) : (
        <div className={className}>{body}</div>
      )}
    </Reveal>
  );
}

export function PrimaryCta({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-[15px] font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary-hover hover:shadow-elev-3 active:scale-[0.98]",
        className,
      )}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
    </Link>
  );
}

export function SecondaryCta({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-input bg-card px-7 text-[15px] font-semibold text-foreground transition-all duration-200 hover:border-primary/40 hover:bg-primary-soft hover:text-primary",
        className,
      )}
    >
      {children}
    </Link>
  );
}

/** Full-width primary band used to close every marketing page. */
export function CtaBand({
  title = "Bring your WhatsApp team into one inbox today.",
  description = "Free to self-host. Set up in an afternoon. Your data stays yours.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-primary-foreground/10" />
            <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-primary-foreground/[0.07]" />
            <div className="pointer-events-none absolute right-24 top-10 hidden h-16 w-16 animate-spin-slow rounded-2xl border-2 border-dashed border-primary-foreground/25 md:block" />
            <h2 className="relative mx-auto max-w-2xl font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
              {title}
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg opacity-85">
              {description}
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary-foreground px-7 text-[15px] font-semibold text-primary transition-all duration-200 hover:shadow-elev-3 active:scale-[0.98]"
              >
                Create free account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-12 items-center rounded-full border border-primary-foreground/40 px-7 text-[15px] font-semibold transition-colors hover:bg-primary-foreground/10"
              >
                See pricing
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/** Small page hero for the inner marketing pages. */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  description: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <Container className="relative py-20 text-center sm:py-24">
        <div className="animate-rise-in">
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        <h1
          className="mx-auto mt-5 max-w-3xl animate-rise-in font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          style={{ animationDelay: "100ms" }}
        >
          {title}
        </h1>
        <p
          className="mx-auto mt-5 max-w-2xl animate-rise-in text-lg leading-relaxed text-muted-foreground"
          style={{ animationDelay: "200ms" }}
        >
          {description}
        </p>
        {children ? (
          <div className="mt-8 animate-rise-in" style={{ animationDelay: "300ms" }}>
            {children}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
