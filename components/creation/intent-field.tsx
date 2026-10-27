"use client";

import { useEffect, useRef } from "react";
import {
  fitCanvas,
  onThemeChange,
  prefersReducedMotion,
  readTokens,
} from "@/components/creation/canvas-utils";

/** Half the background's 22px pitch, so the hero grid nests inside it. */
const CELL = 11;
const TRAIL_MS = 2200;
const NIB = -Math.PI / 4;
const MAX_SPARKS = 160;

type TrailPoint = { x: number; y: number; t: number; w: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number };

function clamp(v: number, lo = 0, hi = 1) {
  return Math.min(hi, Math.max(lo, v));
}

function smoothstep(a: number, b: number, x: number) {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

/**
 * "Intent, rasterised": the hero of the home page.
 *
 * Two layers with two kinds of motion. The human layer is a broad-nib pen
 * that follows the cursor on a damped spring and leaves a calligraphic
 * stroke: continuous, slow and vector. The machine layer is a damped wave
 * equation on a fine dot grid. Every stroke is an impulse into it, so the
 * matrix answers with ripples that interfere, outrun the pen and fade. Sparks
 * thrown by the pen snap to the grid as they fly. With nobody touching it the
 * pen writes on its own; scrolling sends a scanline through the field.
 *
 * Under `prefers-reduced-motion` it simulates offline and paints one still.
 */
export function IntentField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pulseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const section = canvas?.closest("section");
    if (!canvas || !ctx || !section) return;

    const reduced = prefersReducedMotion();
    let tokens = readTokens();
    let size = fitCanvas(canvas);
    let cols = 0;
    let rows = 0;
    let cur = new Float32Array(0);
    let prev = new Float32Array(0);

    const pen = { x: 0, y: 0, vx: 0, vy: 0 };
    const target = { x: 0, y: 0 };
    const pointer = { x: 0, y: 0, active: false, lastMove: -1e9 };
    let autopilot = 1;
    const trail: TrailPoint[] = [];
    const sparks: Spark[] = [];
    let scrollY = window.scrollY;
    let scrollEnergy = 0;
    let frame = 0;
    let last = performance.now();
    let clock = 0;
    let visible = true;

    function layout() {
      size = fitCanvas(canvas!);
      cols = Math.ceil(size.width / CELL) + 1;
      rows = Math.ceil(size.height / CELL) + 1;
      cur = new Float32Array(cols * rows);
      prev = new Float32Array(cols * rows);
      const home = autopilotPoint(clock);
      pen.x = target.x = home.x;
      pen.y = target.y = home.y;
      trail.length = 0;
    }

    /** A slow, never-repeating loop on the right side of the hero. */
    function autopilotPoint(t: number) {
      const { width, height } = size;
      const wide = width >= 1024;
      const cx = width * (wide ? 0.7 : 0.5);
      const cy = height * (wide ? 0.5 : 0.5);
      const ax = width * (wide ? 0.17 : 0.32);
      const ay = height * (wide ? 0.26 : 0.3);
      return {
        x: cx + ax * Math.sin(t * 0.9) * Math.cos(t * 0.31),
        y: cy + ay * Math.sin(t * 1.37 + 1.3) * Math.cos(t * 0.23),
      };
    }

    function impulse(x: number, y: number, amount: number, radius = 1) {
      const ci = Math.round(x / CELL);
      const cj = Math.round(y / CELL);
      for (let j = cj - radius; j <= cj + radius; j++) {
        for (let i = ci - radius; i <= ci + radius; i++) {
          if (i < 1 || j < 1 || i >= cols - 1 || j >= rows - 1) continue;
          const fall = 1 - Math.hypot(i - ci, j - cj) / (radius + 1);
          if (fall > 0) cur[j * cols + i] += amount * fall;
        }
      }
    }

    function step(dt: number) {
      clock += dt;
      const k = dt * 60;

      // ── pen: damped spring toward the cursor or the autopilot ───────
      const idle = performance.now() - pointer.lastMove > 2600;
      autopilot += ((pointer.active && !idle ? 0 : 1) - autopilot) * 0.03 * k;
      const auto = autopilotPoint(clock);
      target.x = pointer.x + (auto.x - pointer.x) * autopilot;
      target.y = pointer.y + (auto.y - pointer.y) * autopilot;

      pen.vx += (target.x - pen.x) * 0.045 * k;
      pen.vy += (target.y - pen.y) * 0.045 * k;
      pen.vx *= Math.pow(0.8, k);
      pen.vy *= Math.pow(0.8, k);
      pen.x += pen.vx * k;
      pen.y += pen.vy * k;

      const speed = Math.hypot(pen.vx, pen.vy);
      const angle = Math.atan2(pen.vy, pen.vx);
      const nib = 1.6 + 7.5 * Math.abs(Math.sin(angle - NIB));
      const width = nib * clamp(1.2 - speed * 0.025, 0.5, 1.2);
      trail.push({ x: pen.x, y: pen.y, t: clock * 1000, w: width });
      while (trail.length && clock * 1000 - trail[0].t > TRAIL_MS)
        trail.shift();

      // ── machine: the stroke is an impulse into the wave field ───────
      impulse(pen.x, pen.y, Math.min(1.2, 0.3 + speed * 0.08));

      if (scrollEnergy > 0.01) {
        const j = rows - 3;
        for (let i = 1; i < cols - 1; i++) cur[j * cols + i] += scrollEnergy;
        scrollEnergy *= 0.6;
      }

      for (let j = 1; j < rows - 1; j++) {
        for (let i = 1; i < cols - 1; i++) {
          const n = j * cols + i;
          const lap =
            cur[n - 1] +
            cur[n + 1] +
            cur[n - cols] +
            cur[n + cols] -
            4 * cur[n];
          prev[n] = (2 * cur[n] - prev[n] + 0.24 * lap) * 0.982;
        }
      }
      const swap = prev;
      prev = cur;
      cur = swap;

      // ── sparks: thrown by fast strokes, quantised to the grid ───────
      if (
        speed > 3 &&
        sparks.length < MAX_SPARKS &&
        Math.random() < speed * 0.05
      ) {
        const a = angle + Math.PI + (Math.random() - 0.5) * 1.6;
        const v = 1 + Math.random() * speed * 0.5;
        sparks.push({
          x: pen.x,
          y: pen.y,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v,
          life: 1,
        });
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx * k;
        s.y += s.vy * k;
        s.vx *= Math.pow(0.95, k);
        s.vy *= Math.pow(0.95, k);
        s.life -= dt * 1.4;
        if (s.life <= 0) sparks.splice(i, 1);
      }
    }

    function draw() {
      const { width, height, dpr } = size;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, width, height);
      const wide = width >= 1024;
      const fadeOut =
        1 - clamp(-section!.getBoundingClientRect().top / (height * 0.9)) * 0.7;

      // machine layer: rasterised wave, ink dots first, crests in brand
      const crests: number[] = [];
      ctx!.fillStyle = tokens.foreground;
      for (let j = 1; j < rows - 1; j++) {
        const y = j * CELL;
        const edgeY =
          smoothstep(0, CELL * 4, y) * smoothstep(height, height - CELL * 4, y);
        for (let i = 1; i < cols - 1; i++) {
          const v = cur[j * cols + i];
          const a = Math.abs(v);
          if (a < 0.035) continue;
          const x = i * CELL;
          if (a > 0.45) {
            crests.push(x, y, a);
            continue;
          }
          // keep the text column calm on wide screens
          const mask = wide
            ? 0.25 + 0.75 * smoothstep(width * 0.3, width * 0.56, x)
            : 1;
          const s = Math.min(CELL - 4, 1.2 + a * 9);
          ctx!.globalAlpha = Math.min(0.75, a * 1.6) * mask * edgeY * fadeOut;
          ctx!.fillRect(x - s / 2, y - s / 2, s, s);
        }
      }
      ctx!.fillStyle = tokens.brand;
      for (let n = 0; n < crests.length; n += 3) {
        const s = Math.min(CELL - 3, 2 + crests[n + 2] * 5);
        ctx!.globalAlpha = Math.min(0.9, 0.35 + crests[n + 2] * 0.5) * fadeOut;
        ctx!.fillRect(crests[n] - s / 2, crests[n + 1] - s / 2, s, s);
      }

      // sparks, snapped to the grid they're falling through
      for (const s of sparks) {
        const gx = Math.round(s.x / CELL) * CELL;
        const gy = Math.round(s.y / CELL) * CELL;
        const r = 1.5 + s.life * 2;
        ctx!.globalAlpha = s.life * fadeOut;
        ctx!.fillRect(gx - r, gy - r, r * 2, r * 2);
      }

      // human layer: calligraphic stroke, oldest segments thinnest
      const now = clock * 1000;
      ctx!.strokeStyle = tokens.foreground;
      ctx!.lineCap = "round";
      for (let i = 2; i < trail.length; i++) {
        const a = trail[i - 2];
        const b = trail[i - 1];
        const c = trail[i];
        const life = 1 - (now - c.t) / TRAIL_MS;
        ctx!.globalAlpha = clamp(life * 1.2) * 0.92 * fadeOut;
        ctx!.lineWidth = c.w * (0.35 + 0.65 * life);
        ctx!.beginPath();
        ctx!.moveTo((a.x + b.x) / 2, (a.y + b.y) / 2);
        ctx!.quadraticCurveTo(b.x, b.y, (b.x + c.x) / 2, (b.y + c.y) / 2);
        ctx!.stroke();
      }

      // the touch: where the pen meets the matrix
      const tip = ctx!.createRadialGradient(pen.x, pen.y, 0, pen.x, pen.y, 34);
      tip.addColorStop(0, tokens.brand);
      tip.addColorStop(1, "transparent");
      ctx!.globalAlpha = 0.28 * fadeOut;
      ctx!.fillStyle = tip;
      ctx!.fillRect(pen.x - 34, pen.y - 34, 68, 68);
      ctx!.globalAlpha = fadeOut;
      ctx!.fillStyle = tokens.brand;
      ctx!.fillRect(Math.round(pen.x) - 3, Math.round(pen.y) - 3, 6, 6);
      ctx!.globalAlpha = 1;
    }

    function loop(now: number) {
      const dt = Math.min(1 / 30, (now - last) / 1000);
      last = now;
      step(dt);
      draw();
      frame = requestAnimationFrame(loop);
    }

    function start() {
      cancelAnimationFrame(frame);
      if (reduced) {
        for (let i = 0; i < 260; i++) step(1 / 60);
        draw();
        return;
      }
      if (!visible || document.hidden) return;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    }

    function pulse(x = pen.x, y = pen.y) {
      impulse(x, y, 6, 2);
      for (let i = 0; i < 40 && sparks.length < MAX_SPARKS; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = 2 + Math.random() * 6;
        sparks.push({
          x,
          y,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v,
          life: 1,
        });
      }
    }

    function onMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointer.active = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (!pointer.active) return;
      pointer.x = x;
      pointer.y = y;
      pointer.lastMove = performance.now();
    }

    function onDown(e: PointerEvent) {
      if ((e.target as Element).closest("a, button")) return;
      const rect = canvas!.getBoundingClientRect();
      pulse(e.clientX - rect.left, e.clientY - rect.top);
    }

    function onScroll() {
      const dy = window.scrollY - scrollY;
      scrollY = window.scrollY;
      scrollEnergy = Math.min(0.5, scrollEnergy + Math.abs(dy) * 0.004);
    }

    function onResize() {
      layout();
      if (reduced) start();
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else cancelAnimationFrame(frame);
    });
    const stopTheme = onThemeChange(() => {
      tokens = readTokens();
      if (reduced) draw();
    });
    const onVisibility = () =>
      document.hidden ? cancelAnimationFrame(frame) : start();
    const onPulse = () => pulse();
    const button = pulseRef.current;

    layout();
    io.observe(canvas);
    start();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      section.addEventListener("pointerdown", onDown);
      button?.addEventListener("click", onPulse);
    }

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      stopTheme();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      section.removeEventListener("pointerdown", onDown);
      button?.removeEventListener("click", onPulse);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 h-full w-full cursor-crosshair"
      />
      <button
        ref={pulseRef}
        type="button"
        className="absolute right-5 bottom-5 z-10 font-mono text-[10px] uppercase tracking-[0.18em] text-brand-text transition-colors hover:text-foreground motion-reduce:hidden sm:right-6 lg:right-[max(2rem,calc((100vw-1180px)/2+2rem))]"
      >
        ↯ send a pulse
      </button>
    </>
  );
}
