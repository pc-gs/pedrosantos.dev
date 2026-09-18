import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getAllPostSlugs } from "@/lib/blog";
import { formatDate } from "@/lib/date";
import { profile } from "@/content/profile";
import { ProcessBox } from "@/components/blog/process-box";
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

  return (
    <main>
      <JsonLd
        data={generateArticleStructuredData({
          title: post.title,
          description: post.description,
          url: `${SITE_URL}/blog/${post.slug}`,
          datePublished: post.date,
          tags: post.tags,
          section: "Essays",
        })}
      />
      <JsonLd
        data={generateBreadcrumbStructuredData([
          { name: "Home", url: SITE_URL },
          { name: "Essays", url: `${SITE_URL}/blog` },
          { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
        ])}
      />

      <Wrap className="pt-14 md:pt-20">
        <Eyebrow>
          Essays ·{" "}
          <time dateTime={post.date}>
            {formatDate(post.date, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        </Eyebrow>
        <h1 className="mt-5 max-w-[22ch] font-display text-[clamp(2.25rem,6vw,4rem)] leading-[0.98] tracking-[-0.02em]">
          {post.title}
        </h1>
        <p className="mt-5 max-w-[58ch] text-[1.125rem] leading-relaxed text-muted-foreground">
          {post.description}
        </p>

        <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
            {post.readingTime}
          </span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>

        {post.coWritten ? (
          <section className="mt-8 max-w-[62ch] border border-ai/30 bg-ai/5 p-4">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-ai">
              ✦ co-written
            </p>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">
              Drafted from my own notes with a model, then edited by hand. The
              full paper trail is at the end of the essay.
            </p>
          </section>
        ) : (
          <section className="mt-8 max-w-[62ch] border border-border p-4">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground">
              ✎ by hand
            </p>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">
              Written start to finish by hand.
            </p>
          </section>
        )}
      </Wrap>

      <Wrap className="mt-10">
        <article className="max-w-[64ch]">
          <div
            className="prose dropcap"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />

          {post.coWritten && post.process && (
            <ProcessBox process={post.process} />
          )}

          <div className="mt-14 border-t border-border pt-6">
            <p className="max-w-[58ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
              Written by{" "}
              <Link href="/about" className="link-inline">
                {profile.name}
              </Link>
              {post.coWritten ? " with a model as drafting partner" : ""},{" "}
              {profile.role.toLowerCase()}, {profile.location}.{" "}
              <Link href="/contact" className="link-inline">
                Get in touch
              </Link>
              .
            </p>
          </div>
        </article>
      </Wrap>

      <Wrap className="mt-12">
        <nav
          aria-label="Previous and next essay"
          className="grid grid-cols-1 gap-8 border-t border-border py-8 sm:grid-cols-2"
        >
          {prev ? (
            <Link href={`/blog/${prev.slug}`} className="group min-w-0">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                ← previous
              </span>
              <span className="mt-2 block font-display text-[1.25rem] leading-snug tracking-[-0.01em] transition-colors group-hover:text-brand-text">
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
              <span className="mt-2 block font-display text-[1.25rem] leading-snug tracking-[-0.01em] transition-colors group-hover:text-brand-text">
                {next.title}
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
        </nav>

        <p className="mb-4">
          <Link
            href="/blog"
            className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-brand-text transition-colors hover:text-foreground"
          >
            ← all essays
          </Link>
        </p>
      </Wrap>
    </main>
  );
}
