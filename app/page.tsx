import { Link } from "next-view-transitions";
import { profile } from "@/content/profile";
import { getFeaturedProjects } from "@/content/projects";
import { nowItems, nowUpdated } from "@/content/now";
import { getAllLogEntries } from "@/lib/log";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/date";
import { AiBadge } from "@/components/log/ai-badge";
import { NowList } from "@/components/now/now-list";
import {
  Folio,
  Manuscript,
  Sidenote,
} from "@/components/manuscript/manuscript";
import { Mark, MarginLink, Sep, Stamp } from "@/components/manuscript/marks";
import { projectStatusMeta } from "@/components/sections/projects/project-status";

const DATE: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
const MONTH: Intl.DateTimeFormatOptions = { month: "short", year: "numeric" };

export default function HomePage() {
  const allLog = getAllLogEntries();
  const log = allLog.slice(0, 4);
  const coWritten = allLog.filter((e) => e.aiAssisted).length;
  const featured = getFeaturedProjects().slice(0, 3);
  const posts = getAllPosts().slice(0, 3);

  return (
    <main className="container py-12 md:py-16">
      {/* ── 00 · masthead ─────────────────────────────────────────── */}
      <Manuscript
        marginWidth="wide"
        folio={<Folio>00</Folio>}
        margin={
          <div>
            {profile.availability.open && (
              <Stamp tone="brand">open to work</Stamp>
            )}
            <p className="mt-3 font-serif text-[0.925rem] leading-relaxed text-muted-foreground">
              {profile.availability.note}
            </p>
          </div>
        }
      >
        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          {profile.role} <Sep /> {profile.location}
        </p>

        <h1 className="mt-5 font-display display-hero text-foreground">
          Building for the web.
          <br />
          <em className="italic text-brand">
            Logging what I learn — with AI as co-writer.
          </em>
        </h1>

        <p className="mt-7 max-w-[58ch] font-serif text-[1.125rem] leading-[1.72] text-foreground/85">
          Hey, I&apos;m {profile.name}. By day I ship production React and
          Next.js; on the side I run Melro.io. This site is a manuscript: what
          I&apos;m doing now, what I&apos;m learning — logged in the open with the
          prompts attached — and the work behind it, marked honestly when a
          model helped draft it.
        </p>

        <div className="mt-8 flex flex-wrap items-baseline gap-x-8 gap-y-3">
          <Link
            href="/log"
            className="group inline-flex items-baseline gap-2 font-mono text-[11.5px] uppercase tracking-[0.16em] text-foreground"
          >
            <span className="border-b border-brand pb-[3px] transition-colors group-hover:border-foreground">
              read the log
            </span>
            <span aria-hidden className="text-brand">
              →
            </span>
          </Link>
          <Link
            href="/projects"
            className="group inline-flex items-baseline gap-2 font-mono text-[11.5px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="border-b border-border pb-[3px] transition-colors group-hover:border-brand">
              see the case studies
            </span>
            <span aria-hidden className="group-hover:text-brand">
              →
            </span>
          </Link>
        </div>

        <p className="mt-9 font-mono text-[11px] leading-relaxed text-muted-foreground/80">
          {profile.stack.join("  ·  ")}
        </p>
      </Manuscript>

      {/* ── 01 · now ──────────────────────────────────────────────── */}
      <Manuscript
        className="mt-20 md:mt-28"
        folio={<Folio>01</Folio>}
        margin={
          <Sidenote label="kept drifting" leader>
            <p className="font-serif text-[0.925rem] leading-relaxed text-muted-foreground">
              Updated {formatDate(nowUpdated, MONTH)} — a living snapshot, not a
              résumé line.
            </p>
            <p className="mt-3">
              <MarginLink href="/now">the now page →</MarginLink>
            </p>
          </Sidenote>
        }
      >
        <h2 className="font-display display-block text-foreground">
          What I&apos;m doing right now
        </h2>
        <p className="mt-3 max-w-[54ch] font-serif text-[1.0625rem] leading-relaxed text-muted-foreground">
          Most sites tell you what someone did. This is the part that keeps
          moving.
        </p>
        <div className="mt-7">
          <NowList items={nowItems} />
        </div>
      </Manuscript>

      {/* ── 02 · the log — the signature ───────────────────────────── */}
      <Manuscript
        className="mt-20 md:mt-28"
        marginWidth="wide"
        folio={<Folio>02</Folio>}
        margin={
          <>
            <Sidenote label="by the numbers" leader tone="brand">
              <p className="font-mono text-[11.5px] leading-relaxed text-muted-foreground tabnum">
                {allLog.length} entries
                <br />
                {coWritten} drafted with a model
                <br />
                {allLog.length - coWritten} written by hand
              </p>
              <p className="mt-3 font-serif text-[0.925rem] leading-relaxed text-muted-foreground">
                Every co-written entry publishes the prompt that started it. The
                entries that used no model say so as well — the marking only
                means something if both halves exist.
              </p>
              <p className="mt-3">
                <MarginLink href="/log">the full log →</MarginLink>
              </p>
            </Sidenote>

            <Sidenote label="rss">
              <p>
                <MarginLink href="/log/feed.xml">log feed →</MarginLink>
              </p>
            </Sidenote>
          </>
        }
      >
        <h2 className="font-display display-block text-foreground">
          A log, not a blog
        </h2>
        <p className="mt-3 max-w-[56ch] font-serif text-[1.0625rem] leading-relaxed text-muted-foreground">
          Short entries about what I just learned, written the week I learned
          it. Unfinished on purpose — that is what learning looks like from the
          inside.
        </p>

        <ol className="mt-8">
          {log.map((entry) => (
            <li key={entry.slug} className="border-b border-border last:border-0">
              <Link
                href={`/log/${entry.slug}`}
                className="group grid grid-cols-1 items-baseline gap-x-5 gap-y-1.5 py-4 sm:grid-cols-[5.5rem_minmax(0,1fr)]"
              >
                <time
                  dateTime={entry.date}
                  className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground"
                >
                  {formatDate(entry.date, DATE)}
                </time>
                <div className="min-w-0">
                  <p className="font-display text-[1.3rem] leading-snug tracking-tight text-foreground transition-colors group-hover:text-brand">
                    {entry.title}
                  </p>
                  <p className="mt-2">
                    {entry.aiAssisted ? (
                      <AiBadge model={entry.model} short />
                    ) : (
                      <Mark tone="muted">
                        <span aria-hidden>✎</span> no model
                      </Mark>
                    )}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </Manuscript>

      {/* ── 03 · selected work ─────────────────────────────────────── */}
      <Manuscript
        className="mt-20 md:mt-28"
        folio={<Folio>03</Folio>}
        margin={
          <Sidenote label="how these read" leader>
            <p className="font-serif text-[0.925rem] leading-relaxed text-muted-foreground">
              Each case study is set the same way: the problem, the approach,
              the outcome, then what I took away. No logo wall, no gradient
              cards.
            </p>
            <p className="mt-3">
              <MarginLink href="/projects">all work →</MarginLink>
            </p>
          </Sidenote>
        }
      >
        <h2 className="font-display display-block text-foreground">
          Things I&apos;ve built, with the story attached
        </h2>

        <ul className="mt-8">
          {featured.map((project) => (
            <li key={project.slug} className="border-b border-border last:border-0">
              <Link
                href={`/projects/${project.slug}`}
                className="group block py-6"
              >
                <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  <span>{project.period}</span>
                  <Sep />
                  <span className="text-brand">
                    {projectStatusMeta(project.status).label}
                  </span>
                </p>
                <p className="mt-2 font-display text-[1.4rem] leading-snug tracking-tight text-foreground transition-colors group-hover:text-brand">
                  {project.title}
                </p>
                <p className="mt-2 max-w-[62ch] font-serif text-[1.0125rem] leading-relaxed text-muted-foreground">
                  {project.summary}
                </p>
                <p className="mt-2.5 font-mono text-[11px] text-muted-foreground/80">
                  {project.stack.slice(0, 4).join("  ·  ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Manuscript>

      {/* ── 04 · writing ──────────────────────────────────────────── */}
      {posts.length > 0 && (
        <Manuscript
          className="mt-20 md:mt-28"
          folio={<Folio>04</Folio>}
          margin={
            <Sidenote label="the disclosure" leader tone="ai">
              <p className="font-serif text-[0.925rem] leading-relaxed text-muted-foreground">
                Essays start as my notes, get drafted with a model, and are
                edited by me. Every one carries its own paper trail: notes,
                prompts, first draft, edit.
              </p>
              <p className="mt-3">
                <MarginLink href="/blog">all writing →</MarginLink>
              </p>
            </Sidenote>
          }
        >
          <h2 className="font-display display-block text-foreground">
            Longer thinking, co-written honestly
          </h2>

          <ul className="mt-8">
            {posts.map((post) => (
              <li key={post.slug} className="border-b border-border last:border-0">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group grid grid-cols-1 items-baseline gap-x-5 gap-y-1.5 py-4 sm:grid-cols-[5.5rem_minmax(0,1fr)]"
                >
                  <time
                    dateTime={post.date}
                    className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    {formatDate(post.date, MONTH)}
                  </time>
                  <div className="min-w-0">
                    <p className="font-display text-[1.3rem] leading-snug tracking-tight text-foreground transition-colors group-hover:text-brand">
                      {post.title}
                    </p>
                    <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                      {post.readingTime}
                      {post.coWritten && (
                        <>
                          {"  "}
                          <Sep />{"  "}
                          <span className="text-ai">✦ co-written</span>
                        </>
                      )}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Manuscript>
      )}

      {/* ── 05 · close ────────────────────────────────────────────── */}
      <Manuscript
        className="mt-20 md:mt-28"
        folio={<Folio>05</Folio>}
        margin={
          <Sidenote label="fastest route" leader>
            <p className="font-serif text-[0.925rem] leading-relaxed text-muted-foreground">
              The form reaches the same inbox as a direct mail. Either is fine.
            </p>
            <p className="mt-2 break-words font-mono text-[11.5px] leading-relaxed">
              <a href={`mailto:${profile.email}`} className="link-ink">
                {profile.email}
              </a>
            </p>
          </Sidenote>
        }
      >
        <h2 className="font-display display-block text-foreground">
          Let&apos;s talk<span className="text-brand">.</span>
        </h2>
        <p className="mt-3 max-w-[52ch] font-serif text-[1.0625rem] leading-relaxed text-muted-foreground">
          Open to full-time roles and contract work. If something in this
          manuscript resonates — the way I work, the way I mark what a model
          did, the case studies — that is the whole point.
        </p>
        <div className="mt-7 flex flex-wrap items-baseline gap-x-8 gap-y-3">
          <Link
            href="/contact"
            className="group inline-flex items-baseline gap-2 font-mono text-[11.5px] uppercase tracking-[0.16em] text-foreground"
          >
            <span className="border-b border-brand pb-[3px]">start a conversation</span>
            <span aria-hidden className="text-brand">
              →
            </span>
          </Link>
          <Link
            href="/about"
            className="font-mono text-[11.5px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="border-b border-border pb-[3px] transition-colors hover:border-brand">
              more about me
            </span>
          </Link>
        </div>
      </Manuscript>
    </main>
  );
}
