"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { LogEntryPreview } from "@/lib/types";
import { EntryRow } from "@/components/log/entry-row";

/**
 * The log index. Filtering stays client-side so the page is fully static;
 * the controls are typeset toggles rather than pill chips.
 */
export function LogFeed({ entries }: { entries: LogEntryPreview[] }) {
  const [tag, setTag] = useState<string | null>(null);
  const [aiOnly, setAiOnly] = useState(false);

  const tags = useMemo(() => {
    const set = new Set<string>();
    for (const e of entries) for (const t of e.tags) set.add(t);
    return [...set].sort();
  }, [entries]);

  const filtered = entries.filter(
    (e) => (!tag || e.tags.includes(tag)) && (!aiOnly || e.aiAssisted),
  );

  return (
    <div>
      <div
        className="flex flex-wrap items-baseline gap-x-6 gap-y-3 border-b border-border pb-4"
        role="group"
        aria-label="Filter log entries"
      >
        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Filter
        </span>
        <FilterMark active={tag === null} onClick={() => setTag(null)}>
          all
        </FilterMark>
        {tags.map((t) => (
          <FilterMark key={t} active={tag === t} onClick={() => setTag(t)}>
            #{t}
          </FilterMark>
        ))}
        <span aria-hidden className="hidden h-3 w-px bg-border sm:block" />
        <FilterMark
          active={aiOnly}
          tone="ai"
          onClick={() => setAiOnly((v) => !v)}
        >
          <span aria-hidden>✦</span> co-written only
        </FilterMark>
      </div>

      <ol>
        {filtered.map((entry) => (
          <EntryRow key={entry.slug} entry={entry} />
        ))}
      </ol>
      {filtered.length === 0 && (
        <p className="max-w-[46ch] py-16 text-[1.0625rem] leading-relaxed text-muted-foreground">
          Nothing under that filter yet. New entries land as they are learned,
          not on a schedule.
        </p>
      )}

      <p className="mt-6 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground tabnum">
        showing {filtered.length} of {entries.length}
        {aiOnly && " · co-written, always edited by hand"}
      </p>
    </div>
  );
}

/** A typeset toggle: underlined type that reads as a word, not a button. */
function FilterMark({
  active,
  onClick,
  tone = "brand",
  children,
}: {
  active: boolean;
  onClick: () => void;
  tone?: "brand" | "ai";
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-baseline gap-1.5 border-b pb-[3px] font-mono text-[10.5px] uppercase tracking-[0.18em] transition-colors",
        active
          ? tone === "ai"
            ? "border-ai text-ai"
            : "border-brand text-brand-text"
          : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
