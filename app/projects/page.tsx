import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { ProjectCard } from "@/components/projects/project-card";
import { SectionLabel } from "@/components/ui/section-label";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I've built — side projects, tools, and experiments.",
};

export default function ProjectsPage() {
  return (
    <PageContainer wide>
      <div className="mb-10 surface-panel-elevated">
        <SectionLabel>Projects</SectionLabel>
        <h1 className="mb-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Things I&apos;ve built
        </h1>
        <p className="max-w-2xl text-muted-foreground leading-relaxed">
          Side projects, developer tools, and experiments. Some shipped, some still
          growing.
        </p>
      </div>
      <div className="bento-grid">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </PageContainer>
  );
}