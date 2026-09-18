"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Theme toggle printed as two words rather than an icon button: paper by day,
 * night after dark. Renders the same shape before mount so nothing shifts.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const target = mounted && resolvedTheme === "dark" ? "paper" : "night";

  if (!mounted) {
    return (
      <span
        aria-hidden
        className="inline-flex items-baseline gap-1.5 border-b border-transparent pb-[3px] font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground opacity-0"
      >
        paper
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(target === "paper" ? "light" : "dark")}
      className="group inline-flex items-baseline gap-1.5 border-b border-transparent pb-[3px] font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-brand hover:text-foreground"
      aria-label={target === "paper" ? "Switch to light mode" : "Switch to night mode"}
      title={target === "paper" ? "Switch to paper (light)" : "Switch to night (dark)"}
    >
      <span
        aria-hidden
        className="inline-block h-2 w-2 -translate-y-px border border-muted-foreground/50 transition-colors group-hover:border-brand"
        style={{
          background: target === "paper" ? "hsl(39 47% 96%)" : "hsl(26 14% 8%)",
        }}
      />
      {target}
    </button>
  );
}
