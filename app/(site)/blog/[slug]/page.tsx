import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getAllPostSlugs } from "@/lib/blog";
import { formatDate } from "@/lib/date";
import { profile } from "@/content/profile";
import { AiBadge } from "@/components/log/ai-badge";
import { ProcessBox } from "@/components/blog/process-box";
import { dateParts } from "@/components/log/entry-row";
import {
  DateFolio,
  Manuscript,
  Sidenote,
} from "@/components/manuscript/manuscript";
import { HandWrittenMark, MarginLink, TagRun } from "@/components/manuscript/marks";
import { JsonLd } from "@/components/layout/json-ld";
import {
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
} from "@/lib/structured-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pedrosantos.dev";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const post = getPostBySlug(slug);
    if (!post) return { title: "Not found" };
    return {
      title: post.title,
      description: post.description,
      alternates: { canonical: `/blog/${post.slug}` },
      openGraph: {
        type: "article",
        title: `${post.title} — Pedro Santos`,
        description: post.description,
        url: `${SITE_URL}/blog/${post.slug}`,
        publishedTime: post.date,
        authors: [profile.name],
        tags: post.tags,
      },
    };
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const all = getAllPosts();
  const index = all.findIndex((p) => p.slug === slug);
  const prev = index > 0 ? all[index - 1] : null;
  const next = index < all.length - 1 ? all[index + 1] : null;
  const { day, month } = dateParts(post.date);

  return (
    <main className="container py-12 md:py-16">
      <JsonLd
        data={generateArticleStructuredData({
          title: post.title,
          description: post.description,
          url: `${SITE_URL}/blog/${post.slug}`,
          datePublished: post.date,
          tags: post.tags,
          section: "Writing",
        })}
      />
      <JsonLd
        data={generateBreadcrumbStructuredData([
          { name: "Home", url: SITE_URL },
          { name: "Writing", url: `${SITE_URL}/blog` },
          { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
        ])}
      />

      <Manuscript
        marginWidth="wide"
        folio={<DateFolio day={day} month={month} />}
        margin={
          <>
            {post.coWritten ? (
              <Sidenote label="✦ co-written" tone="ai" leader>
                <p className="font-serif text-[0.925rem] leading-relaxed text-muted-foreground">
                  Drafted from my own notes with a model, then edited by hand.
                  The full paper trail — notes, prompts, and what I changed — is
                  at the end of the essay.
                </p>
              </Sidenote>
            ) : (
              <Sidenote label="no model involved" leader>
                <HandWrittenMark />
                <p className="mt-3 font-serif text-[0.925rem] leading-relaxed text-muted-foreground">
                  Written by hand, start to finish.
                </p>
              </Sidenote>
            )}

            <Sidenote label="the essay">
              <p className="font-mono text-[11.5px] leading-[1.9] text-muted-foreground tabnum">
                {formatDate(post.date, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                <br />
                {post.readingTime}
              </p>
              <div className="mt-3">
                <TagRun tags={post.tags} />
              </div>
            </Sidenote>

            <Sidenote label="">
              <MarginLink href="/blog">← all writing</MarginLink>
            </Sidenote>
          </>
        }
      >
        <article className="min-w-0">
          <header className="border-b border-border pb-8">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              writing ·{" "}
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </p>
            <h1 className="mt-5 font-display display-page text-foreground">
              {post.title}
            </h1>
            <p className="mt-6 max-w-[56ch] font-serif text-[1.125rem] leading-[1.72] text-foreground/85">
              {post.description}
            </p>
            {post.coWritten && (
              <p className="mt-5">
                <AiBadge />
              </p>
            )}
          </header>

          <div
            className="prose dropcap mt-10 max-w-[64ch]"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />

          {post.coWritten && post.process && <ProcessBox process={post.process} />}

          <div className="mt-14 border-t border-border pt-6">
            <p className="max-w-[58ch] font-serif text-[1.0625rem] leading-relaxed text-muted-foreground">
              Written by{" "}
              <Link href="/about" className="link-plain">
                {profile.name}
              </Link>
              {post.coWritten ? " with a model as drafting partner" : ""} —{" "}
              {profile.role}, {profile.location}.{" "}
              <Link href="/contact" className="link-ink">
                Get in touch
              </Link>
              .
            </p>
          </div>
        </article>
      </Manuscript>

      <nav
        aria-label="Previous and next essay"
        className="mt-20 grid grid-cols-1 gap-8 border-t border-border pt-6 sm:grid-cols-2"
      >
        {prev ? (
          <Link href={`/blog/${prev.slug}`} className="group min-w-0">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              ← previous
            </span>
            <span className="mt-2 block font-display text-[1.25rem] leading-snug tracking-tight text-foreground transition-colors group-hover:text-brand">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/blog/${next.slug}`}
            className="group min-w-0 sm:text-right"
          >
            <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              next →
            </span>
            <span className="mt-2 block font-display text-[1.25rem] leading-snug tracking-tight text-foreground transition-colors group-hover:text-brand">
              {next.title}
            </span>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
      </nav>
    </main>
  );
}
