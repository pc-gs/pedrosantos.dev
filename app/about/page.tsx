import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { profile } from "@/content/profile";
import { experience } from "@/content/experience";
import { education } from "@/content/education";
import { SocialRow } from "@/components/layout/social-row";
import {
  Folio,
  Manuscript,
  Sidenote,
} from "@/components/manuscript/manuscript";
import { MarginLink, Stamp } from "@/components/manuscript/marks";

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

/** Section with its number in a sub-gutter, used for all the ruled lists here. */
function Numbered({
  index,
  label,
  children,
}: {
  index: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid grid-cols-1 gap-y-3 border-t border-border py-9 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-x-6">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground tabnum">
        <span className="text-brand">{index}</span>
      </p>
      <div className="min-w-0">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <div className="mt-5">{children}</div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <main className="container py-12 md:py-16">
      <Manuscript
        marginWidth="wide"
        folio={<Folio>about</Folio>}
        margin={
          <>
            <figure>
              <Image
                src={profile.avatarUrl}
                alt={profile.name}
                width={320}
                height={320}
                className="h-auto w-full border border-border object-cover grayscale"
                unoptimized
              />
              <figcaption className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                {profile.location}
              </figcaption>
            </figure>

            {profile.availability.open && (
              <div>
                <Stamp tone="brand">open to work</Stamp>
                <p className="mt-3 font-serif text-[0.925rem] leading-relaxed text-muted-foreground">
                  {profile.availability.note}
                </p>
              </div>
            )}

            <Sidenote label="elsewhere">
              <SocialRow />
            </Sidenote>

            <Sidenote label="">
              <MarginLink href="/contact">start a conversation →</MarginLink>
            </Sidenote>
          </>
        }
      >
        <header className="border-b border-border pb-9">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            about · {profile.role}
          </p>
          <h1 className="mt-5 font-display display-page text-foreground">
            {profile.name}
          </h1>
          <p className="mt-6 max-w-[56ch] font-serif text-[1.25rem] leading-[1.6] text-foreground/85">
            {profile.tagline} I&apos;m open to full-time roles and contract work
            — and I keep a meaningful side project alive on purpose.
          </p>
        </header>

        <div className="mt-10 max-w-[62ch] space-y-5 font-serif text-[1.0625rem] leading-[1.72] text-muted-foreground">
          <p>
            I started in support and moved into software because I wanted to fix
            the things people were complaining about, not just file tickets
            about them. That shift shaped how I work: I still think from the
            user&apos;s frustration backward, not from the tech stack forward.
          </p>
          <p>
            Today I ship production React and Next.js at{" "}
            <span className="text-foreground">Aubay Portugal</span>, on a React +
            GraphQL codebase large enough that frontend architecture and testing
            stop being opinions and start being infrastructure. I care most
            about the parts of the job that make everyone else faster: clean
            component boundaries, patterns people can actually follow, and
            reviews that teach instead of gatekeeping.
          </p>
          <p>
            On the side I run{" "}
            <a
              href={profile.founded.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-ink"
            >
              {profile.founded.name}
            </a>
            {" "}
            — the engineer&apos;s version of founding: owning the whole loop, not
            just the implementation. And this site, which is deliberately a
            manuscript: what I&apos;m learning, the prompts behind it, and the
            work with the thinking left in.
          </p>
        </div>

        <Numbered index="01" label="How I think">
          <ul>
            {principles.map((p) => (
              <li key={p.title} className="border-b border-border/70 py-5 first:pt-0 last:border-0">
                <p className="font-display text-[1.3rem] leading-snug tracking-tight text-foreground">
                  {p.title}
                </p>
                <p className="mt-2 max-w-[62ch] font-serif text-[1.0625rem] leading-[1.72] text-muted-foreground">
                  {p.body}
                </p>
              </li>
            ))}
          </ul>
        </Numbered>

        <Numbered index="02" label="Where I&apos;ve worked">
          <ul>
            {experience.map((job) => (
              <li
                key={`${job.company}-${job.period}`}
                className="border-b border-border/70 py-6 first:pt-0 last:border-0"
              >
                <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground tabnum">
                  {job.period}
                  {job.current && <span className="ml-2 text-brand">current</span>}
                </p>
                <p className="mt-2 font-display text-[1.3rem] leading-snug tracking-tight text-foreground">
                  {job.role}
                  <span className="text-muted-foreground"> · {job.company}</span>
                </p>
                <p className="mt-3 max-w-[62ch] font-serif text-[1.0625rem] leading-[1.72] text-muted-foreground">
                  {job.summary}
                </p>
                {job.story && (
                  <p className="mt-3 max-w-[62ch] font-serif text-[1.0625rem] leading-[1.72] text-muted-foreground/80">
                    {job.story}
                  </p>
                )}
                <p className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-2 font-mono text-[11px] text-muted-foreground/80">
                  {job.stack?.join("  ·  ")}
                  {job.link && (
                    <a
                      href={job.link.href}
                      target={job.link.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        job.link.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="link-ink"
                    >
                      {job.link.label} →
                    </a>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </Numbered>

        <Numbered index="03" label="Education &amp; study">
          <ul>
            {education.map((edu) => (
              <li
                key={`${edu.title}-${edu.org}`}
                className="grid grid-cols-1 gap-y-1.5 border-b border-border/70 py-4 first:pt-0 last:border-0 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-x-6"
              >
                <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground tabnum">
                  {edu.period}
                </span>
                <div className="min-w-0">
                  <p className="font-display text-[1.15rem] leading-snug tracking-tight text-foreground">
                    {edu.title}{" "}
                    <span className="font-serif text-muted-foreground">
                      · {edu.org}
                    </span>
                  </p>
                  <p className="mt-1 font-serif text-[0.975rem] text-muted-foreground">
                    {edu.note}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Numbered>
      </Manuscript>

      <p className="mt-16 max-w-[56ch] font-serif text-[1.0625rem] leading-relaxed text-muted-foreground">
        Curious about working together?{" "}
        <Link href="/contact" className="link-ink">
          Let&apos;s talk
        </Link>{" "}
        — or see{" "}
        <Link href="/projects" className="link-plain">
          what I&apos;ve built
        </Link>
        .
      </p>
    </main>
  );
}
