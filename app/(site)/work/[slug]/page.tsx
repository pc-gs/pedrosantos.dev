import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/content/projects";
import { formatDate } from "@/lib/date";
import { renderMarkdown } from "@/lib/markdown";
import { projectStatusMeta } from "@/components/sections/projects/project-status";
import { profile } from "@/content/profile";
import { Wrap } from "@/components/site/wrap";
import { Eyebrow } from "@/components/site/eyebrow";
import { Screen } from "@/components/site/screen";
import { ProjectArt } from "@/components/site/project-art";

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
      alternates: { canonical: `/work/${project.slug}` },
      openGraph: {
        title: `${project.title} — Pedro Santos`,
        description: project.summary,
        url: `${SITE_URL}/work/${project.slug}`,
      },
    };
  });
}

/** A case-study movement: number in the gutter, argument in the block. */
function Movement({
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
    <section className="border-t border-border py-10 md:py-12">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-6">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-brand-text">
          {index}
        </p>
        <div className="min-w-0">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-3 max-w-[54ch] font-display text-[clamp(1.35rem,2.4vw,1.75rem)] leading-snug tracking-[-0.01em]">
            {thesis}
          </p>
          <div
            className="prose mt-5 max-w-[62ch]"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </div>
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
    <main>
      <Wrap className="pt-14 md:pt-20">
        <Eyebrow>Work · The story</Eyebrow>
        <h1 className="mt-5 max-w-[20ch] font-display text-[clamp(2.25rem,6vw,4rem)] leading-[0.98] tracking-[-0.02em]">
          {project.title}
        </h1>
        <p className="mt-5 max-w-[54ch] text-[1.25rem] leading-snug text-muted-foreground">
          {project.tagline}
        </p>
        <p className="mt-4 max-w-[62ch] text-[1.0125rem] leading-relaxed text-muted-foreground">
          {project.summary}
        </p>
      </Wrap>

      <Wrap className="mt-10">
        <Screen label={project.slug} className="border border-border">
          <ProjectArt
            slug={project.slug}
            title={project.title}
            cover={project.cover}
            corner={String(project.year)}
          />
        </Screen>
      </Wrap>

      <Wrap className="mt-12">
        <div className="grid grid-cols-1 gap-8 border-y border-border py-8 md:grid-cols-3 md:gap-10">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-brand-text">
              TL;DR
            </p>
            <p className="mt-3 text-[1rem] leading-relaxed">
              {project.caseStudy.tldr}
            </p>
          </div>

          {project.highlights && project.highlights.length > 0 && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                At a glance
              </p>
              <ul className="mt-3 space-y-2">
                {project.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex gap-2.5 text-[0.9375rem] leading-snug text-muted-foreground"
                  >
                    <span
                      aria-hidden
                      className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-brand"
                    />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <dl className="space-y-3">
            {[
              { label: "Status", value: meta.label },
              { label: "Period", value: project.period },
              { label: "Role", value: project.role },
              { label: "Stack", value: project.stack.join(" · ") },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-4 border-b border-border pb-2 last:border-0"
              >
                <dt className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  {row.label}
                </dt>
                <dd className="text-right text-[0.9rem] leading-snug">
                  {row.value}
                </dd>
              </div>
            ))}
            {project.links.length > 0 && (
              <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-text transition-colors hover:text-foreground"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            )}
          </dl>
        </div>

        <Movement
          index="01"
          label="Problem"
          thesis={project.caseStudy.problem.thesis}
          bodyHtml={renderMarkdown(project.caseStudy.problem.body)}
        />
        <Movement
          index="02"
          label="Approach"
          thesis={project.caseStudy.approach.thesis}
          bodyHtml={renderMarkdown(project.caseStudy.approach.body)}
        />
        <Movement
          index="03"
          label="Outcome"
          thesis={project.caseStudy.outcome.thesis}
          bodyHtml={renderMarkdown(project.caseStudy.outcome.body)}
        />

        {project.caseStudy.learnings &&
          project.caseStudy.learnings.length > 0 && (
            <section className="border-t border-border py-10 md:py-12">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-6">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-brand-text">
                  04
                </p>
                <div className="min-w-0">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                    What I took away
                  </p>
                  <ul className="mt-4 space-y-3">
                    {project.caseStudy.learnings.map((learning) => (
                      <li
                        key={learning}
                        className="flex max-w-[62ch] gap-3 text-[1rem] leading-relaxed text-muted-foreground"
                      >
                        <span
                          aria-hidden
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand"
                        />
                        <span>{learning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

        {project.milestones && project.milestones.length > 0 && (
          <section className="border-t border-border py-10 md:py-12">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-6">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-brand-text">
                {project.caseStudy.learnings?.length ? "05" : "04"}
              </p>
              <div className="min-w-0">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  Changelog
                </p>
                <ol className="mt-4 max-w-[62ch]">
                  {[...project.milestones].reverse().map((milestone) => (
                    <li
                      key={milestone.date}
                      className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 border-t border-border py-3 first:border-t-0"
                    >
                      <span className="pt-[3px] font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                        <time dateTime={milestone.date}>
                          {formatDate(milestone.date, {
                            month: "short",
                            year: "numeric",
                          })}
                        </time>
                        <span className="block text-brand-text">{milestone.kind}</span>
                      </span>
                      <span className="text-[1rem] leading-relaxed">
                        {milestone.title}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        )}

        <nav
          aria-label="Previous and next project"
          className="grid grid-cols-1 gap-8 border-t border-border py-8 sm:grid-cols-2"
        >
          {prev ? (
            <Link href={`/work/${prev.slug}`} className="group min-w-0">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                ← previous
              </span>
              <span className="mt-2 block font-display text-[1.25rem] leading-snug tracking-[-0.01em] transition-colors group-hover:text-brand-text">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/work/${next.slug}`}
              className="group min-w-0 sm:text-right"
            >
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                next →
              </span>
              <span className="mt-2 block font-display text-[1.25rem] leading-snug tracking-[-0.01em] transition-colors group-hover:text-brand-text">
                {next.title}
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
        </nav>

        <p className="mb-4 max-w-[56ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
          Want to talk about building something like this?{" "}
          <Link href="/contact" className="link-inline">
            Let&apos;s talk
          </Link>{" "}
          or email{" "}
          <a href={`mailto:${profile.email}`} className="link-inline">
            {profile.email}
          </a>
          .
        </p>
      </Wrap>
    </main>
  );
}
