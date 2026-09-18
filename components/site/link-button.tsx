import { Link } from "next-view-transitions";
import { cn } from "@/lib/utils";

type LinkButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "quiet";
  className?: string;
};

const SOLID =
  "inline-flex items-center gap-2 border border-foreground bg-foreground px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-background transition-colors hover:border-brand hover:bg-brand hover:text-brand-foreground";

const QUIET =
  "inline-flex items-center gap-2 border-b border-border pb-1 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground transition-colors hover:border-brand hover:text-brand-text";

/** Text link with button weight. Internal routes go through view transitions. */
export function LinkButton({
  href,
  children,
  variant = "solid",
  className,
}: LinkButtonProps) {
  const classes = cn(variant === "solid" ? SOLID : QUIET, className);

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={classes}>
      {children}
    </a>
  );
}
