"use client";

import { useEffect, useRef } from "react";
import {
  fitCanvas,
  onThemeChange,
  prefersReducedMotion,
  readTokens,
} from "@/components/creation/canvas-utils";
import { fingerPath, handPath, makeHand, sampleLattice } from "@/components/creation/hand";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
};

const MAX_PARTICLES = 420;

function clamp(v: number, lo = 0, hi = 1) {
  return Math.min(hi, Math.max(lo, v));
}

/**
 * Hero artwork: The Creation of Adam, redrawn as two techniques. The human
 * hand on the left is ink hatching on paper; the synthetic hand on the right
 * is the same dot matrix as the page background, with signals running along
 * its bones. The gap between the index fingers sparks. Pointer distance,
 * scroll and taps feed the spark; scrolling also closes the gap.
 *
 * Everything is one 2D canvas; the loop only runs while the hero is on
 * screen, and under `prefers-reduced-motion` it renders a single still frame.
 */
export function CreationOfAdam() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = prefersReducedMotion();
    let tokens = readTokens();
    let size = fitCanvas(canvas);

    const human = makeHand(0.07);
    const machine = makeHand(-0.015);
    const humanPath = handPath(human);
    const humanFingers = fingerPath(human);
    const machinePath = handPath(machine);
    const machineFingers = fingerPath(machine);
    const lattice = sampleLattice(machinePath, 5);
    const spine = [
      { x: -150, y: 46 },
      { x: -30, y: 12 },
      { x: 18, y: -4 },
      { x: 96, y: -14 },
      ...machine.index.map((b) => ({ x: b.x1, y: b.y1 })),
      machine.tip,
    ];
    const spineLengths = spine
      .slice(1)
      .map((p, i) => Math.hypot(p.x - spine[i].x, p.y - spine[i].y));
    const spineTotal = spineLengths.reduce((a, b) => a + b, 0);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0, near: 0, tnear: 0 };
    const particles: Particle[] = [];
    let arc: { x: number; y: number }[] = [];
    let burst = 0;
    let frame = 0;
    let last = performance.now();
    let visible = true;

    function pointOnSpine(u: number) {
      let d = u * spineTotal;
      for (let i = 0; i < spineLengths.length; i++) {
        if (d <= spineLengths[i]) {
          const k = d / spineLengths[i];
          return {
            x: spine[i].x + (spine[i + 1].x - spine[i].x) * k,
            y: spine[i].y + (spine[i + 1].y - spine[i].y) * k,
          };
        }
        d -= spineLengths[i];
      }
      return spine[spine.length - 1];
    }

    function scrollProgress() {
      const rect = canvas!.getBoundingClientRect();
      return clamp((window.innerHeight * 0.55 - rect.top) / (rect.height * 1.4));
    }

    function emit(cx: number, cy: number, count: number, force: number) {
      for (let i = 0; i < count && particles.length < MAX_PARTICLES; i++) {
        const a = Math.random() * Math.PI * 2;
        const speed = (20 + Math.random() * 110) * force;
        const max = 0.5 + Math.random() * 0.9;
        particles.push({
          x: cx + (Math.random() - 0.5) * 6,
          y: cy + (Math.random() - 0.5) * 6,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed - 8,
          life: max,
          max,
        });
      }
    }

    function draw(now: number, dt: number) {
      const { width, height, dpr } = size;
      const t = now / 1000;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, width, height);

      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      pointer.near += (pointer.tnear - pointer.near) * 0.08;
      burst = Math.max(0, burst - dt * 1.2);

      const progress = reduced ? 0.35 : scrollProgress();
      const s = width / (width < 640 ? 640 : 1040);
      const cx = width / 2;
      const cy = height * 0.5;
      const gap = (1 - progress) * 74 * s + 5;
      const intensity = clamp(
        0.22 + pointer.near * 0.45 + progress * 0.45 + burst,
        0,
        1.6,
      );
      const breathe = reduced ? 0 : Math.sin(t * 0.9) * 2.5;

      const humanTip = {
        x: cx - gap / 2,
        y: cy + 6 * s + pointer.y * 9 + breathe,
      };
      const machineTip = {
        x: cx + gap / 2,
        y: cy - 6 * s - pointer.y * 9 - breathe,
      };

      // ── human: ink hatching on paper ─────────────────────────────────
      ctx!.save();
      ctx!.translate(humanTip.x, humanTip.y);
      ctx!.rotate(-0.1 - pointer.y * 0.05 + pointer.x * 0.02);
      ctx!.transform(1, 0, pointer.x * 0.05, 1, 0, 0);
      ctx!.scale(s, s);
      ctx!.translate(-human.tip.x, -human.tip.y);

      ctx!.strokeStyle = tokens.foreground;
      ctx!.lineWidth = 2.4 / s;
      ctx!.globalAlpha = 0.9;
      ctx!.stroke(humanPath);
      ctx!.globalAlpha = 1;
      ctx!.fillStyle = tokens.background;
      ctx!.fill(humanPath);
      ctx!.clip(humanPath);
      ctx!.lineWidth = 0.9 / s;
      ctx!.globalAlpha = 0.5;
      ctx!.beginPath();
      for (let y = -170; y <= 120; y += 4.6) {
        for (let x = -230; x <= 260; x += 10) {
          const yy =
            y + x * 0.28 + Math.sin(x * 0.03 + y * 0.09 + t * 0.7) * 1.6;
          if (x === -230) ctx!.moveTo(x, yy);
          else ctx!.lineTo(x, yy);
        }
      }
      ctx!.stroke();
      // finger contours, so the curl reads like a drawing and not a mitten
      ctx!.globalAlpha = 0.85;
      ctx!.lineWidth = 1.3 / s;
      ctx!.stroke(humanFingers);
      ctx!.restore();

      // ── machine: dot lattice with signals on its bones ───────────────
      ctx!.save();
      ctx!.translate(machineTip.x, machineTip.y);
      ctx!.rotate(-0.1 - pointer.y * 0.05 - pointer.x * 0.02);
      ctx!.transform(1, 0, -pointer.x * 0.05, 1, 0, 0);
      ctx!.scale(-s, s);
      ctx!.translate(-machine.tip.x, -machine.tip.y);

      ctx!.fillStyle = tokens.foreground;
      const charge = 40 + intensity * 70;
      for (const p of lattice) {
        const flicker = Math.sin(t * 2.2 + p.x * 0.07 + p.y * 0.11);
        const alpha = 0.22 + p.edge * 0.5 + flicker * 0.14;
        const dTip = Math.hypot(p.x - machine.tip.x, p.y - machine.tip.y);
        const lit = dTip < charge;
        ctx!.fillStyle = lit ? tokens.brand : tokens.foreground;
        ctx!.globalAlpha = clamp(lit ? alpha + 0.3 : alpha);
        const d = (p.edge ? 2.4 : 1.7) + (lit ? 0.8 : 0);
        ctx!.fillRect(p.x - d / 2, p.y - d / 2, d, d);
      }

      ctx!.globalAlpha = 0.3;
      ctx!.strokeStyle = tokens.foreground;
      ctx!.lineWidth = 0.8 / s;
      ctx!.beginPath();
      for (const b of machine.bones) {
        ctx!.moveTo(b.x1, b.y1);
        ctx!.lineTo(b.x2, b.y2);
      }
      ctx!.stroke();
      ctx!.globalAlpha = 0.55;
      ctx!.setLineDash([2, 3]);
      ctx!.stroke(machineFingers);
      ctx!.setLineDash([]);

      ctx!.globalAlpha = 1;
      ctx!.fillStyle = tokens.brand;
      const pulses = reduced ? 0 : 4;
      for (let k = 0; k < pulses; k++) {
        const u = (t * (0.18 + intensity * 0.12) + k / pulses) % 1;
        const p = pointOnSpine(u);
        const r = 2.4 + u * 1.6;
        ctx!.fillRect(p.x - r, p.y - r, r * 2, r * 2);
      }
      ctx!.restore();

      // ── the spark ────────────────────────────────────────────────────
      const mx = (humanTip.x + machineTip.x) / 2;
      const my = (humanTip.y + machineTip.y) / 2;
      const glow = ctx!.createRadialGradient(mx, my, 0, mx, my, 30 + 110 * intensity);
      glow.addColorStop(0, tokens.brand);
      glow.addColorStop(1, "transparent");
      ctx!.globalAlpha = clamp(0.1 + 0.22 * intensity);
      ctx!.fillStyle = glow;
      ctx!.fillRect(mx - 160, my - 160, 320, 320);

      if (reduced || Math.random() < 0.35) {
        arc = [];
        const steps = 9;
        for (let i = 0; i <= steps; i++) {
          const k = i / steps;
          const jitter =
            i === 0 || i === steps
              ? 0
              : (Math.random() - 0.5) * (4 + gap * 0.35) * intensity;
          arc.push({
            x: humanTip.x + (machineTip.x - humanTip.x) * k,
            y: humanTip.y + (machineTip.y - humanTip.y) * k + jitter,
          });
        }
      }
      if (reduced || Math.random() < 0.45 + intensity * 0.4) {
        ctx!.globalAlpha = clamp(0.55 + intensity * 0.4);
        ctx!.strokeStyle = tokens.brand;
        ctx!.lineWidth = 1.2 + intensity;
        ctx!.shadowColor = tokens.brand;
        ctx!.shadowBlur = 6 + 14 * intensity;
        ctx!.beginPath();
        arc.forEach((p, i) => (i ? ctx!.lineTo(p.x, p.y) : ctx!.moveTo(p.x, p.y)));
        ctx!.stroke();
        ctx!.shadowBlur = 0;
      }

      if (!reduced) {
        const rate = intensity * 2.4;
        emit(mx, my, Math.floor(rate) + (Math.random() < rate % 1 ? 1 : 0), 0.6 + intensity * 0.6);
      }
      ctx!.fillStyle = tokens.brand;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const k = p.life / p.max;
        ctx!.globalAlpha = k;
        const r = 0.6 + k * 1.4;
        ctx!.fillRect(p.x - r, p.y - r, r * 2, r * 2);
      }
      ctx!.globalAlpha = 1;
    }

    function loop(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      draw(now, dt);
      frame = requestAnimationFrame(loop);
    }

    function start() {
      cancelAnimationFrame(frame);
      if (reduced) {
        draw(0, 0);
        return;
      }
      if (!visible || document.hidden) return;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    }

    function spark() {
      if (reduced) return;
      burst = 1;
      const { width, height } = size;
      emit(width / 2, height / 2, 90, 1.6);
    }

    function onMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      pointer.tx = clamp(nx, -1, 1);
      pointer.ty = clamp(ny, -1, 1);
      const d = Math.hypot(
        e.clientX - (rect.left + rect.width / 2),
        e.clientY - (rect.top + rect.height / 2),
      );
      pointer.tnear = clamp(1 - d / Math.max(220, rect.width * 0.3));
    }

    function onResize() {
      size = fitCanvas(canvas!);
      if (reduced) draw(0, 0);
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else cancelAnimationFrame(frame);
    });
    io.observe(canvas);

    const stopTheme = onThemeChange(() => {
      tokens = readTokens();
      if (reduced) draw(0, 0);
    });
    const onVisibility = () =>
      document.hidden ? cancelAnimationFrame(frame) : start();
    const button = buttonRef.current;

    start();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      canvas.addEventListener("pointerdown", spark);
      button?.addEventListener("click", spark);
    }

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      stopTheme();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", spark);
      button?.removeEventListener("click", spark);
    };
  }, []);

  return (
    <figure className="relative">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Two hands reaching for each other, after Michelangelo's Creation of Adam. The left hand is drawn in ink hatching, the right is made of dots and circuit lines. A spark jumps between their index fingers."
        className="block h-[clamp(240px,40vw,540px)] w-full cursor-crosshair touch-pan-y"
      />
      <figcaption className="mx-auto mt-3 flex w-full max-w-[1180px] flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:px-6 lg:px-8">
        <span>
          Fig. 1 — after Michelangelo, c. 1512. Left: ink. Right: matrix.
        </span>
        <button
          ref={buttonRef}
          type="button"
          className="text-brand-text transition-colors hover:text-foreground motion-reduce:hidden"
        >
          ↯ make contact
        </button>
      </figcaption>
    </figure>
  );
}
