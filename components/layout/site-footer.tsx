import { Link } from "next-view-transitions";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/content/profile";
import { getAllLogEntries } from "@/lib/log";
import { formatDate } from "@/lib/date";
import { Wrap } from "@/components/site/wrap";

const contents = [
  { name: "Log", href: "/log" },
  { name: "Studies", href: "/studies" },
  { name: "Essays", href: "/blog" },
  { name: "Work", href: "/work" },
  { name: "Now", href: "/now" },
  { name: "Uses", href: "/uses" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const elsewhere = [
  { name: "GitHub", href: "https://github.com/pc-gs" },
  { name: "LinkedIn", href: "https://linkedin.com/in/pedro-santos" },
  { name: "X", href: "https://x.com/pcgs_tsx" },
  { name: "Writing RSS", href: "/rss.xml" },
  { name: "Log RSS", href: "/log/feed.xml" },
];

/**
 * Site footer. Instead of repeating a big call to action on every page, it
 * shows the latest note (the site is alive) and the practical lines: how to
 * reach me, where to go next, small print. The full pitch lives on /contact.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const latest = getAllLogEntries()[0];

  return (
    <footer className="border-t border-border">
      <Wrap className="py-14 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Say hi
            </p>
            {profile.availability.open && (
              <p className="mt-3 max-w-[42ch] text-[1rem] leading-relaxed">
                Open to full-time roles and contract work, remote-friendly, EU
                timezones.
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-3">
              <a
                href={`mailto:${profile.email}`}
                className="link-inline font-mono text-[11px] uppercase tracking-[0.16em]"
              >
                {profile.email}
              </a>
              <Link
                href="/contact"
                className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-brand-text transition-colors hover:text-foreground"
              >
                the form →
              </Link>
            </div>
          </div>

          {latest && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Latest from the log
              </p>
              <Link href={`/log/${latest.slug}`} className="group mt-3 block">
                <span className="font-display text-[1.375rem] leading-snug tracking-[-0.01em] transition-colors group-hover:text-brand">
                  {latest.title}
                </span>
                <span className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
                  <time dateTime={latest.date}>
                    {formatDate(latest.date, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                  {latest.aiAssisted ? (
                    <span className="text-ai">
                      ✦ co-written{latest.model ? ` with ${latest.model}` : ""}
                    </span>
                  ) : (
                    <span>✎ by hand</span>
                  )}
                  <ArrowUpRight
                    className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            </div>
          )}
        </div>

        <nav
          aria-label="Contents"
          className="mt-12 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-border pt-6"
        >
          {contents.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-brand-text"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
          <span>
            © {year} {profile.name} · {profile.location}
          </span>
          <span className="flex flex-wrap items-center gap-5">
            {elsewhere.map((item) =>
              item.href.startsWith("/") ? (
                <Link
                  key={item.name}
                  href={item.href}
                  className="hover:text-brand-text"
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-text"
                >
                  {item.name}
                </a>
              ),
            )}
          </span>
        </div>
      </Wrap>
    </footer>
  );
}
