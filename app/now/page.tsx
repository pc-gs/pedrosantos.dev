import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { nowItems, nowUpdated } from "@/content/now";
import { formatDate } from "@/lib/date";
import { NowList } from "@/components/now/now-list";

export const metadata: Metadata = {
  title: "Now",
  description:
    "What Pedro Santos is working on right now — day job, Melro.io, the AI-assisted workflow, and what he's learning. A /now page snapshot.",
  alternates: { canonical: "/now" },
};

export default function NowPage() {
  return (
    <main className="container py-14 md:py-20">
      <header className="fade-up border-b border-border pb-8">
        <p className="label mb-4">Now</p>
        <h1 className="max-w-3xl font-display text-[clamp(2.5rem,6vw,4rem)] leading-[1.05] tracking-tight text-foreground">
          What I&apos;m doing right now
        </h1>
        <p className="mt-5 max-w-xl font-serif text-lg leading-relaxed text-muted-foreground">
          Most personal sites tell you what someone did. This is the part that
          keeps drifting: the work in flight, the things I&apos;m learning, and
          what I&apos;ve deliberately said no to this season.
        </p>
        <p className="mt-5 font-mono text-[12px] text-muted-foreground">
          last updated{" "}
          <time dateTime={nowUpdated}>{formatDate(nowUpdated)}</time> · a{" "}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-border underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
          >
            /now page
          </a>
        </p>
      </header>

      <section className="mt-10">
        <NowList items={nowItems} />
      </section>

      <section className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        <div>
          <h2 className="font-display text-2xl tracking-tight text-foreground">
            The granular version
          </h2>
          <p className="mt-3 max-w-md font-serif text-[1.0625rem] leading-relaxed text-muted-foreground">
            This page is the summary. The week-to-week detail — the thing I just
            broke, the API that surprised me, the prompt that worked — lives in{" "}
            <Link
              href="/log"
              className="text-brand underline decoration-brand/40 underline-offset-4 hover:decoration-brand"
            >
              the log
            </Link>
            .
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl tracking-tight text-foreground">
            What I&apos;m not doing
          </h2>
          <ul className="mt-3 space-y-2 font-serif text-[1.0625rem] leading-relaxed text-muted-foreground">
            <li>Chasing every new framework — I&apos;d rather get deeper.</li>
            <li>
              Treating the side company as a growth story; it&apos;s a craft
              story.
            </li>
            <li>Pretending finished work is the interesting part.</li>
          </ul>
        </div>
      </section>

      <section className="mt-14 border-t border-border pt-8">
        <p className="max-w-xl font-serif text-[1.0625rem] leading-relaxed text-muted-foreground">
          Curious about the tools behind all of this? There&apos;s a{" "}
          <Link
            href="/uses"
            className="text-brand underline decoration-brand/40 underline-offset-4 hover:decoration-brand"
          >
            /uses
          </Link>{" "}
          page. And if something here looks like a fit,{" "}
          <Link
            href="/contact"
            className="text-brand underline decoration-brand/40 underline-offset-4 hover:decoration-brand"
          >
            tell me
          </Link>
          .
        </p>
      </section>
    </main>
  );
}