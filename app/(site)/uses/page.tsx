import type { Metadata } from "next";
import { uses } from "@/content/uses";
import { Folio, Manuscript, Sidenote } from "@/components/manuscript/manuscript";
import { MarginLink, Stamp } from "@/components/manuscript/marks";
import { JsonLd } from "@/components/layout/json-ld";
import { generateBreadcrumbStructuredData } from "@/lib/structured-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pedrosantos.dev";

export const metadata: Metadata = {
  title: "Uses",
  description:
    "The tools, stack and settings behind Pedro Santos's work — TypeScript, React, Next.js, Tauri, the typefaces and tokens behind this site.",
  alternates: { canonical: "/uses" },
};

export default function UsesPage() {
  return (
    <main className="container py-12 md:py-16">
      <JsonLd
        data={generateBreadcrumbStructuredData([
          { name: "Home", url: SITE_URL },
          { name: "Uses", url: `${SITE_URL}/uses` },
        ])}
      />

      <Manuscript
        marginWidth="wide"
        folio={<Folio>uses</Folio>}
        margin={
          <>
            <div>
              <Stamp tone="muted">no affiliate links</Stamp>
            </div>

            <Sidenote label="the rule" leader>
              <p className="font-serif text-[0.925rem] leading-relaxed text-muted-foreground">
                If a tool is on this page it earned the spot in real work. No
                listicles, no sponsored picks, no &ldquo;top 10 tools for
                developers&rdquo;.
              </p>
            </Sidenote>

            <Sidenote label="the thinking">
              <p className="font-serif text-[0.925rem] leading-relaxed text-muted-foreground">
                Why the stack is shaped this way is in writing; the recent
                experiments are in the log.
              </p>
              <p className="mt-3 flex flex-col gap-2">
                <MarginLink href="/blog">writing →</MarginLink>
                <MarginLink href="/log">the log →</MarginLink>
              </p>
            </Sidenote>
          </>
        }
      >
        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          uses
        </p>
        <h1 className="mt-5 font-display display-page text-foreground">
          What I build with
        </h1>
        <p className="mt-6 max-w-[56ch] font-serif text-[1.125rem] leading-[1.72] text-foreground/85">
          A short, honest inventory. Everything here passed the same test: it
          survived being used on real work with real deadlines.
        </p>

        {uses.map((group, gi) => (
          <section
            key={group.id}
            className="mt-14 grid grid-cols-1 gap-y-3 border-t border-border pt-9 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-x-6"
          >
            <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground tabnum">
              <span className="text-brand">
                {String(gi + 1).padStart(2, "0")}
              </span>
            </p>
            <div className="min-w-0">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                {group.title}
              </p>
              {group.note && (
                <p className="mt-3 max-w-[52ch] font-serif text-[1.0625rem] leading-relaxed text-muted-foreground italic">
                  {group.note}
                </p>
              )}
              <ul className="mt-5">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="border-b border-border/70 py-4 first:pt-0 last:border-0"
                  >
                    <p className="font-display text-[1.25rem] leading-snug tracking-tight text-foreground">
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border-b border-transparent pb-[2px] transition-colors hover:border-brand hover:text-brand"
                        >
                          {item.name}
                        </a>
                      ) : (
                        item.name
                      )}
                    </p>
                    {item.detail && (
                      <p className="mt-1.5 max-w-[60ch] font-serif text-[1.0625rem] leading-[1.7] text-muted-foreground">
                        {item.detail}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </Manuscript>
    </main>
  );
}
