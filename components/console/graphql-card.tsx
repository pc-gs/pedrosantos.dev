"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProcessCard } from "./process-card";

type Seg = { t: string; owner?: string; field?: boolean };
type Line = Seg[];

const COMPONENTS = [
  { id: "EntryHeader", file: "entry-header.tsx", fields: ["title", "date"] },
  { id: "EntryMargin", file: "entry-margin.tsx", fields: ["date", "tags", "aiAssisted"] },
  { id: "EntryBody", file: "entry-body.tsx", fields: ["body", "readingTime"] },
];

const ALL_FIELDS = [...new Set(COMPONENTS.flatMap((c) => c.fields))];

function fieldsLine(fields: string[], owner?: string): Seg[] {
  return fields.flatMap((f) => [{ t: " " }, { t: f, owner, field: true }]);
}

function colocatedDoc(): Line[] {
  return [
    [{ t: "query EntryPage($slug: String!) {" }],
    [{ t: "  logEntry(slug: $slug) {" }],
    ...COMPONENTS.map((c) => [{ t: "    " }, { t: `...${c.id}_entry`, owner: c.id }]),
    [{ t: "  }" }],
    [{ t: "}" }],
    [{ t: "" }],
    ...COMPONENTS.flatMap((c) => [
      [{ t: `# ${c.file}`, owner: c.id }],
      [
        { t: `fragment ${c.id}_entry on LogEntry {`, owner: c.id },
        ...fieldsLine(c.fields, c.id),
        { t: " }" },
      ],
    ]),
  ];
}

function hoistedDoc(): Line[] {
  return [
    [{ t: "query EntryPage($slug: String!) {" }],
    [{ t: "  logEntry(slug: $slug) {" }, ...fieldsLine(ALL_FIELDS), { t: " }" }],
    [{ t: "}" }],
    [{ t: "" }],
    ...COMPONENTS.flatMap((c) => [
      [{ t: `# ${c.file}`, owner: c.id }],
      [
        { t: `type ${c.id}Props = {`, owner: c.id },
        ...fieldsLine(c.fields, c.id),
        { t: " }" },
      ],
    ]),
  ];
}

/**
 * Fragment colocation, playable. Pick a component to see the fields it owns,
 * flip between colocated fragments and a hoisted query, and rename a field to
 * see what each shape makes you touch. Shaped like this site's LogEntry.
 */
export function GraphqlCard() {
  const [layout, setLayout] = useState<"colocated" | "hoisted">("colocated");
  const [selected, setSelected] = useState<string | null>("EntryMargin");
  const [renamed, setRenamed] = useState(false);

  const doc = layout === "colocated" ? colocatedDoc() : hoistedDoc();
  const users = COMPONENTS.filter((c) => c.fields.includes("date")).length;

  return (
    <ProcessCard pid="004" name="react + graphql" mode="graphql" status="schema" className="md:col-span-3">
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Query shape">
          {(["colocated", "hoisted"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={layout === option}
              onClick={() => setLayout(option)}
              className={cn(
                "rounded-[6px] border px-2.5 py-1 font-mono text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7cc4ff]",
                layout === option
                  ? "border-[#7cc4ff]/60 text-[#7cc4ff]"
                  : "border-con-line text-con-dim hover:text-con-ink",
              )}
            >
              {option === "colocated" ? "colocated fragments" : "hoisted query + prop types"}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[150px_1fr]">
          <ul className="flex flex-row flex-wrap gap-2 font-mono text-[11px] sm:flex-col sm:flex-nowrap" aria-label="Components">
            <li className="w-full text-con-dim">EntryPage</li>
            {COMPONENTS.map((c) => (
              <li key={c.id} className="flex items-center gap-1.5">
                <span className="hidden text-con-line sm:inline" aria-hidden="true">
                  └
                </span>
                <button
                  type="button"
                  aria-pressed={selected === c.id}
                  onClick={() => setSelected(selected === c.id ? null : c.id)}
                  className={cn(
                    "rounded border px-1.5 py-0.5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7cc4ff]",
                    selected === c.id
                      ? "border-[#7cc4ff]/60 bg-[#7cc4ff]/10 text-[#7cc4ff]"
                      : "border-con-line text-con-ink hover:border-con-dim",
                  )}
                >
                  {c.id}
                </button>
              </li>
            ))}
          </ul>

          <pre className="h-[220px] overflow-auto rounded-[8px] border border-con-line bg-black/40 p-3 font-mono text-[10.5px] leading-[1.7] text-con-dim [scrollbar-width:thin]">
            {doc.map((line, i) => (
              <div key={i}>
                {line.map((seg, j) => {
                  const mine = selected !== null && seg.owner === selected;
                  const broken = renamed && seg.field && seg.t === "date";
                  return (
                    <span
                      key={j}
                      className={cn(
                        mine && "text-[#7cc4ff]",
                        mine && seg.field && "rounded-sm bg-[#7cc4ff]/15",
                        seg.t.startsWith("#") && !mine && "text-con-dim/50",
                        broken && "rounded-sm bg-con-amber/15 text-con-amber line-through",
                      )}
                    >
                      {seg.t || " "}
                    </span>
                  );
                })}
              </div>
            ))}
          </pre>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            aria-pressed={renamed}
            onClick={() => setRenamed((r) => !r)}
            className="rounded-[6px] border border-con-amber/50 px-2.5 py-1 font-mono text-[11px] text-con-amber transition-colors hover:bg-con-amber/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-con-amber"
          >
            {renamed ? "undo rename" : "rename date → publishedAt"}
          </button>
          <p className="font-mono text-[10.5px] text-con-dim" aria-live="polite">
            {!renamed
              ? "schema change: none"
              : layout === "colocated"
                ? `${users} fragments flagged, each next to its component · types regenerate`
                : `1 query + ${users} hand-written prop types to find and fix`}
          </p>
        </div>

        <p className="mt-4 max-w-[52ch] text-[0.92rem] leading-relaxed text-con-dim">
          A component declares the fields it needs right where it uses them, the page query only spreads
          fragments, and generated types flow down. Moving to that let me delete a folder of hand-written
          prop types.
        </p>
      </div>
    </ProcessCard>
  );
}
