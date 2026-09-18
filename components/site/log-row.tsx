import { Link } from "next-view-transitions";
import type { LogEntry } from "@/lib/types";
import { formatDate } from "@/lib/date";

const DATE: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };

/** One log entry as a row: date, title, disclosure mark. */
export function LogRow({ entry }: { entry: LogEntry }) {
  return (
    <li className="border-b border-border last:border-0">
      <Link
        href={`/log/${entry.slug}`}
        className="group grid grid-cols-1 items-baseline gap-x-6 gap-y-1 py-4 sm:grid-cols-[6rem_minmax(0,1fr)_auto]"
      >
        <time
          dateTime={entry.date}
          className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
        >
          {formatDate(entry.date, DATE)}
        </time>
        <h3 className="font-display text-[1.25rem] leading-snug tracking-[-0.01em] transition-colors group-hover:text-brand-text">
          {entry.title}
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {entry.aiAssisted ? "✦ co-written" : "✎ by hand"}
        </span>
      </Link>
    </li>
  );
}
