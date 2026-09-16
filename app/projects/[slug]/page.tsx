import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { getAllProjects, getProjectBySlug } from "@/content/projects";
import { renderMarkdown } from "@/lib/markdown";
import { projectStatusMeta } from "@/components/sections/projects/project-status";
import { profile } from "@/content/profile";

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
        url: `https://pedrosantos.dev/projects/${project.slug}`,
      },
    };
  });
}

function CaseStudySection({
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
    <section className="mt-12 first:mt-0">
      <div className="mb-4 flex items-baseline gap-3 border-b border-border pb-3">
        <span className="label-brand">{index}</span>
        <span className="label">{label}</span>
      </div>
      <p className="measure-narrow font-display text-[1.625rem] leading-snug tracking-tight text-foreground">
        {thesis}
      </p>
      <div
        className="prose measure mt-4"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
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
    <main className="container py-16 md:py-24">
      {/* Breadcrumb */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 font-mono text-[13px] text-muted-foreground transition-colors hover:text-brand"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        all work
      </Link>

      {/* Header */}
      <header className="mt-8 max-w-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="label-brand">{meta.label}</span>
          <span className="label">{project.period}</span>
        </div>
        <h1 className="mt-4 font-display text-[clamp(2.25rem,5.5vw,3.5rem)] leading-[1.06] tracking-tight text-foreground">
          {project.title}
        </h1>
        <p className="mt-3 font-serif text-xl leading-snug text-muted-foreground">
          {project.tagline}
        </p>
        <p className="mt-5 max-w-xl font-serif text-[1.0625rem] leading-relaxed text-muted-foreground">
          {project.summary}
        </p>
      </header>

      {/* Meta grid */}
      <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
        <MetaRow label="Role" value={project.role} />
        <MetaRow label="Status" value={meta.label} />
        <MetaRow label="Period" value={project.period} />
        <MetaRow label="Stack" value={project.stack.join(" · ")} />
      </dl>

      {/* Links */}
      {project.links.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-4 font-mono text-[13px] text-foreground transition-colors hover:border-brand hover:text-brand"
            >
              {link.label}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>
      )}

      {/* Highlights */}
      {project.highlights && project.highlights.length > 0 && (
        <section className="mt-12 rounded-lg border border-border bg-card p-6 md:p-8">
          <p className="label mb-4">At a glance</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {project.highlights.map((h) => (
              <li
                key={h}
                className="flex items-start gap-2.5 font-serif text-[0.975rem] leading-relaxed text-foreground"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {h}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* TL;DR — the one line a recruiter can quote without reading further */}
      <section className="mt-12 overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-5 py-2.5">
          <span className="label-brand">tl;dr</span>
        </div>
        <p className="px-5 py-4 font-serif text-[1.0625rem] leading-relaxed text-foreground">
          {project.caseStudy.tldr}
        </p>
      </section>

      {/* Case study body */}
      <div className="mt-16">
        <CaseStudySection
          index="01"
          label="Problem"
          thesis={project.caseStudy.problem.thesis}
          bodyHtml={renderMarkdown(project.caseStudy.problem.body)}
        />
        <CaseStudySection
          index="02"
          label="Approach"
          thesis={project.caseStudy.approach.thesis}
          bodyHtml={renderMarkdown(project.caseStudy.approach.body)}
        />
        <CaseStudySection
          index="03"
          label="Outcome"
          thesis={project.caseStudy.outcome.thesis}
          bodyHtml={renderMarkdown(project.caseStudy.outcome.body)}
        />

        {project.caseStudy.learnings && project.caseStudy.learnings.length > 0 && (
          <section className="mt-12">
            <div className="mb-4 flex items-baseline gap-3 border-b border-border pb-3">
              <span className="label-brand">04</span>
              <span className="label">What I took away</span>
            </div>
            <ul className="space-y-3 measure">
              {project.caseStudy.learnings.map((l) => (
                <li
                  key={l}
                  className="flex items-start gap-3 font-serif text-[1.0625rem] leading-relaxed text-muted-foreground"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Tags */}
      <div className="mt-16 flex flex-wrap gap-2 border-t border-border pt-8">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded border border-border px-2.5 py-1 font-mono text-[12px] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Prev / next */}
      <nav className="mt-12 grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/projects/${prev.slug}`}
            className="group rounded-lg border border-border p-5 transition-colors hover:border-brand"
          >
            <span className="label flex items-center gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              previous
            </span>
            <span className="mt-2 block font-display text-lg leading-snug text-foreground transition-colors group-hover:text-brand">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/projects/${next.slug}`}
            className="group rounded-lg border border-border p-5 text-right transition-colors hover:border-brand sm:col-start-2"
          >
            <span className="label flex items-center justify-end gap-1.5">
              next
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
            <span className="mt-2 block font-display text-lg leading-snug text-foreground transition-colors group-hover:text-brand">
              {next.title}
            </span>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
      </nav>

      {/* Contact nudge */}
      <div className="mt-16 rounded-lg border border-border bg-card p-6 md:p-8">
        <p className="font-serif text-[1.0625rem] leading-relaxed text-foreground">
          Want to talk about building something like this?{" "}
          <Link
            href="/contact"
            className="text-brand underline underline-offset-4 decoration-brand/40 hover:decoration-brand"
          >
            Let&apos;s talk
          </Link>{" "}
          — or email{" "}
          <a
            href={`mailto:${profile.email}`}
            className="text-foreground underline underline-offset-4 decoration-border hover:text-brand hover:decoration-brand"
          >
            {profile.email}
          </a>
          .
        </p>
      </div>
    </main>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 bg-card p-4 md:p-5">
      <dt className="label">{label}</dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  );
}
