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
      {/* Open hero — content first, minimal decoration */}
      <section className="pt-8 pb-16 md:pt-12 md:pb-20">
        <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
          Hey — I&apos;m {siteConfig.name}.
        </h1>
        <p className="mb-3 text-lg text-muted-foreground leading-relaxed">
          {siteConfig.tagline}
        </p>
        <p className="mb-8 max-w-xl text-muted-foreground leading-relaxed">
          I ship production React/Next.js work for teams by day and keep a real
          founder project (Melro.io) moving on the side. If the way I think
          about problems and shipping resonates, let&apos;s talk.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/projects">
              View projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl border-border/70 hover:bg-surface">
            <Link href="/contact">Get in touch</Link>
          </Button>
        </div>
      </section>

      <section className="mb-16 md:mb-20">
        <SectionLabel>Now</SectionLabel>
        <div className="bento-grid">
          {nowItems.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-border/50 bg-[hsl(var(--surface))]/30 p-5 transition-colors hover:border-accent/40"
            >
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

      <section className="mb-16 md:mb-20">
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

      <section className="mb-16 md:mb-20">
        <div className="mb-6 flex items-center justify-between">
          <SectionLabel className="mb-0">Writing</SectionLabel>
          <Link
            href="/blog"
            className="font-mono text-xs text-muted-foreground transition-colors hover:text-accent"
          >
            All posts →
          </Link>
        </div>
        <PostList posts={latestPosts} />
      </section>

      <section className="border-t border-border/60 pt-8 pb-12 text-center">
        <p className="mb-4 text-sm text-muted-foreground">
          Open to full-time roles and contract work.
        </p>
        <Button asChild className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href="/contact">Let&apos;s talk →</Link>
        </Button>
      </section>
    </PageContainer>
  );
}