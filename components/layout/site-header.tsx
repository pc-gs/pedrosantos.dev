"use client";

import { cn } from "@/lib/utils";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { CommandPalette } from "@/components/layout/command-palette";
import type { PaletteItem } from "@/lib/palette";

const navItems = [
  { name: "Log", href: "/log", folio: "01" },
  { name: "Writing", href: "/blog", folio: "02" },
  { name: "Work", href: "/projects", folio: "03" },
  { name: "Now", href: "/now", folio: "04" },
  { name: "About", href: "/about", folio: "05" },
];

/** Running-head label: which part of the manuscript you are in. */
function sectionFor(pathname: string): string | null {
  if (pathname === "/") return null;
  if (pathname.startsWith("/log")) return "the log";
  if (pathname.startsWith("/blog")) return "writing";
  if (pathname.startsWith("/projects")) return "work";
  if (pathname.startsWith("/now")) return "now";
  if (pathname.startsWith("/uses")) return "uses";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/contact")) return "contact";
  return null;
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Running head. A book prints the section at the top of every page; this does
 * the same, and grows the current section name once you have started reading.
 */
export function SiteHeader({ paletteItems }: { paletteItems: PaletteItem[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const section = sectionFor(pathname);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="container flex h-14 items-center justify-between gap-5">
          <div className="flex min-w-0 items-baseline gap-3">
            <Link
              href="/"
              className="font-display text-[17px] leading-none tracking-tight text-foreground transition-colors hover:text-brand"
            >
              pedro santos
              <span className="text-brand" aria-hidden>
                .
              </span>
            </Link>
            {section && (
              <span
                className={cn(
                  "hidden truncate font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground transition-opacity duration-300 sm:inline",
                  scrolled ? "opacity-100" : "opacity-0",
                )}
                aria-hidden={!scrolled}
              >
                {section}
              </span>
            )}
          </div>

          <nav className="hidden items-baseline gap-6 md:flex">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "border-b pb-[3px] font-mono text-[10.5px] uppercase tracking-[0.18em] transition-colors",
                    active
                      ? "border-brand text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-5 md:flex">
            <button
              type="button"
              onClick={() => document.dispatchEvent(new Event("palette:open"))}
              className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Open command palette"
            >
              ⌘K
            </button>
            <ThemeToggle />
            <Link
              href="/contact"
              className="border-b border-border pb-[3px] font-mono text-[10.5px] uppercase tracking-[0.18em] text-foreground transition-colors hover:border-brand hover:text-brand"
            >
              say hi
            </Link>
          </div>

          <button
            type="button"
            className="-mr-2 inline-flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground md:hidden"
            aria-label={open ? "Close contents" : "Open contents"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="font-mono text-[14px] tracking-[0.1em]">
              {open ? "×" : "≡"}
            </span>
          </button>
        </div>

        {open && (
          <div className="border-t border-border bg-background md:hidden">
            <nav className="container flex flex-col py-2" aria-label="Contents">
              {[
                ...navItems,
                { name: "Uses", href: "/uses", folio: "06" },
                { name: "Contact", href: "/contact", folio: "07" },
              ].map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="flex items-baseline gap-4 border-b border-border/70 py-3 last:border-0"
                  >
                    <span className="font-mono text-[10.5px] tracking-[0.18em] text-muted-foreground">
                      {item.folio}
                    </span>
                    <span
                      className={cn(
                        "font-display text-xl leading-none tracking-tight",
                        active ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {item.name}
                    </span>
                    {active && (
                      <span
                        className="ml-auto h-1 w-1 rounded-full bg-brand"
                        aria-hidden
                      />
                    )}
                  </Link>
                );
              })}
              <div className="flex items-center justify-between py-3">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  theme
                </span>
                <ThemeToggle />
              </div>
            </nav>
          </div>
        )}
      </header>
      <CommandPalette items={paletteItems} />
    </>
  );
}
