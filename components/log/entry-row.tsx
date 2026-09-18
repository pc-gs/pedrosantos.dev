import { Link } from "next-view-transitions";
import type { LogEntryPreview } from "@/lib/types";
import { formatDate } from "@/lib/date";

const DATE: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };

/**
 * A log entry as a row. The disclosure stays on the index: co-written entries
 * show the prompt that started them, by-hand entries say so. The marking only
 * means something because both halves are visible.
 */
export function EntryRow({ entry }: { entry: LogEntryPreview }) {
  return (
    <li className="border-b border-border py-6 last:border-0">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-6">
        <time
          dateTime={entry.date}
          className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
        >
          {formatDate(entry.date, DATE)}
        </time>
        <div className="min-w-0">
          <h3 className="font-display text-[1.5rem] leading-snug tracking-[-0.01em]">
            <Link
              href={`/log/${entry.slug}`}
              className="transition-colors hover:text-brand"
            >
              {entry.title}
            </Link>
          </h3>

          {entry.description && (
            <p className="mt-2 max-w-[62ch] text-[1rem] leading-relaxed text-muted-foreground">
              {entry.description}
            </p>
          )}

          {entry.aiAssisted && entry.prompt && (
            <blockquote className="mt-3 max-w-[62ch] border-l-2 border-ai/40 pl-4">
              <p className="font-mono text-[11.5px] leading-relaxed text-foreground/80">
                &ldquo;{entry.prompt}&rdquo;
              </p>
              <p className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-ai">
                ✦ co-written{entry.model ? ` with ${entry.model}` : ""}, edited
                by hand
              </p>
            </blockquote>
          )}

          <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
            {!entry.aiAssisted && (
              <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
                ✎ by hand
              </span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
