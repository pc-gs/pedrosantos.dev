import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";

const statusLabels: Record<Project["status"], string> = {
  active: "Active",
  shipped: "Shipped",
  experiment: "Experiment",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-2xl border border-border/60 p-5 transition-colors hover:border-accent/40"
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <h3 className="font-medium text-foreground transition-colors group-hover:text-accent">
          {project.title}
        </h3>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
      </div>

      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-muted-foreground">
          {project.year}
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span className="rounded-full bg-accent/10 px-2 py-0.5 font-mono text-xs text-accent">
          {statusLabels[project.status]}
        </span>
        {project.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-lg border border-border/60 bg-surface px-2 py-0.5 font-mono text-xs text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}