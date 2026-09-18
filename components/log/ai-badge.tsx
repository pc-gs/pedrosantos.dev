import { Mark } from "@/components/manuscript/marks";

/**
 * AI co-authorship mark — the ✦ annotation. Set as typeset type rather than a
 * capsule: it should read like a note in the margin, not a tag on a card.
 */
export function AiBadge({
  model,
  className,
  short = false,
}: {
  model?: string;
  className?: string;
  /** Drop the model name (feed rows, tight margins). */
  short?: boolean;
}) {
  const label = short || !model ? "co-written" : `co-written with ${model}`;

  return (
    <Mark
      tone="ai"
      className={className}
      title={
        model
          ? `Drafted with ${model} and edited by Pedro — the prompt is shown beside it`
          : "Drafted with AI and edited by Pedro"
      }
    >
      <span aria-hidden>✦</span>
      {label}
    </Mark>
  );
}
