import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { SectionLabel } from "@/components/ui/section-label";
import { getProjectBySlug, projects } from "@/lib/projects";

const statusLabels = {
  active: "Active",
  shipped: "Shipped",
  experiment: "Experiment",
} as const;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <PageContainer>
      <div className="surface-panel-elevated">
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All projects
        </Link>

        <SectionLabel>{statusLabels[project.status]}</SectionLabel>
        <h1 className="mb-3 text-3xl font-semibold tracking-tight md:text-4xl">
          {project.title}
        </h1>

        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">
            {project.year}
          </span>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg border border-border/60 bg-surface px-2 py-0.5 font-mono text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="mb-6 text-lg text-muted-foreground leading-relaxed">
          {project.description}
        </p>

        {project.longDescription && (
          <p className="mb-8 leading-relaxed text-foreground/90">
            {project.longDescription}
          </p>
        )}

        {(project.links?.live || project.links?.github) && (
          <div className="flex flex-wrap gap-3">
            {project.links.live && (
              <Link
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-surface px-4 py-2 font-mono text-xs transition-colors hover:border-accent/40 hover:text-accent"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Visit site
              </Link>
            )}
            {project.links.github && (
              <Link
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-surface px-4 py-2 font-mono text-xs transition-colors hover:border-accent/40 hover:text-accent"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </Link>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
}