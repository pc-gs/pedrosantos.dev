"use client";

import { useConsole, type ConsoleMode } from "./console-context";
import { CoreCanvas, type Blueprint } from "./core-canvas";

/**
 * The hero frame. In human mode the canvas unmounts (stopping its loop) and
 * a plain readout takes its place.
 */
export function ConsoleHero({
  blueprints,
  readout,
  children,
}: {
  blueprints: Record<ConsoleMode, Blueprint>;
  readout: React.ReactNode;
  children: React.ReactNode;
}) {
  const { humanMode } = useConsole();

  return (
    <section
      aria-label="Introduction"
      className="relative isolate overflow-hidden border-b border-con-line"
    >
      {humanMode ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(rgba(232,230,225,0.08)_1px,transparent_1px)] [background-size:22px_22px]"
        />
      ) : (
        <div className="absolute inset-0 -z-10">
          <CoreCanvas blueprints={blueprints} />
        </div>
      )}

      <div className="mx-auto grid min-h-[calc(100svh-49px)] w-full max-w-[1280px] grid-cols-1 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:px-10">
        {!humanMode && <div className="h-[44svh] max-h-[400px] lg:hidden" aria-hidden="true" />}
        <div className="flex flex-col justify-center pb-14 pt-6 lg:py-20">{children}</div>
        {humanMode && (
          <div className="flex flex-col justify-center pb-14 lg:py-20 lg:pl-12">{readout}</div>
        )}
      </div>
    </section>
  );
}
