import { Link } from "next-view-transitions";
import { ArrowUpRight } from "lucide-react";
import { nowItems, nowKindLabel, nowUpdated } from "@/content/now";
import { formatDate } from "@/lib/date";

const MONTH: Intl.DateTimeFormatOptions = { month: "short", year: "numeric" };

function NowLink({ href }: { href: string }) {
  const className =
    "mt-1.5 inline-flex items-center gap-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-brand-text";
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        read more
        <ArrowUpRight className="h-3 w-3" />
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      visit
      <ArrowUpRight className="h-3 w-3" />
    </a>
  );
}

/** Light band under the hero: what I'm working on right now. */
export function NowStrip() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-6 md:py-10 lg:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em]">
            Working on now
          </p>
          <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
            updated {formatDate(nowUpdated, MONTH)}
          </p>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {nowItems.slice(0, 4).map((item) => (
            <div key={item.id} className="border-t border-border pt-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-brand-text">
                {nowKindLabel[item.kind]}
              </p>
              <p className="mt-1.5 text-[0.875rem] leading-snug">
                {item.text}
              </p>
              {item.href && <NowLink href={item.href} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
