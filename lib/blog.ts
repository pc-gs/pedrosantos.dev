import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { BlogPost } from "@/lib/types";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

marked.setOptions({
  gfm: true,
  breaks: false,
});

type Frontmatter = {
  title?: string;
  description?: string;
  date?: string;
  tags?: string[];
  draft?: boolean;
  readingTime?: string;
  /** Marks a post drafted with AI from the author's notes, then human-edited. */
  coWritten?: boolean;
  process?: {
    notes?: string;
    prompts?: string[];
    humanEdit?: string;
  };
};

function readingTimeFor(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function loadPostFile(fileName: string): BlogPost | null {
  const fullPath = path.join(BLOG_DIR, fileName);
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as Frontmatter;

  const slug = fileName.replace(/\.md$/, "");
  const date = fm.date ?? "";

  const process =
    fm.process && (fm.process.notes || fm.process.prompts?.length || fm.process.humanEdit)
      ? {
          notes: fm.process.notes ?? "",
          prompts: Array.isArray(fm.process.prompts) ? fm.process.prompts : [],
          humanEdit: fm.process.humanEdit ?? "",
        }
      : undefined;

  return {
    slug,
    title: fm.title ?? slug,
    description: fm.description ?? "",
    date,
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    draft: Boolean(fm.draft),
    readingTime: fm.readingTime ?? readingTimeFor(content),
    body: marked.parse(content) as string,
    content,
    coWritten: Boolean(fm.coWritten),
    process,
  };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  const posts = files
    .map((f) => loadPostFile(f))
    .filter((p): p is BlogPost => p !== null)
    .filter((p) => (process.env.NODE_ENV === "production" ? !p.draft : true))
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return posts;
}

export function getPostBySlug(slug: string): BlogPost | null {
  const file = `${slug}.md`;
  const post = loadPostFile(file);
  if (!post) return null;
  if (process.env.NODE_ENV === "production" && post.draft) return null;
  return post;
}

export function getAllPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}
