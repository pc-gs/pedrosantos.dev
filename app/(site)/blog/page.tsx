import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/date";
import { JsonLd } from "@/components/layout/json-ld";
import { generateCollectionStructuredData } from "@/lib/structured-data";
import { Wrap } from "@/components/site/wrap";
import { Eyebrow } from "@/components/site/eyebrow";

export const metadata: Metadata = {
  title: "Essays",
  description:
    "Essays on building software, drafted from my own notes with AI and edited by me. Every post shows how it was made.",
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": [
        { url: "/rss.xml", title: "Pedro Santos — Writing" },
      ],
    },
  },
};

const DATE: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };

export default function BlogPage() {
  const posts = getAllPosts();
  const coWritten = posts.filter((p) => p.coWritten).length;

  return (
    <main>
      <JsonLd
        data={generateCollectionStructuredData({
          name: "Essays — Pedro Santos",
          description:
            "Essays on building software, co-written with AI and human-edited.",
          url: "https://pedrosantos.dev/blog",
          items: posts.map((p) => ({
            title: p.title,
            url: `https://pedrosantos.dev/blog/${p.slug}`,
          })),
        })}
      />

      <Wrap className="pb-10 pt-14 md:pt-20">
        <Eyebrow>Essays</Eyebrow>
        <h1 className="mt-6 max-w-[18ch] font-display text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[0.95] tracking-[-0.025em]">
          Essays on building software
        </h1>
        <p className="mt-6 max-w-[58ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
          Longer pieces start as my notes, get drafted with a model, and are
          edited by me. Each one carries its paper trail at the end: the notes,
          the prompts, and what I changed by hand.
        </p>
      </Wrap>

      <Wrap className="pb-10">
        <div className="grid grid-cols-1 gap-6 border-y border-border py-6 md:grid-cols-3 md:gap-10">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              The bar for a post
            </p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
              Something has to need the length before it becomes an essay here.
              Shorter things go to{" "}
              <Link href="/log" className="link-inline">
                the log
              </Link>
              , where most of the thinking happens.
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              By the numbers
            </p>
            <p className="mt-3 font-mono text-[11.5px] leading-[1.9] text-muted-foreground">
              {posts.length} essays
              <br />
              {coWritten} with a paper trail
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Feed
            </p>
            <p className="mt-3">
              <a
                href="/rss.xml"
                className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-brand-text transition-colors hover:text-foreground"
              >
                writing RSS ↗
              </a>
            </p>
          </div>
        </div>
      </Wrap>

      <Wrap className="pb-20 md:pb-24">
        {posts.length === 0 ? (
          <p className="max-w-[46ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
            Nothing published yet. The log is where the writing starts.
          </p>
        ) : (
          <ol>
            {posts.map((post) => (
              <li key={post.slug} className="border-b border-border py-6 last:border-0">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-6">
                  <time
                    dateTime={post.date}
                    className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    {formatDate(post.date, DATE)}
                  </time>
                  <div className="min-w-0">
                    <h2 className="font-display text-[1.5rem] leading-snug tracking-[-0.01em]">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="transition-colors hover:text-brand-text"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-2 max-w-[62ch] text-[1rem] leading-relaxed text-muted-foreground">
                      {post.description}
                    </p>
                    <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-2 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
                      {post.coWritten ? (
                        <span className="text-ai">✦ co-written</span>
                      ) : (
                        <span>✎ by hand</span>
                      )}
                      <span>{post.readingTime}</span>
                      {post.tags.map((tag) => (
                        <span key={tag} className="tracking-[0.08em] normal-case">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}

        <p className="mt-10 max-w-[52ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
          Shorter, faster notes live in{" "}
          <Link href="/log" className="link-inline">
            the log
          </Link>
          . Same honesty, less ceremony.
        </p>
      </Wrap>
    </main>
  );
}
