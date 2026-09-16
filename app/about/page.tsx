import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { profile } from "@/content/profile";
import { experience } from "@/content/experience";
import { education } from "@/content/education";
import { SocialRow } from "@/components/layout/social-row";
import { StatusDot } from "@/components/layout/status-dot";

export const metadata: Metadata = {
  title: "About",
  description:
    "How I think and how I work — a software engineer shipping production React/Next.js by day and building Melro.io on the side. Open to full-time and contract work.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    title: "Ship, then sharpen",
    body: "A working thing in someone's hands teaches you more than a perfect thing in your head. I get to a thin vertical slice fast, then improve against real use.",
  },
  {
    title: "DX is a feature",
    body: "The experience of building the thing matters. Clean component boundaries, fast feedback, and patterns people can follow make the whole team faster.",
  },
  {
    title: "Decide what not to build",
    body: "The hardest part of product work isn't building — it's the cutting. I'd rather ship one well-scoped thing than three half-finished ones.",
  },
  {
    title: "Founder thinking compounds",
    body: "Running a side company makes me ask better questions at my day job: who is this for, what happens after we ship, what's the smallest useful thing.",
  },
];

export default function AboutPage() {
  return (
    <main className="container py-16 md:py-24">
      {/* Header */}
      <header className="grid grid-cols-1 gap-8 border-b border-border pb-12 md:grid-cols-[auto_1fr] md:gap-10">
        <Image
          src={profile.avatarUrl}
          alt={profile.name}
          width={96}
          height={96}
          className="h-24 w-24 rounded-full border border-border object-cover grayscale"
          unoptimized
        />
        <div className="min-w-0">
          <p className="label mb-3">
            {profile.role} · {profile.location}
          </p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,3.75rem)] leading-[1.05] tracking-tight text-foreground">
            {profile.name}
          </h1>
          <p className="mt-4 max-w-2xl font-serif text-xl leading-relaxed text-muted-foreground">
            {profile.tagline} I&apos;m open to full-time roles and contract
            work — and I keep a meaningful side project alive on purpose.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <StatusDot label="Open to full-time & contract work" />
            <SocialRow />
          </div>
        </div>
      </header>

      {/* Narrative */}
      <section className="mt-16 max-w-2xl">
        <p className="label-brand mb-4">How I got here</p>
        <div className="space-y-5 font-serif text-[1.0625rem] leading-relaxed text-muted-foreground">
          <p>
            I started in support and moved into software because I wanted to fix
            the things people were complaining about, not just file tickets
            about them. That shift shaped how I work: I still think from the
            user&apos;s frustration backward, not from the tech stack forward.
          </p>
          <p>
            Today I ship production React and Next.js at{" "}
            <span className="text-foreground">Aubay Portugal</span>, working on
            a React + GraphQL codebase large enough that architecture and
            testing actually matter. In parallel, I run{" "}
            <a
              href={profile.founded.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline underline-offset-4 decoration-brand/40 hover:decoration-brand"
            >
              {profile.founded.name}
            </a>{" "}
            on the side — {profile.founded.blurb.toLowerCase()}
          </p>
          <p>
            The two feed each other. Founding on the side makes me a better
            engineer at my day job, not a distracted one. It forces the
            questions that are easy to skip when someone else owns the roadmap:
            who is this for, what happens after we ship, what&apos;s the
            smallest thing that&apos;s actually useful.
          </p>
        </div>
      </section>

      {/* How I think */}
      <section className="mt-20">
        <div className="mb-8 flex items-baseline gap-3 border-b border-border pb-4">
          <span className="label-brand">01</span>
          <span className="label">How I think</span>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          {principles.map((p) => (
            <div key={p.title} className="bg-card p-6 md:p-7">
              <h3 className="text-base font-semibold text-foreground">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Experience as stories */}
      <section className="mt-20">
        <div className="mb-8 flex items-baseline gap-3 border-b border-border pb-4">
          <span className="label-brand">02</span>
          <span className="label">Where I&apos;ve worked</span>
        </div>
        <ul className="space-y-10">
          {experience.map((job) => (
            <li
              key={`${job.company}-${job.period}`}
              className="grid grid-cols-1 gap-3 md:grid-cols-[220px_1fr] md:gap-10"
            >
              <div className="flex flex-col gap-1.5">
                <span className="label">{job.period}</span>
                {job.current && <StatusDot label="current" pulse={false} />}
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-xl leading-snug text-foreground">
                  {job.role}
                  <span className="text-muted-foreground"> · {job.company}</span>
                </h3>
                {job.location && (
                  <p className="mt-0.5 label">{job.location}</p>
                )}
                <p className="mt-3 max-w-2xl font-serif text-[0.975rem] leading-relaxed text-muted-foreground">
                  {job.summary}
                </p>
                {job.story && (
                  <p className="mt-3 max-w-2xl font-serif text-[0.975rem] leading-relaxed text-muted-foreground/80">
                    {job.story}
                  </p>
                )}
                {job.stack && job.stack.length > 0 && (
                  <p className="mt-3 font-mono text-[12px] text-muted-foreground/70">
                    {job.stack.join(" · ")}
                  </p>
                )}
                {job.link && (
                  <Link
                    href={job.link.href}
                    target={job.link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      job.link.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="mt-3 inline-flex items-center gap-1 font-mono text-[13px] text-brand hover:underline"
                  >
                    {job.link.label} →
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Education — minimal, at the bottom */}
      <section className="mt-20">
        <div className="mb-8 flex items-baseline gap-3 border-b border-border pb-4">
          <span className="label-brand">03</span>
          <span className="label">Education &amp; study</span>
        </div>
        <ul className="divide-y divide-border border-y border-border">
          {education.map((edu) => (
            <li
              key={`${edu.title}-${edu.org}`}
              className="grid grid-cols-1 gap-1 py-4 md:grid-cols-[160px_1fr] md:gap-8"
            >
              <span className="label">{edu.period}</span>
              <div>
                <p className="font-display text-base leading-snug text-foreground">
                  {edu.title}{" "}
                  <span className="font-serif text-muted-foreground">
                    · {edu.org}
                  </span>
                </p>
                <p className="mt-0.5 font-serif text-[0.95rem] text-muted-foreground">
                  {edu.note}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="mt-20 rounded-lg border border-border bg-card p-6 md:p-8">
        <p className="text-base text-foreground">
          Curious about working together?{" "}
          <Link
            href="/contact"
            className="text-brand underline underline-offset-4 decoration-brand/40 hover:decoration-brand"
          >
            Let&apos;s talk
          </Link>{" "}
          — or see{" "}
          <Link
            href="/projects"
            className="text-foreground underline underline-offset-4 decoration-border hover:text-brand hover:decoration-brand"
          >
            what I&apos;ve built
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
