import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { uses } from "@/content/uses";
import { Wrap } from "@/components/site/wrap";
import { Eyebrow } from "@/components/site/eyebrow";

export const metadata: Metadata = {
  title: "Uses",
  description:
    "The tools, stack and typefaces behind the work and this site. Kept specific: a claim about what I actually use.",
  alternates: { canonical: "/uses" },
};

export default function UsesPage() {
  return (
    <main>
      <Wrap className="pb-10 pt-14 md:pt-20">
        <Eyebrow>Uses</Eyebrow>
        <h1 className="mt-6 max-w-[18ch] font-display text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[0.95] tracking-[-0.025em]">
          Tools, stack and typefaces
        </h1>
        <p className="mt-6 max-w-[58ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
          Everything below is a claim about what I actually use, so it stays
          short and specific. Rows, not adjectives.
        </p>
      </Wrap>

      <Wrap className="pb-20 md:pb-24">
        {uses.map((group) => (
          <section key={group.id} className="border-t border-border py-8 md:py-10">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-10">
              <div>
                <h2 className="font-display text-[1.375rem] leading-snug tracking-[-0.01em]">
                  {group.title}
                </h2>
                {group.note && (
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {group.note}
                  </p>
                )}
              </div>

              <ul>
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="border-b border-border py-3 first:pt-0 last:border-0"
                  >
                    <p className="text-[1rem] leading-snug">
                      {item.href ? (
                        <a
                          href={item.href}
                          target={
                            item.href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            item.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="link-inline"
                        >
                          {item.name}
                        </a>
                      ) : (
                        item.name
                      )}
                    </p>
                    {item.detail && (
                      <p className="mt-1 max-w-[62ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
                        {item.detail}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}

        <p className="border-t border-border pt-8 text-[1.0625rem] leading-relaxed text-muted-foreground">
          What I&apos;m doing with all of this is on{" "}
          <Link href="/now" className="link-inline">
            the now page
          </Link>
          .
        </p>
      </Wrap>
    </main>
  );
}
