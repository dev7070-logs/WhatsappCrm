import Image from "next/image";

import { cn } from "@/lib/utils";

// Demo customers shown in the marketing mock-ups. The portraits are
// AI-generated faces — not real people — stored in /public/avatars.
export const PEOPLE = {
  aisha: { name: "Aisha Khan", src: "/avatars/aisha.jpg" },
  rahul: { name: "Rahul Mehta", src: "/avatars/rahul.jpg" },
  sofia: { name: "Sofia Lopez", src: "/avatars/sofia.jpg" },
  daniel: { name: "Daniel Weber", src: "/avatars/daniel.jpg" },
  emma: { name: "Emma Collins", src: "/avatars/emma.jpg" },
} as const;

export type PersonId = keyof typeof PEOPLE;

export function PersonAvatar({
  person,
  size = 32,
  online = false,
  className,
}: {
  person: PersonId;
  size?: number;
  /** Adds a green presence dot. */
  online?: boolean;
  className?: string;
}) {
  const p = PEOPLE[person];
  return (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={p.src}
        alt={p.name}
        width={size * 2}
        height={size * 2}
        className="h-full w-full rounded-full object-cover ring-2 ring-background"
      />
      {online ? (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
      ) : null}
    </span>
  );
}
