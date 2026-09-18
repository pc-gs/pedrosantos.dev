import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { nowItems, nowUpdated } from "@/content/now";
import { formatDate } from "@/lib/date";
import { NowList } from "@/components/now/now-list";
import { Folio, Manuscript, Sidenote } from "@/components/manuscript/manuscript";
import { MarginLink } from "@/components/manuscript/marks";

export const metadata: Metadata = {
  title: "Now",
  description:
    "What Pedro Santos is working on right now — day job, Melro.io, the AI-assisted workflow, and what he is learning. A /now page snapshot.",
  alternates: { canonical: "/now" },
};

const notDoing = [
  "Chasing every new framework — I would rather get deeper on fewer things.",
  "Treating the side company as a growth story; it is a craft story.",
  "Pretending finished work is the interesting part.",
];

export default function NowPage() {
  return (
    <main className="container py-12 md:py-16">
      <Manuscript
        marginWidth="wide"
        folio={<Folio>now</Folio>}
        margin={
          <>
            <Sidenote label="stamped" leader>
              <p className="font-mono text-[11.5px] leading-[1.9] text-muted-foreground tabnum">
                updated
                <br />
                {formatDate(nowUpdated, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="mt-3 font-serif text-[0.925rem] leading-relaxed text-muted-foreground">
                A {}
                <a
                  href="https://nownownow.com/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-ink"
                >
                  /now page
                </a>
                {" "}
                — edited when things actually change, not on a schedule.
              </p>
            </Sidenote>

            <Sidenote label="the granular version">
              <p className="font-serif text-[0.925rem] leading-relaxed text-muted-foreground">
                The week-to-week detail — the thing I just broke, the API that
                surprised me, the prompt that worked — is in the log.
              </p>
              <p className="mt-3">
                <MarginLink href="/log">the log →</MarginLink>
              </p>
            </Sidenote>

            <Sidenote label="the tools">
              <p>
                <MarginLink href="/uses">/uses →</MarginLink>
              </p>
            </Sidenote>
          </>
        }
      >
        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          now · a snapshot
        </p>
        <h1 className="mt-5 font-display display-page text-foreground">
          What I&apos;m doing right now
        </h1>
        <p className="mt-6 max-w-[56ch] font-serif text-[1.125rem] leading-[1.72] text-foreground/85">
          Most personal sites tell you what someone did. This is the part that
          keeps drifting: the work in flight, the things I&apos;m learning, and
          what I&apos;ve deliberately said no to this season.
        </p>

        <div className="mt-10">
          <NowList items={nowItems} />
        </div>

        <section className="mt-14 grid grid-cols-1 gap-y-3 border-t border-border py-9 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-x-6">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground tabnum">
            <span className="text-brand">04</span>
          </p>
          <div className="min-w-0">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              What I&apos;m not doing
            </p>
            <ul className="mt-4">
              {notDoing.map((line) => (
                <li
                  key={line}
                  className="flex max-w-[58ch] gap-3 border-b border-border/70 py-3.5 font-serif text-[1.0625rem] leading-[1.72] text-muted-foreground last:border-0"
                >
                  <span
                    aria-hidden
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Manuscript>

      <p className="mt-16 max-w-[56ch] font-serif text-[1.0625rem] leading-relaxed text-muted-foreground">
        If something here looks like a fit,{" "}
        <Link href="/contact" className="link-ink">
          tell me
        </Link>
        .
      </p>
    </main>
  );
}
