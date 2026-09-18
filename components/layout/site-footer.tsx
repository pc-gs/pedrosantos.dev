import { Link } from "next-view-transitions";
import { profile } from "@/content/profile";

const contents = [
  { name: "Log", href: "/log" },
  { name: "Writing", href: "/blog" },
  { name: "Work", href: "/projects" },
  { name: "Now", href: "/now" },
  { name: "Uses", href: "/uses" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const elsewhere = [
  { name: "GitHub", href: "https://github.com/pedrocarlos-ti" },
  { name: "LinkedIn", href: "https://linkedin.com/in/pedro-santos" },
  { name: "X", href: "https://x.com/pcgs_tsx" },
  { name: "Email", href: `mailto:${profile.email}` },
  { name: "Writing RSS", href: "/rss.xml" },
  { name: "Log RSS", href: "/log/feed.xml" },
];

/**
 * Colophon. A printed book ends by telling you who made it and how — this
 * footer does the same instead of stacking three columns of link lists.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-28 border-t border-border">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[3.25rem_minmax(0,1fr)_15rem] lg:gap-x-7 xl:grid-cols-[4rem_minmax(0,1fr)_17rem] xl:gap-x-9">
          <p className="hidden font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground lg:block lg:text-right">
            colophon
          </p>

          <div className="min-w-0">
            <Link
              href="/"
              className="font-display text-[1.75rem] leading-none tracking-tight text-foreground transition-colors hover:text-brand"
            >
              pedro santos
              <span className="text-brand" aria-hidden>
                .
              </span>
            </Link>

            <p className="mt-5 max-w-[56ch] font-serif text-[1.0625rem] leading-relaxed text-muted-foreground">
              Set in Instrument Serif, Newsreader and JetBrains Mono. Built with
              Next.js, Tailwind and bun; the words are markdown in a git
              repository. Everything drafted with a model says so{" "}
              <span className="text-ai" aria-hidden>
                ✦
              </span>{" "}
              — and every line is edited by hand.
            </p>

            <nav
              aria-label="Contents"
              className="mt-7 flex flex-wrap items-baseline gap-x-6 gap-y-2"
            >
              {contents.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border-b border-transparent pb-[3px] font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-brand hover:text-foreground"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="min-w-0 space-y-6 lg:border-l lg:border-border lg:pl-7">
            <div>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                Elsewhere
              </p>
              <ul className="mt-3 space-y-1.5">
                {elsewhere.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        item.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="font-serif text-[0.975rem] text-muted-foreground underline decoration-border underline-offset-[3px] transition-colors hover:text-brand hover:decoration-brand"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                Imprint
              </p>
              <p className="mt-3 font-serif text-[0.975rem] leading-relaxed text-muted-foreground">
                © {year} {profile.name}
                <br />
                {profile.location}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
