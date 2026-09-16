import { cn } from "@/lib/utils";

/** Pulsing availability dot with a mono label. */
export function StatusDot({
  label,
  pulse = true,
  className,
}: {
  label: string;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[12px] text-muted-foreground",
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {pulse && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60 motion-reduce:animate-none" />
        )}
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
      </span>
      {label}
    </span>
  );
}
