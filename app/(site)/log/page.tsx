import type { Metadata } from "next";
import { getAllLogEntries } from "@/lib/log";
import { LogFeed } from "@/components/log/log-feed";
import { JsonLd } from "@/components/layout/json-ld";
import { generateCollectionStructuredData } from "@/lib/structured-data";
import { Wrap } from "@/components/site/wrap";
import { Eyebrow } from "@/components/site/eyebrow";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pedrosantos.dev";

export const metadata: Metadata = {
  title: "The log — learning in public",
  description:
    "Short entries about what I am learning, as I learn it. Entries drafted with a model are marked ✦ and publish the prompt that started them.",
  alternates: { canonical: "/log" },
};

export default function LogPage() {
  const entries = getAllLogEntries();
  const aiCount = entries.filter((e) => e.aiAssisted).length;

  return (
    <main>
      <JsonLd
        data={generateCollectionStructuredData({
          name: "The log — Pedro Santos",
          description:
            "A public learning log: short entries on what I just learned. ✦ entries are co-written with AI and show their prompts.",
          url: `${SITE_URL}/log`,
          items: entries.map((e) => ({
            title: e.title,
            url: `${SITE_URL}/log/${e.slug}`,
          })),
        })}
      />

      <Wrap className="pb-10 pt-14 md:pt-20">
        <Eyebrow>The log</Eyebrow>
        <h1 className="mt-6 max-w-[18ch] font-display text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[0.95] tracking-[-0.025em]">
          Learning in public, one entry at a time
        </h1>
        <p className="mt-6 max-w-[58ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
          A builder&apos;s lab notebook: short, frequent, unfinished on purpose.
          Most of what I actually learn is too small to survive being called a
          post, which is exactly why it belongs here.
        </p>
      </Wrap>

      <Wrap className="pb-10">
        <div className="grid grid-cols-1 gap-6 border-y border-border py-6 md:grid-cols-3 md:gap-10">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ai">
              ✦ how to read this
            </p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
              Entries drafted with a model are marked ✦ and show the prompt that
              started them. Entries that used no model say so as well. The
              marking only means something because both halves exist.
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              By the numbers
            </p>
            <p className="mt-3 font-mono text-[11.5px] leading-[1.9] text-muted-foreground">
              {entries.length} entries
              <br />
              {aiCount} co-written
              <br />
              {entries.length - aiCount} by hand
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Feed
            </p>
            <p className="mt-3">
              <a
                href="/log/feed.xml"
                className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-brand-text transition-colors hover:text-foreground"
              >
                log RSS ↗
              </a>
            </p>
          </div>
        </div>
      </Wrap>

      <Wrap className="pb-20 md:pb-24">
        <LogFeed entries={entries} />
      </Wrap>
    </main>
  );
}
