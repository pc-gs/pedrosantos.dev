import { profile } from "@/content/profile";

export type FeedItem = {
  slug: string;
  title: string;
  description?: string;
  date: string;
  href: string;
};

function escapeXml(str: string): string {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function buildRssFeed({
  title,
  description,
  items,
  path,
}: {
  title: string;
  description: string;
  items: FeedItem[];
  path: string;
}): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pedrosantos.dev";
  const feedUrl = `${siteUrl}${path}`;

  const entries = items
    .map(
      (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${siteUrl}${item.href}</link>
      <guid isPermaLink="true">${siteUrl}${item.href}</guid>
      <pubDate>${new Date(item.date.length === 7 ? `${item.date}-01` : item.date).toUTCString()}</pubDate>
      ${item.description ? `<description>${escapeXml(item.description)}</description>` : ""}
    </item>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(description)}</description>
    <language>en</language>
    <managingEditor>${escapeXml(profile.email)} (Pedro Santos)</managingEditor>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
    ${entries}
  </channel>
</rss>`;
}
