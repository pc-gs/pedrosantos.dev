// Pure simulation logic for the Lab "build" feature.
// Extracted so the SHIPPED behavior in app/page.tsx can be directly tested.
// No React, no side effects.

export const BUILD_STEPS = [
  "build started",
  "typecheck...",
  "bundling chunks",
  "optimizing routes",
  "generating static",
  "ready → http://localhost:3000",
] as const;

export function getInitialLog(): string[] {
  return ["studio ready", "watching src/", "melro agents idle"];
}

export function getBuildLog(): string[] {
  return [...BUILD_STEPS];
}

// Returns the next log state after applying the next build step from current log length
export function applyNextBuildStep(currentLog: string[]): string[] {
  const base = getBuildLog();
  const nextLen = Math.min(currentLog.length + 1, base.length);
  return base.slice(0, nextLen);
}

// For tests: simulate full run to final
export function simulateFullBuild(): string[] {
  return [...getBuildLog()];
}
