import type { Study } from "@/lib/types";

/**
 * /studies — the bench.
 *
 * A study track is not a TODO item: it's a thread I'm pulling on, with the
 * log entries that show the actual work. Keep `why` specific and first
 * person; if a track stops moving for months, either revive it or remove it.
 */
export const studies: Study[] = [
  {
    id: "ai-workflow",
    title: "AI-assisted engineering",
    why: "The way I write software is changing faster than any framework cycle I've lived through. The log is my lab notebook: what works, what doesn't, and what stays human.",
    state: "applying",
    since: "2026-06",
    updatedAt: "2026-09-16",
    logSlugs: [
      "this-site-is-now-co-written-with-ai",
      "good-prompt-is-a-good-ticket",
      "ai-linter-for-thinking",
    ],
  },
  {
    id: "cross-platform",
    title: "Desktop & cross-platform",
    why: "Tauri makes desktop feel like shipping web — until the webview reminds you it isn't Chrome. I want the platform edges to stop being a tax.",
    state: "learning",
    since: "2026-05",
    updatedAt: "2026-08-21",
    logSlugs: ["tauri-webview-not-browser"],
  },
  {
    id: "graphql-architecture",
    title: "GraphQL & frontend architecture",
    why: "Colocated fragments and a strict schema changed how I think about data flow. This is the depth I want in my day-job craft, not just in side projects.",
    state: "applying",
    since: "2025-11",
    updatedAt: "2026-09-10",
    logSlugs: ["graphql-fragments-dx"],
  },
  {
    id: "typescript-details",
    title: "TypeScript, one detail at a time",
    why: "Small language features compound. The satisfy operator was one afternoon; there's a pile of these still to work through, and each one makes the compiler a better teammate.",
    state: "exploring",
    since: "2026-08",
    updatedAt: "2026-09-02",
    logSlugs: ["til-satisfy-operator"],
  },
];

export function getStudyBySlug(slug: string): Study | undefined {
  return studies.find((s) => s.id === slug);
}
