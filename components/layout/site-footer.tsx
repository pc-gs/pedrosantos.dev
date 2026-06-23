import Link from "next/link";
import { siteConfig, socialLinks } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40">
      <div className="page-content flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {socialLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="font-mono text-xs text-muted-foreground transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}