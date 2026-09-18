import type { Metadata } from "next";
import { profile } from "@/content/profile";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { Wrap } from "@/components/site/wrap";
import { Eyebrow } from "@/components/site/eyebrow";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Open to full-time roles and contract work. Send a message or email Pedro Santos, software engineer shipping production React/Next.js and building Melro.io on the side.",
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
  {
    label: "GitHub",
    value: "pedrocarlos-ti",
    href: "https://github.com/pedrocarlos-ti",
  },
];

export default function ContactPage() {
  return (
    <main>
      <Wrap className="pb-10 pt-14 md:pt-20">
        <Eyebrow>Contact</Eyebrow>
        <h1 className="mt-6 max-w-[18ch] font-display text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[0.95] tracking-[-0.025em]">
          Let&apos;s talk<span className="text-brand">.</span>
        </h1>
        <p className="mt-6 max-w-[58ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
          I read everything myself. Tell me about the role, the project, or the
          thing you are building. The form reaches the same inbox as a direct
          email.
        </p>
      </Wrap>

      <Wrap className="pb-20 md:pb-24">
        <div className="grid grid-cols-1 gap-12 border-t border-border pt-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <section aria-labelledby="form-heading">
            <h2
              id="form-heading"
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
            >
              Send a message
            </h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </section>

          <aside>
            {profile.availability.open && (
              <div className="border border-border bg-card p-5">
                <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-brand">
                  Open to work
                </p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {profile.availability.note}
                </p>
                <ul className="mt-4 space-y-2">
                  {profile.availability.types.map((type) => (
                    <li
                      key={type}
                      className="flex items-baseline gap-2.5 text-[0.9375rem]"
                    >
                      <span
                        aria-hidden
                        className="h-1 w-1 shrink-0 rounded-full bg-brand"
                      />
                      {type === "full-time"
                        ? "Full-time engineering roles"
                        : "Contract & freelance work"}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Channels
              </p>
              <ul className="mt-4 space-y-4">
                {channels.map((channel) => (
                  <li key={channel.label}>
                    <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
                      {channel.label}
                    </p>
                    <a
                      href={channel.href}
                      target={
                        channel.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        channel.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="link-inline mt-1 block break-words text-[0.9375rem]"
                    >
                      {channel.value}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                The side company
              </p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
                For business enquiries about Melro.io rather than the day job:
              </p>
              <a
                href="mailto:developer@melro.io"
                className="link-inline mt-2 inline-block font-mono text-[11.5px]"
              >
                developer@melro.io
              </a>
            </div>
          </aside>
        </div>
      </Wrap>
    </main>
  );
}
