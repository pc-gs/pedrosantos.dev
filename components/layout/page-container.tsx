import { cn } from "@/lib/utils";

export function PageContainer({
  children,
  className,
  wide,
}: {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        wide ? "page-content" : "page-content max-w-5xl",
        className,
      )}
    >
      {children}
    </div>
  );
}