"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MacbookMockupProps {
  children: ReactNode;
  className?: string;
  showGradientOverlay?: boolean;
}

export function MacbookMockup({
  children,
  className,
  showGradientOverlay = false,
}: MacbookMockupProps) {
  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      {/* MacBook Screen */}
      <div className="relative">
        {/* Outer bezel */}
        <div className="bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 dark:from-zinc-600 dark:via-zinc-700 dark:to-zinc-800 rounded-t-xl p-[3px] shadow-2xl">
          {/* Inner bezel with camera */}
          <div className="bg-gradient-to-b from-zinc-900 to-black rounded-t-lg overflow-hidden">
            {/* Camera area */}
            <div className="h-5 bg-zinc-900 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-zinc-800 border border-zinc-700 shadow-inner relative">
                <div className="absolute inset-0.5 rounded-full bg-zinc-950" />
                <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-zinc-600" />
              </div>
            </div>
            {/* Screen */}
            <div className="relative aspect-[16/10] bg-zinc-950 overflow-hidden">
              {children}
              {showGradientOverlay && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 pointer-events-none" />
              )}
              {/* Screen reflection */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Chin/Logo area */}
        <div className="h-4 bg-gradient-to-b from-zinc-800 via-zinc-700 to-zinc-600 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-500 rounded-b-sm flex items-center justify-center shadow-lg">
          <div className="w-8 h-2 bg-gradient-to-b from-zinc-500/30 to-zinc-600/30 rounded-sm" />
        </div>
      </div>

      {/* Base */}
      <div className="relative">
        {/* Hinge */}
        <div className="h-2 bg-gradient-to-b from-zinc-600 to-zinc-500 dark:from-zinc-500 dark:to-zinc-400 mx-auto w-[85%] rounded-b-lg shadow-md" />
        {/* Base plate */}
        <div className="h-1.5 bg-gradient-to-b from-zinc-400 to-zinc-500 dark:from-zinc-400 dark:to-zinc-500 mx-auto w-[95%] rounded-b-xl shadow-lg" />
        {/* Bottom edge */}
        <div className="h-0.5 bg-gradient-to-b from-zinc-500 to-zinc-600 mx-auto w-[98%] rounded-b-xl" />
      </div>

      {/* Shadow */}
      <div className="h-4 bg-gradient-to-t from-transparent to-black/10 dark:to-black/20 mx-auto w-[90%] blur-xl -mt-2" />
    </div>
  );
}
