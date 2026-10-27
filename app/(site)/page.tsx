import { ArrowUpRight } from "lucide-react";
import { Link } from "next-view-transitions";
import { profile } from "@/content/profile";
import { getLogEntryBySlug } from "@/lib/log";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { LogEntry } from "@/lib/types";
import { Wrap } from "@/components/site/wrap";
import { Eyebrow } from "@/components/site/eyebrow";
import { CreationOfAdam } from "@/components/creation/creation-of-adam";
import { Duality } from "@/components/creation/duality";

const FEATURED_LOG = [
  "this-site-is-now-co-written-with-ai",
  "good-prompt-is-a-good-ticket",
  "ai-linter-for-thinking",
  "tauri-webview-not-browser",
];

type BentoCard = {
  index: string;
  kicker: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  external?: boolean;
  className: string;
  /** Dot-matrix motif drawn behind the card, in CSS */
  motif: "dense" | "sparse" | "diagonal" | "rows";
};

const bento: BentoCard[] = [
  {
    index: "01",
    kicker: "Founder",
    title: "Melro.io",
    body: "Bespoke software for local businesses. Founder mode: talk to the owner, ship the thing, watch it get used for real.",
    href: profile.founded.url,
    cta: "melro.io",
    external: true,
    className: "md:col-span-4 md:row-span-2",
    motif: "dense",
  },
  {
    index: "02",
    kicker: "Desktop",
    title: "Tauri v2 & desktop systems",
    body: "Web engineering in a native shell, with a Rust core. Mira, an on-screen annotation overlay, is where I learn it by shipping.",
    href: "/work/mira",
    cta: "case study",
    className: "md:col-span-4",
    motif: "rows",
  },
  {
    index: "03",
    kicker: "Lab",
    title: "Agent-driven engineering",
    body: "Experiments orchestrating Claude Code, Codex and local autonomous loops, and writing down what holds up.",
    href: "/studies",
    cta: "studies",
    className: "md:col-span-4",
    motif: "sparse",
  },
  {
    index: "04",
    kicker: "Day job craft",
    title: "Production React & GraphQL",
    body: "Large frontends that stay pleasant to work in: typed data with fragments, components with clear boundaries, and DX the next person thanks you for.",
    href: "/log/graphql-fragments-dx",
    cta: "on fragments",
    className: "md:col-span-8",
    motif: "diagonal",
  },
];

const motifClass: Record<BentoCard["motif"], string> = {
  dense:
    "[background-image:radial-gradient(var(--foreground)_0.9px,transparent_1px)] [background-size:9px_9px] opacity-[0.12]",
  sparse:
    "[background-image:radial-gradient(var(--foreground)_1px,transparent_1.2px)] [background-size:18px_18px] opacity-[0.14]",
  rows: "[background-image:radial-gradient(var(--foreground)_0.9px,transparent_1px)] [background-size:6px_14px] opacity-[0.12]",
  diagonal:
    "[background-image:repeating-linear-gradient(115deg,var(--foreground)_0_1px,transparent_1px_9px)] opacity-[0.07]",
};

function featuredEntries(): LogEntry[] {
  return FEATURED_LOG.map((slug) => getLogEntryBySlug(slug)).filter(
    (entry): entry is LogEntry => entry !== null,
  );
}

export default function HomePage() {
  const entries = featuredEntries();

  return (
    <main>
      {/* ── hero ───────────────────────────────────────────────────────── */}
      <section aria-labelledby="hero-title" className="pt-12 md:pt-16">
        <Wrap>
          <p className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 border border-border bg-background/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] backdrop-blur-[2px]">
            <span aria-hidden className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            <span>Belmonte, PT</span>
            <span className="text-muted-foreground">·</span>
            <span>Building Melro.io</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              Deep-diving into Agentic AI &amp; Tauri v2
            </span>
          </p>

          <h1
            id="hero-title"
            className="mt-7 max-w-[16ch] font-display text-[clamp(2.6rem,7vw,5.75rem)] leading-[0.93] tracking-[-0.03em]"
          >
            A decade of shipping by hand.{" "}
            <span className="text-brand">Now I direct the agents.</span>
          </h1>
          <p className="mt-7 max-w-[60ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
            I&apos;m {profile.name}, a senior software engineer. I frame the
            work, draw the boundaries and review every line that ships; models
            explore, draft and run the loops in the background. Production
            React, TypeScript and GraphQL by day, Tauri and Rust on the desk,{" "}
            <a
              href={profile.founded.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-inline"
            >
              Melro.io
            </a>{" "}
            on the side.
          </p>
        </Wrap>

        <div className="mt-6 md:mt-2">
          <CreationOfAdam />
        </div>
      </section>

      {/* ── human judgement vs model drafting ─────────────────────────── */}
      <section aria-labelledby="duality-title" className="pt-24 md:pt-32">
        <Wrap>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-end">
            <div>
              <Eyebrow>§ 01 — The split</Eyebrow>
              <h2
                id="duality-title"
                className="mt-4 font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[0.98] tracking-[-0.025em]"
              >
                Human judgement,
                <br />
                <span className="text-muted-foreground">model drafting.</span>
              </h2>
            </div>
            <p className="max-w-[52ch] text-[0.98rem] leading-relaxed text-muted-foreground">
              Who does what on a normal day. Pick a stage, then drag the seam
              to inspect each side. The rule underneath all of it: the model
              writes drafts, I own what ships.
            </p>
          </div>
          <div className="mt-10">
            <Duality />
          </div>
        </Wrap>
      </section>

      {/* ── shipping & researching ────────────────────────────────────── */}
      <section aria-labelledby="bento-title" className="pt-24 md:pt-32">
        <Wrap>
          <Eyebrow>§ 02 — On the bench</Eyebrow>
          <h2
            id="bento-title"
            className="mt-4 font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[0.98] tracking-[-0.025em]"
          >
            What I&apos;m shipping
            <br />
            <span className="text-muted-foreground">&amp; researching.</span>
          </h2>

          <ul className="mt-10 grid grid-cols-1 gap-3 md:auto-rows-[minmax(13rem,auto)] md:grid-cols-8">
            {bento.map((card) => (
              <li key={card.index} className={card.className}>
                <BentoLink card={card} />
              </li>
            ))}
          </ul>
        </Wrap>
      </section>

      {/* ── lab notebook ──────────────────────────────────────────────── */}
      <section
        aria-labelledby="notebook-title"
        className="pt-24 pb-24 md:pt-32 md:pb-32"
      >
        <Wrap>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>§ 03 — Lab notebook</Eyebrow>
              <h2
                id="notebook-title"
                className="mt-4 font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[0.98] tracking-[-0.025em]"
              >
                Essays &amp; log
              </h2>
            </div>
            <p className="max-w-[44ch] text-[0.9rem] leading-relaxed text-muted-foreground">
              Rows marked <span className="text-ai">✦</span> were drafted with
              a model and edited by hand. The rest I typed myself.
            </p>
          </div>

          <ol className="mt-8 border-t border-foreground">
            {entries.map((entry, i) => (
              <li key={entry.slug} className="border-b border-border">
                <Link
                  href={`/log/${entry.slug}`}
                  className="group grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4 gap-y-2 bg-background/70 py-5 backdrop-blur-[2px] md:grid-cols-[2.5rem_8rem_minmax(0,1fr)_auto] md:items-baseline"
                >
                  <span className="font-mono text-[10.5px] text-muted-foreground tabnum">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="col-start-2 font-display text-[1.3rem] leading-snug tracking-[-0.01em] transition-colors group-hover:text-brand md:order-3 md:col-start-auto md:text-[1.5rem]">
                    {entry.aiAssisted && (
                      <span
                        className="mr-2 text-ai"
                        title="Co-written with a model"
                      >
                        ✦
                      </span>
                    )}
                    {entry.title}
                  </span>
                  <time
                    dateTime={entry.date}
                    className="col-start-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground md:order-2 md:col-start-auto"
                  >
                    {formatDate(entry.date)}
                  </time>
                  <span className="col-start-2 flex flex-wrap items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground md:order-4 md:col-start-auto">
                    {entry.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="border border-border px-1.5 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                    <ArrowUpRight
                      aria-hidden
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <Link
            href="/log"
            className="mt-6 inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-brand-text transition-colors hover:text-foreground"
          >
            the whole log →
          </Link>
        </Wrap>
      </section>
    </main>
  );
}

function BentoLink({ card }: { card: BentoCard }) {
  const inner = (
    <>
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0",
          motifClass[card.motif],
        )}
      />
      <span className="relative flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>
          {card.index} · {card.kicker}
        </span>
        <ArrowUpRight
          aria-hidden
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
        />
      </span>
      <span className="relative mt-auto block pt-10">
        <span className="block font-display text-[1.6rem] leading-[1.05] tracking-[-0.02em] transition-colors group-hover:text-brand md:text-[1.85rem]">
          {card.title}
        </span>
        <span className="mt-3 block max-w-[48ch] text-[0.92rem] leading-relaxed text-muted-foreground">
          {card.body}
        </span>
        <span className="mt-4 block font-mono text-[10px] uppercase tracking-[0.18em] text-brand-text">
          {card.cta} {card.external ? "↗" : "→"}
        </span>
      </span>
    </>
  );

  const className =
    "group relative flex h-full flex-col overflow-hidden border border-border bg-card/85 p-5 backdrop-blur-[2px] transition-colors hover:border-foreground md:p-6";

  return card.external ? (
    <a
      href={card.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {inner}
    </a>
  ) : (
    <Link href={card.href} className={className}>
      {inner}
    </Link>
  );
}
