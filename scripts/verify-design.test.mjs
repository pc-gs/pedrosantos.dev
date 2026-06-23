import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

const globals = read("app/globals.css");
assert.match(globals, /--accent:\s*12\s/, "accent hue must be warm coral (12), not cyan");
assert.doesNotMatch(globals, /--accent:\s*187\s/, "cyan accent (187) must be removed");
assert.match(globals, /\.page-content/, "page-content layout utility must exist");
assert.match(globals, /\.bento-grid/, "bento-grid layout utility must exist");

const layoutChecks = [
  ["app/page.tsx", /PageContainer|bento-grid|surface-panel/],
  ["app/layout.tsx", /SiteSidebar|md:ml-64/],
  ["components/layout/site-sidebar.tsx", /nav-pill-active|bg-accent/],
  ["components/projects/project-card.tsx", /surface-panel/],
  ["components/ui/section-label.tsx", /text-accent|bg-accent/],
];

for (const [file, pattern] of layoutChecks) {
  assert.match(read(file), pattern, `${file} must use updated design classes`);
}

const { getAllPosts, getPostBySlug } = await import(path.join(root, "lib/blog.ts"));
const posts = getAllPosts();
assert.ok(posts.length > 0, "blog posts must load");
const post = getPostBySlug(posts[0].slug);
assert.ok(post?.content.length > 0, "blog post content must render");

console.log("verify-design: all checks passed");