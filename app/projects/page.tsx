import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { ArrowRight } from "lucide-react";
import { getAllProjects } from "@/content/projects";
import { projectStatusMeta } from "@/components/sections/projects/project-status";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects with real narratives — the problem, the approach, and what I learned. Developer tools, a learning platform, a desktop utility, and a founder experiment.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <main className="container py-16 md:py-24">
      <header className="fade-up border-b border-border pb-8">
        <p className="label mb-4">Work</p>
        <h1 className="max-w-3xl font-display text-[clamp(2.5rem,6vw,4rem)] leading-[1.05] tracking-tight text-foreground">
          Things I&apos;ve built, with the story attached.
        </h1>
        <p className="mt-5 max-w-xl font-serif text-lg leading-relaxed text-muted-foreground">
          Not a grid of gradient cards. Each project below has a case study —
          what problem existed, what I actually built, and what I took away from
          it.
        </p>
      </header>

      <ul className="divide-y divide-border border-b border-border">
        {projects.map((project) => {
          const meta = projectStatusMeta(project.status);
          return (
            <li key={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                className="group grid grid-cols-1 gap-4 py-8 md:grid-cols-[200px_1fr_auto] md:items-start md:gap-10"
              >
                <div className="flex flex-col gap-1.5">
                  <span className="label">{project.period}</span>
                  <span className="label-brand">{meta.label}</span>
                  <span className="label">{project.role}</span>
                </div>

                <div className="min-w-0">
                  <h2 className="font-display text-2xl leading-snug tracking-tight text-foreground transition-colors group-hover:text-brand">
                    {project.title}
                  </h2>
                  <p className="mt-1 font-serif text-[1.0625rem] text-muted-foreground">
                    {project.tagline}
                  </p>
                  <p className="mt-3 max-w-2xl font-serif text-[1.0625rem] leading-relaxed text-muted-foreground">
                    {project.summary}
                  </p>
                  <p className="mt-3 font-mono text-[12px] text-muted-foreground/80">
                    {project.stack.join(" · ")}
                  </p>
                </div>

                <span className="hidden shrink-0 self-center font-mono text-[13px] text-muted-foreground transition-colors group-hover:text-brand md:inline">
                  case study →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-10 font-mono text-[13px] text-muted-foreground">
        More on{" "}
        <Link
          href="https://github.com/pedrocarlos-ti"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground underline underline-offset-4 decoration-border hover:text-brand hover:decoration-brand"
        >
          GitHub
        </Link>{" "}
        <ArrowRight className="inline h-3.5 w-3.5" />
      </p>
    </main>
  );
}
