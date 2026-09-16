import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { getAllLogEntries } from "@/lib/log";
import { SectionHeading } from "@/components/layout/section";
import { LogFeed } from "@/components/log/log-feed";
import { AiBadge } from "@/components/log/ai-badge";
import { JsonLd } from "@/components/layout/json-ld";
import { generateCollectionStructuredData } from "@/lib/structured-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pedrosantos.dev";

export const metadata: Metadata = {
  title: "The log — learning in public",
  description:
    "Short entries about what I'm learning, as I learn it. AI-assisted entries are marked ✦ and include the prompt that started them.",
  alternates: { canonical: "/log" },
};

export default function LogPage() {
  const entries = getAllLogEntries();
  const aiCount = entries.filter((e) => e.aiAssisted).length;

  return (
    <main className="container py-14 md:py-20">
      <JsonLd
        data={generateCollectionStructuredData({
          name: "The log — Pedro Santos",
          description:
            "A public learning log: short entries on what I just learned. ✦ entries are AI-assisted and show their prompts.",
          url: `${SITE_URL}/log`,
          items: entries.map((e) => ({
            title: e.title,
            url: `${SITE_URL}/log/${e.slug}`,
          })),
        })}
      />
      <SectionHeading
        as="h1"
        index="✦"
        eyebrow="The log"
        title="Learning in public, one entry at a time"
        description="A builder's lab notebook: short, frequent, unfinished on purpose. Entries marked ✦ were drafted with an AI model and edited by me — expand an entry to see the actual prompt."
      />

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="label">{entries.length} entries</span>
        <span aria-hidden className="text-muted-foreground/40">
          ·
        </span>
        <AiBadge model={undefined} short />
        <span className="font-mono text-[11px] text-muted-foreground">
          {aiCount} co-written, always human-edited
        </span>
        <Link
          href="/log/feed.xml"
          className="ml-auto font-mono text-[12px] text-muted-foreground transition-colors hover:text-brand"
        >
          rss →
        </Link>
      </div>

      <LogFeed entries={entries} />
    </main>
  );
}
