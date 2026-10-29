import type { ComponentType } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ProjectCover } from "@/components/covers/project-cover";

/**
 * Hand-drawn project art, one scene per project.
 *
 * These are diagrams, not screenshots: each one shows what the tool actually
 * does. A project with a real screenshot (`cover`) shows that instead, in
 * the same 16:10 frame; the monogram cover
 * stays as the fallback for projects without a scene yet.
 */

function Frame({
  children,
  corner,
}: {
  children: React.ReactNode;
  corner?: string;
}) {
  return (
    <div className="relative h-full w-full bg-card">
      {children}
      {corner && (
        <span className="absolute top-3 right-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {corner}
        </span>
      )}
    </div>
  );
}

/** A small storefront: software for local businesses. */
function MelroArt() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden>
      <rect
        x="84"
        y="42"
        width="152"
        height="22"
        fill="var(--brand)"
        opacity="0.9"
      />
      {[114, 144, 174, 204].map((x) => (
        <line
          key={x}
          x1={x}
          y1="42"
          x2={x}
          y2="64"
          stroke="var(--brand-foreground)"
          strokeWidth="4"
          opacity="0.85"
        />
      ))}
      <rect
        x="84"
        y="64"
        width="152"
        height="94"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="98"
        y="78"
        width="62"
        height="48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="98"
        y1="96"
        x2="160"
        y2="96"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
      />
      <rect
        x="176"
        y="96"
        width="46"
        height="62"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="212" cy="128" r="2.5" fill="var(--brand)" />
      <line
        x1="84"
        y1="158"
        x2="236"
        y2="158"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

const SCENES: Record<string, ComponentType> = {
  "melro-io": MelroArt,
};

export function ProjectArt({
  slug,
  title,
  cover,
  corner,
  className,
}: {
  slug: string;
  title: string;
  /** A real screenshot under /public; wins over the drawn scene. */
  cover?: string;
  corner?: string;
  className?: string;
}) {
  if (cover) {
    return (
      <div className="relative h-full w-full bg-[#191919]">
        <Image
          src={cover}
          alt={`${title} screenshot`}
          fill
          sizes="(min-width: 1024px) 1100px, 100vw"
          className={cn("object-contain p-6", className)}
        />
        {corner && (
          <span className="absolute top-3 right-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">
            {corner}
          </span>
        )}
      </div>
    );
  }

  const Scene = SCENES[slug];

  if (!Scene) {
    return (
      <ProjectCover
        slug={slug}
        title={title}
        corner={corner}
        className={className}
      />
    );
  }

  return (
    <Frame corner={corner}>
      <div className={cn("h-full w-full p-6 text-foreground", className)}>
        <Scene />
      </div>
    </Frame>
  );
}
