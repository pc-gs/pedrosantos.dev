"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, siteConfig, socialLinks } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border/60 bg-[hsl(var(--surface))]/90 backdrop-blur-xl md:flex">
      <div className="flex flex-1 flex-col px-5 py-8">
        <Link href="/" className="mb-8 block">
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Pedro Santos
          </span>
          <span className="mt-1 block font-mono text-[11px] text-muted-foreground">
            pedrosantos.dev
          </span>
        </Link>

        <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Available
        </span>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm transition-colors",
                pathname === item.href
                  ? "nav-pill-active font-medium"
                  : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-6 pt-8">
          <Link
            href="/contact"
            className="flex w-full items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            Let&apos;s talk
          </Link>

          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {socialLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.href.startsWith("http") ? "noopener noreferrer" : undefined
                }
                className="font-mono text-[10px] text-muted-foreground transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <p className="font-mono text-[10px] text-muted-foreground/70">
            {siteConfig.location}
          </p>
        </div>
      </div>
    </aside>
  );
}