"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navItems, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-lg">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex h-14 items-center justify-between">
          {/* Left: Identity + availability */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-baseline gap-1.5">
              <span className="text-base font-semibold tracking-tight">Pedro Santos</span>
              <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">pedrosantos.dev</span>
            </Link>

            <span
              className="hidden items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-2 py-px font-mono text-[10px] uppercase tracking-wider text-accent sm:inline-flex"
              title={siteConfig.availability}
            >
              <span className="h-1 w-1 rounded-full bg-accent" />
              Open
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  pathname === item.href
                    ? "bg-accent/10 text-accent font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side: CTA + mobile toggle */}
          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className="hidden rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 md:block"
            >
              Let&apos;s talk
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-border/60 py-4 md:hidden">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm",
                    pathname === item.href
                      ? "bg-accent/10 text-accent font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-xl bg-accent px-4 py-2 text-center text-sm font-medium text-accent-foreground"
              >
                Let&apos;s talk
              </Link>
            </nav>

            <div className="mt-4 flex items-center gap-2 px-1">
              <span className="font-mono text-[10px] text-muted-foreground/70">
                {siteConfig.location}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}