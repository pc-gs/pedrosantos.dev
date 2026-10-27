"use client";

import { useId, useState } from "react";
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

/**
 * "Human judgement vs AI drafting". A tab list of the stages of a working
 * day; the split under it is a slider the visitor can drag to inspect each
 * side. The split starts where the selected stage's lead sits.
 */
export function Duality() {
  const [active, setActive] = useState(0);
  const [split, setSplit] = useState(66);
  const sliderId = useId();
  const stage = stages[active];

  function select(i: number) {
    setActive(i);
    setSplit(stages[i].lead === "human" ? 66 : 34);
  }

  return (
    <div className="border border-border bg-background/80 backdrop-blur-[2px]">
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
              if (e.key === "ArrowLeft") select((i - 1 + stages.length) % stages.length);
            }}
            tabIndex={i === active ? 0 : -1}
            className={cn(
              "border-r border-border px-2 py-3 text-left font-mono text-[10px] uppercase tracking-[0.16em] transition-colors last:border-r-0 sm:px-4",
              i === active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="block opacity-60 tabnum">0{i + 1}</span>
            {s.label}
          </button>
        ))}
      </div>

      <div
        id="duality-panel"
        role="tabpanel"
        aria-labelledby={`tab-${stage.id}`}
        className="relative grid min-h-[17rem] grid-cols-1 md:block"
      >
        {/* Human side, clipped by the split on wide screens */}
        <div
          className="p-5 md:absolute md:inset-0 md:p-8 md:[clip-path:inset(0_var(--cut)_0_0)]"
          style={{ ["--cut" as string]: `${100 - split}%` }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-text">
            ✎ Human judgement
          </p>
          <p className="mt-3 max-w-[34ch] font-display text-[1.375rem] leading-snug tracking-[-0.01em] md:text-[1.6rem]">
            {stage.human}
          </p>
        </div>

        {/* Model side */}
        <div
          className="border-t border-border p-5 md:absolute md:inset-0 md:border-t-0 md:p-8 md:text-right md:[clip-path:inset(0_0_0_var(--cut))]"
          style={{ ["--cut" as string]: `${split}%` }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ai">
            ✦ Model drafting
          </p>
          <p className="mt-3 max-w-[34ch] font-display text-[1.375rem] leading-snug tracking-[-0.01em] text-muted-foreground md:ml-auto md:text-[1.6rem]">
            {stage.model}
          </p>
        </div>

        {/* The seam */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 hidden w-px bg-foreground md:block"
          style={{ left: `${split}%` }}
        >
          <span className="absolute top-1/2 left-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-foreground bg-background font-mono text-[11px]">
            ⇆
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border px-5 py-4 md:px-8">
        <label
          htmlFor={sliderId}
          className="hidden font-mono md:inline text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
        >
          Inspect
        </label>
        <input
          id={sliderId}
          type="range"
          min={8}
          max={92}
          value={split}
          onChange={(e) => setSplit(Number(e.target.value))}
          aria-valuetext={`${split}% human side visible`}
          className="hidden h-1 min-w-[10rem] flex-1 md:block cursor-ew-resize accent-[var(--brand)]"
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
          {leadLabel[stage.lead]}
        </span>
      </div>
    </div>
  );
}
