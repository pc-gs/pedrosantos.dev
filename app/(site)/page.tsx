import { ArrowUpRight } from "lucide-react";
import { Link } from "next-view-transitions";
import { profile } from "@/content/profile";
import { getFeaturedProjects } from "@/content/projects";
import { nowItems, nowKindLabel, nowUpdated } from "@/content/now";
import { formatDate } from "@/lib/date";
import { getCurrentVersion, getTimeline, groupByRelease } from "@/lib/timeline";
import { Wrap } from "@/components/site/wrap";
import { Eyebrow } from "@/components/site/eyebrow";
import { Changelog } from "@/components/changelog/changelog";
import { PinnedProject } from "@/components/changelog/pinned-project";

const MONTH: Intl.DateTimeFormatOptions = { month: "short", year: "numeric" };

function socialHref(icon: "github" | "linkedin") {
  return profile.socials.find((social) => social.icon === icon)?.href;
}

export default function HomePage() {
  const version = getCurrentVersion();
  const releases = groupByRelease(getTimeline());
  const pinned = getFeaturedProjects();
  const linkedInUrl = socialHref("linkedin");
  const gitHubUrl = socialHref("github");

  return (
    <main>
      {/* ── who, and the state of things ──────────────────────────────── */}
      <Wrap className="grid grid-cols-1 gap-12 pb-14 pt-14 md:pt-20 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
        <div>
          <Eyebrow>
            {profile.role} · {profile.location}
          </Eyebrow>
          <h1 className="mt-6 font-display text-[clamp(2.75rem,7.5vw,5.5rem)] leading-[0.93] tracking-[-0.025em]">
            Hi, I&apos;m Pedro.
            <br />
            <span className="text-brand">This is my changelog.</span>
          </h1>
          <p className="mt-8 max-w-[58ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
            Software engineer with more than a decade in tech. I ship
            production React, Next.js and TypeScript, and lately desktop apps
            with Tauri and Rust. On the side I run{" "}
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
          <p className="mt-4 max-w-[58ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
            Instead of a portfolio, this page is a running record of what I
            ship, write and learn, month by month. The full work history lives
            on{" "}
            {linkedInUrl ? (
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-inline"
              >
                LinkedIn
              </a>
            ) : (
              "LinkedIn"
            )}
            .
          </p>
          <p className="mt-8 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            {profile.stack.join("  ·  ")}
          </p>
        </div>

        <aside
          aria-label="Status"
          className="self-start border-t-2 border-foreground pt-4 lg:mt-2"
        >
          <p className="flex items-baseline justify-between gap-3 font-mono text-[10.5px] uppercase tracking-[0.18em]">
            <span>Status</span>
            <span className="text-muted-foreground">{version}</span>
          </p>

          {profile.availability.open && (
            <p className="mt-4 flex gap-2.5 text-[0.95rem] leading-snug">
              <span
                aria-hidden
                className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-brand"
              />
              <span>
                Open to {profile.availability.types.join(" and ")} work.
                Remote, EU timezones.
              </span>
            </p>
          )}

          <ul className="mt-5">
            {nowItems.slice(0, 3).map((item) => (
              <li key={item.id} className="border-t border-border py-3">
                <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-brand-text">
                  {nowKindLabel[item.kind]}
                </p>
                <p className="mt-1 text-[0.875rem] leading-snug">{item.text}</p>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-t border-border pt-3 font-mono text-[10.5px] uppercase tracking-[0.16em]">
            <Link
              href="/now"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              now · {formatDate(nowUpdated, MONTH)}
            </Link>
            {gitHubUrl && (
              <a
                href={gitHubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                GitHub ↗
              </a>
            )}
            <Link
              href="/contact"
              className="text-brand-text transition-colors hover:text-foreground"
            >
              say hi →
            </Link>
          </div>
        </aside>
      </Wrap>

      {/* ── pinned work ─────────────────────────────────────────────── */}
      <Wrap className="pb-14">
        <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
          <Eyebrow>Pinned</Eyebrow>
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
          >
            all work
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {pinned.map((project) => (
            <PinnedProject key={project.slug} project={project} />
          ))}
        </div>
      </Wrap>

      {/* ── the changelog ───────────────────────────────────────────── */}
      <section id="changelog" aria-labelledby="changelog-title" className="scroll-mt-16">
        <Wrap className="pb-20 md:pb-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2
              id="changelog-title"
              className="font-display text-[clamp(2rem,4vw,3rem)] leading-none tracking-[-0.02em]"
            >
              Changelog
            </h2>
            <p className="max-w-[46ch] text-[0.9rem] leading-relaxed text-muted-foreground">
              Every dated thing on this site, newest first. Rows marked{" "}
              <span className="text-ai">✦</span> were drafted with a model and
              edited by hand.
            </p>
          </div>
          <div className="mt-6">
            <Changelog releases={releases} />
          </div>
        </Wrap>
      </section>
    </main>
  );
}
