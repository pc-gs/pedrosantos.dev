import { cn } from "@/lib/utils";
import type { BlogPost } from "@/lib/types";

/**
 * The paper trail for a co-written essay: my notes, the prompt(s), the first
 * draft, my edit — set as a ruled list rather than a card, so it reads as part
 * of the manuscript instead of a widget pasted onto it.
 */
export function ProcessBox({
  process,
  className,
}: {
  process: NonNullable<BlogPost["process"]>;
  className?: string;
}) {
  return (
    <aside className={cn("mt-16", className)} aria-labelledby="paper-trail">
      <h2
        id="paper-trail"
        className="scroll-mt-20 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground"
      >
        <span className="text-ai" aria-hidden>
          ✦
        </span>{" "}
        the paper trail — how this post was made
      </h2>

      <ol className="mt-6 border-t border-border">
        <Step index="01" label="My notes">
          <p className="max-w-[62ch] text-[1.0625rem] leading-[1.75] text-muted-foreground">
            {process.notes}
          </p>
        </Step>

        {process.prompts.length > 0 && (
          <Step index="02" label="The prompt">
            <ol className="space-y-3">
              {process.prompts.map((prompt, i) => (
                <li
                  key={i}
                  className="border-l border-ai/35 pl-3 font-mono text-[11.5px] leading-[1.75] text-foreground/80"
                >
                  &ldquo;{prompt}&rdquo;
                </li>
              ))}
            </ol>
          </Step>
        )}

        <Step index="03" label="First draft">
          <p className="max-w-[62ch] text-[1.0625rem] leading-[1.75] text-muted-foreground">
            A model turned those notes into a first draft — structure and prose,
            never facts. Every claim in it came from step 01.
          </p>
        </Step>

        <Step index="04" label="My edit">
          <p className="max-w-[62ch] text-[1.0625rem] leading-[1.75] text-muted-foreground">
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
    <li className="grid grid-cols-1 gap-y-2 border-b border-border py-5 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-x-6">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        <span className="text-brand-text tabnum">{index}</span>{" "}
        <span className="mt-0.5 block">{label}</span>
      </p>
      <div className="min-w-0">{children}</div>
    </li>
  );
}
