import { Link } from "next-view-transitions";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/date";

const MONTH: Intl.DateTimeFormatOptions = { month: "short", year: "numeric" };

/** Essay card: number, title, description, reading meta. */
export function PostCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group border border-border bg-card p-6 transition-colors hover:border-foreground"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand">
        Essay {String(index + 1).padStart(2, "0")}
      </p>
      <h3 className="mt-3 font-display text-[1.5rem] leading-tight tracking-[-0.01em] transition-colors group-hover:text-brand">
        {post.title}
      </h3>
      <p className="mt-2 text-[0.925rem] leading-relaxed text-muted-foreground">
        {post.description}
      </p>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {formatDate(post.date, MONTH)}
        {post.readingTime ? `  ·  ${post.readingTime}` : ""}
      </p>
    </Link>
  );
}
