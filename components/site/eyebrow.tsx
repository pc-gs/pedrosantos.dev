import { cn } from "@/lib/utils";

/** Mono metadata label. Dates, section numbers, small print. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}
