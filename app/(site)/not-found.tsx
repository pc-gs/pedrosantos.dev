import { Link } from "next-view-transitions";
import { Wrap } from "@/components/site/wrap";
import { Eyebrow } from "@/components/site/eyebrow";

export default function NotFound() {
  return (
    <main>
      <Wrap className="py-20 md:py-28">
        <Eyebrow>404</Eyebrow>
        <h1 className="mt-6 max-w-[18ch] font-display text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[0.95] tracking-[-0.025em]">
          This page doesn&apos;t exist (yet).
        </h1>
        <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
          Either it moved or it was never written. Both happen here: this site
          grows as I learn.
        </p>
        <div className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3 font-mono text-[10.5px] uppercase tracking-[0.16em]">
          <Link href="/" className="text-brand transition-colors hover:text-foreground">
            ← home
          </Link>
          <Link
            href="/work"
            className="text-muted-foreground transition-colors hover:text-brand"
          >
            see the work
          </Link>
          <Link
            href="/log"
            className="text-muted-foreground transition-colors hover:text-brand"
          >
            read the log
          </Link>
        </div>
      </Wrap>
    </main>
  );
}
