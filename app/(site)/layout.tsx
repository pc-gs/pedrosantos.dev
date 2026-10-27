import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getPaletteItems } from "@/lib/palette";
import { getCurrentVersion } from "@/lib/timeline";

/**
 * Chrome for the public site (header, footer, skip link).
 *
 * Lives in a route group so design explorations under /design can render
 * standalone, without this chrome and without the manuscript grain.
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SiteHeader paletteItems={getPaletteItems()} version={getCurrentVersion()} />
      <div className="flex-1">
        <div id="main">{children}</div>
      </div>
      <SiteFooter />
    </div>
  );
}
