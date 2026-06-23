export type Project = {
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  status: "active" | "shipped" | "experiment";
  featured: boolean;
  year: string;
  links?: {
    live?: string;
    github?: string;
  };
};

export const projects: Project[] = [
  {
    slug: "melro-io",
    title: "Melro.io",
    description:
      "Side project: tailored Next.js sites + small internal tools for local businesses (bakery orders, hardware inventory). Slow, real ownership.",
    longDescription:
      "## The problem\n\nLocal businesses often get stuck between generic website builders that don't fit their process and expensive custom agencies. They need something that matches how they actually work, delivered without ceremony.\n\n## Approach\n\nTreat every engagement as a small product. Start with Next.js + TypeScript. Build narrow reusable form/email components (server actions + Resend) instead of CMS or full backend for v1 speed. Direct collab, own the deploy. Pricing: small fixed + optional iteration retainer. Decision: no design system, just 3-4 battle-tested patterns per client.\n\n## Outcome & reflection\n\n- Bakery (Padaria da Esquina): order inquiry form + weekly email summary; owner reported ~40% less phone time for orders.\n- Hardware store (Ferramentas Belmonte): internal stock list + low-stock alerts (simple editable table + local persistence); 2 staff using it daily.\n- Dentist lead site: services pages + request form.\n\n3 paying clients in first active year, 1 repeat project. Shipped 4 production sites/tools total. Learned: scope ruthlessly or it becomes free consulting; underpriced first two; 'MVP then paid follow-ups' contract works. Melro stays a deliberate side experiment — slow, real ownership, funds itself.",
    tags: ["Next.js", "TypeScript", "Product"],
    status: "active",
    featured: true,
    year: "2023",
    links: { live: "https://melro.io" },
  },
  {
    slug: "select-script",
    title: "Select Script",
    description:
      "VS Code extension: quick dropdown to run package.json scripts without opening the file or typing in terminal.",
    longDescription:
      "## The problem\n\nEvery day I found myself either hunting inside package.json for the right script name or typing `npm run ` in the terminal and hoping for tab completion. Tiny friction that added up across a hundred small tasks.\n\n## Approach\n\nSmallest possible VS Code extension. Parse scripts from package.json, show QuickPick via Command Palette + status bar item, exec via integrated terminal API. Pure TS, no settings, one command only. Decision: no extra UI, package with vsce, manual publish first.\n\n## Outcome & reflection\n\nPublished to marketplace. Still my daily driver. ~few hundred installs (marketplace stats at time). Learned manifest contrib points, packaging quirks, and that tiny single-purpose tools are worth shipping. No major updates needed since. Small, finished, useful.",
    tags: ["TypeScript", "VS Code", "Developer Tools"],
    status: "shipped",
    featured: true,
    year: "2024",
    links: { github: "https://github.com/pedrocarlos-ti/select-script" },
  },
  {
    slug: "ai-tree",
    title: "AI Tree",
    description:
      "Experiment in structured visualizations for learning technical concepts — trees, graphs, and linked explanations.",
    longDescription:
      "## The problem\n\nDense technical topics are usually taught as long articles or scattered videos. Hard to build an accurate mental model quickly or see how concepts connect.\n\n## Approach\n\nWeb app with visual tree (custom SVG + React state, no heavy d3 to keep tiny). Expandable nodes, focused explanation pane + minimal demo. Next.js + Supabase anon for shareable trees. Decision: no user accounts for v0, just share links.\n\n## Outcome & reflection\n\nv0 shipped with 5 core trees I authored. 12 user trees created. Viz helped 'see' structure but writing good node content was 80% effort. Community/auth would have ballooned scope. Parked, but tree viz pattern and 'content is the hard part' lesson used elsewhere.",
    tags: ["Next.js", "React", "Supabase"],
    status: "experiment",
    featured: true,
    year: "2024",
  },
  {
    slug: "electron-draw",
    title: "Electron Draw",
    description:
      "Screen annotation tool with transparent overlay and drawing tools for presentations and demos.",
    longDescription:
      "A desktop app built with Electron for annotating your screen during calls and demos. Transparent window overlay, drawing tools, and keyboard shortcuts — focused on speed and minimal friction.",
    tags: ["Electron", "TypeScript", "Desktop"],
    status: "shipped",
    featured: false,
    year: "2023",
  },
];

export function getFeaturedProjects() {
  return projects.filter((p) => p.featured);
}

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}