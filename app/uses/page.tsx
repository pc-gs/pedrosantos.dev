import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { uses } from "@/content/uses";
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
    <main className="container py-14 md:py-20">
      <JsonLd
        data={generateBreadcrumbStructuredData([
          { name: "Home", url: SITE_URL },
          { name: "Uses", url: `${SITE_URL}/uses` },
        ])}
      />

      <header className="fade-up border-b border-border pb-8">
        <p className="label mb-4">Uses</p>
        <h1 className="max-w-3xl font-display text-[clamp(2.5rem,6vw,4rem)] leading-[1.05] tracking-tight text-foreground">
          What I build with
        </h1>
        <p className="mt-5 max-w-xl font-serif text-lg leading-relaxed text-muted-foreground">
          A short, honest inventory — no affiliate links, no listicles. If a tool
          is here, it&apos;s because it earned the spot in real work.
        </p>
      </header>

      <div className="mt-4">
        {uses.map((group) => (
          <section key={group.id} className="border-b border-border py-10">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr] md:gap-12">
              <div>
                <h2 className="font-display text-2xl leading-snug tracking-tight text-foreground">
                  {group.title}
                </h2>
                {group.note && (
                  <p className="mt-2 font-serif text-[0.975rem] leading-relaxed text-muted-foreground">
                    {group.note}
                  </p>
                )}
              </div>

              <ul className="divide-y divide-border/70">
                {group.items.map((item) => (
                  <li key={item.name} className="py-3.5 first:pt-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-mono text-[13px] text-foreground">
                        {item.href ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline decoration-border underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
                          >
                            {item.name}
                          </a>
                        ) : (
                          item.name
                        )}
                      </span>
                    </div>
                    {item.detail && (
                      <p className="mt-1 max-w-[58ch] font-serif text-[0.975rem] leading-relaxed text-muted-foreground">
                        {item.detail}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      <p className="mt-10 max-w-xl font-serif text-[1.0625rem] leading-relaxed text-muted-foreground">
        The thinking behind the stack is in{" "}
        <Link
          href="/blog"
          className="text-brand underline decoration-brand/40 underline-offset-4 hover:decoration-brand"
        >
          writing
        </Link>
        , and the recent experiments are in{" "}
        <Link
          href="/log"
          className="text-brand underline decoration-brand/40 underline-offset-4 hover:decoration-brand"
        >
          the log
        </Link>
        .
      </p>
    </main>
  );
}