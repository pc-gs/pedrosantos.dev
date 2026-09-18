import type { Metadata } from "next";
import { getAllLogEntries } from "@/lib/log";
import { LogFeed } from "@/components/log/log-feed";
import { Folio, Manuscript, Sidenote } from "@/components/manuscript/manuscript";
import { MarginLink, Stamp } from "@/components/manuscript/marks";
import { JsonLd } from "@/components/layout/json-ld";
import { generateCollectionStructuredData } from "@/lib/structured-data";

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
    <main className="container py-12 md:py-16">
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

      <Manuscript
        marginWidth="wide"
        folio={<Folio>✦</Folio>}
        margin={
          <>
            <div>
              <Stamp tone="ai">co-written where marked</Stamp>
            </div>

            <Sidenote label="how to read this" leader tone="ai">
              <p className="font-serif text-[0.925rem] leading-relaxed text-muted-foreground">
                Entries drafted with a model are marked ✦ and print the prompt
                that started them in this margin. Entries that used no model say
                so as well — the marking only means something because both
                halves exist.
              </p>
            </Sidenote>

            <Sidenote label="by the numbers">
              <p className="font-mono text-[11.5px] leading-[1.9] text-muted-foreground tabnum">
                {entries.length} entries
                <br />
                {aiCount} co-written
                <br />
                {entries.length - aiCount} by hand
              </p>
            </Sidenote>

            <Sidenote label="feed">
              <p>
                <MarginLink href="/log/feed.xml">log rss →</MarginLink>
              </p>
            </Sidenote>
          </>
        }
      >
        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          the log
        </p>
        <h1 className="mt-5 font-display display-page text-foreground">
          Learning in public, one entry at a time
        </h1>
        <p className="mt-6 max-w-[56ch] font-serif text-[1.125rem] leading-[1.72] text-foreground/85">
          A builder&apos;s lab notebook: short, frequent, unfinished on purpose.
          Most of what I actually learn is too small to survive being called a
          post — which is exactly why it belongs here.
        </p>
      </Manuscript>

      <div className="mt-16">
        <LogFeed entries={entries} />
      </div>
    </main>
  );
}
