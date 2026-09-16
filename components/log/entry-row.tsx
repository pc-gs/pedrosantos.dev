import { Link } from "next-view-transitions";
import { formatDate } from "@/lib/date";
import type { LogEntryPreview } from "@/lib/types";
import { AiBadge } from "@/components/log/ai-badge";

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
};

/**
 * A single log entry row — date, title, tags, AI co-authorship mark,
 * and (when present) a <details> disclosure showing the prompt that
 * seeded the entry. No client JS needed.
 */
export function EntryRow({ entry }: { entry: LogEntryPreview }) {
  return (
    <article className="group grid grid-cols-1 gap-1 py-5 md:grid-cols-[92px_1fr] md:gap-6">
      <p className="label pt-1.5 md:text-right">
        <time dateTime={entry.date}>{formatDate(entry.date, DATE_FORMAT)}</time>
      </p>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <h3 className="font-display text-xl leading-snug tracking-tight md:text-[1.375rem]">
            <Link
              href={`/log/${entry.slug}`}
              className="text-foreground transition-colors group-hover:text-brand"
            >
              {entry.title}
            </Link>
          </h3>
          {entry.aiAssisted && <AiBadge model={entry.model} short />}
        </div>
        {entry.description && (
          <p className="mt-1.5 max-w-2xl font-serif text-[0.975rem] leading-relaxed text-muted-foreground">
            {entry.description}
          </p>
        )}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="font-mono text-[11px] text-muted-foreground/70">
            {entry.tags.map((t) => `#${t}`).join(" ")}
          </span>
          {entry.prompt && (
            <details className="min-w-0 flex-1">
              <summary className="inline cursor-pointer list-none font-mono text-[11px] text-muted-foreground/70 underline decoration-dotted underline-offset-4 transition-colors hover:text-ai [&::-webkit-details-marker]:hidden">
                ✦ the prompt
              </summary>
              <p className="mt-2 max-w-2xl rounded-md border border-ai/25 bg-ai/5 p-3 font-mono text-[12px] leading-relaxed text-foreground/80">
                &ldquo;{entry.prompt}&rdquo;
              </p>
            </details>
          )}
        </div>
      </div>
    </article>
  );
}
