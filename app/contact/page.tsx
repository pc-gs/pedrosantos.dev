import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/contact-form";
import { PageContainer } from "@/components/layout/page-container";
import { SectionLabel } from "@/components/ui/section-label";
import { siteConfig, socialLinks } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch — open to full-time and contract opportunities.",
};

export default function ContactPage() {
  return (
    <PageContainer wide>
      <div className="mb-10 surface-panel-elevated">
        <SectionLabel>Contact</SectionLabel>
        <h1 className="mb-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Let&apos;s talk
        </h1>
        <p className="max-w-2xl text-muted-foreground leading-relaxed">
          Full-time role or contract project? Tell me what you&apos;re building. I
          reply within a couple of days.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="surface-panel lg:col-span-2">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Direct
          </h2>
          <div className="space-y-4">
            <div>
              <p className="font-mono text-xs text-muted-foreground">Email</p>
              <Link
                href={`mailto:${siteConfig.email}`}
                className="text-sm transition-colors hover:text-accent"
              >
                {siteConfig.email}
              </Link>
            </div>
            <div>
              <p className="font-mono text-xs text-muted-foreground">Location</p>
              <p className="text-sm">{siteConfig.location}</p>
            </div>
          </div>

          <h2 className="mb-4 mt-8 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Elsewhere
          </h2>
          <div className="flex flex-col gap-2">
            {socialLinks
              .filter((l) => l.href.startsWith("http"))
              .map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-muted-foreground transition-colors hover:text-accent"
                >
                  {link.label} →
                </Link>
              ))}
          </div>
        </div>

        <div className="surface-panel lg:col-span-3">
          <ContactForm />
        </div>
      </div>
    </PageContainer>
  );
}