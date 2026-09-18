import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/site/eyebrow";

/**
 * Section opener: number + label, display title, optional description and
 * an action link on the right. Keeps every section on the same rhythm.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-6 border-b border-border pb-4",
        className,
      )}
    >
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-2 font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-tight tracking-[-0.015em]">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-[58ch] text-[0.95rem] leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
