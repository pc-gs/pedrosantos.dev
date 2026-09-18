import { Link } from "next-view-transitions";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/content/profile";
import { Wrap } from "@/components/site/wrap";
import { Eyebrow } from "@/components/site/eyebrow";
import { LinkButton } from "@/components/site/link-button";

const contents = [
  { name: "Log", href: "/log" },
  { name: "Essays", href: "/blog" },
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
  { name: "Writing RSS", href: "/rss.xml" },
  { name: "Log RSS", href: "/log/feed.xml" },
];

/**
 * Site footer: the contact block every page ends on, plus the small print.
 * One orange accent, hairlines, no dark slabs.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <Wrap className="py-16 md:py-20">
        <Eyebrow>Contact</Eyebrow>
        <h2 className="mt-3 font-display text-[clamp(2.25rem,6vw,4rem)] leading-[0.95] tracking-[-0.02em]">
          Let&apos;s talk<span className="text-brand">.</span>
        </h2>
        <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
          {profile.availability.note}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <LinkButton href="/contact" variant="solid">
            Start a conversation
            <ArrowUpRight className="h-4 w-4" />
          </LinkButton>
          <a
            href={`mailto:${profile.email}`}
            className="link-inline font-mono text-[11px] uppercase tracking-[0.16em]"
          >
            {profile.email}
          </a>
        </div>

        <nav
          aria-label="Contents"
          className="mt-14 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-border pt-6"
        >
          {contents.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-brand"
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
                  className="hover:text-brand"
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand"
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
