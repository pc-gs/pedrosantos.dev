import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { profile } from "@/content/profile";
import { experience } from "@/content/experience";
import { education } from "@/content/education";
import { Wrap } from "@/components/site/wrap";
import { Eyebrow } from "@/components/site/eyebrow";
import { LinkButton } from "@/components/site/link-button";

export const metadata: Metadata = {
  title: "About",
  description:
    "How I think and how I work: a software engineer shipping production React/Next.js by day and building Melro.io on the side. Open to full-time and contract work.",
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
    body: "The hardest part of product work isn't building, it's the cutting. I'd rather ship one well-scoped thing than three half-finished ones.",
  },
  {
    title: "Founder thinking compounds",
    body: "Running a side company makes me ask better questions at my day job: who is this for, what happens after we ship, what's the smallest useful thing.",
  },
];

/** Section with its number in a gutter, used for all the ruled lists here. */
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
    <section className="border-t border-border py-10 md:py-12">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-6">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-brand">
          {index}
        </p>
        <div className="min-w-0">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </p>
          <div className="mt-5">{children}</div>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <main>
      <Wrap className="pb-10 pt-14 md:pt-20">
        <Eyebrow>About · {profile.role}</Eyebrow>
        <h1 className="mt-6 max-w-[18ch] font-display text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[0.95] tracking-[-0.025em]">
          {profile.name}
        </h1>
        <p className="mt-6 max-w-[24ch] font-display text-[clamp(1.5rem,3.2vw,2.25rem)] leading-snug tracking-[-0.015em]">
          I make software, break it, fix it, and learn something along the way.
        </p>
        <p className="mt-6 max-w-[58ch] text-[1.125rem] leading-relaxed text-muted-foreground">
          Software engineer from Belmonte, Portugal. I&apos;m open to full-time
          roles and contract work, and I keep a meaningful side project alive on
          purpose.
        </p>
      </Wrap>

      <Wrap className="pb-10">
        <dl className="grid grid-cols-1 gap-6 border-y border-border py-6 sm:grid-cols-2 md:grid-cols-4 md:gap-10">
          {[
            { label: "Based in", value: profile.location },
            { label: "In tech", value: "more than a decade" },
            { label: "Now", value: "React + GraphQL at Aubay" },
            { label: "Availability", value: "full-time & contract, remote (EU)" },
          ].map((row) => (
            <div key={row.label}>
              <dt className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground">
                {row.label}
              </dt>
              <dd className="mt-2 text-[0.9375rem] leading-snug">{row.value}</dd>
            </div>
          ))}
        </dl>
      </Wrap>

      <Wrap>
        <div className="max-w-[62ch] space-y-5 text-[1.0625rem] leading-[1.75] text-muted-foreground">
          <p>
            I started in support and moved into software because I wanted to fix
            the things people were complaining about, not just file tickets
            about them. That shift shaped how I work: I still think from the
            user&apos;s frustration backward, not from the tech stack forward.
          </p>
          <p>
            Today I ship production React and Next.js at{" "}
            <span className="text-foreground">Aubay Portugal</span>, on a React
            + GraphQL codebase large enough that frontend architecture and
            testing stop being opinions and start being infrastructure. I care
            most about the parts of the job that make everyone else faster:
            clean component boundaries, patterns people can actually follow,
            and reviews that teach instead of gatekeeping.
          </p>
          <p>
            On the side I run{" "}
            <a
              href={profile.founded.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-inline"
            >
              {profile.founded.name}
            </a>
            , the engineer&apos;s version of founding: owning the whole loop,
            not just the implementation. And this site, which is where I write
            down what I&apos;m learning and the work behind it.
          </p>
          <p>
            I love the web. With AI as a drafting partner, I&apos;m learning
            what it takes to build professionally and securely for any
            environment, from a browser tab to a phone to a desktop app. The
            goal isn&apos;t speed for its own sake: it&apos;s shipping things
            that are safe to put in front of real users.
          </p>
        </div>

        <Numbered index="01" label="How I think">
          <ul>
            {principles.map((principle) => (
              <li
                key={principle.title}
                className="border-b border-border py-5 first:pt-0 last:border-0"
              >
                <p className="font-display text-[1.3rem] leading-snug tracking-[-0.01em]">
                  {principle.title}
                </p>
                <p className="mt-2 max-w-[62ch] text-[1.0625rem] leading-[1.75] text-muted-foreground">
                  {principle.body}
                </p>
              </li>
            ))}
          </ul>
        </Numbered>

        <Numbered index="02" label="Where I've worked">
          <ul>
            {experience.map((job) => (
              <li
                key={`${job.company}-${job.period}`}
                className="border-b border-border py-6 first:pt-0 last:border-0"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {job.period}
                  {job.current && (
                    <span className="ml-2 text-brand">current</span>
                  )}
                </p>
                <p className="mt-2 font-display text-[1.3rem] leading-snug tracking-[-0.01em]">
                  {job.role}
                  <span className="text-muted-foreground">
                    {" "}
                    · {job.company}
                  </span>
                </p>
                <p className="mt-3 max-w-[62ch] text-[1.0625rem] leading-[1.75] text-muted-foreground">
                  {job.summary}
                </p>
                {job.story && (
                  <p className="mt-3 max-w-[62ch] text-[1.0625rem] leading-[1.75] text-muted-foreground/85">
                    {job.story}
                  </p>
                )}
                <p className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-2 font-mono text-[10.5px] text-muted-foreground">
                  {job.stack?.join("  ·  ")}
                  {job.link && (
                    <a
                      href={job.link.href}
                      target={
                        job.link.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        job.link.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="text-brand transition-colors hover:text-foreground"
                    >
                      {job.link.label} ↗
                    </a>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </Numbered>

        <Numbered index="03" label="Education & study">
          <ul>
            {education.map((edu) => (
              <li
                key={`${edu.title}-${edu.org}`}
                className="grid grid-cols-1 gap-y-1.5 border-b border-border py-4 first:pt-0 last:border-0 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-x-6"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {edu.period}
                </span>
                <div className="min-w-0">
                  <p className="font-display text-[1.15rem] leading-snug tracking-[-0.01em]">
                    {edu.title}{" "}
                    <span className="text-muted-foreground">· {edu.org}</span>
                  </p>
                  <p className="mt-1 text-[0.975rem] text-muted-foreground">
                    {edu.note}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Numbered>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-border py-10">
          <LinkButton href="/contact" variant="solid">
            Start a conversation
          </LinkButton>
          <Link
            href="/work"
            className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-brand"
          >
            see what I&apos;ve built →
          </Link>
        </div>
      </Wrap>
    </main>
  );
}
