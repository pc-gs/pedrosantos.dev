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
      "Early-stage product for customized software solutions — branding, landing pages, and client tooling.",
    longDescription:
      "A long-term product I'm building in my own time. Melro.io focuses on helping local businesses with tailored software — from landing pages to internal tools. Still early-stage, but it's where I experiment with product thinking, client workflows, and shipping end-to-end.",
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
      "VS Code extension with a quick dropdown to run package.json scripts without digging through the file.",
    longDescription:
      "A developer tool born from a small daily annoyance — finding and running npm scripts. Select Script adds a clean dropdown picker inside VS Code so you can run scripts in one click.",
    tags: ["TypeScript", "VS Code", "Developer Tools"],
    status: "shipped",
    featured: true,
    year: "2024",
    links: { github: "https://github.com/pedrocarlos-ti" },
  },
  {
    slug: "ai-tree",
    title: "AI Tree",
    description:
      "Platform for learning and sharing AI knowledge with interactive visualizations.",
    longDescription:
      "An experiment in making AI concepts easier to explore — combining structured content, visualizations, and community features. Built with Next.js and Supabase.",
    tags: ["Next.js", "React", "Supabase", "AI"],
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