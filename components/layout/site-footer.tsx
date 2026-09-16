import { Link } from "next-view-transitions";
import { Github, Linkedin, Mail, Rss } from "lucide-react";
import { XIcon } from "@/components/ui/x-icon";
import { profile } from "@/content/profile";

const nav = [
  { name: "Log", href: "/log" },
  { name: "Writing", href: "/blog" },
  { name: "Projects", href: "/projects" },
  { name: "About", href: "/about" },
  { name: "Now", href: "/now" },
  { name: "Uses", href: "/uses" },
];

const elsewhere = [
  { name: "GitHub", href: "https://github.com/pedrocarlos-ti", icon: Github },
  { name: "LinkedIn", href: "https://linkedin.com/in/pedro-santos", icon: Linkedin },
  { name: "X", href: "https://x.com/pcgs_tsx", icon: XIcon },
  { name: "Email", href: `mailto:${profile.email}`, icon: Mail },
  { name: "RSS", href: "/rss.xml", icon: Rss },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border">
      <div className="container py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="font-display text-2xl tracking-tight text-foreground transition-colors hover:text-brand"
            >
              pedro santos<span className="text-brand" aria-hidden>.</span>
            </Link>
            <p className="mt-3 max-w-xs font-serif text-[0.95rem] leading-relaxed text-muted-foreground">
              {profile.tagline}
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 font-mono text-[12px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
              available for new work
            </p>
          </div>

          <div>
            <p className="label mb-3">Navigate</p>
            <ul className="space-y-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label mb-3">Elsewhere</p>
            <ul className="space-y-2">
              {elsewhere.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      item.href.startsWith("http") ? "noopener noreferrer" : undefined
                    }
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 font-mono text-[12px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Pedro Santos — Belmonte, Portugal</p>
          <p>
            co-written with AI where marked{" "}
            <span className="text-ai" aria-hidden>
              ✦
            </span>{" "}
            · human-edited, always
          </p>
        </div>
      </div>
    </footer>
  );
}
