import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import { ProjectCover } from "@/components/covers/project-cover";

/**
 * Hand-drawn project art, one scene per project.
 *
 * These are diagrams, not screenshots: each one shows what the tool actually
 * does (a script dropdown, a branching tree, a drawn line). When real
 * screenshots exist, they drop into the same 16:10 frame; the monogram cover
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

/** A command palette: search field, list rows, one highlighted. */
function SelectScriptArt() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden>
      <rect
        x="58"
        y="28"
        width="204"
        height="30"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="70"
        y1="43"
        x2="146"
        y2="43"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 5"
        opacity="0.55"
      />
      <rect x="149" y="36" width="2.5" height="14" fill="var(--brand)" />
      {[72, 96, 120, 144].map((y, index) => (
        <g key={y}>
          <rect
            x="58"
            y={y}
            width="204"
            height="18"
            fill={index === 1 ? "var(--brand)" : "none"}
            stroke="currentColor"
            strokeWidth="1"
            opacity={index === 1 ? 0.9 : 0.5}
          />
          <line
            x1="70"
            y1={y + 9}
            x2={index === 1 ? 128 : 150 + index * 14}
            y2={y + 9}
            stroke={index === 1 ? "var(--brand-foreground)" : "currentColor"}
            strokeWidth="1.5"
            opacity={index === 1 ? 0.9 : 0.4}
          />
        </g>
      ))}
    </svg>
  );
}

/** A branching tree of concepts, one path taken. */
function AiTreeArt() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden>
      <g stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.55">
        <line x1="76" y1="100" x2="156" y2="48" />
        <line x1="76" y1="100" x2="156" y2="152" />
        <line x1="176" y1="100" x2="252" y2="100" />
      </g>
      <line
        x1="76"
        y1="100"
        x2="156"
        y2="100"
        stroke="var(--brand)"
        strokeWidth="2.5"
      />
      <line
        x1="172"
        y1="100"
        x2="236"
        y2="62"
        stroke="var(--brand)"
        strokeWidth="2.5"
      />
      <circle cx="76" cy="100" r="8" fill="currentColor" />
      <circle
        cx="166"
        cy="100"
        r="7"
        fill="var(--brand)"
        stroke="var(--brand)"
        strokeWidth="2"
      />
      <circle
        cx="243"
        cy="56"
        r="6"
        fill="var(--brand)"
        stroke="var(--brand)"
        strokeWidth="2"
      />
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="166" cy="42" r="6" />
        <circle cx="166" cy="158" r="6" />
        <circle cx="262" cy="100" r="6" />
      </g>
    </svg>
  );
}

/** A transparent overlay with a drawn line on top of a screen. */
function ElectronDrawArt() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden>
      <rect
        x="66"
        y="34"
        width="188"
        height="116"
        rx="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="66"
        y1="50"
        x2="254"
        y2="50"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />
      <circle cx="76" cy="42" r="2.5" fill="currentColor" opacity="0.5" />
      <circle cx="86" cy="42" r="2.5" fill="currentColor" opacity="0.5" />
      <circle cx="96" cy="42" r="2.5" fill="currentColor" opacity="0.5" />
      <rect
        x="142"
        y="150"
        width="36"
        height="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="126"
        y="155"
        width="68"
        height="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M 96 122 C 116 78, 146 88, 156 110 S 200 132, 214 84"
        fill="none"
        stroke="var(--brand)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="214" cy="84" r="3.5" fill="var(--brand)" />
    </svg>
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
  "select-script": SelectScriptArt,
  "ai-tree": AiTreeArt,
  "electron-draw": ElectronDrawArt,
  "melro-io": MelroArt,
};

export function ProjectArt({
  slug,
  title,
  corner,
  className,
}: {
  slug: string;
  title: string;
  corner?: string;
  className?: string;
}) {
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
