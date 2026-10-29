import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { readingTimeFor, renderMarkdown } from "@/lib/markdown";
import type { LogEntry } from "@/lib/types";

const LOG_DIR = path.join(process.cwd(), "content", "log");

type Frontmatter = {
  title?: string;
  description?: string;
  date?: string;
  tags?: string[];
  aiAssisted?: boolean;
  model?: string;
  prompt?: string;
  draft?: boolean;
};

function loadEntryFile(fileName: string): LogEntry | null {
  const fullPath = path.join(LOG_DIR, fileName);
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as Frontmatter;

  const slug = fileName.replace(/\.md$/, "");

  return {
    slug,
    title: fm.title ?? slug,
    description: fm.description ?? "",
    date: fm.date ?? "",
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    aiAssisted: Boolean(fm.aiAssisted),
    model: fm.model,
    prompt: fm.prompt,
    draft: Boolean(fm.draft),
    readingTime: readingTimeFor(content),
    body: renderMarkdown(content),
    content,
  };
}

export function getAllLogEntries(): LogEntry[] {
  if (!fs.existsSync(LOG_DIR)) return [];

  const files = fs.readdirSync(LOG_DIR).filter((f) => f.endsWith(".md"));

  const entries = files
    .map((f) => loadEntryFile(f))
    .filter((e): e is LogEntry => e !== null)
    .filter((e) => (process.env.NODE_ENV === "production" ? !e.draft : true))
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return entries;
}

export function getLogEntryBySlug(slug: string): LogEntry | null {
  const entry = loadEntryFile(`${slug}.md`);
  if (!entry) return null;
  if (process.env.NODE_ENV === "production" && entry.draft) return null;
  return entry;
}

export function getAllLogSlugs(): string[] {
  return getAllLogEntries().map((e) => e.slug);
}
