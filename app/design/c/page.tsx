import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { Link } from "next-view-transitions";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/content/profile";
import { getFeaturedProjects } from "@/content/projects";
import { nowItems, nowUpdated } from "@/content/now";
import { studies } from "@/content/studies";
import { getAllLogEntries } from "@/lib/log";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { LogEntry } from "@/lib/types";
import { ProjectCover } from "@/components/covers/project-cover";
import { projectStatusMeta } from "@/components/sections/projects/project-status";
import "./planta.css";

export const metadata: Metadata = {
  title: "C · Planta",
};

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const MONTH: Intl.DateTimeFormatOptions = { month: "short", year: "numeric" };
const DATE: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };

function Wrap({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1120px] px-5 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Cell({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-b border-r pl-rule p-4", className)}>
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--pl-muted)]">
        {label}
      </p>
      <p className="mt-1 text-[0.9375rem] leading-snug">{value}</p>
    </div>
  );
}

/** The hero drawing: one central node, five destinations. */
function SiteMap() {
  const nodes: { id: string; label: string; href: string; x: number; y: number }[] = [
    { id: "work", label: "WORK", href: "#work", x: 56, y: 64 },
    { id: "studies", label: "STUDIES", href: "#studies", x: 344, y: 72 },
    { id: "log", label: "LOG", href: "#notes", x: 64, y: 258 },
    { id: "essays", label: "ESSAYS", href: "#essays", x: 340, y: 250 },
    { id: "contact", label: "CONTACT", href: "#contact", x: 200, y: 292 },
  ];
  const cx = 200;
  const cy = 166;

  return (
    <svg
      viewBox="0 0 400 330"
      role="img"
      aria-label="Site map: work, studies, log, essays and contact, connected to Pedro"
      className="h-auto w-full"
    >
      {/* frame crosses */}
      {[
        [12, 12],
        [388, 12],
        [12, 318],
        [388, 318],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`} stroke="var(--pl-line)" strokeWidth="1">
          <line x1={x - 5} y1={y} x2={x + 5} y2={y} />
          <line x1={x} y1={y - 5} x2={x} y2={y + 5} />
        </g>
      ))}

      {/* connectors */}
      {nodes.map((node) => (
        <line
          key={`line-${node.id}`}
          x1={cx}
          y1={cy}
          x2={node.x}
          y2={node.y}
          stroke="var(--pl-line)"
          strokeWidth="1"
          className="pl-draw"
        />
      ))}

      {/* center */}
      <circle cx={cx} cy={cy} r="9" fill="var(--pl-ink)" />
      <text
        x={cx}
        y={cy + 26}
        textAnchor="middle"
        fontSize="10"
        letterSpacing="2"
        fill="var(--pl-ink)"
        fontFamily="var(--font-plex-mono), monospace"
      >
        PEDRO
      </text>

      {/* destinations */}
      {nodes.map((node) => (
        <a key={node.id} href={node.href} className="pl-node">
          <circle
            cx={node.x}
            cy={node.y}
            r="6"
            fill="var(--pl-bg)"
            stroke="var(--pl-ink)"
            strokeWidth="1.5"
          />
          <text
            x={node.x}
            y={node.y + (node.y > cy ? 24 : -14)}
            textAnchor="middle"
            fontSize="9.5"
            letterSpacing="1.6"
            fill="var(--pl-muted)"
            fontFamily="var(--font-plex-mono), monospace"
          >
            {node.label}
          </text>
        </a>
      ))}
    </svg>
  );
}

export default function PlantaPage() {
  const allLog = getAllLogEntries();
  const log = allLog.slice(0, 4);
  const logBySlug = new Map(allLog.map((entry) => [entry.slug, entry]));
  const featured = getFeaturedProjects();
  const posts = getAllPosts().slice(0, 2);

  return (
    <div className={`${plexSans.variable} ${plexMono.variable} planta min-h-screen`}>
      <div className="pl-grid min-h-screen">
        {/* ── title strip ───────────────────────────────────────────── */}
        <header className="border-b pl-rule bg-[var(--pl-bg)]">
          <Wrap className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em]">
              Pedro Santos — Software Engineer
            </p>
            <nav className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pl-muted)]">
              <a href="#work" className="hover:text-[var(--pl-signal)]">
                02 Work
              </a>
              <a href="#studies" className="hover:text-[var(--pl-signal)]">
                03 Studies
              </a>
              <a href="#notes" className="hover:text-[var(--pl-signal)]">
                04 Log
              </a>
              <a href="#essays" className="hover:text-[var(--pl-signal)]">
                05 Writing
              </a>
              <a href="#contact" className="hover:text-[var(--pl-signal)]">
                06 Contact
              </a>
            </nav>
          </Wrap>
        </header>

        <main>
          {/* ── hero drawing ────────────────────────────────────────── */}
          <section className="border-b pl-rule">
            <Wrap className="grid grid-cols-1 items-center gap-12 py-16 md:py-20 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--pl-signal)]">
                  Drawing 00 — Site index
                </p>
                <h1 className="planta-display mt-4 text-[clamp(2.75rem,6.5vw,5rem)] leading-[0.98]">
                  Pedro Santos
                </h1>
                <p className="mt-5 max-w-[52ch] text-[1.0625rem] leading-relaxed text-[var(--pl-muted)]">
                  {profile.tagline}
                </p>
                <p className="mt-4 max-w-[52ch] text-[0.95rem] leading-relaxed text-[var(--pl-muted)]">
                  {profile.availability.note}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="#work"
                    className="inline-flex items-center gap-2 border border-[var(--pl-ink)] bg-[var(--pl-ink)] px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--pl-panel)] transition-colors hover:bg-[var(--pl-signal)] hover:border-[var(--pl-signal)]"
                  >
                    See the work
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                  <Link
                    href="/contact"
                    className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--pl-blue)] underline decoration-[var(--pl-line)] underline-offset-4 hover:decoration-[var(--pl-blue)]"
                  >
                    Start a conversation
                  </Link>
                </div>
                <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pl-muted)]">
                  {profile.stack.join("  ·  ")}
                </p>
              </div>
              <div className="border border-[var(--pl-line)] bg-[var(--pl-panel)] p-4">
                <div className="flex items-center justify-between border-b border-[var(--pl-line)] pb-2 font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--pl-muted)]">
                  <span>Fig. 00 — Site map</span>
                  <span>Scale 1:1</span>
                </div>
                <div className="pt-4">
                  <SiteMap />
                </div>
              </div>
            </Wrap>
          </section>

          {/* ── status board ────────────────────────────────────────── */}
          <section id="status" className="border-b pl-rule">
            <Wrap className="py-12 md:py-16">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--pl-signal)]">
                  Sheet 01 — Status
                </p>
                <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-[var(--pl-muted)]">
                  updated {formatDate(nowUpdated, MONTH)}
                </p>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-px border border-[var(--pl-line)] bg-[var(--pl-line)] md:grid-cols-2">
                {nowItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[var(--pl-panel)] p-4 md:last:col-span-2"
                  >
                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--pl-signal)]">
                      {item.kind}
                    </p>
                    <p className="mt-1.5 text-[0.925rem] leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </Wrap>
          </section>

          {/* ── work index ──────────────────────────────────────────── */}
          <section id="work" className="border-b pl-rule">
            <Wrap className="py-16 md:py-20">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--pl-signal)]">
                    Sheet 02 — Work
                  </p>
                  <h2 className="planta-display mt-3 text-[clamp(1.75rem,3.2vw,2.5rem)] leading-tight">
                    Project index
                  </h2>
                </div>
                <Link
                  href="/projects"
                  className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--pl-muted)] hover:text-[var(--pl-signal)]"
                >
                  full index →
                </Link>
              </div>

              <div className="mt-10 overflow-x-auto border border-[var(--pl-line)] bg-[var(--pl-panel)]">
                <table className="w-full min-w-[640px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[var(--pl-line)] font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--pl-muted)]">
                      <th scope="col" className="px-4 py-3 font-normal">
                        Ref
                      </th>
                      <th scope="col" className="px-4 py-3 font-normal">
                        Project
                      </th>
                      <th scope="col" className="px-4 py-3 font-normal">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3 font-normal">
                        Period
                      </th>
                      <th scope="col" className="px-4 py-3 font-normal">
                        Stack
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {featured.map((project, index) => (
                      <tr
                        key={project.slug}
                        className="pl-row border-b border-[var(--pl-line)] last:border-0"
                      >
                        <td className="px-4 py-4 font-mono text-[10px] tracking-[0.16em] text-[var(--pl-muted)]">
                          P-{String(index + 1).padStart(2, "0")}
                        </td>
                        <td className="px-4 py-4">
                          <Link
                            href={`/projects/${project.slug}`}
                            className="planta-display text-[1.0625rem] hover:text-[var(--pl-signal)]"
                          >
                            {project.title}
                          </Link>
                          <p className="mt-0.5 text-[0.875rem] text-[var(--pl-muted)]">
                            {project.tagline}
                          </p>
                        </td>
                        <td className="px-4 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--pl-signal)]">
                          {projectStatusMeta(project.status).label}
                        </td>
                        <td className="px-4 py-4 font-mono text-[10px] tracking-[0.12em] text-[var(--pl-muted)]">
                          {project.period}
                        </td>
                        <td className="px-4 py-4 font-mono text-[10px] tracking-[0.12em] text-[var(--pl-muted)]">
                          {project.stack.join(" / ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* detail drawing of the lead project */}
              {featured[0] && (
                <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-[1.1fr_0.9fr]">
                  <figure className="border border-[var(--pl-line)] bg-[var(--pl-panel)] p-3">
                    <div className="aspect-[16/10] border border-[var(--pl-line)]">
                      <ProjectCover
                        slug={featured[0].slug}
                        title={featured[0].title}
                        corner={`P-01 · ${featured[0].year}`}
                        className="[--cover-bg:var(--pl-ink)] [--cover-fg:var(--pl-signal)]"
                      />
                    </div>
                    <figcaption className="mt-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--pl-muted)]">
                      <span>Fig. 01 — {featured[0].title}</span>
                      <span>Detail</span>
                    </figcaption>
                  </figure>
                  <div className="border border-[var(--pl-line)] bg-[var(--pl-panel)]">
                    <Cell label="Reference" value={`P-01 · ${featured[0].slug}`} />
                    <Cell label="Scope" value={featured[0].role} />
                    <Cell label="Stack" value={featured[0].stack.join(" / ")} />
                    <Cell
                      label="Summary"
                      value={featured[0].caseStudy.tldr}
                      className="border-r-0 border-b-0"
                    />
                  </div>
                </div>
              )}
            </Wrap>
          </section>

          {/* ── studies tracks ──────────────────────────────────────── */}
          <section id="studies" className="border-b pl-rule">
            <Wrap className="py-16 md:py-20">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--pl-signal)]">
                Sheet 03 — Studies
              </p>
              <h2 className="planta-display mt-3 text-[clamp(1.75rem,3.2vw,2.5rem)] leading-tight">
                Active study tracks
              </h2>
              <p className="mt-2 max-w-[58ch] text-[0.95rem] text-[var(--pl-muted)]">
                Each track lists the log entries where the work actually
                happened. Nodes are dated; the line keeps moving.
              </p>

              <div className="mt-10 space-y-8">
                {studies.map((study) => {
                  const linked = study.logSlugs
                    .map((slug) => logBySlug.get(slug))
                    .filter((entry): entry is LogEntry => Boolean(entry));
                  return (
                    <article
                      key={study.id}
                      className="border border-[var(--pl-line)] bg-[var(--pl-panel)] p-5 md:p-6"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                        <h3 className="planta-display text-[1.25rem]">
                          {study.title}
                        </h3>
                        <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-[var(--pl-muted)]">
                          <span className="text-[var(--pl-signal)]">
                            {study.state}
                          </span>{" "}
                          · since {study.since}
                        </p>
                      </div>
                      <p className="mt-2 max-w-[70ch] text-[0.9rem] leading-relaxed text-[var(--pl-muted)]">
                        {study.why}
                      </p>
                      <ol className="relative mt-6 flex flex-col gap-3 border-l border-[var(--pl-line)] pl-5 sm:flex-row sm:gap-8 sm:border-l-0 sm:border-t sm:pl-0 sm:pt-5">
                        {linked.map((entry) => (
                          <li key={entry.slug} className="relative sm:pt-0">
                            <span
                              aria-hidden
                              className="absolute -left-[23px] top-1.5 h-2 w-2 rounded-full border border-[var(--pl-ink)] bg-[var(--pl-bg)] sm:-top-[25px] sm:left-0"
                            />
                            <Link
                              href={`/log/${entry.slug}`}
                              className="group block max-w-[36ch]"
                            >
                              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--pl-muted)]">
                                {formatDate(entry.date, DATE)}
                              </span>
                              <span className="mt-0.5 block text-[0.9rem] leading-snug group-hover:text-[var(--pl-signal)]">
                                {entry.title}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ol>
                    </article>
                  );
                })}
              </div>
            </Wrap>
          </section>

          {/* ── log timeline ────────────────────────────────────────── */}
          <section id="notes" className="border-b pl-rule">
            <Wrap className="py-16 md:py-20">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--pl-signal)]">
                    Sheet 04 — Log
                  </p>
                  <h2 className="planta-display mt-3 text-[clamp(1.75rem,3.2vw,2.5rem)] leading-tight">
                    Field notes
                  </h2>
                </div>
                <Link
                  href="/log"
                  className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--pl-muted)] hover:text-[var(--pl-signal)]"
                >
                  all {allLog.length} entries →
                </Link>
              </div>

              <ol className="relative mt-10 border-l border-[var(--pl-line)] pl-6">
                {log.map((entry) => (
                  <li key={entry.slug} className="relative pb-6 last:pb-0">
                    <span
                      aria-hidden
                      className="absolute -left-[28px] top-1.5 h-2 w-2 rounded-full border border-[var(--pl-ink)] bg-[var(--pl-bg)]"
                    />
                    <Link href={`/log/${entry.slug}`} className="group block">
                      <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-[var(--pl-muted)]">
                        {formatDate(entry.date, DATE)} ·{" "}
                        {entry.aiAssisted
                          ? `✦ co-written${entry.model ? ` / ${entry.model}` : ""}`
                          : "✎ by hand"}
                      </p>
                      <p className="mt-1 text-[1.0625rem] leading-snug group-hover:text-[var(--pl-signal)]">
                        {entry.title}
                      </p>
                    </Link>
                  </li>
                ))}
              </ol>
            </Wrap>
          </section>

          {/* ── essays ──────────────────────────────────────────────── */}
          <section id="essays" className="border-b pl-rule">
            <Wrap className="py-16 md:py-20">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--pl-signal)]">
                Sheet 05 — Writing
              </p>
              <h2 className="planta-display mt-3 text-[clamp(1.75rem,3.2vw,2.5rem)] leading-tight">
                Essays
              </h2>
              <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                {posts.map((post, index) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group border border-[var(--pl-line)] bg-[var(--pl-panel)] p-6 transition-colors hover:border-[var(--pl-signal)]"
                  >
                    <p className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-[var(--pl-muted)]">
                      Doc {String(index + 1).padStart(2, "0")} ·{" "}
                      {formatDate(post.date, MONTH)}
                      {post.readingTime ? ` · ${post.readingTime}` : ""}
                    </p>
                    <h3 className="planta-display mt-3 text-[1.375rem] leading-snug group-hover:text-[var(--pl-signal)]">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-[0.925rem] leading-relaxed text-[var(--pl-muted)]">
                      {post.description}
                    </p>
                  </Link>
                ))}
              </div>
            </Wrap>
          </section>
        </main>

        {/* ── title block ───────────────────────────────────────────── */}
        <footer id="contact" className="border-t pl-rule bg-[var(--pl-panel)]">
          <Wrap className="py-16 md:py-20">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--pl-signal)]">
              Sheet 06 — Contact
            </p>
            <h2 className="planta-display mt-3 text-[clamp(2.25rem,5.5vw,4rem)] leading-[0.98]">
              Let&apos;s talk.
            </h2>
            <p className="mt-4 max-w-[52ch] text-[1rem] leading-relaxed text-[var(--pl-muted)]">
              {profile.availability.note}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-[var(--pl-ink)] bg-[var(--pl-ink)] px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--pl-panel)] transition-colors hover:border-[var(--pl-signal)] hover:bg-[var(--pl-signal)]"
              >
                Start a conversation
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a
                href={`mailto:${profile.email}`}
                className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--pl-blue)] underline decoration-[var(--pl-line)] underline-offset-4 hover:decoration-[var(--pl-blue)]"
              >
                {profile.email}
              </a>
            </div>

            <div className="mt-14 border border-[var(--pl-line)] bg-[var(--pl-bg)]">
              <div className="grid grid-cols-2 md:grid-cols-4">
                <Cell label="Project" value="pedrosantos.dev" />
                <Cell label="Drawn by" value="Pedro Santos" />
                <Cell label="Date" value={formatDate(nowUpdated, MONTH)} />
                <Cell label="Scale" value="1:1" className="border-r-0" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--pl-muted)]">
                <span>© 2026 Pedro Santos</span>
                <span className="flex items-center gap-5">
                  <a href="/log/feed.xml" className="hover:text-[var(--pl-signal)]">
                    log feed
                  </a>
                  <a href="/rss.xml" className="hover:text-[var(--pl-signal)]">
                    writing feed
                  </a>
                </span>
              </div>
            </div>
          </Wrap>
        </footer>
      </div>
    </div>
  );
}
