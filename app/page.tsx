import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PostList } from "@/components/blog/post-list";
import { PageContainer } from "@/components/layout/page-container";
import { ProjectCard } from "@/components/projects/project-card";
import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { getLatestPosts } from "@/lib/blog";
import { nowItems } from "@/lib/now";
import { getFeaturedProjects } from "@/lib/projects";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  const featuredProjects = getFeaturedProjects();
  const latestPosts = getLatestPosts(3);

  return (
    <PageContainer wide>
      <section className="mb-10 surface-panel-elevated md:mb-14">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-accent">
              {siteConfig.availability}
            </p>
            <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Hey — I&apos;m {siteConfig.name}.
            </h1>
            <p className="mb-3 text-lg text-muted-foreground leading-relaxed">
              {siteConfig.tagline}
            </p>
            <p className="mb-8 max-w-2xl text-muted-foreground leading-relaxed">
              Day job is React/Next.js production work for teams. On the side I keep
              Melro.io — a real founder project — moving. If the way I think about
              problems and shipping resonates, let&apos;s talk.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/projects">
                  View projects
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/contact">Get in touch</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-xl border border-border/50 bg-surface p-5">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-glow">
              Quick links
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-accent">
                About me →
              </Link>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-accent">
                Latest writing →
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-accent">
                Contact →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10 md:mb-14">
        <SectionLabel>Now</SectionLabel>
        <div className="bento-grid">
          {nowItems.map((item) => (
            <div key={item.label} className="surface-panel">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-accent">
                {item.label}
              </p>
              <p className="text-sm leading-relaxed text-foreground/90">
                {item.description}
                {item.href && (
                  <>
                    {" "}
                    <Link
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      {item.href.replace("https://", "")}
                    </Link>
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10 md:mb-14">
        <div className="mb-6 flex items-center justify-between">
          <SectionLabel className="mb-0">Selected work</SectionLabel>
          <Link
            href="/projects"
            className="font-mono text-xs text-muted-foreground transition-colors hover:text-accent"
          >
            View all →
          </Link>
        </div>
        <div className="bento-grid">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="mb-10 md:mb-14">
        <div className="mb-6 flex items-center justify-between">
          <SectionLabel className="mb-0">Writing</SectionLabel>
          <Link
            href="/blog"
            className="font-mono text-xs text-muted-foreground transition-colors hover:text-accent"
          >
            All posts →
          </Link>
        </div>
        <div className="surface-panel">
          <PostList posts={latestPosts} />
        </div>
      </section>

      <section className="surface-panel-elevated text-center">
        <h2 className="mb-2 text-xl font-medium">Open to work</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Full-time roles and contract work. The day job funds the side project;
          both stay active.
        </p>
        <Button asChild className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href="/contact">Let&apos;s talk →</Link>
        </Button>
      </section>
    </PageContainer>
  );
}