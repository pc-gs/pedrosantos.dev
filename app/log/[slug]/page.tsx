import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { marked } from "marked";
import {
  getAllLogEntries,
  getAllLogSlugs,
  getLogEntryBySlug,
} from "@/lib/log";
import { formatDate } from "@/lib/date";
import { AiBadge } from "@/components/log/ai-badge";
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

  return (
    <main className="container py-14 md:py-20">
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
      <article className="mx-auto max-w-2xl">
        <Link
          href="/log"
          className="inline-flex items-center gap-1.5 font-mono text-[13px] text-muted-foreground transition-colors hover:text-brand"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          the log
        </Link>

        <header className="mt-8">
          <p className="label">
            <time dateTime={entry.date}>{formatDate(entry.date)}</time>
            {entry.aiAssisted && (
              <span className="ml-3 inline-flex translate-y-[-1px] align-middle">
                <AiBadge model={entry.model} />
              </span>
            )}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight text-foreground md:text-5xl">
            {entry.title}
          </h1>
          {entry.description && (
            <p className="mt-4 font-serif text-xl leading-relaxed text-muted-foreground">
              {entry.description}
            </p>
          )}
          <p className="mt-4 font-mono text-[12px] text-muted-foreground/70">
            {entry.tags.map((t) => `#${t}`).join(" ")} · {entry.readingTime}
          </p>
        </header>

        {entry.prompt && (
          <aside className="mt-8 rounded-lg border border-ai/25 bg-ai/5 p-4">
            <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ai">
              ✦ the prompt that started this
            </p>
            <p className="mt-2 font-mono text-[12.5px] leading-relaxed text-foreground/80">
              &ldquo;{entry.prompt}&rdquo;
            </p>
            {entry.model && (
              <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                drafted with {entry.model} · edited by Pedro
              </p>
            )}
          </aside>
        )}

        <div
          className="prose mt-10"
          dangerouslySetInnerHTML={{ __html: marked.parse(entry.content) as string }}
        />

        <nav className="mt-14 grid grid-cols-1 gap-3 border-t border-border pt-6 sm:grid-cols-2">
          <div>
            {older && (
              <Link
                href={`/log/${older.slug}`}
                className="group inline-flex flex-col gap-0.5"
              >
                <span className="label">← older</span>
                <span className="font-display text-lg text-foreground transition-colors group-hover:text-brand">
                  {older.title}
                </span>
              </Link>
            )}
          </div>
          <div className="sm:text-right">
            {newer && (
              <Link
                href={`/log/${newer.slug}`}
                className="group inline-flex flex-col items-start gap-0.5 sm:items-end"
              >
                <span className="label">
                  newer <ArrowRight className="inline h-3 w-3" />
                </span>
                <span className="font-display text-lg text-foreground transition-colors group-hover:text-brand">
                  {newer.title}
                </span>
              </Link>
            )}
          </div>
        </nav>
      </article>
    </main>
  );
}
