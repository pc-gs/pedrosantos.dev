import { Link } from "next-view-transitions";
import { ArrowUpRight, Github, Linkedin, Mail, Rss } from "lucide-react";
import { profile } from "@/content/profile";
import { getAllLogEntries } from "@/lib/log";
import { formatDate } from "@/lib/date";
import { Wrap } from "@/components/site/wrap";
import { XIcon } from "@/components/ui/x-icon";

const contents = [
  { name: "Work", href: "/work" },
  { name: "Log", href: "/log" },
  { name: "Studies", href: "/studies" },
  { name: "Now", href: "/now" },
  { name: "Uses", href: "/uses" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const elsewhere = [
  {
    name: "GitHub",
    handle: "pc-gs",
    href: "https://github.com/pc-gs",
    icon: <Github className="h-4 w-4" aria-hidden />,
  },
  {
    name: "X",
    handle: "@pcgs_tsx",
    href: "https://x.com/pcgs_tsx",
    icon: <XIcon size={14} />,
  },
  {
    name: "LinkedIn",
    handle: "pedro-santos",
    href: "https://linkedin.com/in/pedro-santos",
    icon: <Linkedin className="h-4 w-4" aria-hidden />,
  },
  {
    name: "Email",
    handle: profile.email,
    href: `mailto:${profile.email}`,
    icon: <Mail className="h-4 w-4" aria-hidden />,
  },
  {
    name: "Writing RSS",
    handle: "/rss.xml",
    href: "/rss.xml",
    icon: <Rss className="h-4 w-4" aria-hidden />,
  },
  {
    name: "Log RSS",
    handle: "/log/feed.xml",
    href: "/log/feed.xml",
    icon: <Rss className="h-4 w-4" aria-hidden />,
  },
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

        <ul
          aria-label="Elsewhere"
          className="mt-6 grid grid-cols-1 border-t border-l border-border sm:grid-cols-2 lg:grid-cols-3"
        >
          {elsewhere.map((item) => {
            const external = item.href.startsWith("http");
            return (
              <li key={item.name} className="border-r border-b border-border">
                <a
                  href={item.href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group flex items-center gap-3 bg-background/70 px-4 py-3.5 backdrop-blur-[2px] transition-colors hover:bg-card"
                >
                  <span className="text-muted-foreground transition-colors group-hover:text-brand">
                    {item.icon}
                  </span>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.16em]">
                    {item.name}
                  </span>
                  <span className="ml-auto truncate font-mono text-[10.5px] text-muted-foreground">
                    {item.handle}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
          <span>
            © {year} {profile.name}
          </span>
          <span className="tabnum">40.36° N · 7.35° W · {profile.location}</span>
          <span className="text-brand-text">
            ⌁ Crafted between Belmonte &amp; the Cloud
          </span>
        </div>
      </Wrap>
    </footer>
  );
}
