import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    slug: "select-script",
    title: "Select Script",
    tagline: "A fast dropdown selector for npm scripts inside VS Code.",
    summary:
      "A VS Code extension that turns the package.json scripts list into a quick, keyboard-first dropdown — so you stop memorizing and retyping script names.",
    role: "Solo builder",
    status: "shipped",
    period: "2024 — present",
    year: 2024,
    featured: true,
    order: 1,
    tags: ["Developer Tools", "VS Code", "DX"],
    stack: ["TypeScript", "VS Code Extension API"],
    links: [
      { label: "Source", href: "https://github.com/pc-gs", kind: "source" },
    ],
    caseStudy: {
      tldr:
        "A one-command VS Code extension that turns npm scripts into a keyboard-first dropdown — so you stop memorizing and retyping them.",
      problem: {
        thesis:
          "Running npm scripts from memory or by scrolling a panel breaks flow — I wanted a command-palette feel.",
        body:
          "Every React/Next.js project ends up with a dozen scripts — `dev`, `build`, `lint`, `test`, `typecheck`, plus project-specific ones like `db:seed`. The default ways to run them are typing `npm run <name>` from memory or scrolling the scripts panel. Both break flow. I wanted something closer to a command palette: type a few letters, hit enter, done.",
      },
      approach: {
        thesis:
          "One VS Code command, a quick-pick dropdown fed from `package.json`, and zero config — a tool that disappears into your workflow.",
        body:
          "Built a VS Code extension that registers a single command and opens a quick-pick dropdown populated directly from the workspace's `package.json`. The list is filtered as you type, shows the script name and its full command, and runs it in the integrated terminal on selection.\n\nKept the surface area deliberately tiny — one command, no settings page, no telemetry, no dependencies beyond the extension host. The goal was a tool that disappears into your workflow rather than one you have to manage.",
      },
      outcome: {
        thesis:
          "A small tool that does one thing well — and the muscle-memory moment of `Cmd+Shift+P`, `ss`, enter is the real reward.",
        body:
          "A focused extension that does one thing well. It's the kind of tool I built for myself first and polished because the friction it removes is one I hit dozens of times a day. The real payoff is that muscle-memory moment: `Cmd+Shift+P`, `ss`, enter, and the right script is running.",
      },
      learnings: [
        "Constraint is a feature: one command and zero config made the extension feel instant rather than heavy.",
        "Developer tools earn trust by being boring and predictable — the best DX is the one you stop noticing.",
        "Reading the VS Code quick-pick API closely paid off; the built-in filtering already does most of the work.",
      ],
    },
    highlights: [
      "Single-command, keyboard-first script runner",
      "Zero runtime dependencies, minimal extension footprint",
      "Built dogfood-first — I use it daily",
    ],
  },
  {
    slug: "ai-tree",
    title: "AI Tree",
    tagline: "Learning AI through interactive, branching visualizations.",
    summary:
      "A platform for learning and sharing knowledge about AI using interactive visualizations and a branching tree metaphor — concepts split into explorable paths instead of a flat article.",
    role: "Builder",
    status: "ongoing",
    period: "2023 — present",
    year: 2023,
    featured: true,
    order: 2,
    tags: ["Learning", "Visualization", "Web App"],
    stack: ["Next.js", "React", "TypeScript", "Supabase"],
    links: [{ label: "Source", href: "https://github.com/pc-gs", kind: "source" }],
    caseStudy: {
      tldr:
        "A learning platform where AI concepts live on an expandable tree — the structure of the knowledge becomes the interface, not a flat article.",
      problem: {
        thesis:
          "Flat articles and scrubable videos don't map to how concepts actually branch — I wanted the structure to be the interface.",
        body:
          "Most AI learning material is either a flat long-form article or a video you scrub through. Neither maps well to how concepts actually relate — a topic branches into prerequisites, alternatives, and deeper specializations. I wanted a format where the structure of the knowledge is part of the interface.",
      },
      approach: {
        thesis:
          "A Next.js app where content lives on an expandable tree, backed by Supabase so it grows without redeploying.",
        body:
          "Built a Next.js app where content lives on a tree you can expand and collapse. Each node is a focused concept with a short explanation and links to children that go deeper or sideways. Supabase backs the content so it can grow over time without redeploying. The interaction model borrows from file explorers and outliners — things developers already know how to navigate.\n\nThe hard part wasn't rendering a tree — it was deciding what deserves to be a node. Too granular and it's overwhelming; too coarse and it's just an article with arrows.",
      },
      outcome: {
        thesis:
          "An ongoing experiment — the open question is whether the tree metaphor holds as content scales, or whether it needs to become a graph.",
        body:
          "An ongoing experiment in making structured knowledge feel explorable rather than imposed. It's still growing — the interesting question is whether the tree metaphor holds up as content scales, or whether it needs to become a graph.",
      },
      learnings: [
        "Content structure is a UX decision, not just an information-architecture one.",
        "Trees are intuitive to navigate but brittle to author — the authoring experience deserves as much thought as the reading experience.",
        "Supabase is a great fit for content that should evolve without a CMS or redeploy loop.",
      ],
    },
    highlights: [
      "Interactive branching concept tree",
      "Content stored in Supabase, evolves without redeploy",
      "Ongoing — format questions still open",
    ],
  },
  {
    slug: "electron-draw",
    title: "Electron Draw",
    tagline: "A transparent overlay for annotating anything on your screen.",
    summary:
      "A desktop screen-annotation tool built with Electron — a transparent always-on-top window you can draw on top of any app, useful for demos, recordings, and pair work.",
    role: "Solo builder",
    status: "shipped",
    period: "2022 — 2023",
    year: 2022,
    featured: true,
    order: 3,
    tags: ["Desktop", "Electron", "Utility"],
    stack: ["Electron", "TypeScript", "Canvas"],
    links: [{ label: "Source", href: "https://github.com/pc-gs", kind: "source" }],
    caseStudy: {
      tldr:
        "A transparent, always-on-top Electron overlay you can draw on top of any app — a lightweight pen for demos, recordings, and pair work.",
      problem: {
        thesis:
          "Gesturing at a screen you can't mark means alt-tabbing to a whiteboard or a heavy recorder — I wanted a pen that floats over everything.",
        body:
          "When you're recording a tutorial or walking someone through a UI over a call, you end up gesturing at a screen you can't mark. The options are either heavy screen-recorder suites or a separate whiteboard app you have to alt-tab into. I wanted a lightweight pen that floats over everything.",
      },
      approach: {
        thesis:
          "A transparent, click-through Electron canvas with a hotkey toggle between draw mode and pass-through mode.",
        body:
          "Built an Electron app whose main window is a fully transparent, always-on-top, click-through canvas overlay. Drawing tools render onto an HTML canvas; a hotkey toggles between draw mode (captures input) and pass-through mode (lets you click the app underneath). Packaged for desktop with standard Electron tooling.\n\nThe trickiest piece was the input-routing: a transparent overlay that's clickable when you want to draw but invisible to clicks when you want to use the app behind it. Getting that toggle to feel instant was the whole game.",
      },
      outcome: {
        thesis:
          "A focused utility that does one thing and gets out of the way — the best overlay apps are the ones you forget are running.",
        body:
          "A focused utility that does one thing — let you draw on top of your screen — and gets out of the way. It taught me that desktop tooling with Electron is accessible if you respect the platform conventions, and that the best overlay apps are the ones you forget are running.",
      },
      learnings: [
        "Transparent + always-on-top + click-through is a powerful combo, but input routing has sharp edges.",
        "Hotkey-driven mode switching is what makes a utility feel professional rather than a toy.",
        "Electron's reputation for heaviness is overstated for single-window utility apps.",
      ],
    },
    highlights: [
      "Transparent, always-on-top canvas overlay",
      "Hotkey toggle between draw and pass-through modes",
      "Cross-platform desktop packaging",
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
    order: 4,
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
