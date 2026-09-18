import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/content/projects";
import { renderMarkdown } from "@/lib/markdown";
import { projectStatusMeta } from "@/components/sections/projects/project-status";
import { profile } from "@/content/profile";
import {
  Manuscript,
  Sidenote,
} from "@/components/manuscript/manuscript";
import { MarginLink, TagRun } from "@/components/manuscript/marks";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pedrosantos.dev";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const project = getProjectBySlug(slug);
    if (!project) return { title: "Not found" };
    return {
      title: project.title,
      description: project.summary,
      alternates: { canonical: `/projects/${project.slug}` },
      openGraph: {
        title: `${project.title} — Pedro Santos`,
        description: project.summary,
        url: `${SITE_URL}/projects/${project.slug}`,
      },
    };
  });
}

/** A case-study movement: number in the sub-gutter, argument in the block. */
function StudySection({
  index,
  label,
  thesis,
  bodyHtml,
}: {
  index: string;
  label: string;
  thesis: string;
  bodyHtml: string;
}) {
  return (
    <section className="grid grid-cols-1 gap-y-3 border-t border-border py-9 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-x-6">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground tabnum">
        <span className="text-brand">{index}</span>
      </p>
      <div className="min-w-0">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-4 max-w-[58ch] font-display text-[1.5rem] leading-snug tracking-tight text-foreground">
          {thesis}
        </p>
        <div
          className="prose mt-5 max-w-[62ch]"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </div>
    </section>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const meta = projectStatusMeta(project.status);
  const all = getAllProjects();
  const index = all.findIndex((p) => p.slug === slug);
  const prev = index > 0 ? all[index - 1] : null;
  const next = index < all.length - 1 ? all[index + 1] : null;

  return (
    <main className="container py-12 md:py-16">
      <Manuscript
        marginWidth="wide"
        folio={
          <div className="space-y-2">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-brand">
              {meta.label}
            </p>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground tabnum">
              {project.period}
            </p>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              {project.role}
            </p>
          </div>
        }
        margin={
          <>
            <Sidenote label="tl;dr" leader tone="brand">
              <p className="font-serif text-[0.975rem] leading-relaxed text-foreground/85">
                {project.caseStudy.tldr}
              </p>
            </Sidenote>

            {project.links.length > 0 && (
              <Sidenote label="where to look">
                <ul className="space-y-2">
                  {project.links.map((link) => (
                    <li key={link.href}>
                      {link.href.startsWith("http") ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block border-b border-brand/30 pb-[3px] font-mono text-[10.5px] uppercase tracking-[0.18em] text-brand transition-colors hover:border-brand"
                        >
                          {link.label} ↗
                        </a>
                      ) : (
                        <MarginLink href={link.href}>{link.label}</MarginLink>
                      )}
                    </li>
                  ))}
                </ul>
              </Sidenote>
            )}

            {project.highlights && project.highlights.length > 0 && (
              <Sidenote label="at a glance">
                <ul className="space-y-2">
                  {project.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex gap-2.5 font-serif text-[0.925rem] leading-relaxed text-muted-foreground"
                    >
                      <span
                        aria-hidden
                        className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-brand"
                      />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </Sidenote>
            )}

            <Sidenote label="built with">
              <p className="font-mono text-[11px] leading-[1.9] text-muted-foreground">
                {project.stack.join("  ·  ")}
              </p>
            </Sidenote>

            <Sidenote label="">
              <MarginLink href="/projects">← all work</MarginLink>
            </Sidenote>
          </>
        }
      >
        <header className="border-b border-border pb-9">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            work · case study
          </p>
          <h1 className="mt-5 font-display display-page text-foreground">
            {project.title}
          </h1>
          <p className="mt-5 max-w-[56ch] font-serif text-[1.25rem] leading-snug text-muted-foreground italic">
            {project.tagline}
          </p>
          <p className="mt-5 max-w-[60ch] font-serif text-[1.0625rem] leading-[1.72] text-muted-foreground">
            {project.summary}
          </p>
        </header>

        <StudySection
          index="01"
          label="Problem"
          thesis={project.caseStudy.problem.thesis}
          bodyHtml={renderMarkdown(project.caseStudy.problem.body)}
        />
        <StudySection
          index="02"
          label="Approach"
          thesis={project.caseStudy.approach.thesis}
          bodyHtml={renderMarkdown(project.caseStudy.approach.body)}
        />
        <StudySection
          index="03"
          label="Outcome"
          thesis={project.caseStudy.outcome.thesis}
          bodyHtml={renderMarkdown(project.caseStudy.outcome.body)}
        />

        {project.caseStudy.learnings && project.caseStudy.learnings.length > 0 && (
          <section className="grid grid-cols-1 gap-y-3 border-t border-border py-9 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-x-6">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground tabnum">
              <span className="text-brand">04</span>
            </p>
            <div className="min-w-0">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                What I took away
              </p>
              <ul className="mt-4 space-y-3">
                {project.caseStudy.learnings.map((l) => (
                  <li
                    key={l}
                    className="flex max-w-[62ch] gap-3 font-serif text-[1.0625rem] leading-[1.72] text-muted-foreground"
                  >
                    <span
                      aria-hidden
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand"
                    />
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <div className="border-t border-border pt-6">
          <TagRun tags={project.tags} />
        </div>
      </Manuscript>

      <nav
        aria-label="Previous and next project"
        className="mt-20 grid grid-cols-1 gap-8 border-t border-border pt-6 sm:grid-cols-2"
      >
        {prev ? (
          <Link href={`/projects/${prev.slug}`} className="group min-w-0">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              ← previous
            </span>
            <span className="mt-2 block font-display text-[1.25rem] leading-snug tracking-tight text-foreground transition-colors group-hover:text-brand">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/projects/${next.slug}`}
            className="group min-w-0 sm:text-right"
          >
            <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              next →
            </span>
            <span className="mt-2 block font-display text-[1.25rem] leading-snug tracking-tight text-foreground transition-colors group-hover:text-brand">
              {next.title}
            </span>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
      </nav>

      <p className="mt-16 max-w-[56ch] font-serif text-[1.0625rem] leading-relaxed text-muted-foreground">
        Want to talk about building something like this?{" "}
        <Link href="/contact" className="link-ink">
          Let&apos;s talk
        </Link>{" "}
        — or email{" "}
        <a href={`mailto:${profile.email}`} className="link-plain">
          {profile.email}
        </a>
        . <span className="hidden lg:inline">See also the log entries on {" "}</span>
        <Link href="/log" className="link-ink">
          what I learned along the way
        </Link>
        .
      </p>
    </main>
  );
}
