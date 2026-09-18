import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Link } from "next-view-transitions";
import { profile } from "@/content/profile";
import { getFeaturedProjects } from "@/content/projects";
import { studies } from "@/content/studies";
import { getAllLogEntries } from "@/lib/log";
import { getAllPosts } from "@/lib/blog";
import type { LogEntry } from "@/lib/types";
import { Wrap } from "@/components/site/wrap";
import { Eyebrow } from "@/components/site/eyebrow";
import { SectionHeader } from "@/components/site/section-header";
import { LinkButton } from "@/components/site/link-button";
import { NowStrip } from "@/components/site/now-strip";
import { ProjectCard } from "@/components/site/project-card";
import { StudyCard } from "@/components/site/study-card";
import { LogRow } from "@/components/site/log-row";
import { PostCard } from "@/components/site/post-card";

export default function HomePage() {
  const allLog = getAllLogEntries();
  const log = allLog.slice(0, 4);
  const logBySlug = new Map(allLog.map((entry) => [entry.slug, entry]));
  const featured = getFeaturedProjects().slice(0, 3);
  const posts = getAllPosts().slice(0, 2);

  return (
    <main>
      {/* ── hero ────────────────────────────────────────────────────── */}
      <Wrap className="pb-16 pt-14 md:pb-20 md:pt-20">
        <Eyebrow>
          {profile.role} · {profile.location}
        </Eyebrow>
        <h1 className="mt-6 max-w-[16ch] font-display text-[clamp(2.75rem,8vw,6rem)] leading-[0.93] tracking-[-0.025em]">
          Hi, I&apos;m Pedro.
          <br />
          <span className="text-brand">I build software for the web.</span>
        </h1>
        <p className="mt-8 max-w-[58ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
          Software engineer from Belmonte, Portugal, with more than a decade in
          tech. By day I ship production React and GraphQL at Aubay. On the
          side I&apos;m building{" "}
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
          This site is where I write down what I&apos;m working on and what I
          learn while doing it.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
          <LinkButton href="#studies" variant="solid">
            What I&apos;m studying
            <ArrowDownRight className="h-4 w-4" />
          </LinkButton>
          <LinkButton href="#notes" variant="quiet">
            Read the log
            <ArrowUpRight className="h-3.5 w-3.5" />
          </LinkButton>
        </div>
        <p className="mt-10 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          {profile.stack.join("  ·  ")}
        </p>
      </Wrap>

      {/* ── working on now ──────────────────────────────────────────── */}
      <NowStrip />

      {/* ── studies ────────────────────────────────────────────────── */}
      <section id="studies" className="border-b border-border">
        <Wrap className="py-16 md:py-24">
          <SectionHeader
            eyebrow="01 · Studies"
            title="What I'm studying"
            description="A track is something I'm actively learning, with the notes that show the actual work. No progress bars."
          />
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {studies.map((study) => {
              const notes = study.logSlugs
                .map((slug) => logBySlug.get(slug))
                .filter((entry): entry is LogEntry => Boolean(entry));
              return <StudyCard key={study.id} study={study} notes={notes} />;
            })}
          </div>
        </Wrap>
      </section>

      {/* ── log ────────────────────────────────────────────────────── */}
      <section id="notes" className="border-b border-border">
        <Wrap className="py-16 md:py-24">
          <SectionHeader
            eyebrow="02 · Log"
            title="The latest notes"
            description="Short entries, written the week I learn something. Unfinished on purpose."
            action={
              <Link
                href="/log"
                className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] hover:text-brand"
              >
                all {allLog.length} entries
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <ol className="mt-4">
            {log.map((entry) => (
              <LogRow key={entry.slug} entry={entry} />
            ))}
          </ol>
        </Wrap>
      </section>

      {/* ── essays ─────────────────────────────────────────────────── */}
      <section id="essays" className="border-b border-border">
        <Wrap className="py-16 md:py-24">
          <SectionHeader
            eyebrow="03 · Essays"
            title="Longer reads"
            description="Essays on building software and learning in the open."
          />
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            {posts.map((post, index) => (
              <PostCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── work ───────────────────────────────────────────────────── */}
      <section id="work" className="border-b border-border">
        <Wrap className="py-16 md:py-24">
          <SectionHeader
            eyebrow="04 · Work"
            title="Selected work"
            description="Tools I built for myself and for other people. Each one has a case study: the problem, the approach, and what I took away."
            action={
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] hover:text-brand"
              >
                all work
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </Wrap>
      </section>
    </main>
  );
}
