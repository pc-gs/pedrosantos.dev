import { cn } from "@/lib/utils";

/**
 * The manuscript skeleton every page is built on.
 *
 * Three tracks on desktop — a folio gutter for numbers and kinds, the text
 * block at reading measure, and a margin column for annotations (dates, tags,
 * the prompt that started an entry, model credit). The vertical hairline
 * between text and margin is the page's one structural rule.
 *
 * On smaller screens the margin stacks under the text, so nothing is lost —
 * annotations simply become notes below the block they annotate.
 */
export function Manuscript({
  folio,
  margin,
  children,
  className,
  marginWidth = "narrow",
}: {
  /** Folio gutter — section numbers, years, entry indices. Hidden below lg. */
  folio?: React.ReactNode;
  /** Margin column — annotations. Stacks under the text on small screens. */
  margin?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** `wide` gives the margin room for the reply slip or long prompts. */
  marginWidth?: "narrow" | "wide";
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-y-8",
        marginWidth === "wide"
          ? "lg:grid-cols-[3.25rem_minmax(0,1fr)_18rem] lg:gap-x-7 xl:grid-cols-[4rem_minmax(0,1fr)_22rem] xl:gap-x-9"
          : "lg:grid-cols-[3.25rem_minmax(0,1fr)_15rem] lg:gap-x-7 xl:grid-cols-[4rem_minmax(0,1fr)_17rem] xl:gap-x-9",
        className,
      )}
    >
      {folio && (
        <div className="hidden min-w-0 lg:block">
          <div className="sticky top-24">{folio}</div>
        </div>
      )}

      <div className="min-w-0">{children}</div>

      <aside className="min-w-0 lg:border-l lg:border-border lg:pl-7">
        <div className="space-y-7">{margin}</div>
      </aside>
    </div>
  );
}

/** A number or kind set in the gutter, aligned to the text block. */
export function Folio({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-baseline gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground lg:justify-end lg:text-right",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** A stacked folio for dates: big day, small month above. */
export function DateFolio({ day, month }: { day: string; month: string }) {
  return (
    <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground lg:text-right">
      <span className="block">{month}</span>
      <span className="block font-display text-2xl leading-none tracking-tight text-foreground tabnum">
        {day}
      </span>
    </p>
  );
}

/**
 * A margin annotation. `leader` draws the connecting hairline + dot so a note
 * reads as attached to the block beside it rather than floating.
 */
export function Sidenote({
  label,
  children,
  leader = false,
  tone = "plain",
  className,
}: {
  label?: string;
  children: React.ReactNode;
  leader?: boolean;
  tone?: "plain" | "ai" | "brand";
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      {leader && <Leader tone={tone} />}
      {label && (
        <p
          className={cn(
            "font-mono text-[10.5px] uppercase tracking-[0.18em]",
            tone === "ai"
              ? "text-ai"
              : tone === "brand"
                ? "text-brand"
                : "text-muted-foreground",
          )}
        >
          {label}
        </p>
      )}
      <div
        className={cn(
          "mt-2 border-l pl-3",
          tone === "ai"
            ? "border-ai/35"
            : tone === "brand"
              ? "border-brand/35"
              : "border-border",
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** The leader rule: hairline with a dot, pointing from the margin to the text. */
export function Leader({
  tone = "plain",
  className,
}: {
  tone?: "plain" | "ai" | "brand";
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "leader mb-3 block",
        tone === "ai"
          ? "text-ai"
          : tone === "brand"
            ? "text-brand"
            : "text-muted-foreground/60",
        className,
      )}
    />
  );
}

/** A full-width rule used to open sections inside the text block. */
export function Rule({ className }: { className?: string }) {
  return <div aria-hidden className={cn("h-px w-full bg-border", className)} />;
}