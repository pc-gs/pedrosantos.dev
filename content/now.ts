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
    text: "Shipping features on a React + GraphQL codebase at Aubay Portugal — focused on frontend DX and component architecture.",
    date: "2025-02",
  },
  {
    id: "melro",
    kind: "building",
    text: "Iterating on Melro.io — a side experiment building software for local businesses. Slow, deliberate, founder-mode.",
    href: "https://melro.io",
    date: "2025-02",
  },
  {
    id: "react-native",
    kind: "learning",
    text: "Exploring Tauri for desktop and going deeper on React Native — web skills translating to every surface.",
    date: "2025-01",
  },
  {
    id: "writing",
    kind: "writing",
    text: "Writing about rebuilding this site and the trade-offs of a builder's home base over a classic portfolio.",
    href: "/blog",
    date: "2025-02",
  },
];

export const nowUpdated = "2025-02-10";
