import { Link } from "next-view-transitions";
import type { LogEntryPreview } from "@/lib/types";
import {
  DateFolio,
  Manuscript,
  Sidenote,
} from "@/components/manuscript/manuscript";
import { HandWrittenMark, TagRun } from "@/components/manuscript/marks";

/** Split an ISO date into the pieces the folio gutter prints. */
export function dateParts(iso: string) {
  const [year, month, day] = iso.split("-");
  const parsed = new Date(`${year}-${month ?? "01"}-01T00:00:00`);
  return {
    day: day ?? "01",
    month: Number.isNaN(parsed.getTime())
      ? ""
      : parsed.toLocaleDateString("en-US", { month: "short" }),
  };
}

/**
 * A log entry as an annotated spread: the entry in the text block, and its
 * disclosure in the margin — permanently visible, not hidden behind a click.
 * The prompt is the annotation, so the co-authorship is the layout itself.
 */
export function EntryRow({ entry }: { entry: LogEntryPreview }) {
  const { day, month } = dateParts(entry.date);

  return (
    <Manuscript
      className="border-b border-border py-9 last:border-0"
      folio={<DateFolio day={day} month={month} />}
      margin={
        entry.aiAssisted ? (
          <Sidenote label="✦ the prompt that started this" tone="ai" leader>
            {entry.prompt ? (
              <p className="font-mono text-[11.5px] leading-[1.75] text-foreground/80">
                &ldquo;{entry.prompt}&rdquo;
              </p>
            ) : (
              <p className="font-mono text-[11.5px] leading-[1.75] text-muted-foreground">
                Prompt not recorded.
              </p>
            )}
            <p className="mt-3.5 font-serif text-[0.9rem] leading-relaxed text-muted-foreground">
              Drafted from that prompt
              {entry.model ? ` with ${entry.model}` : ""}, then rewritten, cut
              and checked by hand.
            </p>
          </Sidenote>
        ) : (
          <Sidenote label="no model involved" leader>
            <HandWrittenMark />
            <p className="mt-3 font-serif text-[0.9rem] leading-relaxed text-muted-foreground">
              Written start to finish by hand. The disclosure cuts both ways
              around here.
            </p>
          </Sidenote>
        )
      }
    >
      <h3 className="font-display text-[1.55rem] leading-snug tracking-tight">
        <Link
          href={`/log/${entry.slug}`}
          className="border-b border-transparent pb-[2px] text-foreground transition-colors hover:border-brand"
        >
          {entry.title}
        </Link>
      </h3>

      {entry.description && (
        <p className="mt-3 max-w-[62ch] font-serif text-[1.0625rem] leading-[1.72] text-muted-foreground">
          {entry.description}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <TagRun tags={entry.tags} />
        <Link
          href={`/log/${entry.slug}`}
          className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-brand"
        >
          read →
        </Link>
      </div>
    </Manuscript>
  );
}
