import { getAllProjects } from "@/content/projects";
import { getAllPosts } from "@/lib/blog";
import { getAllLogEntries } from "@/lib/log";

export type PaletteItem = {
  id: string;
  label: string;
  hint?: string;
  href: string;
  kind: "page" | "project" | "post" | "log";
};

const PAGES: PaletteItem[] = [
  { id: "page-home", label: "Home", href: "/", kind: "page" },
  { id: "page-log", label: "The log", hint: "learning in public", href: "/log", kind: "page" },
  { id: "page-studies", label: "Studies", hint: "on the bench", href: "/studies", kind: "page" },
  { id: "page-projects", label: "Work", hint: "case studies", href: "/work", kind: "page" },
  { id: "page-about", label: "About", href: "/about", kind: "page" },
  { id: "page-now", label: "Now", hint: "what I'm doing", href: "/now", kind: "page" },
  { id: "page-uses", label: "Uses", hint: "tools & gear", href: "/uses", kind: "page" },
  { id: "page-contact", label: "Contact", href: "/contact", kind: "page" },
];

/** Static index for the ⌘K palette — computed on the server from site content. */
export function getPaletteItems(): PaletteItem[] {
  const projects: PaletteItem[] = getAllProjects().map((p) => ({
    id: `project-${p.slug}`,
    label: p.title,
    hint: p.tagline,
    href: `/work/${p.slug}`,
    kind: "project",
  }));

  const posts: PaletteItem[] = getAllPosts().map((p) => ({
    id: `post-${p.slug}`,
    label: p.title,
    hint: "essay",
    href: `/blog/${p.slug}`,
    kind: "post",
  }));

  const log: PaletteItem[] = getAllLogEntries().map((e) => ({
    id: `log-${e.slug}`,
    label: e.title,
    hint: `log · ${e.date}`,
    href: `/log/${e.slug}`,
    kind: "log",
  }));

  return [...PAGES, ...log, ...posts, ...projects];
}
