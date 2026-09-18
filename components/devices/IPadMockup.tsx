"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface IPadMockupProps {
  children: ReactNode;
  className?: string;
  showGradientOverlay?: boolean;
  orientation?: "portrait" | "landscape";
}

export function IPadMockup({
  children,
  className,
  showGradientOverlay = false,
  orientation = "landscape",
}: IPadMockupProps) {
  const isLandscape = orientation === "landscape";

  return (
    <div className={cn("w-full max-w-3xl mx-auto", className)}>
      {/* iPad Frame */}
      <div className="relative">
        {/* Outer frame */}
        <div
          className={cn(
            "relative bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 dark:from-zinc-600 dark:via-zinc-700 dark:to-zinc-800 shadow-2xl",
            isLandscape ? "rounded-[1.5rem] p-2" : "rounded-[2rem] p-2",
          )}
        >
          {/* Power button */}
          <div
            className={cn(
              "absolute bg-zinc-600",
              isLandscape
                ? "top-8 -right-0.5 w-0.5 h-8 rounded-r-sm"
                : "-top-0.5 right-12 h-0.5 w-8 rounded-t-sm",
            )}
          />

          {/* Volume buttons */}
          <div
            className={cn(
              "absolute bg-zinc-600",
              isLandscape
                ? "-top-0.5 left-20 h-0.5 w-6 rounded-t-sm"
                : "-left-0.5 top-20 w-0.5 h-6 rounded-l-sm",
            )}
          />
          <div
            className={cn(
              "absolute bg-zinc-600",
              isLandscape
                ? "-top-0.5 left-28 h-0.5 w-6 rounded-t-sm"
                : "-left-0.5 top-28 w-0.5 h-6 rounded-l-sm",
            )}
          />

          {/* Inner bezel */}
          <div
            className={cn(
              "bg-black p-[2px] relative overflow-hidden",
              isLandscape ? "rounded-[1.25rem]" : "rounded-[1.75rem]",
            )}
          >
            {/* Metallic inner edge */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br from-zinc-600/20 via-transparent to-zinc-600/20",
                isLandscape ? "rounded-[1.25rem]" : "rounded-[1.75rem]",
              )}
            />

            {/* Screen area */}
            <div
              className={cn(
                "relative bg-zinc-950 overflow-hidden",
                isLandscape
                  ? "rounded-[1rem] aspect-[4/3]"
                  : "rounded-[1.5rem] aspect-[3/4]",
              )}
            >
              {/* Front camera - positioned based on orientation */}
              <div
                className={cn(
                  "absolute z-20",
                  isLandscape
                    ? "top-1/2 -translate-y-1/2 left-2"
                    : "left-1/2 -translate-x-1/2 top-2",
                )}
              >
                <div className="w-2 h-2 rounded-full bg-zinc-900 border border-zinc-800 relative">
                  <div className="absolute inset-0.5 rounded-full bg-zinc-800" />
                  <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full bg-zinc-600" />
                </div>
              </div>

              {/* Screen content */}
              <div className="absolute inset-0">{children}</div>

              {showGradientOverlay && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 pointer-events-none z-10" />
              )}

              {/* Screen reflection */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none z-10" />

              {/* Home indicator */}
              <div
                className={cn(
                  "absolute z-20",
                  isLandscape
                    ? "bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1"
                    : "bottom-2 left-1/2 -translate-x-1/2 w-28 h-1",
                )}
              >
                <div className="w-full h-full bg-zinc-600/60 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Ambient shadow */}
        <div className="absolute -inset-4 bg-black/20 dark:bg-black/40 rounded-[2.5rem] blur-2xl -z-10" />
      </div>
    </div>
  );
}
