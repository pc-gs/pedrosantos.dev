import { Link } from "next-view-transitions";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAllLogEntries } from "@/lib/log";

export default function NotFound() {
  const latest = getAllLogEntries().slice(0, 3);

  return (
    <main className="container flex min-h-[60vh] flex-col justify-center py-20">
      <div className="max-w-xl">
        <p className="label-brand mb-4">404</p>
        <h1 className="font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.05] tracking-tight text-foreground">
          This page doesn&apos;t exist.
        </h1>
        <p className="mt-5 font-serif text-lg leading-relaxed text-muted-foreground">
          It may have been moved or never built. The rest of the site is still
          here — including whatever I was learning this week.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-md border border-border px-5 font-mono text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" />
            back home
          </Link>
          <Link
            href="/log"
            className="inline-flex h-11 items-center gap-2 rounded-md bg-foreground px-5 font-mono text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            read the log
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {latest.length > 0 && (
        <section className="mt-14 border-t border-border pt-8">
          <p className="label mb-4">Latest from the log</p>
          <ul className="divide-y divide-border/70">
            {latest.map((entry) => (
              <li key={entry.slug}>
                <Link
                  href={`/log/${entry.slug}`}
                  className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3"
                >
                  <span className="font-display text-lg leading-snug text-foreground transition-colors group-hover:text-brand">
                    {entry.title}
                  </span>
                  <span className="label">{entry.date}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
