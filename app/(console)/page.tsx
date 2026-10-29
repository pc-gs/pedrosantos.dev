import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/content/profile";
import { getProjectBySlug } from "@/content/projects";
import { getAllLogEntries } from "@/lib/log";
import { formatDate } from "@/lib/date";
import { ConsoleProvider, type ConsoleMode } from "@/components/console/console-context";
import type { Blueprint } from "@/components/console/core-canvas";
import { ConsoleHero } from "@/components/console/console-hero";
import { CommandBar } from "@/components/console/command-bar";
import { MelroCard } from "@/components/console/melro-card";
import { TauriCard } from "@/components/console/tauri-card";
import { AgentCard, type AgentSession } from "@/components/console/agent-card";
import { GraphqlCard } from "@/components/console/graphql-card";

/** Rough token estimate: ~4 characters per token for English prose. */
function estimateTokens(text: string): number {
  return Math.round(text.length / 4);
}

const NAV = [
  { href: "/log", label: "log" },
  { href: "/work", label: "work" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
];

export default function ConsolePage() {
  const log = getAllLogEntries();
  const melro = getProjectBySlug("melro-io");
  const newest = log[0]?.date ?? new Date().toISOString();
  const version = `v${newest.slice(0, 4)}.${newest.slice(5, 7)}`;

  const sessions: AgentSession[] = log
    .filter((entry) => entry.aiAssisted && entry.prompt)
    .map((entry) => ({
      slug: entry.slug,
      title: entry.title,
      date: entry.date,
      model: entry.model ?? "unnamed",
      prompt: entry.prompt!,
      promptTokens: estimateTokens(entry.prompt!),
      outputTokens: estimateTokens(entry.content),
    }));

  const blueprints: Record<ConsoleMode, Blueprint> = {
    idle: {
      title: "synthetic core",
      caption: "move to pull · click to perturb · / to type",
      nodes: [],
    },
    melro: {
      title: "melro.io",
      caption: `${melro?.period ?? "2023 — present"} · founder & engineer`,
      nodes: [...(melro?.stack ?? []), "local businesses"],
    },
    tauri: {
      title: "tauri v2 + rust",
      caption: "a native shell around the OS webview",
      nodes: ["Rust core", "invoke() · JSON IPC", "WKWebView / WebView2", "dialogs · fs · drag & drop", "React UI"],
    },
    agents: {
      title: "agent loop",
      caption: `${sessions.length} assisted log entries · every prompt published`,
      nodes: ["prompt = ticket", "model draft", "human edit", "typecheck · lint · build", "publish + disclose"],
    },
    graphql: {
      title: "react + graphql",
      caption: "fragments live next to their components",
      nodes: ["schema", "EntryPage query", "...EntryHeader_entry", "...EntryMargin_entry", "...EntryBody_entry", "generated types"],
    },
    stack: {
      title: "stack",
      caption: profile.location.toLowerCase(),
      nodes: [...profile.stack, "Rust", "GraphQL"],
    },
  };

  const readout = (
    <div className="max-w-[46ch] rounded-[12px] border border-con-line bg-con-panel p-6 font-mono text-[12.5px] leading-relaxed text-con-dim">
      <p className="text-[10.5px] uppercase tracking-[0.16em] text-con-phosphor">human mode · no canvas running</p>
      <ul className="mt-4 space-y-2">
        <li>
          <span className="text-con-ink">who</span> · {profile.name}, engineer in {profile.location}
        </li>
        <li>
          <span className="text-con-ink">day</span> · production React and GraphQL
        </li>
        <li>
          <span className="text-con-ink">side</span> · Melro.io, software for local businesses
        </li>
        <li>
          <span className="text-con-ink">learning</span> · Tauri v2, Rust, working with agents
        </li>
        <li>
          <span className="text-con-ink">open to</span> · {profile.availability.types.join(" and ")} work
        </li>
      </ul>
    </div>
  );

  return (
    <ConsoleProvider>
      <header className="sticky top-0 z-30 border-b border-con-line bg-con-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-[1280px] items-center justify-between gap-4 px-4 font-mono text-[11px] sm:px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-2.5 text-con-ink">
            <span className="rounded-[4px] border border-con-amber/60 px-1 text-con-amber">PS</span>
            <span className="hidden sm:inline">pedrosantos.dev</span>
            <span className="text-con-dim">{version}</span>
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-4 sm:gap-6">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="text-con-dim transition-colors hover:text-con-ink">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main id="main">
        <ConsoleHero blueprints={blueprints} readout={readout}>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-con-amber">
            Senior Software Engineer · {profile.location}
          </p>
          <h1 className="mt-5 font-inter text-[clamp(2.75rem,7vw,5.25rem)] font-semibold leading-[0.95] tracking-[-0.035em]">
            Pedro Santos
          </h1>
          <p className="mt-6 max-w-[44ch] text-[1.0625rem] leading-relaxed text-con-dim">
            I ship production React and GraphQL, build desktop apps with{" "}
            <span className="text-con-ink">Tauri v2 and Rust</span>, and run{" "}
            <a
              href={profile.founded.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-con-ink underline decoration-con-melro/60 underline-offset-4 hover:decoration-con-melro"
            >
              Melro.io
            </a>
            . I work with agents every day. The model drafts, I decide.
          </p>
          <div className="mt-9">
            <CommandBar />
          </div>
        </ConsoleHero>

        <section aria-labelledby="processes" className="border-b border-con-line">
          <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 md:py-24 lg:px-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-con-dim">ps aux</p>
                <h2 id="processes" className="mt-3 text-[clamp(1.75rem,3.4vw,2.5rem)] font-semibold tracking-[-0.025em]">
                  Running processes
                </h2>
              </div>
              <p className="max-w-[44ch] text-[0.95rem] leading-relaxed text-con-dim">
                Four things I do, each one live. Nothing on this page is a canned number.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-6">
              <MelroCard
                tagline={melro?.tagline ?? profile.founded.blurb}
                period={melro?.period ?? "2023 — present"}
                stack={melro?.stack ?? []}
                url={profile.founded.url}
                role={profile.founded.role}
              />
              <TauriCard />
              <AgentCard sessions={sessions} />
              <GraphqlCard />
            </div>
          </div>
        </section>

        <section aria-labelledby="stdout" className="border-b border-con-line">
          <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 md:py-20 lg:px-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-con-dim">stdout</p>
                <h2 id="stdout" className="mt-3 text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[-0.02em]">
                  The log
                </h2>
              </div>
              <Link
                href="/log"
                className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-con-dim hover:text-con-ink"
              >
                all {log.length} entries
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <ol className="mt-8 border-t border-con-line">
              {log.slice(0, 5).map((entry) => (
                <li key={entry.slug} className="border-b border-con-line">
                  <Link
                    href={`/log/${entry.slug}`}
                    className="group grid grid-cols-[88px_1fr] items-baseline gap-4 py-4 sm:grid-cols-[110px_1fr_auto]"
                  >
                    <time dateTime={entry.date} className="font-mono text-[11px] text-con-dim">
                      {formatDate(entry.date, { month: "short", day: "numeric", year: "numeric" })}
                    </time>
                    <span className="text-[1rem] text-con-ink transition-colors group-hover:text-con-amber">
                      {entry.title}
                    </span>
                    <span
                      className={`col-start-2 font-mono text-[10.5px] sm:col-start-auto ${entry.aiAssisted ? "text-con-ai" : "text-con-dim"}`}
                    >
                      {entry.aiAssisted ? "✦ co-written" : "✎ by hand"}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-4 py-10 font-mono text-[11px] text-con-dim sm:px-6 lg:px-10">
        <span>
          {profile.name} · {profile.location}
        </span>
        <span className="text-con-ai">✦ this page was drafted with Claude from my brief</span>
        <span className="flex gap-4">
          {profile.socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target={social.href.startsWith("http") ? "_blank" : undefined}
              rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="hover:text-con-ink"
            >
              {social.name.toLowerCase()}
            </a>
          ))}
        </span>
      </footer>
    </ConsoleProvider>
  );
}
