import { getAllLogEntries } from "@/lib/log";
import { buildRssFeed } from "@/lib/rss";

export const dynamic = "force-static";

export function GET() {
  const items = getAllLogEntries().map((e) => ({
    slug: e.slug,
    title: e.title,
    description: e.description,
    date: e.date,
    href: `/log/${e.slug}`,
  }));

  const xml = buildRssFeed({
    title: "Pedro Santos — The log",
    description:
      "A public learning log: short entries about what I just learned. ✦ entries are AI-assisted and show their prompts.",
    items,
    path: "/log/feed.xml",
  });

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
