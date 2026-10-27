/**
 * Shared helpers for the hero and background canvases. Browser-only: every
 * function here touches `window` or `document`, so call them from effects.
 */

export type Tokens = {
  foreground: string;
  background: string;
  brand: string;
  muted: string;
};

/** Read the theme tokens from `:root` / `.dark` so canvases follow the theme. */
export function readTokens(): Tokens {
  const style = getComputedStyle(document.documentElement);
  const get = (name: string, fallback: string) =>
    style.getPropertyValue(name).trim() || fallback;
  return {
    foreground: get("--foreground", "#14161a"),
    background: get("--background", "#f4f1e9"),
    brand: get("--brand", "#ff4d00"),
    muted: get("--muted-foreground", "#625c50"),
  };
}

/** Call `cb` whenever the `.dark` class on <html> flips. Returns a cleanup. */
export function onThemeChange(cb: () => void): () => void {
  const observer = new MutationObserver(cb);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Size a canvas to its CSS box at a capped device pixel ratio. */
export function fitCanvas(canvas: HTMLCanvasElement, maxDpr = 2) {
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.round(width * dpr));
  canvas.height = Math.max(1, Math.round(height * dpr));
  return { width, height, dpr };
}
