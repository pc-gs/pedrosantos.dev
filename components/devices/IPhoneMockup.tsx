"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface IPhoneMockupProps {
  children: ReactNode;
  className?: string;
  showGradientOverlay?: boolean;
}

export function IPhoneMockup({
  children,
  className,
  showGradientOverlay = false,
}: IPhoneMockupProps) {
  return (
    <div className={cn("w-full max-w-xs mx-auto", className)}>
      {/* iPhone Frame */}
      <div className="relative">
        {/* Outer frame with buttons */}
        <div className="relative bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 dark:from-zinc-600 dark:via-zinc-700 dark:to-zinc-800 rounded-[3rem] p-1 shadow-2xl">
          {/* Side buttons - left */}
          <div className="absolute -left-0.5 top-24 w-0.5 h-6 bg-zinc-600 rounded-l-sm" />
          <div className="absolute -left-0.5 top-36 w-0.5 h-10 bg-zinc-600 rounded-l-sm" />
          <div className="absolute -left-0.5 top-48 w-0.5 h-10 bg-zinc-600 rounded-l-sm" />
          {/* Side button - right */}
          <div className="absolute -right-0.5 top-32 w-0.5 h-14 bg-zinc-600 rounded-r-sm" />

          {/* Inner bezel */}
          <div className="bg-black rounded-[2.75rem] p-[3px] relative overflow-hidden">
            {/* Metallic inner edge */}
            <div className="absolute inset-0 rounded-[2.75rem] bg-gradient-to-br from-zinc-600/20 via-transparent to-zinc-600/20" />

            {/* Screen area */}
            <div className="relative bg-zinc-950 rounded-[2.5rem] overflow-hidden aspect-[9/19.5]">
              {/* Dynamic Island */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
                <div className="bg-black rounded-full px-6 py-2 flex items-center gap-2 shadow-lg">
                  <div className="w-2 h-2 rounded-full bg-zinc-900 relative">
                    <div className="absolute inset-0.5 rounded-full bg-zinc-800" />
                  </div>
                  <div className="w-3 h-3 rounded-full bg-zinc-900 border border-zinc-800" />
                </div>
              </div>

              {/* Screen content */}
              <div className="absolute inset-0">{children}</div>

              {showGradientOverlay && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 pointer-events-none z-10" />
              )}

              {/* Screen reflection */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none z-10" />

              {/* Home indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-zinc-600/80 rounded-full z-20" />
            </div>
          </div>
        </div>

        {/* Ambient shadow */}
        <div className="absolute -inset-4 bg-black/20 dark:bg-black/40 rounded-[4rem] blur-2xl -z-10" />
      </div>
    </div>
  );
}
