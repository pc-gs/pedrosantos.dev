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
  { name: "Studies", href: "/studies", folio: "02" },
  { name: "Essays", href: "/blog", folio: "03" },
  { name: "Work", href: "/work", folio: "04" },
  { name: "About", href: "/about", folio: "05" },
];

/** Running head: which part of the site you are in. */
function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Sticky header: wordmark, section nav, command palette hint and the theme
 * toggle. Hairlines only, one orange accent. Nothing in here may change width
 * between routes: the nav has to sit still while you move around.
 */
export function SiteHeader({ paletteItems }: { paletteItems: PaletteItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-[1180px] items-center justify-between gap-5 px-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5"
            aria-label="Pedro Santos — home"
          >
            <span className="grid h-6 w-6 place-items-center border border-foreground bg-brand font-display text-[11px] font-bold leading-none text-brand-foreground shadow-[2px_2px_0_0_var(--foreground)] transition-colors group-hover:bg-foreground group-hover:text-background">
              PS
            </span>
            <span className="font-display text-[16px] font-bold leading-none tracking-[-0.02em] text-foreground">
              pedro santos
              <span className="font-mono text-[10px] font-normal tracking-[0.06em] text-muted-foreground">
                .dev
              </span>
            </span>
          </Link>

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
            aria-label={open ? "Close menu" : "Open menu"}
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
            <nav
              className="mx-auto flex w-full max-w-[1180px] flex-col px-5 py-2 sm:px-6 lg:px-8"
              aria-label="Menu"
            >
              {[
                ...navItems,
                { name: "Now", href: "/now", folio: "06" },
                { name: "Uses", href: "/uses", folio: "07" },
                { name: "Contact", href: "/contact", folio: "08" },
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
