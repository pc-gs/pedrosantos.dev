"use client";

import { cn } from "@/lib/utils";
import { useConsole, type ConsoleMode } from "./console-context";
import { MODE_ACCENT } from "./core-canvas";

/**
 * Bento cell styled as a running process. It lights up when the core is
 * showing its blueprint, and its header inspects it.
 */
export function ProcessCard({
  pid,
  name,
  mode,
  status,
  className,
  children,
}: {
  pid: string;
  name: string;
  mode: ConsoleMode;
  status: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { mode: current, setMode, humanMode } = useConsole();
  const active = current === mode && !humanMode;
  const accent = MODE_ACCENT[mode];

  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[12px] border bg-con-panel transition-[border-color,box-shadow] duration-300 motion-reduce:transition-none",
        active ? "border-transparent" : "border-con-line",
        className,
      )}
      style={
        active
          ? { boxShadow: `0 0 0 1px ${accent}, 0 0 48px -16px ${accent}` }
          : undefined
      }
    >
      <header className="flex items-center justify-between gap-3 border-b border-con-line px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-con-dim">
        <span className="flex min-w-0 items-center gap-2">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: accent, opacity: active ? 1 : 0.6 }}
            aria-hidden="true"
          />
          <span className="text-con-dim/70">{pid}</span>
          <span className="truncate text-con-ink">{name}</span>
        </span>
        <span className="flex shrink-0 items-center gap-3">
          <span className="hidden sm:inline">{status}</span>
          <button
            type="button"
            onClick={() => setMode(active ? "idle" : mode)}
            className="rounded border border-con-line px-1.5 py-0.5 normal-case tracking-normal text-con-dim transition-colors hover:text-con-ink focus-visible:text-con-ink focus-visible:outline-none"
            aria-pressed={active}
          >
            {active ? "release" : "inspect"}
          </button>
        </span>
      </header>
      {children}
    </article>
  );
}
