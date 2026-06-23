// Builder-focused content for pedrosantos.dev home base (2026)
// Separated for easy iteration; concrete, no placeholders, external links only.

export type NowItem = {
  title: string;
  status: string;
  detail: string;
  updated: string;
};

export type ActiveBuild = {
  id: number;
  title: string;
  description: string;
  status: "Active" | "In Progress" | "Shipped";
  stack: string[];
  href: string;
  hrefLabel: string;
};

export type LogEntry = {
  date: string;
  title: string;
  detail: string;
  kind: "ship" | "lab" | "note";
};

export const siteIdentity = {
  name: "Pedro Santos",
  role: "Builder & Founder",
  org: "Melro.io",
  orgUrl: "https://melro.io",
  location: "Belmonte, Portugal",
  tagline: "Crafting production systems and experiments in public.",
};

export const nowItems: NowItem[] = [
  {
    title: "Melro Platform",
    status: "Active",
    detail: "Shipping AI-powered custom solutions for local businesses. Next.js + agent tooling.",
    updated: "Jun 2026",
  },
  {
    title: "Internal dev tooling",
    status: "In Progress",
    detail: "Prototyping local-first automation and script runners for client ops.",
    updated: "Jun 2026",
  },
  {
    title: "Builder notes & patterns",
    status: "Ongoing",
    detail: "Documenting React/TS patterns that scale for agency work.",
    updated: "This week",
  },
];

export const activeBuilds: ActiveBuild[] = [
  {
    id: 1,
    title: "Melro.io Platform",
    description: "Core delivery platform for bespoke AI and web solutions. Focus on reliability, fast iteration, and real business outcomes.",
    status: "Active",
    stack: ["Next.js", "TypeScript", "GraphQL", "AI Agents"],
    href: "https://melro.io",
    hrefLabel: "Visit melro.io",
  },
  {
    id: 2,
    title: "Client automation suite",
    description: "Internal tools and integrations that remove manual work for small teams. React/Node + scheduling.",
    status: "In Progress",
    stack: ["React", "Node.js", "GraphQL", "TypeScript"],
    href: "https://github.com/pedrocarlos-ti",
    hrefLabel: "See builds on GitHub",
  },
  {
    id: 3,
    title: "Open experiments",
    description: "Public prototypes and utilities — VS Code helpers, visualization tooling, and AI UX sketches.",
    status: "Shipped",
    stack: ["TypeScript", "Next.js", "Canvas"],
    href: "https://github.com/pedrocarlos-ti",
    hrefLabel: "Browse on GitHub",
  },
];

export const builderLog: LogEntry[] = [
  { date: "2026-06", title: "Contact flow hardened", detail: "Production email via Resend + validation + escaped templates.", kind: "ship" },
  { date: "2026-05", title: "Client site v2 live", detail: "Rebuilt delivery site with server components and live preview mockups.", kind: "ship" },
  { date: "2026-04", title: "Lab: workspace preview", detail: "Integrated device frames + live state simulation for demos.", kind: "lab" },
  { date: "2026-03", title: "Pattern notes", detail: "Started internal log of scalable patterns for agency React work.", kind: "note" },
];

export const shortcuts = [
  { key: "n", label: "Jump to Now", action: "#now" },
  { key: "l", label: "Open Lab", action: "#lab" },
  { key: "s", label: "Stack", action: "#stack" },
  { key: "g", label: "GitHub", action: "https://github.com/pedrocarlos-ti" },
  { key: "m", label: "Melro", action: "https://melro.io" },
  { key: "c", label: "Contact", action: "#contact" },
] as const;
