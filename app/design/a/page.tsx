import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { Link } from "next-view-transitions";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { profile } from "@/content/profile";
import { getFeaturedProjects } from "@/content/projects";
import { nowItems, nowKindLabel, nowUpdated } from "@/content/now";
import { studies } from "@/content/studies";
import { getAllLogEntries } from "@/lib/log";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { LogEntry, Project, Study } from "@/lib/types";
import { ProjectCover } from "@/components/covers/project-cover";
import { projectStatusMeta } from "@/components/sections/projects/project-status";
import "./bancada.css";

export const metadata: Metadata = {
  title: "A · Bancada",
};

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const DATE: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
const MONTH: Intl.DateTimeFormatOptions = { month: "short", year: "numeric" };

const STUDY_STATE_CLASS: Record<Study["state"], string> = {
  applying: "bg-[var(--bk-accent)] text-[var(--bk-bg)] border-[var(--bk-ink)]",
  learning: "bg-[var(--bk-ink)] text-[var(--bk-bg)] border-[var(--bk-ink)]",
  exploring: "bg-transparent text-[var(--bk-blue)] border-[var(--bk-blue)]",
};

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
        "mx-auto w-full max-w-[1180px] px-5 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--bk-muted)]">
      {children}
    </p>
  );
}

/** Flat browser frame. The web-native counterpart of a device mockup. */
function Screen({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-[var(--bk-ink)]", className)}>
      <div className="flex items-center gap-1.5 border-b border-[var(--bk-ink)] bg-[var(--bk-panel)] px-3 py-2">
        <span className="h-2 w-2 rounded-full border border-[var(--bk-ink)] bg-[var(--bk-accent)]" />
        <span className="h-2 w-2 rounded-full border border-[var(--bk-ink)]" />
        <span className="h-2 w-2 rounded-full border border-[var(--bk-ink)]" />
        <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--bk-muted)]">
          {label}
        </span>
      </div>
      <div className="aspect-[16/10]">{children}</div>
    </div>
  );
}

function NowLink({ href }: { href: string }) {
  const className =
    "mt-1.5 inline-flex items-center gap-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-[var(--bk-accent)]";
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        read more
        <ArrowUpRight className="h-3 w-3" />
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      visit
      <ArrowUpRight className="h-3 w-3" />
    </a>
  );
}

function WorkCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col border border-[var(--bk-line)] bg-[var(--bk-panel)] transition-colors hover:border-[var(--bk-ink)]"
    >
      <Screen label={project.slug} className="border-b">
        <ProjectCover
          slug={project.slug}
          title={project.title}
          corner={String(project.year)}
          className="[--cover-bg:var(--bk-panel)] [--cover-fg:var(--bk-ink)]"
        />
      </Screen>
      <div className="flex flex-1 flex-col p-4">
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--bk-muted)]">
          <span>{project.period}</span>
          <span className="text-[var(--bk-accent)]">
            {projectStatusMeta(project.status).label}
          </span>
        </p>
        <h3 className="bancada-display mt-2 text-[1.25rem] leading-tight tracking-[-0.01em] transition-colors group-hover:text-[var(--bk-accent)]">
          {project.title}
        </h3>
        <p className="mt-1.5 text-[0.875rem] leading-relaxed text-[var(--bk-muted)]">
          {project.tagline}
        </p>
      </div>
    </Link>
  );
}

export default function BancadaPage() {
  const allLog = getAllLogEntries();
  const log = allLog.slice(0, 4);
  const logBySlug = new Map(allLog.map((entry) => [entry.slug, entry]));
  const featured = getFeaturedProjects().slice(0, 3);
  const posts = getAllPosts().slice(0, 2);

  return (
    <div className={`${bricolage.variable} bancada min-h-screen`}>
      {/* ── bar ─────────────────────────────────────────────────────── */}
      <header className="border-b border-[var(--bk-line)]">
        <Wrap className="flex items-center justify-between gap-4 py-4">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em]">
            Pedro Santos<span className="text-[var(--bk-accent)]">.</span>dev
          </p>
          <nav className="hidden items-center gap-6 font-mono text-[10.5px] uppercase tracking-[0.18em] md:flex">
            <a href="#studies" className="hover:text-[var(--bk-accent)]">
              Studies
            </a>
            <a href="#notes" className="hover:text-[var(--bk-accent)]">
              Log
            </a>
            <a href="#essays" className="hover:text-[var(--bk-accent)]">
              Essays
            </a>
            <a href="#work" className="hover:text-[var(--bk-accent)]">
              Work
            </a>
            <a href="#contact" className="hover:text-[var(--bk-accent)]">
              Contact
            </a>
          </nav>
          {profile.availability.open && (
            <span className="inline-flex items-center gap-2 border border-[var(--bk-line)] px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--bk-muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--bk-accent)]" />
              open to work
            </span>
          )}
        </Wrap>
      </header>

      <main>
        {/* ── hero ──────────────────────────────────────────────────── */}
        <Wrap className="pb-16 pt-14 md:pb-20 md:pt-20">
          <Eyebrow>
            {profile.role} · {profile.location}
          </Eyebrow>
          <h1 className="bancada-display mt-6 max-w-[16ch] text-[clamp(2.75rem,8vw,6rem)] leading-[0.93] tracking-[-0.025em]">
            Hi, I&apos;m Pedro.
            <br />
            <span className="text-[var(--bk-accent)]">
              I build software for the web.
            </span>
          </h1>
          <p className="mt-8 max-w-[58ch] text-[1.0625rem] leading-relaxed text-[var(--bk-muted)]">
            Software engineer from Belmonte, Portugal, with more than a decade
            in tech. By day I ship production React and GraphQL at Aubay. On
            the side I&apos;m building{" "}
            <a
              href={profile.founded.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-inline"
            >
              Melro.io
            </a>
            , a small company that writes software for local businesses.
          </p>
          <p className="mt-4 max-w-[58ch] text-[1.0625rem] leading-relaxed text-[var(--bk-muted)]">
            This site is where I write down what I&apos;m working on and what I
            learn while doing it.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href="#studies"
              className="inline-flex items-center gap-2 border border-[var(--bk-ink)] bg-[var(--bk-ink)] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--bk-bg)] transition-colors hover:border-[var(--bk-accent)] hover:bg-[var(--bk-accent)]"
            >
              What I&apos;m studying
              <ArrowDownRight className="h-4 w-4" />
            </a>
            <a
              href="#notes"
              className="inline-flex items-center gap-2 border-b border-[var(--bk-line)] pb-1 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors hover:border-[var(--bk-accent)] hover:text-[var(--bk-accent)]"
            >
              Read the log
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <p className="mt-10 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--bk-muted)]">
            {profile.stack.join("  ·  ")}
          </p>
        </Wrap>

        {/* ── working on now ────────────────────────────────────────── */}
        <section className="border-y border-[var(--bk-line)] bg-[var(--bk-panel)]">
          <Wrap className="py-8 md:py-10">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em]">
                Working on now
              </p>
              <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-[var(--bk-muted)]">
                updated {formatDate(nowUpdated, MONTH)}
              </p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              {nowItems.slice(0, 4).map((item) => (
                <div key={item.id} className="border-t border-[var(--bk-line)] pt-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--bk-accent)]">
                    {nowKindLabel[item.kind]}
                  </p>
                  <p className="mt-1.5 text-[0.875rem] leading-snug">
                    {item.text}
                  </p>
                  {item.href && <NowLink href={item.href} />}
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ── studies ───────────────────────────────────────────────── */}
        <section id="studies" className="border-b border-[var(--bk-line)]">
          <Wrap className="py-16 md:py-24">
            <div className="border-b border-[var(--bk-line)] pb-4">
              <Eyebrow>01 · On the bench</Eyebrow>
              <h2 className="bancada-display mt-2 text-[clamp(1.75rem,3.4vw,2.75rem)] leading-tight tracking-[-0.015em]">
                What I&apos;m studying right now
              </h2>
              <p className="mt-2 max-w-[58ch] text-[0.95rem] leading-relaxed text-[var(--bk-muted)]">
                A track is something I&apos;m actively learning, with the notes
                that show the actual work. No progress bars.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              {studies.map((study) => {
                const linked = study.logSlugs
                  .map((slug) => logBySlug.get(slug))
                  .filter((entry): entry is LogEntry => Boolean(entry));
                return (
                  <article
                    key={study.id}
                    className="flex flex-col border border-[var(--bk-line)] bg-[var(--bk-panel)] p-6"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span
                        className={cn(
                          "border px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.18em]",
                          STUDY_STATE_CLASS[study.state],
                        )}
                      >
                        {study.state}
                      </span>
                      <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-[var(--bk-muted)]">
                        since {study.since}
                      </span>
                    </div>
                    <h3 className="bancada-display mt-4 text-[1.375rem] leading-snug tracking-[-0.01em]">
                      {study.title}
                    </h3>
                    <p className="mt-2 text-[0.9rem] leading-relaxed text-[var(--bk-muted)]">
                      {study.why}
                    </p>
                    <ul className="mt-5 space-y-2 border-t border-[var(--bk-line)] pt-4">
                      {linked.map((entry) => (
                        <li key={entry.slug}>
                          <Link
                            href={`/log/${entry.slug}`}
                            className="group flex items-baseline justify-between gap-4"
                          >
                            <span className="text-[0.875rem] leading-snug transition-colors group-hover:text-[var(--bk-accent)]">
                              {entry.title}
                            </span>
                            <span className="shrink-0 font-mono text-[9.5px] uppercase tracking-[0.14em] text-[var(--bk-muted)]">
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

        {/* ── log ───────────────────────────────────────────────────── */}
        <section id="notes" className="border-b border-[var(--bk-line)]">
          <Wrap className="py-16 md:py-24">
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--bk-line)] pb-4">
              <div>
                <Eyebrow>02 · The log</Eyebrow>
                <h2 className="bancada-display mt-2 text-[clamp(1.75rem,3.4vw,2.75rem)] leading-tight tracking-[-0.015em]">
                  Short notes, written the week I learn something
                </h2>
              </div>
              <Link
                href="/log"
                className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] hover:text-[var(--bk-accent)]"
              >
                all {allLog.length} entries
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <ol className="mt-4">
              {log.map((entry) => (
                <li
                  key={entry.slug}
                  className="border-b border-[var(--bk-line)] last:border-0"
                >
                  <Link
                    href={`/log/${entry.slug}`}
                    className="group grid grid-cols-1 items-baseline gap-x-6 gap-y-1 py-4 sm:grid-cols-[6rem_minmax(0,1fr)_auto]"
                  >
                    <time
                      dateTime={entry.date}
                      className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--bk-muted)]"
                    >
                      {formatDate(entry.date, DATE)}
                    </time>
                    <span className="bancada-display text-[1.25rem] leading-snug tracking-[-0.01em] transition-colors group-hover:text-[var(--bk-accent)]">
                      {entry.title}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--bk-muted)]">
                      {entry.aiAssisted ? "✦ co-written" : "✎ by hand"}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </Wrap>
        </section>

        {/* ── essays ────────────────────────────────────────────────── */}
        <section id="essays" className="border-b border-[var(--bk-line)]">
          <Wrap className="py-16 md:py-24">
            <div className="border-b border-[var(--bk-line)] pb-4">
              <Eyebrow>03 · Essays</Eyebrow>
              <h2 className="bancada-display mt-2 text-[clamp(1.75rem,3.4vw,2.75rem)] leading-tight tracking-[-0.015em]">
                Longer thinking, written in the open
              </h2>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
              {posts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group border border-[var(--bk-line)] bg-[var(--bk-panel)] p-6 transition-colors hover:border-[var(--bk-ink)]"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--bk-accent)]">
                    Essay {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="bancada-display mt-3 text-[1.5rem] leading-tight tracking-[-0.01em] transition-colors group-hover:text-[var(--bk-accent)]">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-[0.925rem] leading-relaxed text-[var(--bk-muted)]">
                    {post.description}
                  </p>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--bk-muted)]">
                    {formatDate(post.date, MONTH)}
                    {post.readingTime ? `  ·  ${post.readingTime}` : ""}
                  </p>
                </Link>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ── work ──────────────────────────────────────────────────── */}
        <section id="work" className="border-b border-[var(--bk-line)]">
          <Wrap className="py-16 md:py-24">
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--bk-line)] pb-4">
              <div>
                <Eyebrow>04 · Selected work</Eyebrow>
                <h2 className="bancada-display mt-2 text-[clamp(1.75rem,3.4vw,2.75rem)] leading-tight tracking-[-0.015em]">
                  Projects with the story attached
                </h2>
                <p className="mt-2 max-w-[58ch] text-[0.95rem] leading-relaxed text-[var(--bk-muted)]">
                  Tools I built for myself and for other people. Each one has a
                  case study: the problem, the approach, and what I took away.
                </p>
              </div>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] hover:text-[var(--bk-accent)]"
              >
                all work
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {featured.map((project) => (
                <WorkCard key={project.slug} project={project} />
              ))}
            </div>
          </Wrap>
        </section>

        {/* ── contact ───────────────────────────────────────────────── */}
        <footer id="contact">
          <Wrap className="py-20 md:py-28">
            <Eyebrow>05 · Contact</Eyebrow>
            <h2 className="bancada-display mt-3 text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.95] tracking-[-0.02em]">
              Let&apos;s talk<span className="text-[var(--bk-accent)]">.</span>
            </h2>
            <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-relaxed text-[var(--bk-muted)]">
              {profile.availability.note}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-[var(--bk-ink)] bg-[var(--bk-ink)] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--bk-bg)] transition-colors hover:border-[var(--bk-accent)] hover:bg-[var(--bk-accent)]"
              >
                Start a conversation
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a
                href={`mailto:${profile.email}`}
                className="link-inline font-mono text-[11px] uppercase tracking-[0.16em]"
              >
                {profile.email}
              </a>
            </div>
            <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--bk-line)] pt-6 font-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--bk-muted)]">
              <span>© 2026 Pedro Santos · Belmonte, Portugal</span>
              <span className="flex items-center gap-5">
                <a href="/log/feed.xml" className="hover:text-[var(--bk-accent)]">
                  log feed
                </a>
                <a href="/rss.xml" className="hover:text-[var(--bk-accent)]">
                  writing feed
                </a>
              </span>
            </div>
          </Wrap>
        </footer>
      </main>
    </div>
  );
}
