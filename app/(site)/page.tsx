import { ArrowUpRight } from "lucide-react";
import { Link } from "next-view-transitions";
import { profile } from "@/content/profile";
import { getLogEntryBySlug } from "@/lib/log";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { LogEntry } from "@/lib/types";
import { Wrap } from "@/components/site/wrap";
import { Eyebrow } from "@/components/site/eyebrow";
import { IntentField } from "@/components/creation/intent-field";
import { Duality } from "@/components/creation/duality";
import {
  AgentArt,
  GraphqlArt,
  MelroArt,
  TauriArt,
} from "@/components/creation/bento-art";

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
  art: React.ReactNode;
  /** "row" puts the art beside the copy on wide screens */
  layout?: "row";
};

const bento: BentoCard[] = [
  {
    index: "01",
    kicker: "Founder",
    title: "Melro.io",
    body: "Bespoke software for local businesses. Founder mode: sit with the owner, ship the thing, watch it get used at the counter.",
    href: profile.founded.url,
    cta: "melro.io",
    external: true,
    className: "md:col-span-4 md:row-span-2",
    art: <MelroArt />,
  },
  {
    index: "02",
    kicker: "Desktop",
    title: "Tauri v2 & desktop systems",
    body: "A web UI in a native shell over a Rust core. Mira, a drawing overlay for screen shares, is where I learn it by shipping.",
    href: "/work/mira",
    cta: "case study",
    className: "md:col-span-4",
    art: <TauriArt />,
  },
  {
    index: "03",
    kicker: "Lab",
    title: "Agent-driven engineering",
    body: "Orchestrating Claude Code, Codex and local loops. Agents draft, deterministic checks gate, a human signs off.",
    href: "/studies",
    cta: "studies",
    className: "md:col-span-4",
    art: <AgentArt />,
  },
  {
    index: "04",
    kicker: "Day job craft",
    title: "Production React & GraphQL",
    body: "Large frontends that stay pleasant to work in: components that own their data through fragments, clear boundaries, and DX the next person thanks you for.",
    href: "/log/graphql-fragments-dx",
    cta: "on fragments",
    className: "md:col-span-8",
    art: <GraphqlArt />,
    layout: "row",
  },
];

function featuredEntries(): LogEntry[] {
  return FEATURED_LOG.map((slug) => getLogEntryBySlug(slug))
    .filter((entry): entry is LogEntry => entry !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export default function HomePage() {
  const entries = featuredEntries();

  return (
    <main>
      {/* ── hero: intent, rasterised ───────────────────────────────── */}
      <section
        aria-labelledby="hero-title"
        className="relative flex flex-col lg:min-h-[min(88vh,820px)] lg:justify-center"
      >
        <Wrap className="relative z-10 pt-12 md:pt-16 lg:py-24">
          <p className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 border border-border bg-background/85 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] backdrop-blur-sm">
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
            className="mt-8 max-w-[13ch] font-display text-[clamp(2.75rem,7.2vw,6.25rem)] leading-[0.9] tracking-[-0.035em]"
          >
            A decade of shipping by hand.{" "}
            <span className="text-brand">Now I direct the agents.</span>
          </h1>
          <p className="mt-8 max-w-[46ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
            I&apos;m {profile.name}, a senior software engineer. I set the
            intent, draw the boundaries and review every line that ships. Models
            explore, draft and run the loops.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/log"
              className="group inline-flex items-center gap-2 bg-foreground px-4 py-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-background transition-colors hover:bg-brand hover:text-brand-foreground"
            >
              Read the log
              <ArrowUpRight
                aria-hidden
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center border border-border bg-background/85 px-4 py-3 font-mono text-[10.5px] uppercase tracking-[0.16em] backdrop-blur-sm transition-colors hover:border-foreground"
            >
              Say hi
            </Link>
          </div>
        </Wrap>

        <div className="relative mt-8 h-[min(52vh,420px)] lg:absolute lg:inset-0 lg:mt-0 lg:h-auto">
          <IntentField />
          <p className="pointer-events-none absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:left-6 lg:left-[max(2rem,calc((100vw-1180px)/2+2rem))]">
            Fig. 1 — Intent, rasterised.{" "}
            <span className="hidden sm:inline">
              Move to draw. The line is yours; the matrix answers.
            </span>
          </p>
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
              Who does what on a normal day. Pick a stage, then drag the seam to
              inspect each side. The rule underneath all of it: the model writes
              drafts, I own what ships.
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

          <ul className="mt-10 grid grid-cols-1 gap-3 md:auto-rows-[minmax(17rem,auto)] md:grid-cols-8">
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
              Rows marked <span className="text-ai">✦</span> were drafted with a
              model and edited by hand. The rest I typed myself.
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
      <span className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>
          {card.index} · {card.kicker}
        </span>
        <ArrowUpRight
          aria-hidden
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
        />
      </span>
      <span
        className={cn(
          "mt-6 flex flex-1 flex-col gap-8",
          card.layout === "row" &&
            "md:flex-row-reverse md:items-end md:justify-between",
        )}
      >
        <span className="flex flex-1 items-center justify-center py-2">
          {card.art}
        </span>
        <span className="block">
          <span className="block font-display text-[1.6rem] leading-[1.05] tracking-[-0.02em] transition-colors group-hover:text-brand md:text-[1.85rem]">
            {card.title}
          </span>
          <span className="mt-3 block max-w-[46ch] text-[0.92rem] leading-relaxed text-muted-foreground">
            {card.body}
          </span>
          <span className="mt-4 block font-mono text-[10px] uppercase tracking-[0.18em] text-brand-text">
            {card.cta} {card.external ? "↗" : "→"}
          </span>
        </span>
      </span>
    </>
  );

  const className =
    "group relative flex h-full flex-col overflow-hidden border border-border bg-card/90 p-5 backdrop-blur-sm transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-foreground motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:p-6";

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
