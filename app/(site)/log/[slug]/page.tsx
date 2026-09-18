import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import {
  getAllLogEntries,
  getAllLogSlugs,
  getLogEntryBySlug,
} from "@/lib/log";
import { formatDate } from "@/lib/date";
import { JsonLd } from "@/components/layout/json-ld";
import {
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
} from "@/lib/structured-data";
import { Wrap } from "@/components/site/wrap";
import { Eyebrow } from "@/components/site/eyebrow";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pedrosantos.dev";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllLogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getLogEntryBySlug(slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.description || undefined,
    alternates: { canonical: `/log/${entry.slug}` },
    openGraph: {
      title: entry.title,
      description: entry.description || undefined,
      type: "article",
      publishedTime: entry.date,
      tags: entry.tags,
    },
  };
}

export default async function LogEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getLogEntryBySlug(slug);
  if (!entry) notFound();

  const all = getAllLogEntries();
  const index = all.findIndex((e) => e.slug === entry.slug);
  const newer = all[index - 1];
  const older = all[index + 1];

  return (
    <main>
      <JsonLd
        data={generateArticleStructuredData({
          type: "TechArticle",
          title: entry.title,
          description: entry.description,
          url: `${SITE_URL}/log/${entry.slug}`,
          datePublished: entry.date,
          tags: entry.tags,
          section: "The log",
        })}
      />
      <JsonLd
        data={generateBreadcrumbStructuredData([
          { name: "Home", url: SITE_URL },
          { name: "The log", url: `${SITE_URL}/log` },
          { name: entry.title, url: `${SITE_URL}/log/${entry.slug}` },
        ])}
      />

      <Wrap className="pt-14 md:pt-20">
        <Eyebrow>
          The log ·{" "}
          <time dateTime={entry.date}>
            {formatDate(entry.date, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        </Eyebrow>
        <h1 className="mt-5 max-w-[22ch] font-display text-[clamp(2.25rem,6vw,4rem)] leading-[0.98] tracking-[-0.02em]">
          {entry.title}
        </h1>
        {entry.description && (
          <p className="mt-5 max-w-[56ch] text-[1.125rem] leading-relaxed text-muted-foreground">
            {entry.description}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
            {entry.readingTime}
          </span>
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>

        {entry.aiAssisted ? (
          <section className="mt-8 max-w-[62ch] border border-ai/30 bg-ai/5 p-4">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-ai">
              ✦ co-written{entry.model ? ` with ${entry.model}` : ""}
            </p>
            {entry.prompt ? (
              <p className="mt-2 font-mono text-[11.5px] leading-relaxed text-foreground/80">
                &ldquo;{entry.prompt}&rdquo;
              </p>
            ) : (
              <p className="mt-2 font-mono text-[11.5px] text-muted-foreground">
                Prompt not recorded.
              </p>
            )}
            <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">
              Drafted from that prompt, then rewritten, cut and checked by hand.
            </p>
          </section>
        ) : (
          <section className="mt-8 max-w-[62ch] border border-border p-4">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground">
              ✎ by hand
            </p>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">
              No model was involved in drafting this entry.
            </p>
          </section>
        )}
      </Wrap>

      <Wrap className="mt-10">
        <div
          className="prose max-w-[62ch]"
          dangerouslySetInnerHTML={{ __html: entry.body }}
        />
      </Wrap>

      <Wrap className="mt-12">
        <nav
          aria-label="Older and newer entries"
          className="grid grid-cols-1 gap-8 border-t border-border py-8 sm:grid-cols-2"
        >
          {older ? (
            <Link href={`/log/${older.slug}`} className="group min-w-0">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                ← older
              </span>
              <span className="mt-2 block font-display text-[1.25rem] leading-snug tracking-[-0.01em] transition-colors group-hover:text-brand">
                {older.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {newer ? (
            <Link
              href={`/log/${newer.slug}`}
              className="group min-w-0 sm:text-right"
            >
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                newer →
              </span>
              <span className="mt-2 block font-display text-[1.25rem] leading-snug tracking-[-0.01em] transition-colors group-hover:text-brand">
                {newer.title}
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
        </nav>

        <p className="mb-4">
          <Link
            href="/log"
            className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-brand transition-colors hover:text-foreground"
          >
            ← the whole log
          </Link>
        </p>
      </Wrap>
    </main>
  );
}
