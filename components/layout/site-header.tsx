"use client";

import { cn } from "@/lib/utils";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { CommandPalette } from "@/components/layout/command-palette";
import type { PaletteItem } from "@/lib/palette";

const navItems = [
  { name: "Log", href: "/log" },
  { name: "Writing", href: "/blog" },
  { name: "Projects", href: "/projects" },
  { name: "Now", href: "/now" },
  { name: "About", href: "/about" },
];

function isActive(pathname: string, href: string) {
  if (href === "/projects") return pathname === "/projects" || pathname.startsWith("/projects/");
  if (href === "/blog") return pathname === "/blog" || pathname.startsWith("/blog/");
  if (href === "/log") return pathname === "/log" || pathname.startsWith("/log/");
  return pathname === href;
}

export function SiteHeader({ paletteItems }: { paletteItems: PaletteItem[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-colors duration-200",
          scrolled
            ? "border-border bg-background/85 backdrop-blur-md"
            : "border-transparent bg-background/60 backdrop-blur-sm",
        )}
      >
        <div className="container flex h-14 items-center justify-between gap-4">
          <Link
            href="/"
            className="font-display text-lg tracking-tight text-foreground transition-colors hover:text-brand"
          >
            pedro&nbsp;santos
            <span className="text-brand" aria-hidden>
              .
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-1.5 font-mono text-[13px] transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.name}
                  {active && (
                    <span
                      className="absolute inset-x-3 -bottom-px h-px bg-brand"
                      aria-hidden
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => document.dispatchEvent(new Event("palette:open"))}
              className="inline-flex h-8 items-center gap-2 rounded-md border border-border bg-background px-2.5 font-mono text-[12px] text-muted-foreground transition-colors hover:border-brand hover:text-foreground"
              aria-label="Open command palette"
            >
              <Search className="h-3.5 w-3.5" aria-hidden />
              <span className="hidden lg:inline">search</span>
              <kbd className="rounded border border-border bg-muted px-1 font-mono text-[10px]">
                ⌘K
              </kbd>
            </button>
            <ThemeToggle />
            <Link
              href="/contact"
              className="inline-flex h-8 items-center rounded-md bg-foreground px-3 font-mono text-[13px] text-background transition-opacity hover:opacity-90"
            >
              say hi
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-border bg-background md:hidden">
            <nav className="container flex flex-col py-3">
              {[...navItems, { name: "Uses", href: "/uses" }, { name: "Contact", href: "/contact" }].map(
                (item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between border-b border-border/60 py-3 font-mono text-sm last:border-0",
                        active ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {item.name}
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
                      )}
                    </Link>
                  );
                },
              )}
              <div className="mt-3 flex items-center justify-between pb-1">
                <span className="font-mono text-[12px] text-muted-foreground">
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
