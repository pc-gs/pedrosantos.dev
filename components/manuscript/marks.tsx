import { Link } from "next-view-transitions";
import { cn } from "@/lib/utils";

/**
 * Marks are the replacement for pills and badges: instead of a bordered
 * capsule, a mark is set type — small caps in mono, underlined like a printed
 * annotation. Nothing about a mark looks like a button, because nothing about
 * it is one.
 */
export function Mark({
  children,
  tone = "muted",
  underline = true,
  className,
  title,
}: {
  children: React.ReactNode;
  tone?: "muted" | "ink" | "brand" | "ai";
  underline?: boolean;
  className?: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-baseline gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em]",
        underline && "border-b pb-[2px]",
        tone === "ai" && "text-ai",
        tone === "brand" && "text-brand",
        tone === "ink" && "text-foreground",
        tone === "muted" && "text-muted-foreground",
        underline &&
          (tone === "ai"
            ? "border-ai/35"
            : tone === "brand"
              ? "border-brand/30"
              : "border-border"),
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * A stamp is the loudest mark on the page and should stay rare: rotated,
 * hairline-bordered, letterspaced mono. Used for availability and for the
 * co-authorship statement on the signature surfaces.
 */
export function Stamp({
  children,
  tone = "brand",
  className,
}: {
  children: React.ReactNode;
  tone?: "brand" | "ai" | "muted";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block -rotate-[1.75deg] border px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.2em]",
        tone === "brand" && "border-brand/45 text-brand",
        tone === "ai" && "border-ai/45 text-ai",
        tone === "muted" && "border-border text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Tag run — `#graphql #til`, no capsules, no background. */
export function TagRun({
  tags,
  className,
}: {
  tags: string[];
  className?: string;
}) {
  if (tags.length === 0) return null;
  return (
    <p
      className={cn(
        "font-mono text-[11px] tracking-[0.06em] text-muted-foreground",
        className,
      )}
    >
      {tags.map((tag) => `#${tag}`).join("  ")}
    </p>
  );
}

/**
 * A margin-sized link: underlined mono type. It is the manuscript's only
 * affordance, so it looks like a footnote rather than a button.
 */
export function MarginLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-block border-b border-brand/30 pb-[3px] font-mono text-[10.5px] uppercase tracking-[0.18em] text-brand transition-colors hover:border-brand",
        className,
      )}
    >
      {children}
    </Link>
  );
}

/** Middle dot separator for inline metadata runs. */
export function Sep({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("text-muted-foreground/45", className)}>
      ·
    </span>
  );
}

/**
 * The symmetric half of the disclosure: entries a model did not help draft say
 * so, rather than saying nothing. Both marks exist, so neither is decoration.
 */
export function HandWrittenMark({
  className,
  title = "Written by hand, no AI drafting",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <Mark tone="muted" className={className} title={title}>
      <span aria-hidden>✎</span>
      written by hand
    </Mark>
  );
}