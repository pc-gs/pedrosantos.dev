import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * AI co-authorship mark — the violet ✦ chip. Used on log entries and
 * posts drafted with AI assistance and human-edited.
 */
export function AiBadge({
  model,
  className,
  short = false,
}: {
  model?: string;
  className?: string;
  short?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-ai/30 bg-ai/10 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-ai",
        className,
      )}
      title={
        model
          ? `Drafted with ${model}, edited by Pedro — the prompt is shown below`
          : "Drafted with AI, edited by Pedro"
      }
    >
      <Sparkles className="h-3 w-3" aria-hidden />
      {short ? "AI" : "co-written"}
    </span>
  );
}
