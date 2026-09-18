import { Link } from "next-view-transitions";
import type { Project } from "@/lib/types";
import { projectStatusMeta } from "@/components/sections/projects/project-status";
import { ProjectArt } from "@/components/site/project-art";
import { Screen } from "@/components/site/screen";

/** Compact project card: illustrated cover, meta, title, one line. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group flex flex-col border border-border bg-card transition-colors hover:border-foreground"
    >
      <Screen label={project.slug} className="border-b">
        <ProjectArt
          slug={project.slug}
          title={project.title}
          corner={String(project.year)}
        />
      </Screen>
      <div className="flex flex-1 flex-col p-4">
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
          <span>{project.period}</span>
          <span className="text-brand-text">
            {projectStatusMeta(project.status).label}
          </span>
        </p>
        <h3 className="mt-2 font-display text-[1.25rem] leading-tight tracking-[-0.01em] transition-colors group-hover:text-brand-text">
          {project.title}
        </h3>
        <p className="mt-1.5 text-[0.875rem] leading-relaxed text-muted-foreground">
          {project.tagline}
        </p>
      </div>
    </Link>
  );
}
