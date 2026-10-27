"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Stage = {
  id: string;
  label: string;
  lead: "human" | "model";
  human: string;
  model: string;
};

const stages: Stage[] = [
  {
    id: "why",
    label: "Frame",
    lead: "human",
    human:
      "Decide what problem is worth solving and why. Write the ticket a stranger could pick up: context, constraints, what done looks like.",
    model:
      "Ask back the questions I forgot. Point at the parts of the ticket that are ambiguous before a line is written.",
  },
  {
    id: "explore",
    label: "Explore",
    lead: "model",
    human:
      "Point it at the right corner of the codebase and say what I suspect. Check its map against what I know about the history.",
    model:
      "Read the legacy code faster than I can: trace call sites, list where a type flows, summarise a module I haven't opened in a year.",
  },
  {
    id: "draft",
    label: "Draft",
    lead: "model",
    human:
      "Set the boundaries: which modules it may touch, which patterns to follow, which ones to leave alone.",
    model:
      "Produce the first draft of the change, the boilerplate, the migration, the tedious test fixtures. Several attempts in the time I'd write one.",
  },
  {
    id: "verify",
    label: "Verify",
    lead: "human",
    human:
      "Deterministic tests, types and a real review. I read every line that ships. Security and data handling are never delegated.",
    model:
      "Run as a linter for thinking: flag edge cases, missing tests and the case I talked myself out of.",
  },
  {
    id: "polish",
    label: "Polish",
    lead: "human",
    human:
      "UX taste. Copy, spacing, the moment something feels wrong in the hand. Whether it should ship at all.",
    model:
      "Background chores while I polish: changelogs, docs, follow-up tickets, the loop that keeps CI green.",
  },
];

const leadLabel = {
  human: "Human leads",
  model: "Model drafts",
} as const;

const MIN = 26;
const MAX = 74;

/**
 * "Human judgement vs AI drafting". A tab list of the stages of a working
 * day over a split panel. Each stage opens the split toward whoever leads it;
 * the seam can be dragged (or moved with the range input) and both columns
 * reflow around it, the narrower side dimming as it gives up room.
 */
export function Duality() {
  const [active, setActive] = useState(0);
  const [split, setSplit] = useState(64);
  const [dragging, setDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const sliderId = useId();
  const stage = stages[active];
  const humanShare = (split - MIN) / (MAX - MIN);

  function select(i: number) {
    setActive(i);
    setSplit(stages[i].lead === "human" ? 64 : 36);
  }

  function splitFromPointer(clientX: number) {
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSplit(Math.round(Math.min(MAX, Math.max(MIN, pct))));
  }

  return (
    <div className="border border-border bg-background/85 backdrop-blur-sm">
      <div
        role="tablist"
        aria-label="Stages of a working day"
        className="grid grid-cols-5 border-b border-border"
      >
        {stages.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            id={`tab-${s.id}`}
            aria-selected={i === active}
            aria-controls="duality-panel"
            onClick={() => select(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") select((i + 1) % stages.length);
              if (e.key === "ArrowLeft")
                select((i - 1 + stages.length) % stages.length);
            }}
            tabIndex={i === active ? 0 : -1}
            className={cn(
              "relative border-r border-border px-2 py-3.5 text-left font-mono text-[10px] uppercase tracking-[0.16em] transition-colors last:border-r-0 sm:px-4",
              i === active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="flex items-center gap-1.5 opacity-70 tabnum">
              0{i + 1}
              <span
                aria-hidden
                className={cn(
                  "h-1.5 w-1.5",
                  s.lead === "human" ? "bg-brand" : "border border-ai",
                )}
              />
            </span>
            {s.label}
            <span
              aria-hidden
              className={cn(
                "absolute inset-x-0 -bottom-px h-0.5 origin-left bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                i === active ? "scale-x-100" : "scale-x-0",
              )}
            />
          </button>
        ))}
      </div>

      <div
        ref={panelRef}
        id="duality-panel"
        role="tabpanel"
        aria-labelledby={`tab-${stage.id}`}
        onPointerDown={(e) => {
          if (window.innerWidth < 768) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging(true);
          splitFromPointer(e.clientX);
        }}
        onPointerMove={(e) => dragging && splitFromPointer(e.clientX)}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
        className={cn(
          "grid min-h-[18rem] grid-cols-1 md:cursor-ew-resize md:grid-cols-[var(--human)_1px_var(--model)] md:select-none",
          !dragging &&
            "md:transition-[grid-template-columns] md:duration-700 md:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        )}
        style={{
          ["--human" as string]: `${split}fr`,
          ["--model" as string]: `${100 - split}fr`,
        }}
      >
        <div
          className="min-w-0 p-5 transition-opacity duration-300 md:p-8"
          style={{ opacity: 0.4 + 0.6 * Math.min(1, humanShare * 1.6) }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-text">
            ✎ Human judgement
          </p>
          <p
            key={`h-${stage.id}`}
            className="mt-4 max-w-[34ch] font-display text-[1.375rem] leading-snug tracking-[-0.01em] motion-safe:animate-[rise_600ms_cubic-bezier(0.22,1,0.36,1)] md:text-[1.55rem]"
          >
            {stage.human}
          </p>
        </div>

        <div aria-hidden className="relative hidden bg-foreground md:block">
          <span className="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-foreground bg-background font-mono text-[11px]">
            ⇆
          </span>
        </div>

        <div
          className="min-w-0 border-t border-border p-5 transition-opacity duration-300 md:border-t-0 md:p-8"
          style={{
            opacity: 0.4 + 0.6 * Math.min(1, (1 - humanShare) * 1.6),
          }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ai">
            ✦ Model drafting
          </p>
          <p
            key={`m-${stage.id}`}
            className="mt-4 max-w-[34ch] font-display text-[1.375rem] leading-snug tracking-[-0.01em] text-muted-foreground motion-safe:animate-[rise_600ms_120ms_cubic-bezier(0.22,1,0.36,1)_both] md:text-[1.55rem]"
          >
            {stage.model}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border px-5 py-4 md:px-8">
        <label
          htmlFor={sliderId}
          className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground md:inline"
        >
          Drag the seam
        </label>
        <input
          id={sliderId}
          type="range"
          min={MIN}
          max={MAX}
          value={split}
          onChange={(e) => setSplit(Number(e.target.value))}
          aria-valuetext={`Human side ${split}%, model side ${100 - split}%`}
          className="hidden h-1 min-w-[10rem] flex-1 cursor-ew-resize accent-[var(--brand)] md:block"
        />
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em]">
          {leadLabel[stage.lead]}
        </span>
      </div>
    </div>
  );
}
