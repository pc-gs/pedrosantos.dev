import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { studies } from "@/content/studies";
import { getAllLogEntries } from "@/lib/log";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { LogEntry, Study } from "@/lib/types";
import { Wrap } from "@/components/site/wrap";
import { Eyebrow } from "@/components/site/eyebrow";
import { SectionHeader } from "@/components/site/section-header";

export const metadata: Metadata = {
  title: "Studies",
  description:
    "What I'm studying right now: active learning tracks, each with the log entries where the work actually happened.",
  alternates: { canonical: "/studies" },
};

const DATE: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };

const STATE_CLASS: Record<Study["state"], string> = {
  applying: "bg-brand text-brand-foreground border-brand",
  learning: "bg-foreground text-background border-foreground",
  exploring: "bg-transparent text-brand border-brand",
};

export default function StudiesPage() {
  const allLog = getAllLogEntries();
  const logBySlug = new Map(allLog.map((entry) => [entry.slug, entry]));
  const noteCount = studies.reduce((total, study) => total + study.logSlugs.length, 0);

  return (
    <main>
      <Wrap className="pb-10 pt-14 md:pt-20">
        <Eyebrow>Studies</Eyebrow>
        <h1 className="mt-6 max-w-[18ch] font-display text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[0.95] tracking-[-0.025em]">
          On the bench
        </h1>
        <p className="mt-6 max-w-[58ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
          A track is something I&apos;m actively learning, with the log entries
          where the work actually happened. No progress bars and no certificates
          wall: if a track stops moving for months, it either comes back to the
          bench or leaves it.
        </p>
        <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          {studies.length} tracks · {noteCount} linked notes
        </p>
      </Wrap>

      <Wrap className="pb-20 md:pb-24">
        {studies.map((study) => {
          const notes = study.logSlugs
            .map((slug) => logBySlug.get(slug))
            .filter((entry): entry is LogEntry => Boolean(entry));

          return (
            <article key={study.id} className="border-t border-border py-8 md:py-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span
                  className={cn(
                    "border px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.18em]",
                    STATE_CLASS[study.state],
                  )}
                >
                  {study.state}
                </span>
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
                  since {study.since} · updated {formatDate(study.updatedAt, DATE)}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_20rem] md:gap-10">
                <div className="min-w-0">
                  <h2 className="font-display text-[1.75rem] leading-tight tracking-[-0.015em]">
                    {study.title}
                  </h2>
                  <p className="mt-3 max-w-[62ch] text-[1rem] leading-relaxed text-muted-foreground">
                    {study.why}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Notes from this track
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {notes.map((entry) => (
                      <li key={entry.slug}>
                        <Link
                          href={`/log/${entry.slug}`}
                          className="group flex items-baseline justify-between gap-4"
                        >
                          <span className="text-[0.9375rem] leading-snug transition-colors group-hover:text-brand">
                            {entry.title}
                          </span>
                          <span className="shrink-0 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">
                            {formatDate(entry.date, DATE)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          );
        })}

        <SectionHeader
          className="mt-4 border-t pt-8"
          eyebrow="How this works"
          title="Tracks come and go"
          description={
            <>
              Everything I learn lands in{" "}
              <Link href="/log" className="link-inline">
                the log
              </Link>
              ; the tracks above are the threads I&apos;m actively pulling on.
              When one is done, the notes stay and the track leaves the bench.
            </>
          }
        />
      </Wrap>
    </main>
  );
}
