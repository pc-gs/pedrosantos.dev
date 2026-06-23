import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { PageContainer } from "@/components/layout/page-container";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <PageContainer>
      <div className="surface-panel-elevated">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All posts
        </Link>

        <time className="font-mono text-xs text-accent">
          {formatDate(post.date)}
        </time>
        <h1 className="mt-3 mb-4 text-3xl font-semibold tracking-tight md:text-4xl">
          {post.title}
        </h1>
        <p className="mb-10 text-muted-foreground leading-relaxed">
          {post.description}
        </p>

        <MarkdownContent content={post.content} />
      </div>
    </PageContainer>
  );
}