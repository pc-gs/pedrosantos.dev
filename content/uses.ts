import type { UsesGroup } from "@/lib/types";

/**
 * /uses — the tools, stack and settings behind the work.
 *
 * Everything below is a claim about what I actually use, so it stays short and
 * specific. Add rows rather than adjectives.
 */
export const uses: UsesGroup[] = [
  {
    id: "daily",
    title: "Daily stack",
    note: "What most of my working hours go through.",
    items: [
      { name: "TypeScript", detail: "Strict mode, no exceptions. Types are documentation that fails the build." },
      { name: "React", detail: "Function components, hooks, and a bias for fewer abstractions." },
      { name: "Next.js", detail: "App Router, server components, static prerendering where it fits." },
      { name: "GraphQL", detail: "Day-job codebase — colocated fragments are the DX win I underused for years." },
      { name: "React Native", detail: "Shared logic across platforms, with platform edges treated as a real cost." },
      { name: "Node.js", detail: "APIs, scripts and the boring glue that keeps projects shippable." },
    ],
  },
  {
    id: "this-site",
    title: "The stack behind this site",
    note: "If you're curious what built what you're reading.",
    items: [
      { name: "Next.js 15", detail: "App Router, static prerendering, view transitions." },
      { name: "Tailwind CSS v4", detail: "Design tokens live in CSS (@theme), not in a JS config." },
      { name: "bun", detail: "Install, scripts, lockfile — the whole toolchain." },
      { name: "marked + gray-matter", detail: "Markdown in content/, frontmatter for metadata. No CMS." },
      { name: "next-themes", detail: "Real light/dark: system preference first, manual override second." },
      { name: "cmdk", detail: "The ⌘K palette — navigation and client-side search over every page." },
      { name: "Cloud Run", detail: "Deploys the container from Google Cloud Build. Scales to zero, no vendor scripts." },
      { name: "Resend", detail: "Contact form delivery." },
    ],
  },
  {
    id: "design",
    title: "Design & type",
    note: "Bancada: warm bone paper, ink, one orange accent.",
    items: [
      { name: "Bricolage Grotesque", detail: "Display headlines. Variable, a bit opinionated, never corporate." },
      { name: "Geist", detail: "Body text and UI chrome. Quiet and legible at small sizes." },
      { name: "JetBrains Mono", detail: "Labels, metadata, log entries and code, where precision matters." },
      { name: "Melro orange", detail: "One accent for links, status and CTAs. The same orange as Melro.io." },
      { name: "Violet ✦", detail: "Reserved exclusively for marking AI co-authorship. It never means anything else." },
    ],
  },
  {
    id: "cross-platform",
    title: "Desktop & cross-platform",
    items: [
      { name: "Tauri", detail: "Small binaries, OS webview. Remember it's not Chrome." },
      { name: "Electron", detail: "Shipped a desktop canvas tool with it before Tauri was on my radar." },
      { name: "macOS", detail: "Where I build. WKWebView differences are a real test target, not a footnote." },
    ],
  },
];

// TODO(pedro): add the "Desk" group (machine, keyboard, monitor, editor, terminal)
// once you want the hardware side public — rows go here, nothing else changes.
