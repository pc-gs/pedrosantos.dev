import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    slug: "mira",
    title: "Mira",
    tagline: "Draw on top of any app while you present. Show what you mean.",
    summary:
      "A desktop annotation overlay for live calls, demos and teaching: a transparent, always-on-top drawing layer on every monitor, driven by a small floating toolbar and global shortcuts.",
    role: "Solo builder",
    status: "ongoing",
    period: "2026 — present",
    year: 2026,
    featured: true,
    order: 1,
    tags: ["Desktop", "Tauri", "Developer Tools"],
    stack: ["Tauri 2", "Rust", "React 19", "TypeScript", "Swift"],
    links: [{ label: "Source", href: "https://github.com/pc-gs/MIRA", kind: "source" }],
    cover: "/work/mira/preview.png",
    caseStudy: {
      tldr:
        "A transparent overlay you can draw on during a screen share, built in Tauri to learn desktop by shipping a real tool, with a native macOS build alongside it.",
      problem: {
        thesis:
          "During a call or a demo, switching to another tool to point at something breaks the explanation.",
        body:
          "When I'm walking someone through a screen, the moment I need to circle a button or draw an arrow I have to leave what I'm showing. I wanted the pen to already be there, on top of whatever app is in front, and to get out of the way the second I'm done.",
      },
      approach: {
        thesis:
          "A split-window app: one small toolbar, one transparent drawing surface per monitor, and a Rust core that keeps them in sync.",
        body:
          "The toolbar is its own compact window. Each monitor gets a transparent, always-on-top overlay with the drawing canvas. The Rust side creates and positions the windows, and the React windows talk to it through Tauri commands while Rust emits events back, so every overlay picks up the current tool, colour and size, including overlays for a display plugged in mid-session.\n\nDrawing uses two canvases, one for finished strokes and one for the stroke in progress, which removed the lag on busy screens. Shortcuts are all `Ctrl+Shift` so they don't collide with the Dock or browser devtools, and on macOS the toolbar sits at status-window level so it never ends up underneath the drawing. In parallel I built a native Swift version of the macOS app to compare against the webview approach.",
      },
      outcome: {
        thesis:
          "A working v1: pen, highlighter, shapes, text, spotlight, undo/redo, multi-monitor, with CI builds for macOS, Windows and Linux.",
        body:
          "Mira has the tools I actually reach for during a presentation: pen, highlighter, eraser, line, rectangle, ellipse, arrow, editable text, a spotlight pointer and a presentation mode with a mini toolbar. Everything is undoable. CI builds it for macOS, Windows and Linux, with Apple code signing and notarization wired in for releases. macOS is the platform I test on.",
      },
      learnings: [
        "Two canvases (committed strokes and the live one) is the difference between a drawing app that keeps up and one that stutters.",
        "On desktop, window levels and focus are the product. Most of the hard bugs were about which window is on top and which one gets the click.",
      ],
    },
    highlights: [
      "Transparent, always-on-top overlay on every monitor",
      "Global shortcuts, spotlight and presentation mode",
      "Tauri app plus a native Swift build for macOS",
    ],
    milestones: [
      {
        date: "2026-02-20",
        kind: "started",
        title: "First Tauri build: floating toolbar, shapes, spotlight and an overlay per monitor",
      },
      {
        date: "2026-03-20",
        kind: "update",
        title: "Dual-canvas rendering, monitor hot-plugging and signed macOS builds",
      },
      {
        date: "2026-04-29",
        kind: "update",
        title: "A native Swift build of the macOS app, next to the Tauri one",
      },
      {
        date: "2026-08-07",
        kind: "update",
        title: "Editable text, presentation mode, screenshot export and CI for macOS, Windows and Linux",
      },
    ],
  },
  {
    slug: "melro-io",
    title: "Melro.io",
    tagline: "A founder-mode side experiment — software for local businesses.",
    summary:
      "The company I run on the side. Building customized software for local businesses — a long-term experiment in thinking like a founder, not just an engineer. Not the main headline, but the thing that keeps me honest.",
    role: "Founder & engineer",
    status: "ongoing",
    period: "2023 — present",
    year: 2023,
    featured: true,
    order: 2,
    tags: ["Founder", "Side project", "Long-term"],
    stack: ["React", "Next.js", "TypeScript", "Node.js"],
    links: [{ label: "melro.io", href: "https://melro.io", kind: "live" }],
    caseStudy: {
      tldr:
        "A deliberately small, deliberately local side company — the place I practice the full product loop, not just the engineering.",
      problem: {
        thesis:
          "I wanted the full loop of building for real users — finding the problem, not just implementing tickets — without quitting my day job.",
        body:
          "I wanted to understand the full loop of building software for real users — not just implementing tickets, but finding the problem, talking to people, shipping something small, and watching it survive contact with reality. A side company was the most honest way to practice that without quitting my day job.",
      },
      approach: {
        thesis:
          "Deliberately small and local — I wear every hat, and the engineering is the easy part.",
        body:
          "Melro.io is deliberately small and deliberately local. I work with local businesses on customized software, which means I wear every hat: scoping, building, supporting, and occasionally saying no. The engineering is the easy part — the real work is figuring out what's actually worth building and what a small business will actually use.\n\nI treat it as a long-running experiment rather than a startup with a growth curve. The goal isn't scale; it's learning to think in product and ownership terms.",
      },
      outcome: {
        thesis:
          "Still going — and the biggest shift is in how I approach my day-job work, not the codebase.",
        body:
          "Still going. The biggest shift isn't in the codebase — it's in how I approach my day-job work. Founding on the side makes you ask better questions: who is this for, what happens after we ship, what's the smallest thing that's actually useful. That perspective is worth more than any single feature I've built.",
      },
      learnings: [
        "The hardest part of building a product isn't building — it's deciding what not to build.",
        "Local, small, and slow is a valid strategy when the goal is learning, not scale.",
        "Founder thinking compounds: it makes you a better engineer at your day job, not a distracted one.",
      ],
    },
    highlights: [
      "Ongoing founder experiment since 2023",
      "Customized software for local businesses",
      "Funds itself; doesn't compete with day-job focus",
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order);
}

export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => a.order - b.order);
}
