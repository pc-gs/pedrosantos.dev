import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { getAllPosts } from "@/lib/blog";
import { AiBadge } from "@/components/log/ai-badge";
import { dateParts } from "@/components/log/entry-row";
import {
  DateFolio,
  Folio,
  Manuscript,
  Sidenote,
} from "@/components/manuscript/manuscript";
import { Mark, MarginLink, Stamp } from "@/components/manuscript/marks";
import { JsonLd } from "@/components/layout/json-ld";
import { generateCollectionStructuredData } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Essays on building software — drafted with AI from my own notes and edited by me. Every post shows how it was made.",
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": [
        { url: "/rss.xml", title: "Pedro Santos — Writing" },
      ],
    },
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const coWritten = posts.filter((p) => p.coWritten).length;

  return (
    <main className="container py-12 md:py-16">
      <JsonLd
        data={generateCollectionStructuredData({
          name: "Writing — Pedro Santos",
          description:
            "Essays on building software, co-written with AI and human-edited.",
          url: "https://pedrosantos.dev/blog",
          items: posts.map((p) => ({
            title: p.title,
            url: `https://pedrosantos.dev/blog/${p.slug}`,
          })),
        })}
      />

      <Manuscript
        marginWidth="wide"
        folio={<Folio>writing</Folio>}
        margin={
          <>
            <div>
              <Stamp tone="ai">co-written where marked</Stamp>
            </div>

            <Sidenote label="the bar for a post" leader tone="ai">
              <p className="font-serif text-[0.925rem] leading-relaxed text-muted-foreground">
                Something has to need the length before it becomes an essay
                here. Shorter things go to{" "}
                <Link href="/log" className="link-ink">
                  the log
                </Link>
                , which is where most of the thinking actually happens.
              </p>
            </Sidenote>

            <Sidenote label="by the numbers">
              <p className="font-mono text-[11.5px] leading-[1.9] text-muted-foreground tabnum">
                {posts.length} essays
                <br />
                {coWritten} with a paper trail
              </p>
            </Sidenote>

            <Sidenote label="feed">
              <p>
                <MarginLink href="/rss.xml">writing rss →</MarginLink>
              </p>
            </Sidenote>
          </>
        }
      >
        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          writing
        </p>
        <h1 className="mt-5 font-display display-page text-foreground">
          Longer thinking, co-written honestly
        </h1>
        <p className="mt-6 max-w-[56ch] font-serif text-[1.125rem] leading-[1.72] text-foreground/85">
          Essays start as my notes, get drafted with a model, and are edited by
          me. Each one carries its paper trail at the end — the notes, the
          prompts, and what I changed by hand.
        </p>
      </Manuscript>

      {posts.length === 0 ? (
        <p className="mt-16 max-w-[46ch] font-serif text-[1.0625rem] leading-relaxed text-muted-foreground">
          Nothing published yet — the log is where the writing starts.
        </p>
      ) : (
        <div className="mt-16">
          {posts.map((post) => {
            const { day, month } = dateParts(post.date);
            return (
              <Manuscript
                key={post.slug}
                className="border-b border-border py-9 last:border-0"
                folio={<DateFolio day={day} month={month} />}
                margin={
                  <Sidenote
                    label={post.coWritten ? "✦ paper trail" : "no model involved"}
                    tone={post.coWritten ? "ai" : "plain"}
                    leader
                  >
                    {post.coWritten ? (
                      <p className="font-serif text-[0.925rem] leading-relaxed text-muted-foreground">
                          Drafted from the author&apos;s own notes, then edited by
                          hand. The prompts and the edits are published at the
                          end of the essay.
                      </p>
                    ) : (
                      <p className="font-serif text-[0.925rem] leading-relaxed text-muted-foreground">
                        Written by hand, start to finish.
                      </p>
                    )}
                    <p className="mt-3 font-mono text-[11px] leading-[1.9] text-muted-foreground">
                      {post.readingTime}
                    </p>
                  </Sidenote>
                }
              >
                <h2 className="font-display text-[1.75rem] leading-snug tracking-tight">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="border-b border-transparent pb-[2px] text-foreground transition-colors hover:border-brand"
                  >
                    {post.title}
                  </Link>
                </h2>

                <p className="mt-3 max-w-[62ch] font-serif text-[1.0625rem] leading-[1.72] text-muted-foreground">
                  {post.description}
                </p>

                <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2">
                  {post.coWritten ? (
                    <AiBadge />
                  ) : (
                    <Mark tone="muted">written by hand</Mark>
                  )}
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {post.tags.map((t) => `#${t}`).join("  ")}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-brand"
                  >
                    read →
                  </Link>
                </div>
              </Manuscript>
            );
          })}
        </div>
      )}

      <p className="mt-16 max-w-[52ch] font-serif text-[1.0625rem] leading-relaxed text-muted-foreground">
        Shorter, faster notes live in{" "}
        <Link href="/log" className="link-ink">
          the log
        </Link>
        . Same honesty, less ceremony.
      </p>
    </main>
  );
}
