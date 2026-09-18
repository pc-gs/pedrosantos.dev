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
    <ul className="border-t border-border">
      {items.map((item) => (
        <li
          key={item.id}
          className="grid grid-cols-1 gap-y-1.5 border-b border-border py-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-x-6"
        >
          <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            {nowKindLabel[item.kind]}
          </span>
          <div className="min-w-0">
            {item.href ? (
              <Link
                href={item.href}
                className="group text-[1.0625rem] leading-relaxed text-foreground"
              >
                <span className="border-b border-transparent transition-colors group-hover:border-brand">
                  {item.text}
                </span>
                {!item.href.startsWith("/") && (
                  <ArrowUpRight
                    className="ml-1 inline h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-brand"
                    aria-hidden
                  />
                )}
              </Link>
            ) : (
              <p className="text-[1.0625rem] leading-relaxed text-foreground">
                {item.text}
              </p>
            )}
            <p className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground/70">
              {formatDate(item.date, NOW_DATE_FORMAT)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}