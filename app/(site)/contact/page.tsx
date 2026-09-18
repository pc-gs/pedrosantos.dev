import type { Metadata } from "next";
import { profile } from "@/content/profile";
import { SocialRow } from "@/components/layout/social-row";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { Folio, Manuscript, Sidenote } from "@/components/manuscript/manuscript";
import { Stamp } from "@/components/manuscript/marks";

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
  {
    label: "GitHub",
    value: "pedrocarlos-ti",
    href: "https://github.com/pedrocarlos-ti",
  },
];

export default function ContactPage() {
  return (
    <main className="container py-12 md:py-16">
      <Manuscript
        marginWidth="wide"
        folio={<Folio>contact</Folio>}
        margin={
          <>
            {profile.availability.open && (
              <div>
                <Stamp tone="brand">open to work</Stamp>
                <p className="mt-3 font-serif text-[0.925rem] leading-relaxed text-muted-foreground">
                  {profile.availability.note}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {profile.availability.types.map((type) => (
                    <li
                      key={type}
                      className="flex items-baseline gap-2.5 font-serif text-[0.975rem] text-foreground"
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

            <Sidenote label="channels" leader>
              <ul className="space-y-2.5">
                {channels.map((c) => (
                  <li key={c.label}>
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                      {c.label}
                    </p>
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        c.href.startsWith("http") ? "noopener noreferrer" : undefined
                      }
                      className="mt-1 block break-words font-serif text-[0.975rem] text-foreground underline decoration-border underline-offset-[3px] transition-colors hover:text-brand hover:decoration-brand"
                    >
                      {c.value}
                    </a>
                  </li>
                ))}
              </ul>
            </Sidenote>

            <Sidenote label="the side company">
              <p className="font-serif text-[0.925rem] leading-relaxed text-muted-foreground">
                For business enquiries about Melro.io rather than the day job:
              </p>
              <a
                href="mailto:developer@melro.io"
                className="mt-2 inline-block font-mono text-[11.5px] text-brand underline decoration-brand/30 underline-offset-[3px] transition-colors hover:decoration-brand"
              >
                developer@melro.io
              </a>
            </Sidenote>

            <Sidenote label="elsewhere">
              <SocialRow />
            </Sidenote>
          </>
        }
      >
        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          contact
        </p>
        <h1 className="mt-5 font-display display-page text-foreground">
          Let&apos;s talk<span className="text-brand">.</span>
        </h1>
        <p className="mt-6 max-w-[54ch] font-serif text-[1.125rem] leading-[1.72] text-foreground/85">
          I read everything myself. Tell me about the role, the project, or the
          thing you are building — the form below reaches the same inbox as a
          direct email.
        </p>

        <div className="mt-12 border-t border-border pt-8">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            send a message
          </p>
          <div className="mt-7">
            <ContactForm />
          </div>
        </div>
      </Manuscript>
    </main>
  );
}
