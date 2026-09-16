import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { ArrowRight } from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/date";
import { AiBadge } from "@/components/log/ai-badge";
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

const POST_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const coWritten = posts.filter((p) => p.coWritten).length;

  return (
    <main className="container py-14 md:py-20">
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

      <header className="fade-up border-b border-border pb-8">
        <p className="label mb-4">Writing</p>
        <h1 className="max-w-3xl font-display text-[clamp(2.5rem,6vw,4rem)] leading-[1.05] tracking-tight text-foreground">
          Longer thinking, co-written honestly.
        </h1>
        <p className="mt-5 max-w-xl font-serif text-lg leading-relaxed text-muted-foreground">
          Essays start as my notes, get drafted with an AI model, and are edited
          by me — each one carries a{" "}
          <span className="text-foreground">&ldquo;how this post was made&rdquo;</span>{" "}
          box with the actual prompts.
        </p>
        <p className="mt-5 font-mono text-[12px] text-muted-foreground">
          {posts.length} {posts.length === 1 ? "post" : "posts"} · {coWritten}{" "}
          co-written{" "}
          <Link
            href="/rss.xml"
            className="ml-1 underline decoration-border underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
          >
            rss
          </Link>
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="py-16 font-serif text-lg text-muted-foreground">
          Nothing published yet — the log is where the writing starts.
        </p>
      ) : (
        <ul className="divide-y divide-border border-b border-border">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group grid grid-cols-1 gap-3 py-7 md:grid-cols-[132px_1fr_auto] md:items-baseline md:gap-8"
              >
                <span className="label">
                  {formatDate(post.date, POST_DATE_FORMAT)}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <h2 className="font-display text-2xl leading-snug tracking-tight text-foreground transition-colors group-hover:text-brand">
                      {post.title}
                    </h2>
                    {post.coWritten && <AiBadge short />}
                  </div>
                  <p className="mt-2 max-w-2xl font-serif text-[1.0625rem] leading-relaxed text-muted-foreground">
                    {post.description}
                  </p>
                  {post.tags.length > 0 && (
                    <p className="mt-3 font-mono text-[12px] text-muted-foreground/70">
                      {post.tags.map((tag) => `#${tag}`).join(" ")}
                    </p>
                  )}
                </div>
                <span className="hidden items-center gap-2 font-mono text-[12px] text-muted-foreground md:flex">
                  {post.readingTime}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-10 max-w-xl font-serif text-[1.0625rem] leading-relaxed text-muted-foreground">
        Shorter, faster notes live in{" "}
        <Link
          href="/log"
          className="text-brand underline decoration-brand/40 underline-offset-4 hover:decoration-brand"
        >
          the log
        </Link>
        . Same honesty, less ceremony.
      </p>
    </main>
  );
}
