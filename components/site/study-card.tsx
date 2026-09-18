import { Link } from "next-view-transitions";
import type { LogEntry, Study } from "@/lib/types";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";

const DATE: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };

const STATE_CLASS: Record<Study["state"], string> = {
  applying: "bg-brand text-brand-foreground border-brand",
  learning: "bg-foreground text-background border-foreground",
  exploring: "bg-transparent text-brand border-brand",
};

/** Study track: state, title, why, and the notes where the work happened. */
export function StudyCard({
  study,
  notes,
}: {
  study: Study;
  notes: LogEntry[];
}) {
  return (
    <article className="flex flex-col border border-border bg-card p-6">
      <div className="flex items-center justify-between gap-4">
        <span
          className={cn(
            "border px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.18em]",
            STATE_CLASS[study.state],
          )}
        >
          {study.state}
        </span>
        <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
          since {study.since}
        </span>
      </div>
      <h3 className="mt-4 font-display text-[1.375rem] leading-snug tracking-[-0.01em]">
        {study.title}
      </h3>
      <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">
        {study.why}
      </p>
      <ul className="mt-5 space-y-2 border-t border-border pt-4">
        {notes.map((entry) => (
          <li key={entry.slug}>
            <Link
              href={`/log/${entry.slug}`}
              className="group flex items-baseline justify-between gap-4"
            >
              <span className="text-[0.875rem] leading-snug transition-colors group-hover:text-brand">
                {entry.title}
              </span>
              <span className="shrink-0 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">
                {formatDate(entry.date, DATE)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
