import { Link } from "next-view-transitions";
import type { Project } from "@/lib/types";
import { projectStatusMeta } from "@/components/sections/projects/project-status";
import { ProjectArt } from "@/components/site/project-art";

/** A pinned project on the changelog: small cover, name, one line, status. */
export function PinnedProject({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-4 border border-border bg-card p-3 transition-colors hover:border-foreground sm:grid-cols-[10rem_minmax(0,1fr)]"
    >
      <div className="aspect-[16/10] overflow-hidden border border-border">
        <ProjectArt
          slug={project.slug}
          title={project.title}
          cover={project.cover}
          className="p-2"
        />
      </div>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {project.period}
          <span className="text-brand-text">
            {"  ·  "}
            {projectStatusMeta(project.status).label}
          </span>
        </p>
        <h3 className="mt-1 font-display text-[1.375rem] leading-tight tracking-[-0.01em] transition-colors group-hover:text-brand-text">
          {project.title}
        </h3>
        <p className="mt-1 text-[0.875rem] leading-snug text-muted-foreground">
          {project.tagline}
        </p>
      </div>
    </Link>
  );
}
