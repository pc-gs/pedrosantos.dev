import { cn } from "@/lib/utils";

type ProjectCoverProps = {
  slug: string;
  title: string;
  className?: string;
  /** Optional override for the monogram; defaults to the title's initials. */
  monogram?: string;
  /** Small label shown in the corner. */
  corner?: string;
};

/**
 * A typographic project cover — deterministic, image-free.
 *
 * Reads `--cover-bg` / `--cover-fg` from the surrounding variant so each
 * design direction can restyle it without touching the artwork. When real
 * screenshots land, this becomes the fallback inside the same frame.
 */
export function ProjectCover({
  slug,
  title,
  className,
  monogram,
  corner,
}: ProjectCoverProps) {
  const mark =
    monogram ??
    title
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div
      aria-hidden
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-[var(--cover-bg,#14161a)] text-[var(--cover-fg,#ff4d00)]",
        className,
      )}
    >
      {/* Diagonal ruling — reads as texture, never as gloss */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, currentColor 0 1px, transparent 1px 14px)",
        }}
      />
      <span className="relative font-display text-[clamp(3.5rem,10vw,8rem)] leading-none tracking-tight">
        {mark}
      </span>
      <span className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.22em] opacity-70">
        {slug}
      </span>
      {corner && (
        <span className="absolute top-3 right-4 font-mono text-[10px] uppercase tracking-[0.22em] opacity-70">
          {corner}
        </span>
      )}
    </div>
  );
}
