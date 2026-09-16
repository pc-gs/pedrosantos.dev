import { getAllPosts } from "@/lib/blog";
import { buildRssFeed } from "@/lib/rss";

export const dynamic = "force-static";

export function GET() {
  const items = getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    date: p.date,
    href: `/blog/${p.slug}`,
  }));

  const xml = buildRssFeed({
    title: "Pedro Santos — Writing",
    description:
      "Essays on building software, co-written with AI and human-edited. Each post shows how it was made.",
    items,
    path: "/rss.xml",
  });

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
