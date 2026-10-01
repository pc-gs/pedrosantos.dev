import type { NowItem, NowKind } from "@/lib/types";

/**
 * Human-voiced labels for each Now row, so the section reads like prose
 * ("Now working on…", "Building…") instead of leaking the data-model key.
 */
export const nowKindLabel: Record<NowKind, string> = {
  working: "Now working on",
  building: "Building",
  learning: "Exploring",
  reading: "Reading",
  writing: "Writing",
  exploring: "Exploring",
};

export const nowItems: NowItem[] = [
  {
    id: "day-job",
    kind: "working",
    text: "Shipping features on a React + GraphQL codebase — focused on frontend architecture, DX and testing practices.",
    date: "2026-09",
  },
  {
    id: "melro",
    kind: "building",
    text: "Iterating on Melro.io — a side company building customized software for local businesses. Slow, deliberate, founder-mode.",
    href: "https://melro.io",
    date: "2026-09",
  },
  {
    id: "ai-workflow",
    kind: "exploring",
    text: "Reworking my daily workflow around AI drafting and human judgement — this site's log is the lab notebook for it.",
    href: "/log",
    date: "2026-09",
  },
  {
    id: "cross-platform",
    kind: "learning",
    text: "Going deeper on Tauri for desktop and React Native for mobile. The web skills transfer; the platform edges are still the tax.",
    href: "/log/tauri-webview-not-browser",
    date: "2026-08",
  },
  {
    id: "writing",
    kind: "writing",
    text: "Writing short log entries instead of waiting for the perfect essay — learning in public, faster and more honestly.",
    href: "/log",
    date: "2026-09",
  },
];

export const nowUpdated = "2026-09-16";
