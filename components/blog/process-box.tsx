import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/lib/types";

/**
 * "How this post was made" — the honest paper trail for a co-written essay.
 *
 * Four steps, always in the same order: my notes → the prompt(s) → the AI
 * draft → my edit. The violet accent is used once, on the AI step, so the
 * box reads as a disclosure rather than decoration.
 */
export function ProcessBox({
  process,
  className,
}: {
  process: NonNullable<BlogPost["process"]>;
  className?: string;
}) {
  return (
    <aside
      className={cn("rounded-lg border border-border bg-card", className)}
      aria-labelledby="process-box-title"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border px-5 py-3.5">
        <span className="label-brand">✦</span>
        <h2
          id="process-box-title"
          className="font-mono text-xs uppercase tracking-wider text-foreground"
        >
          How this post was made
        </h2>
        <span className="ml-auto font-mono text-[11px] text-muted-foreground">
          co-written, human-edited
        </span>
      </div>

      <ol className="divide-y divide-border">
        <Step index="01" label="My notes">
          <p className="max-w-[62ch] font-serif text-[0.975rem] leading-relaxed text-muted-foreground">
            {process.notes}
          </p>
        </Step>

        {process.prompts.length > 0 && (
          <Step index="02" label="The prompt">
            <ul className="space-y-2.5">
              {process.prompts.map((prompt, i) => (
                <li
                  key={i}
                  className="rounded-md border border-ai/25 bg-ai/5 p-3 font-mono text-[12px] leading-relaxed text-foreground/80"
                >
                  <span className="flex items-start gap-2">
                    <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-ai" aria-hidden />
                    <span>&ldquo;{prompt}&rdquo;</span>
                  </span>
                </li>
              ))}
            </ul>
          </Step>
        )}

        <Step index="03" label="First draft">
          <p className="max-w-[62ch] font-serif text-[0.975rem] leading-relaxed text-muted-foreground">
            An AI model turned those notes into a first draft — structure and
            prose, never facts. Every claim in it came from step 01.
          </p>
        </Step>

        <Step index="04" label="My edit">
          <p className="max-w-[62ch] font-serif text-[0.975rem] leading-relaxed text-muted-foreground">
            {process.humanEdit}
          </p>
        </Step>
      </ol>
    </aside>
  );
}

function Step({
  index,
  label,
  children,
}: {
  index: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="grid grid-cols-1 gap-2 px-5 py-4 sm:grid-cols-[104px_1fr] sm:gap-6">
      <p className="flex items-baseline gap-2 sm:flex-col sm:gap-0.5">
        <span className="font-mono text-[11px] text-brand">{index}</span>
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </p>
      <div className="min-w-0">{children}</div>
    </li>
  );
}