"use client";

import { useEffect, useRef } from "react";
import {
  fitCanvas,
  onThemeChange,
  prefersReducedMotion,
  readTokens,
} from "@/components/creation/canvas-utils";

const GAP = 22;
const MAX_RIPPLES = 6;

type Ripple = { x: number; y: number; born: number };

/**
 * The living dot matrix behind every page. A grid of square "pixels" whose
 * size and opacity follow two slow interfering waves, plus rings that spread
 * from the cursor and fade out. Static under `prefers-reduced-motion`, paused
 * while the tab is hidden.
 */
export function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let tokens = readTokens();
    let size = fitCanvas(canvas);
    let frame = 0;
    const reduced = prefersReducedMotion();
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const ripples: Ripple[] = [];
    let lastRipple = 0;

    function draw(t: number) {
      const { width, height, dpr } = size;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, width, height);
      ctx!.fillStyle = tokens.foreground;

      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;

      const time = t / 1000;
      const cols = Math.ceil(width / GAP) + 1;
      const rows = Math.ceil(height / GAP) + 1;
      const ox = (width % GAP) / 2;
      const oy = (height % GAP) / 2;

      for (let j = 0; j < rows; j++) {
        const y = oy + j * GAP;
        // depth: dots fade toward the top of the viewport, like a horizon
        const depth = 0.35 + 0.65 * (y / height);
        for (let i = 0; i < cols; i++) {
          const x = ox + i * GAP;
          let v =
            Math.sin(x * 0.011 + time * 0.6) * Math.cos(y * 0.013 - time * 0.4) +
            Math.sin((x + y) * 0.006 + time * 0.25);
          v = (v + 2) / 4; // 0..1

          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          let lift = Math.max(0, 1 - d / 160) * 0.9;

          for (const r of ripples) {
            const age = (t - r.born) / 1000;
            const radius = age * 260;
            const rd = Math.abs(Math.hypot(x - r.x, y - r.y) - radius);
            if (rd < 26) lift += (1 - rd / 26) * Math.max(0, 1 - age / 1.4) * 0.8;
          }

          const alpha = Math.min(0.5, (0.05 + v * 0.11 + lift * 0.3) * depth);
          const s = 1 + v * 1.1 + lift * 1.6;
          ctx!.globalAlpha = alpha;
          ctx!.fillRect(x - s / 2, y - s / 2, s, s);
        }
      }
      ctx!.globalAlpha = 1;

      while (ripples.length && t - ripples[0].born > 1400) ripples.shift();
    }

    function loop(t: number) {
      draw(t);
      frame = requestAnimationFrame(loop);
    }

    function start() {
      cancelAnimationFrame(frame);
      if (reduced) draw(0);
      else frame = requestAnimationFrame(loop);
    }

    function onMove(e: PointerEvent) {
      pointer.tx = e.clientX;
      pointer.ty = e.clientY;
      const now = performance.now();
      if (now - lastRipple > 280) {
        lastRipple = now;
        ripples.push({ x: e.clientX, y: e.clientY, born: now });
        if (ripples.length > MAX_RIPPLES) ripples.shift();
      }
    }

    function onLeave() {
      pointer.tx = pointer.ty = -9999;
    }

    function onResize() {
      size = fitCanvas(canvas!);
      if (reduced) draw(0);
    }

    function onVisibility() {
      if (document.hidden) cancelAnimationFrame(frame);
      else start();
    }

    const stopTheme = onThemeChange(() => {
      tokens = readTokens();
      if (reduced) draw(0);
    });

    start();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(frame);
      stopTheme();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
