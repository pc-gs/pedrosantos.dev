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
        wide ? "page-content max-w-4xl" : "page-content",
        className,
      )}
    >
      {children}
    </div>
  );
}