import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PostList({ posts }: { posts: BlogPostMeta[] }) {
  if (posts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No posts yet — check back soon.
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="group flex flex-col gap-1 rounded-xl border border-transparent p-4 transition-colors hover:border-border/60 hover:bg-surface sm:flex-row sm:items-baseline sm:justify-between"
        >
          <div>
            <h3 className="font-medium text-foreground transition-colors group-hover:text-accent">
              {post.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {post.description}
            </p>
          </div>
          <time className="shrink-0 font-mono text-xs text-glow">
            {formatDate(post.date)}
          </time>
        </Link>
      ))}
    </div>
  );
}