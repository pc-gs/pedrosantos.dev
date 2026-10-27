"use client";

import { useState } from "react";
import { Link } from "next-view-transitions";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date";
import type {
  TimelineItem,
  TimelineKind,
  TimelineLabel,
  TimelineRelease,
} from "@/lib/timeline";

const FILTERS: { value: TimelineKind | null; label: string }[] = [
  { value: null, label: "everything" },
  { value: "work", label: "work" },
  { value: "note", label: "writing" },
  { value: "learning", label: "learning" },
];

const LABEL_TEXT: Record<TimelineLabel, string> = {
  started: "started",
  shipped: "shipped",
  update: "update",
  note: "note",
  essay: "essay",
  studying: "studying",
};

const LABEL_CLASS: Record<TimelineLabel, string> = {
  started: "text-brand-text",
  shipped: "text-brand-text",
  update: "text-brand-text",
  note: "text-muted-foreground",
  essay: "text-muted-foreground",
  studying: "text-foreground",
};

const DAY: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
const MONTH: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" };

/** Singular and plural, for the month summary under each version. */
const SUMMARY_TEXT: Record<TimelineLabel, [string, string]> = {
  started: ["project started", "projects started"],
  shipped: ["release", "releases"],
  update: ["project update", "project updates"],
  note: ["note", "notes"],
  essay: ["essay", "essays"],
  studying: ["new study track", "new study tracks"],
};

/** "3 notes · 1 essay", so a month reads like release notes at a glance. */
function summarize(items: TimelineItem[]) {
  const counts = new Map<TimelineLabel, number>();
  for (const item of items) counts.set(item.label, (counts.get(item.label) ?? 0) + 1);
  return [...counts]
    .map(([label, count]) => `${count} ${SUMMARY_TEXT[label][count === 1 ? 0 : 1]}`)
    .join(" · ");
}

/**
 * The home page stream. Months are releases, rows are what changed.
 * Filtering stays client-side so the page is still fully static.
 */
export function Changelog({ releases }: { releases: TimelineRelease[] }) {
  const [kind, setKind] = useState<TimelineKind | null>(null);

  const visible = releases
    .map((release) => ({
      ...release,
      items: kind ? release.items.filter((item) => item.kind === kind) : release.items,
    }))
    .filter((release) => release.items.length > 0);

  return (
    <div>
      <div
        role="group"
        aria-label="Filter the changelog"
        className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-foreground pb-3"
      >
        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Show
        </span>
        {FILTERS.map((filter) => {
          const active = kind === filter.value;
          return (
            <button
              key={filter.label}
              type="button"
              aria-pressed={active}
              onClick={() => setKind(filter.value)}
              className={cn(
                "border-b pb-[2px] font-mono text-[10.5px] uppercase tracking-[0.16em] transition-colors",
                active
                  ? "border-brand text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <ol>
        {visible.map((release) => (
          <li
            key={release.month}
            className="grid grid-cols-1 gap-x-10 border-b border-border py-8 md:grid-cols-[11rem_minmax(0,1fr)]"
          >
            <header className="mb-4 md:mb-0">
              <h3 className="font-display text-[1.75rem] leading-none tracking-[-0.02em]">
                <time dateTime={release.month}>{release.version}</time>
              </h3>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {formatDate(release.month, MONTH)}
              </p>
              <p className="mt-1 font-mono text-[10px] tracking-[0.04em] text-muted-foreground">
                {summarize(release.items)}
              </p>
            </header>

            <ul>
              {release.items.map((item) => (
                <li key={item.id} className="border-t border-border first:border-t-0">
                  <ChangelogRow item={item} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ChangelogRow({ item }: { item: TimelineItem }) {
  const showDay = item.date.length > 7;

  return (
    <Link
      href={item.href}
      className="group grid grid-cols-[4.25rem_minmax(0,1fr)] gap-x-4 py-3 sm:grid-cols-[4.25rem_5.5rem_minmax(0,1fr)]"
    >
      <time
        dateTime={item.date}
        className="pt-[3px] font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground"
      >
        {showDay ? formatDate(item.date, DAY) : "—"}
      </time>
      <span
        className={cn(
          "pt-[3px] font-mono text-[10.5px] uppercase tracking-[0.12em]",
          item.ai ? "text-ai" : LABEL_CLASS[item.label],
        )}
      >
        {item.ai && <span aria-label="co-written with AI">✦ </span>}
        {LABEL_TEXT[item.label]}
      </span>
      <span className="col-span-2 min-w-0 sm:col-span-1">
        <span className="block text-[1.0625rem] leading-snug transition-colors group-hover:text-brand-text">
          {item.context && (
            <span className="font-medium text-foreground">{item.context} — </span>
          )}
          {item.title}
        </span>
        {item.description && (
          <span className="mt-1 block text-[0.9rem] leading-relaxed text-muted-foreground">
            {item.description}
          </span>
        )}
      </span>
    </Link>
  );
}
