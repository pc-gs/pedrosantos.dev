import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import {
  getAllLogEntries,
  getAllLogSlugs,
  getLogEntryBySlug,
} from "@/lib/log";
import { formatDate } from "@/lib/date";
import { dateParts } from "@/components/log/entry-row";
import {
  DateFolio,
  Manuscript,
  Sidenote,
} from "@/components/manuscript/manuscript";
import { HandWrittenMark, TagRun } from "@/components/manuscript/marks";
import { JsonLd } from "@/components/layout/json-ld";
import {
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
} from "@/lib/structured-data";

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
  const { day, month } = dateParts(entry.date);

  return (
    <main className="container py-12 md:py-16">
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

      <Manuscript
        marginWidth="wide"
        folio={<DateFolio day={day} month={month} />}
        margin={
          <>
            {entry.aiAssisted ? (
              <Sidenote label="✦ the prompt that started this" tone="ai" leader>
                {entry.prompt ? (
                  <p className="font-mono text-[11.5px] leading-[1.75] text-foreground/80">
                    &ldquo;{entry.prompt}&rdquo;
                  </p>
                ) : (
                  <p className="font-mono text-[11.5px] text-muted-foreground">
                    Prompt not recorded.
                  </p>
                )}
                <p className="mt-3.5 font-serif text-[0.9rem] leading-relaxed text-muted-foreground">
                  Drafted from that prompt
                  {entry.model ? ` with ${entry.model}` : ""}, then rewritten,
                  cut and checked by hand.
                </p>
              </Sidenote>
            ) : (
              <Sidenote label="no model involved" leader>
                <HandWrittenMark />
                <p className="mt-3 font-serif text-[0.9rem] leading-relaxed text-muted-foreground">
                  No model was involved in drafting this entry.
                </p>
              </Sidenote>
            )}

            <Sidenote label="entry">
              <p className="font-mono text-[11.5px] leading-[1.9] text-muted-foreground tabnum">
                {formatDate(entry.date, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                <br />
                {entry.readingTime}
              </p>
              <div className="mt-3">
                <TagRun tags={entry.tags} />
              </div>
            </Sidenote>

            <Sidenote label="">
              <p>
                <Link
                  href="/log"
                  className="inline-block border-b border-brand/30 pb-[3px] font-mono text-[10.5px] uppercase tracking-[0.18em] text-brand transition-colors hover:border-brand"
                >
                  ← the whole log
                </Link>
              </p>
            </Sidenote>
          </>
        }
      >
        <header className="border-b border-border pb-8">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            the log ·{" "}
            <time dateTime={entry.date}>{formatDate(entry.date)}</time>
          </p>
          <h1 className="mt-5 font-display display-page text-foreground">
            {entry.title}
          </h1>
          {entry.description && (
            <p className="mt-6 max-w-[56ch] font-serif text-[1.125rem] leading-[1.72] text-foreground/85">
              {entry.description}
            </p>
          )}
        </header>

        <div
          className="prose mt-10 max-w-[62ch]"
          dangerouslySetInnerHTML={{ __html: entry.body }}
        />
      </Manuscript>

      <nav
        aria-label="Older and newer entries"
        className="mt-20 grid grid-cols-1 gap-8 border-t border-border pt-6 sm:grid-cols-2"
      >
        {older ? (
          <Link href={`/log/${older.slug}`} className="group min-w-0">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              ← older
            </span>
            <span className="mt-2 block font-display text-[1.25rem] leading-snug tracking-tight text-foreground transition-colors group-hover:text-brand">
              {older.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {newer ? (
          <Link href={`/log/${newer.slug}`} className="group min-w-0 sm:text-right">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              newer →
            </span>
            <span className="mt-2 block font-display text-[1.25rem] leading-snug tracking-tight text-foreground transition-colors group-hover:text-brand">
              {newer.title}
            </span>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
      </nav>
    </main>
  );
}
