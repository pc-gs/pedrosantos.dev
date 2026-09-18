import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { nowItems, nowUpdated } from "@/content/now";
import { formatDate } from "@/lib/date";
import { NowList } from "@/components/now/now-list";
import { Wrap } from "@/components/site/wrap";
import { Eyebrow } from "@/components/site/eyebrow";

export const metadata: Metadata = {
  title: "Now",
  description:
    "A living snapshot of what I'm working on, learning and building right now. Updated when things change, not on a schedule.",
  alternates: { canonical: "/now" },
};

export default function NowPage() {
  return (
    <main>
      <Wrap className="pb-10 pt-14 md:pt-20">
        <Eyebrow>Now</Eyebrow>
        <h1 className="mt-6 max-w-[18ch] font-display text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[0.95] tracking-[-0.025em]">
          What I&apos;m doing right now
        </h1>
        <p className="mt-6 max-w-[58ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
          A living snapshot, not a résumé line. This page follows the{" "}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="link-inline"
          >
            now page
          </a>{" "}
          convention: it changes when my focus changes.
        </p>
        <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          updated {formatDate(nowUpdated, { month: "long", year: "numeric" })}
        </p>
      </Wrap>

      <Wrap className="pb-14">
        <NowList items={nowItems} />
      </Wrap>

      <Wrap>
        <p className="max-w-[52ch] border-t border-border pt-8 text-[1.0625rem] leading-relaxed text-muted-foreground">
          The learning behind these is tracked on{" "}
          <Link href="/studies" className="link-inline">
            the bench
          </Link>{" "}
          and written up in{" "}
          <Link href="/log" className="link-inline">
            the log
          </Link>
          .
        </p>
      </Wrap>
    </main>
  );
}
