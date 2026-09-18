import { cn } from "@/lib/utils";

/** The single content measure for the whole site. */
export function Wrap({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1180px] px-5 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
