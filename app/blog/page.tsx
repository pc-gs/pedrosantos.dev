import type { Metadata } from "next";
import { PostList } from "@/components/blog/post-list";
import { PageContainer } from "@/components/layout/page-container";
import { SectionLabel } from "@/components/ui/section-label";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on building, learning, and shipping software.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <PageContainer>
      <div className="mb-10 surface-panel-elevated">
        <SectionLabel>Writing</SectionLabel>
        <h1 className="mb-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Writing
        </h1>
        <p className="max-w-2xl text-muted-foreground leading-relaxed">
          Notes on building, shipping, and what actually worked. The rebuild post is
          the current signal.
        </p>
      </div>
      <div className="surface-panel">
        <PostList posts={posts} />
      </div>
    </PageContainer>
  );
}