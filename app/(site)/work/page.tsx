import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { ArrowUpRight } from "lucide-react";
import { getAllProjects } from "@/content/projects";
import { projectStatusMeta } from "@/components/sections/projects/project-status";
import { Wrap } from "@/components/site/wrap";
import { Eyebrow } from "@/components/site/eyebrow";
import { Screen } from "@/components/site/screen";
import { ProjectArt } from "@/components/site/project-art";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects with real narratives: the problem, the approach, and what I learned. Developer tools, a learning platform, a desktop utility, and a founder experiment.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  const projects = getAllProjects();

  return (
    <main>
      <Wrap className="pb-10 pt-14 md:pt-20">
        <Eyebrow>Work</Eyebrow>
        <h1 className="mt-6 max-w-[18ch] font-display text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[0.95] tracking-[-0.025em]">
          Things I&apos;ve built, with the story attached
        </h1>
        <p className="mt-6 max-w-[58ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
          A portfolio usually shows the finished thing and hides the thinking.
          These are the other way round: problem, approach, outcome, and what I
          took away.
        </p>
      </Wrap>

      <Wrap className="pb-20 md:pb-24">
        {projects.map((project) => {
          const meta = projectStatusMeta(project.status);
          return (
            <article
              key={project.slug}
              className="grid grid-cols-1 gap-6 border-t border-border py-8 md:grid-cols-[18rem_minmax(0,1fr)] md:gap-10 md:py-10"
            >
              <Link
                href={`/work/${project.slug}`}
                className="block border border-border bg-card transition-colors hover:border-foreground"
                aria-label={`${project.title} case study`}
              >
                <Screen label={project.slug}>
                  <ProjectArt
                    slug={project.slug}
                    title={project.title}
                    corner={String(project.year)}
                  />
                </Screen>
              </Link>

              <div className="min-w-0">
                <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  <span>{project.period}</span>
                  <span className="text-brand">{meta.label}</span>
                  <span>· {project.role}</span>
                </p>
                <h2 className="mt-2 font-display text-[1.75rem] leading-tight tracking-[-0.015em]">
                  <Link
                    href={`/work/${project.slug}`}
                    className="transition-colors hover:text-brand"
                  >
                    {project.title}
                  </Link>
                </h2>
                <p className="mt-2 max-w-[62ch] text-[1rem] leading-relaxed text-muted-foreground">
                  {project.summary}
                </p>
                <p className="mt-3 font-mono text-[10.5px] text-muted-foreground">
                  {project.stack.join("  ·  ")}
                </p>
                <Link
                  href={`/work/${project.slug}`}
                  className="group mt-4 inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] hover:text-brand"
                >
                  Read the case study
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </article>
          );
        })}
        <p className="border-t border-border pt-6 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          More on{" "}
          <a
            href="https://github.com/pc-gs"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-brand"
          >
            GitHub ↗
          </a>
        </p>
      </Wrap>
    </main>
  );
}
