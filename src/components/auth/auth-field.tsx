"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Material-style outlined text field for the auth forms: leading icon,
 * 48px touch height, and an optional show/hide toggle for passwords.
 */
export function AuthField({
  id,
  label,
  icon: Icon,
  type = "text",
  trailingLabel,
  className,
  ...props
}: Omit<ComponentProps<"input">, "id"> & {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Rendered at the right end of the label row (e.g. "Forgot password?"). */
  trailingLabel?: ReactNode;
}) {
  const [reveal, setReveal] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        {trailingLabel}
      </div>
      <div className="group relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <input
          id={id}
          type={isPassword && reveal ? "text" : type}
          className={cn(
            "h-12 w-full rounded-xl border border-input bg-card pl-11 text-[15px] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 hover:border-foreground/30 focus:border-primary focus:ring-4 focus:ring-primary/15",
            isPassword ? "pr-12" : "pr-4",
            className,
          )}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setReveal((v) => !v)}
            aria-label={reveal ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {reveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function FormAlert({
  tone,
  children,
}: {
  tone: "error" | "warning";
  children: ReactNode;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "animate-rise-in rounded-xl border px-4 py-3 text-sm",
        tone === "error"
          ? "border-red-500/25 bg-red-500/10 text-red-400"
          : "border-amber-500/25 bg-amber-500/10 text-amber-300",
      )}
    >
      {children}
    </div>
  );
}

export function SubmitButton({
  loading,
  children,
  loadingLabel,
  disabled = false,
}: {
  loading: boolean;
  children: ReactNode;
  loadingLabel: ReactNode;
  /** e.g. while a required CAPTCHA token is still missing. */
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="group mt-2 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary text-[15px] font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary-hover hover:shadow-elev-2 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
