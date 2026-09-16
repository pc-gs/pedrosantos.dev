"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import type { LogEntryPreview } from "@/lib/types";
import { EntryRow } from "@/components/log/entry-row";

/**
 * Client-side filterable log feed: tag chips + a "co-written only" toggle.
 * The page itself stays fully static; filtering happens in the browser.
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
      <div className="mb-6 flex flex-wrap items-center gap-2" role="group" aria-label="Filter log entries">
        <FilterChip active={tag === null} onClick={() => setTag(null)}>
          all
        </FilterChip>
        {tags.map((t) => (
          <FilterChip key={t} active={tag === t} onClick={() => setTag(t)}>
            #{t}
          </FilterChip>
        ))}
        <button
          type="button"
          onClick={() => setAiOnly((v) => !v)}
          aria-pressed={aiOnly}
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors",
            aiOnly
              ? "border-ai/40 bg-ai/10 text-ai"
              : "border-border bg-background text-muted-foreground hover:border-ai/40 hover:text-ai",
          )}
        >
          <Sparkles className="h-3 w-3" aria-hidden />
          co-written only
        </button>
      </div>

      <div className="divide-y divide-border border-y border-border">
        {filtered.map((entry) => (
          <EntryRow key={entry.slug} entry={entry} />
        ))}
        {filtered.length === 0 && (
          <p className="py-10 text-center font-serif text-muted-foreground">
            Nothing here yet — new entries land as they&apos;re learned.
          </p>
        )}
      </div>

      <p className="mt-4 font-mono text-[12px] text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
        {aiOnly && " · co-written with AI, edited by Pedro"}
      </p>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors",
        active
          ? "border-brand/40 bg-brand/10 text-brand"
          : "border-border bg-background text-muted-foreground hover:border-brand/40 hover:text-brand",
      )}
    >
      {children}
    </button>
  );
}
