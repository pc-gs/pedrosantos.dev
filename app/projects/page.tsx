import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { getAllProjects } from "@/content/projects";
import { projectStatusMeta } from "@/components/sections/projects/project-status";
import {
  Folio,
  Manuscript,
  Sidenote,
} from "@/components/manuscript/manuscript";
import { MarginLink, Sep } from "@/components/manuscript/marks";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects with real narratives — the problem, the approach, and what I learned. Developer tools, a learning platform, a desktop utility, and a founder experiment.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <main className="container py-12 md:py-16">
      <Manuscript
        marginWidth="wide"
        folio={<Folio>work</Folio>}
        margin={
          <>
            <Sidenote label="how these read" leader>
              <p className="font-serif text-[0.925rem] leading-relaxed text-muted-foreground">
                Every case study is set the same way: the problem as I found it,
                the approach I took, the outcome, then what I took away. No logo
                wall, no gradient cards, no metrics I cannot defend.
              </p>
            </Sidenote>

            <Sidenote label="elsewhere">
              <p>
                <MarginLink href="https://github.com/pedrocarlos-ti">
                  github →
                </MarginLink>
              </p>
            </Sidenote>
          </>
        }
      >
        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          work
        </p>
        <h1 className="mt-5 font-display display-page text-foreground">
          Things I&apos;ve built, with the story attached
        </h1>
        <p className="mt-6 max-w-[56ch] font-serif text-[1.125rem] leading-[1.72] text-foreground/85">
          A portfolio usually shows the finished thing and hides the thinking.
          These are the other way round.
        </p>
      </Manuscript>

      <div className="mt-16">
        {projects.map((project) => {
          const meta = projectStatusMeta(project.status);
          return (
            <Manuscript
              key={project.slug}
              className="border-b border-border py-9 first:border-t last:border-b-0"
              folio={
                <div className="space-y-2">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-brand">
                    {meta.label}
                  </p>
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground tabnum">
                    {project.period}
                  </p>
                </div>
              }
              margin={
                <Sidenote label="stack" leader>
                  <p className="font-mono text-[11px] leading-[1.9] text-muted-foreground">
                    {project.stack.join("  ·  ")}
                  </p>
                  <p className="mt-3 font-serif text-[0.925rem] leading-relaxed text-muted-foreground">
                    {project.role}
                  </p>
                  <p className="mt-3">
                    <MarginLink href={`/projects/${project.slug}`}>
                      case study →
                    </MarginLink>
                  </p>
                </Sidenote>
              }
            >
              <h2 className="font-display text-[1.75rem] leading-snug tracking-tight">
                <Link
                  href={`/projects/${project.slug}`}
                  className="border-b border-transparent pb-[2px] text-foreground transition-colors hover:border-brand"
                >
                  {project.title}
                </Link>
              </h2>
              <p className="mt-2 font-serif text-[1.0625rem] leading-snug text-muted-foreground italic">
                {project.tagline}
              </p>
              <p className="mt-4 max-w-[62ch] font-serif text-[1.0625rem] leading-[1.72] text-muted-foreground">
                {project.summary}
              </p>
              <p className="mt-4 font-mono text-[11px] text-muted-foreground/80">
                {project.tags.join("  ·  ")}
                <Sep />
                <span className="ml-3">{project.year}</span>
              </p>
            </Manuscript>
          );
        })}
      </div>
    </main>
  );
}
