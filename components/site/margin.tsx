import { cn } from "@/lib/utils";

/**
 * Text column plus a margin, like a lab notebook. Metadata, the AI
 * disclosure and cross-links live in the margin so the text stays clean.
 * On small screens the margin comes first, as a short ruled block.
 */
export function MarginLayout({
  children,
  notes,
}: {
  children: React.ReactNode;
  notes: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,64ch)_15rem] lg:justify-between lg:gap-14">
      <aside
        aria-label="Margin notes"
        className="border-y border-border lg:sticky lg:top-20 lg:order-2 lg:self-start lg:border-y-0 lg:border-l lg:pl-5"
      >
        {notes}
      </aside>
      <div className="min-w-0 lg:order-1">{children}</div>
    </div>
  );
}

export function MarginNote({
  label,
  tone = "muted",
  children,
}: {
  label: React.ReactNode;
  tone?: "muted" | "ai" | "brand";
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border py-3 last:border-b-0 lg:first:pt-0">
      <p
        className={cn(
          "font-mono text-[9.5px] uppercase tracking-[0.2em]",
          tone === "ai" && "text-ai",
          tone === "brand" && "text-brand-text",
          tone === "muted" && "text-muted-foreground",
        )}
      >
        {label}
      </p>
      <div className="mt-1.5 text-[0.875rem] leading-relaxed">{children}</div>
    </div>
  );
}
