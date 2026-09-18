import { cn } from "@/lib/utils";

/**
 * Flat browser frame. The web-native counterpart of a device mockup:
 * hairline chrome, one orange dot, content fills the 16:10 area.
 */
export function Screen({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-border", className)}>
      <div className="flex items-center gap-1.5 border-b border-border bg-card px-3 py-2">
        <span className="h-2 w-2 rounded-full border border-border bg-brand" />
        <span className="h-2 w-2 rounded-full border border-border" />
        <span className="h-2 w-2 rounded-full border border-border" />
        <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="aspect-[16/10]">{children}</div>
    </div>
  );
}
