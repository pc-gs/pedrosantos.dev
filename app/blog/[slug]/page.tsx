import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAllPosts, getPostBySlug, getAllPostSlugs } from "@/lib/blog";
import { formatDate } from "@/lib/date";
import { profile } from "@/content/profile";
import { AiBadge } from "@/components/log/ai-badge";
import { ProcessBox } from "@/components/blog/process-box";
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
        url: `https://pedrosantos.dev/blog/${post.slug}`,
        publishedTime: post.date,
        authors: [profile.name],
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
    <main className="container py-14 md:py-20">
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

      <article className="mx-auto max-w-2xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 font-mono text-[13px] text-muted-foreground transition-colors hover:text-brand"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          all writing
        </Link>

        <header className="fade-up mt-8 border-b border-border pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <time className="label" dateTime={post.date}>
              {formatDate(post.date, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <span aria-hidden className="label text-muted-foreground/50">
              ·
            </span>
            <span className="label">{post.readingTime}</span>
            {post.coWritten && <AiBadge className="ml-1" />}
          </div>
          <h1 className="mt-5 font-display text-[clamp(2.25rem,5.5vw,3.5rem)] leading-[1.06] tracking-tight text-foreground">
            {post.title}
          </h1>
          <p className="mt-5 font-serif text-xl leading-relaxed text-muted-foreground">
            {post.description}
          </p>
          {post.tags.length > 0 && (
            <p className="mt-5 font-mono text-[12px] text-muted-foreground/80">
              {post.tags.map((tag) => `#${tag}`).join(" ")}
            </p>
          )}
        </header>

        <div
          className="prose mt-10"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        {post.coWritten && post.process && (
          <ProcessBox process={post.process} className="mt-14" />
        )}

        {/* Author note */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="font-serif text-[1.0625rem] leading-relaxed text-muted-foreground">
            Written by{" "}
            <Link
              href="/about"
              className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
            >
              {profile.name}
            </Link>
            {post.coWritten ? " with an AI model as drafting partner" : ""} —{" "}
            {profile.role}, {profile.location}.{" "}
            <Link
              href="/contact"
              className="text-brand underline decoration-brand/40 underline-offset-4 hover:decoration-brand"
            >
              Get in touch
            </Link>
            .
          </p>
        </div>

        {/* Prev / next */}
        <nav className="mt-10 grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/blog/${prev.slug}`}
              className="group rounded-lg border border-border p-5 transition-colors hover:border-brand"
            >
              <span className="label flex items-center gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5" />
                previous
              </span>
              <span className="mt-2 block font-display text-lg leading-snug text-foreground transition-colors group-hover:text-brand">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/blog/${next.slug}`}
              className="group rounded-lg border border-border p-5 text-right transition-colors hover:border-brand sm:col-start-2"
            >
              <span className="label flex items-center justify-end gap-1.5">
                next
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
              <span className="mt-2 block font-display text-lg leading-snug text-foreground transition-colors group-hover:text-brand">
                {next.title}
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
        </nav>
      </article>
    </main>
  );
}
