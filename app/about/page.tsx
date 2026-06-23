import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { aboutContent, education, experience, skills } from "@/lib/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "Software engineer with 8+ years in tech. React, Next.js, TypeScript.",
};

export default function AboutPage() {
  return (
    <PageContainer wide>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <div className="surface-panel-elevated">
            <SectionLabel>About</SectionLabel>
            <h1 className="mb-6 text-3xl font-semibold tracking-tight md:text-4xl">
              Pedro Santos
            </h1>

            <div className="mb-8 flex items-center gap-5">
              <Image
                src="https://avatars.githubusercontent.com/u/18473317?v=4"
                alt="Pedro Santos"
                width={72}
                height={72}
                className="rounded-2xl border border-border/60"
              />
              <div>
                <p className="text-sm text-muted-foreground">Software Engineer</p>
                <p className="font-mono text-xs text-muted-foreground">
                  Belmonte, Portugal
                </p>
              </div>
            </div>

            <div className="space-y-4 leading-relaxed text-foreground/90">
              <p>{aboutContent.intro}</p>
              <p>{aboutContent.sideProjects}</p>
            </div>
          </div>

          <div className="surface-panel">
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
              Focus
            </h2>
            <ul className="space-y-2">
              {aboutContent.focus.map((item) => (
                <li key={item} className="flex gap-3 text-sm">
                  <span className="text-accent">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Button asChild variant="outline" className="rounded-xl font-mono text-xs">
            <Link href="/resume.pdf" target="_blank">
              <Download className="h-3.5 w-3.5" />
              Download resume
            </Link>
          </Button>
        </div>

        <div className="space-y-6">
          <div className="surface-panel">
            <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-accent">
              Experience
            </h2>
            <div className="space-y-6">
              {experience.map((job) => (
                <div key={job.company} className="border-l-2 border-accent/30 pl-4">
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

          <div className="surface-panel">
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-border/60 bg-surface px-2.5 py-1 font-mono text-xs text-muted-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="surface-panel">
            <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-accent">
              Education
            </h2>
            <div className="space-y-4">
              {education.map((item) => (
                <div key={item.title} className="flex justify-between gap-4 text-sm">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-muted-foreground">{item.institution}</p>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    {item.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}