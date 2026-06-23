import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { SectionLabel } from "@/components/ui/section-label";
import { aboutContent, education, experience } from "@/lib/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "Software engineer shipping React/Next.js work and building side projects. Open to full-time and contract opportunities.",
};

export default function AboutPage() {
  return (
    <PageContainer wide>
      <div className="mb-10 surface-panel-elevated">
        <SectionLabel>About</SectionLabel>
        <h1 className="mb-6 text-3xl font-semibold tracking-tight md:text-4xl">
          Pedro Santos
        </h1>

        <div className="mb-6 flex items-center gap-5">
          <Image
            src="https://avatars.githubusercontent.com/u/18473317?v=4"
            alt="Pedro Santos"
            width={64}
            height={64}
            className="rounded-xl border border-border/60"
          />
          <div>
            <p className="text-sm text-muted-foreground">Software Engineer</p>
            <p className="font-mono text-xs text-muted-foreground">
              Belmonte, Portugal
            </p>
          </div>
        </div>

        <div className="space-y-4 text-[15px] leading-relaxed text-foreground/90 max-w-3xl">
          <p>{aboutContent.intro}</p>
          <p>{aboutContent.sideProjects}</p>
        </div>
      </div>

      <div className="mb-10 surface-panel">
        <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
          How I think
        </h2>
        <p className="text-sm leading-relaxed text-foreground/90">
          {aboutContent.focus}
        </p>
      </div>

      <div className="mb-10 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="surface-panel h-full">
            <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-accent">
              Experience
            </h2>
            <div className="space-y-8">
              {experience.map((job) => (
                <div key={job.company}>
                  <div className="mb-1 flex flex-wrap items-baseline gap-2">
                    <h3 className="font-medium">{job.title}</h3>
                    <span className="text-sm text-muted-foreground">
                      @ {job.company}
                    </span>
                  </div>
                  <p className="mb-2 font-mono text-xs text-muted-foreground">
                    {job.period}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {job.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="surface-panel h-full">
            <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-accent">
              Background
            </h2>
            <div className="space-y-4">
              {education.map((item) => (
                <div key={item.title} className="text-sm">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-muted-foreground">{item.institution} · {item.year}</p>
                </div>
              ))}
              <p className="pt-3 text-xs text-muted-foreground/80">
                Everything else I know came from shipping real work and paying attention to what actually moves the needle.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        More on what I&apos;m building right now lives on the <Link href="/" className="text-accent hover:underline">homepage</Link> and in <Link href="/projects" className="text-accent hover:underline">projects</Link>.
      </div>
    </PageContainer>
  );
}