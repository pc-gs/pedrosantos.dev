import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import { Link } from "next-view-transitions";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { profile } from "@/content/profile";
import { getFeaturedProjects } from "@/content/projects";
import { nowItems, nowKindLabel, nowUpdated } from "@/content/now";
import { studies } from "@/content/studies";
import { getAllLogEntries } from "@/lib/log";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { LogEntry, Project } from "@/lib/types";
import { ProjectCover } from "@/components/covers/project-cover";
import { MacbookMockup } from "@/components/devices";
import { projectStatusMeta } from "@/components/sections/projects/project-status";
import "./noite.css";

export const metadata: Metadata = {
  title: "B · Estúdio à noite",
};

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
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
        "mx-auto w-full max-w-[1100px] px-5 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono text-[10.5px] uppercase tracking-[0.24em] text-[var(--nt-accent)]",
        className,
      )}
    >
      {children}
    </p>
  );
}

function Exhibit({
  project,
  index,
  device,
}: {
  project: Project;
  index: number;
  device?: boolean;
}) {
  const flip = index % 2 === 1;
  const media = device ? (
    <MacbookMockup>
      <ProjectCover
        slug={project.slug}
        title={project.title}
        corner={String(project.year)}
        className="[--cover-bg:#1b1915] [--cover-fg:var(--nt-accent)]"
      />
    </MacbookMockup>
  ) : (
    <div className="overflow-hidden rounded-xl border nt-rule">
      <div className="aspect-[16/10]">
        <ProjectCover
          slug={project.slug}
          title={project.title}
          corner={String(project.year)}
          className="[--cover-bg:#1b1915] [--cover-fg:var(--nt-accent)]"
        />
      </div>
    </div>
  );

  return (
    <article className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12">
      <div
        className={cn(
          "md:col-span-7",
          flip && "md:order-2",
        )}
      >
        {media}
      </div>
      <div className={cn("md:col-span-5", flip && "md:order-1")}>
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--nt-muted)]">
          Exhibit {String(index + 1).padStart(2, "0")} —{" "}
          {projectStatusMeta(project.status).label}
        </p>
        <h3 className="noite-display mt-3 text-[clamp(1.75rem,3.2vw,2.5rem)] leading-[1.05]">
          {project.title}
        </h3>
        <p className="mt-3 text-[1rem] leading-relaxed text-[var(--nt-muted)]">
          {project.tagline}
        </p>
        <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--nt-muted)]">
          {project.period} · {project.stack.join(" · ")}
        </p>
        <Link
          href={`/projects/${project.slug}`}
          className="group mt-5 inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--nt-accent)]"
        >
          Read the case study
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}

export default function NoitePage() {
  const allLog = getAllLogEntries();
  const log = allLog.slice(0, 4);
  const logBySlug = new Map(allLog.map((entry) => [entry.slug, entry]));
  const featured = getFeaturedProjects().slice(0, 3);
  const posts = getAllPosts().slice(0, 2);

  return (
    <div className={`${fraunces.variable} noite relative min-h-screen`}>
      <div aria-hidden className="nt-grain" />

      <div className="relative z-10">
        {/* ── bar ───────────────────────────────────────────────────── */}
        <header>
          <Wrap className="flex items-center justify-between gap-4 py-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em]">
              Pedro Santos
            </p>
            <nav className="hidden items-center gap-7 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--nt-muted)] md:flex">
              <a href="#work" className="transition-colors hover:text-[var(--nt-accent)]">
                Work
              </a>
              <a href="#studies" className="transition-colors hover:text-[var(--nt-accent)]">
                Studies
              </a>
              <a href="#notes" className="transition-colors hover:text-[var(--nt-accent)]">
                Log
              </a>
              <a href="#essays" className="transition-colors hover:text-[var(--nt-accent)]">
                Essays
              </a>
              <a href="#contact" className="transition-colors hover:text-[var(--nt-accent)]">
                Contact
              </a>
            </nav>
            {profile.availability.open && (
              <span className="nt-pill inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--nt-accent)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--nt-accent)]" />
                open to work
              </span>
            )}
          </Wrap>
        </header>

        <main>
          {/* ── hero ────────────────────────────────────────────────── */}
          <section className="nt-spotlight border-b nt-rule">
            <Wrap className="pb-24 pt-20 text-center md:pb-32 md:pt-28">
              <Eyebrow>
                {profile.role} — {profile.location}
              </Eyebrow>
              <h1 className="noite-display mx-auto mt-6 max-w-[18ch] text-[clamp(3rem,8.5vw,6.5rem)] leading-[0.95]">
                Pedro Santos
              </h1>
              <p className="mx-auto mt-6 max-w-[56ch] text-[1.125rem] leading-relaxed text-[var(--nt-muted)]">
                {profile.tagline}
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#work"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--nt-accent)] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[#1a1509] transition-opacity hover:opacity-90"
                >
                  See the work
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href="/log"
                  className="inline-flex items-center gap-2 rounded-full border nt-rule px-6 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--nt-ink)] transition-colors hover:border-[var(--nt-accent)] hover:text-[var(--nt-accent)]"
                >
                  Read the log
                </Link>
              </div>
              <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--nt-muted)]">
                {profile.stack.join("  ·  ")}
              </p>
            </Wrap>
          </section>

          {/* ── work ────────────────────────────────────────────────── */}
          <section id="work" className="border-b nt-rule">
            <Wrap className="py-20 md:py-28">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <Eyebrow>Selected work</Eyebrow>
                  <h2 className="noite-display mt-3 text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.05]">
                    Built, shipped, and written up
                  </h2>
                </div>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--nt-muted)] transition-colors hover:text-[var(--nt-accent)]"
                >
                  all work
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="mt-16 space-y-24 md:space-y-32">
                {featured.map((project, index) => (
                  <Exhibit
                    key={project.slug}
                    project={project}
                    index={index}
                    device={index === 0}
                  />
                ))}
              </div>
            </Wrap>
          </section>

          {/* ── in the studio ───────────────────────────────────────── */}
          <section className="border-b nt-rule">
            <Wrap className="py-20 md:py-24">
              <Eyebrow>In the studio</Eyebrow>
              <h2 className="noite-display mt-3 text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.05]">
                What I&apos;m doing right now
              </h2>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--nt-muted)]">
                updated {formatDate(nowUpdated, MONTH)}
              </p>
              <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
                {nowItems.map((item) => (
                  <div
                    key={item.id}
                    className="border-t nt-rule pt-4"
                  >
                    <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-[var(--nt-accent)]">
                      {nowKindLabel[item.kind]}
                    </p>
                    <p className="mt-2 text-[0.975rem] leading-relaxed text-[var(--nt-ink)]/90">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </Wrap>
          </section>

          {/* ── studies ─────────────────────────────────────────────── */}
          <section id="studies" className="border-b nt-rule">
            <Wrap className="py-20 md:py-28">
              <Eyebrow>The study wall</Eyebrow>
              <h2 className="noite-display mt-3 text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.05]">
                What I&apos;m studying right now
              </h2>
              <p className="mt-3 max-w-[56ch] text-[1rem] leading-relaxed text-[var(--nt-muted)]">
                A track is a thread I&apos;m pulling on — with the notes that
                show the actual work.
              </p>

              <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
                {studies.map((study) => {
                  const linked = study.logSlugs
                    .map((slug) => logBySlug.get(slug))
                    .filter((entry): entry is LogEntry => Boolean(entry));
                  return (
                    <article
                      key={study.id}
                      className="nt-panel rounded-xl border nt-rule p-7"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-[var(--nt-accent)]">
                          {study.state}
                        </span>
                        <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-[var(--nt-muted)]">
                          since {study.since}
                        </span>
                      </div>
                      <h3 className="noite-display mt-4 text-[1.5rem] leading-snug">
                        {study.title}
                      </h3>
                      <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--nt-muted)]">
                        {study.why}
                      </p>
                      <ul className="mt-6 space-y-2.5 border-t nt-rule pt-5">
                        {linked.map((entry) => (
                          <li key={entry.slug}>
                            <Link
                              href={`/log/${entry.slug}`}
                              className="group flex items-baseline justify-between gap-4 text-[0.9rem]"
                            >
                              <span className="leading-snug transition-colors group-hover:text-[var(--nt-accent)]">
                                {entry.title}
                              </span>
                              <span className="shrink-0 font-mono text-[9.5px] uppercase tracking-[0.14em] text-[var(--nt-muted)]">
                                {formatDate(entry.date, DATE)}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </article>
                  );
                })}
              </div>
            </Wrap>
          </section>

          {/* ── log ─────────────────────────────────────────────────── */}
          <section id="notes" className="border-b nt-rule">
            <Wrap className="py-20 md:py-24">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <Eyebrow>The log</Eyebrow>
                  <h2 className="noite-display mt-3 text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.05]">
                    Short notes, written in the week
                  </h2>
                </div>
                <Link
                  href="/log"
                  className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--nt-muted)] transition-colors hover:text-[var(--nt-accent)]"
                >
                  all {allLog.length} entries
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <ol className="mt-8">
                {log.map((entry) => (
                  <li key={entry.slug} className="border-b nt-rule last:border-0">
                    <Link
                      href={`/log/${entry.slug}`}
                      className="group grid grid-cols-1 items-baseline gap-x-6 gap-y-2 py-5 sm:grid-cols-[7rem_minmax(0,1fr)_auto]"
                    >
                      <time
                        dateTime={entry.date}
                        className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--nt-muted)]"
                      >
                        {formatDate(entry.date, DATE)}
                      </time>
                      <span className="noite-display text-[1.25rem] leading-snug transition-colors group-hover:text-[var(--nt-accent)]">
                        {entry.title}
                      </span>
                      <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-[var(--nt-muted)]">
                        {entry.aiAssisted
                          ? `✦ co-written${entry.model ? ` · ${entry.model}` : ""}`
                          : "✎ by hand"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </Wrap>
          </section>

          {/* ── essays ──────────────────────────────────────────────── */}
          <section id="essays" className="border-b nt-rule">
            <Wrap className="py-20 md:py-24">
              <Eyebrow>Essays</Eyebrow>
              <h2 className="noite-display mt-3 text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.05]">
                Longer thinking, co-written honestly
              </h2>
              <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="nt-panel group rounded-xl border nt-rule p-7 transition-colors hover:border-[var(--nt-accent)]"
                  >
                    <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-[var(--nt-muted)]">
                      {formatDate(post.date, MONTH)}
                      {post.readingTime ? ` · ${post.readingTime}` : ""}
                    </p>
                    <h3 className="noite-display mt-3 text-[1.5rem] leading-snug transition-colors group-hover:text-[var(--nt-accent)]">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--nt-muted)]">
                      {post.description}
                    </p>
                    {post.coWritten && (
                      <p className="mt-4 font-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--nt-accent)]">
                        ✦ co-written
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </Wrap>
          </section>
        </main>

        {/* ── contact ─────────────────────────────────────────────── */}
        <footer id="contact" className="nt-spotlight">
          <Wrap className="pb-16 pt-24 text-center md:pb-20 md:pt-32">
            <Eyebrow>Contact</Eyebrow>
            <h2 className="noite-display mx-auto mt-4 max-w-[14ch] text-[clamp(2.75rem,7vw,5rem)] leading-[0.98]">
              Let&apos;s talk.
            </h2>
            <p className="mx-auto mt-5 max-w-[48ch] text-[1rem] leading-relaxed text-[var(--nt-muted)]">
              {profile.availability.note}
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--nt-accent)] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[#1a1509] transition-opacity hover:opacity-90"
              >
                Start a conversation
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`mailto:${profile.email}`}
                className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--nt-muted)] transition-colors hover:text-[var(--nt-accent)]"
              >
                {profile.email}
              </a>
            </div>
            <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t nt-rule pt-6 font-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--nt-muted)]">
              <span>© 2026 Pedro Santos</span>
              <span className="flex items-center gap-5">
                <a href="/log/feed.xml" className="hover:text-[var(--nt-accent)]">
                  log feed
                </a>
                <a href="/rss.xml" className="hover:text-[var(--nt-accent)]">
                  writing feed
                </a>
              </span>
            </div>
          </Wrap>
        </footer>
      </div>
    </div>
  );
}
