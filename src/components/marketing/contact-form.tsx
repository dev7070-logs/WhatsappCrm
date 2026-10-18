"use client";

import { useState } from "react";
import { Send } from "lucide-react";

import { CONTACT_EMAIL } from "@/lib/site";

/**
 * Backend-free contact form: composes a pre-filled email in the
 * visitor's mail app. Swap the submit handler for a POST to your own
 * endpoint (or a form service) if you prefer server-side delivery.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`WaFlow enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const field =
    "w-full rounded-xl border border-input bg-background px-4 text-[15px] outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 hover:border-foreground/30 focus:border-primary focus:ring-4 focus:ring-primary/15";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={`${field} h-12`}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className={`${field} h-12`}
          />
        </label>
      </div>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Message
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your team and what you need…"
          className={`${field} resize-none py-3`}
        />
      </label>
      <button
        type="submit"
        className="group inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-7 text-[15px] font-semibold text-primary-foreground transition-all hover:bg-primary-hover hover:shadow-elev-2 active:scale-[0.99] sm:self-start"
      >
        Send message
        <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>
    </form>
  );
}
