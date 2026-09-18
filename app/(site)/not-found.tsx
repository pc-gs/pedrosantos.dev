import { Link } from "next-view-transitions";
import { getAllLogEntries } from "@/lib/log";
import { Folio, Manuscript, Sidenote } from "@/components/manuscript/manuscript";
import { MarginLink } from "@/components/manuscript/marks";

export default function NotFound() {
  const latest = getAllLogEntries().slice(0, 3);

  return (
    <main className="container py-16 md:py-24">
      <Manuscript
        folio={<Folio>404</Folio>}
        margin={
          <Sidenote label="try instead" leader>
            <p className="flex flex-col gap-2">
              <MarginLink href="/">← back home</MarginLink>
              <MarginLink href="/log">the log</MarginLink>
              <MarginLink href="/projects">the work</MarginLink>
            </p>
          </Sidenote>
        }
      >
        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          404
        </p>
        <h1 className="mt-5 font-display display-page text-foreground">
          This page doesn&apos;t exist.
        </h1>
        <p className="mt-6 max-w-[52ch] font-serif text-[1.125rem] leading-[1.72] text-foreground/85">
          It may have been moved or never built. The rest of the manuscript is
          still there — including whatever I was learning this week.
        </p>

        {latest.length > 0 && (
          <section className="mt-14 border-t border-border pt-8">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              latest from the log
            </p>
            <ul className="mt-6 border-t border-border">
              {latest.map((entry) => (
                <li key={entry.slug} className="border-b border-border last:border-0">
                  <Link
                    href={`/log/${entry.slug}`}
                    className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3.5"
                  >
                    <span className="font-display text-[1.3rem] leading-snug tracking-tight text-foreground transition-colors group-hover:text-brand">
                      {entry.title}
                    </span>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground tabnum">
                      {entry.date}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </Manuscript>
    </main>
  );
}
