import type { Metadata } from "next";
import { profile } from "@/content/profile";
import { SocialRow } from "@/components/layout/social-row";
import { StatusDot } from "@/components/layout/status-dot";
import { ContactForm } from "@/components/sections/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Open to full-time roles and contract work. Send a message or email Pedro Santos — software engineer shipping production React/Next.js and building Melro.io on the side.",
  alternates: { canonical: "/contact" },
};

const channels = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  {
    label: "LinkedIn",
    value: "pedro-santos",
    href: "https://linkedin.com/in/pedro-santos",
  },
  { label: "X", value: "@pcgs_tsx", href: "https://x.com/pcgs_tsx" },
  { label: "GitHub", value: "pedrocarlos-ti", href: "https://github.com/pedrocarlos-ti" },
];

export default function ContactPage() {
  return (
    <main className="container py-16 md:py-24">
      <header className="mb-12 border-b border-border pb-6">
        <p className="label mb-3">Contact</p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          Let&apos;s talk.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
          I&apos;m open to full-time roles and contract work. If something on
          this site resonates, the form below is the fastest way — or just email
          me directly.
        </p>
        <div className="mt-6">
          <StatusDot label="Open to full-time & contract work" />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        {/* Availability + channels */}
        <aside className="order-2 lg:order-1">
          <section className="rounded-lg border border-border bg-card p-6 md:p-7">
            <p className="label-brand mb-4">What I&apos;m open to</p>
            <ul className="space-y-3">
              {profile.availability.types.map((type) => (
                <li
                  key={type}
                  className="flex items-center gap-2.5 font-serif text-[1.0625rem] text-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  {type === "full-time"
                    ? "Full-time engineering roles"
                    : "Contract & freelance work"}
                </li>
              ))}
            </ul>
            <p className="mt-4 font-serif text-[0.975rem] leading-relaxed text-muted-foreground">
              {profile.availability.note}
            </p>
          </section>

          <section className="mt-6 rounded-lg border border-border bg-card p-6 md:p-7">
            <p className="label mb-4">Channels</p>
            <ul className="space-y-3">
              {channels.map((c) => (
                <li key={c.label} className="flex items-baseline justify-between gap-4">
                  <span className="label">{c.label}</span>
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="truncate font-mono text-[13px] text-foreground underline underline-offset-4 decoration-border hover:text-brand hover:decoration-brand"
                  >
                    {c.value}
                  </a>
                </li>
              ))}
              <li className="flex items-baseline justify-between gap-4">
                <span className="label">Location</span>
                <span className="font-mono text-[13px] text-foreground">
                  {profile.location}
                </span>
              </li>
            </ul>
          </section>

          <section className="mt-6 rounded-lg border border-border bg-card p-6 md:p-7">
            <p className="label mb-2">Melro.io</p>
            <p className="font-serif text-[0.975rem] leading-relaxed text-muted-foreground">
              For business inquiries about the side company:
            </p>
            <a
              href="mailto:developer@melro.io"
              className="mt-2 inline-block font-mono text-[13px] text-brand underline underline-offset-4 decoration-brand/40 hover:decoration-brand"
            >
              developer@melro.io
            </a>
          </section>

          <div className="mt-6">
            <SocialRow />
          </div>
        </aside>

        {/* Form */}
        <section className="order-1 lg:order-2">
          <div className="rounded-lg border border-border bg-card p-6 md:p-8">
            <h2 className="text-lg font-semibold text-foreground">
              Send a message
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Tell me about the role, the project, or what you&apos;re building.
              I read every one.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
