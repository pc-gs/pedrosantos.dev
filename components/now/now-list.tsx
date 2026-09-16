import { Link } from "next-view-transitions";
import { ArrowUpRight } from "lucide-react";
import type { NowItem } from "@/lib/types";
import { formatDate } from "@/lib/date";
import { nowKindLabel } from "@/content/now";

const NOW_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: "short",
  year: "numeric",
};

/**
 * The "Now" list — a living snapshot as hairline rows. Shared between the
 * homepage strip and the dedicated /now page so both stay in sync.
 */
export function NowList({ items }: { items: NowItem[] }) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {items.map((item) => (
        <li
          key={item.id}
          className="grid grid-cols-1 gap-2 py-5 md:grid-cols-[140px_1fr] md:items-baseline md:gap-6"
        >
          <span className="label-brand">{nowKindLabel[item.kind]}</span>
          <div>
            {item.href ? (
              <Link
                href={item.href}
                className="font-serif text-[1.0625rem] leading-relaxed text-foreground transition-colors hover:text-brand"
              >
                {item.text}
                {!item.href.startsWith("/") && (
                  <ArrowUpRight
                    className="ml-1 inline h-3.5 w-3.5 text-muted-foreground"
                    aria-hidden
                  />
                )}
              </Link>
            ) : (
              <p className="font-serif text-[1.0625rem] leading-relaxed text-foreground">
                {item.text}
              </p>
            )}
            <p className="label mt-1">{formatDate(item.date, NOW_DATE_FORMAT)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}