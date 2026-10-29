"use client";

import { useEffect, useRef } from "react";
import { useConsole, type ConsoleMode } from "./console-context";

/** A labelled schematic the core unfolds into. Built on the server from content. */
export type Blueprint = {
  title: string;
  caption: string;
  nodes: string[];
};

export const MODE_ACCENT: Record<ConsoleMode, string> = {
  idle: "#ffb547",
  melro: "#ff4d00",
  tauri: "#ffb547",
  agents: "#5cf29b",
  graphql: "#7cc4ff",
  stack: "#e8e6e1",
};

type Ripple = { x: number; y: number; t0: number; strength: number };
type Pulse = { trace: number; t0: number; dur: number };
type Vec3 = [number, number, number];

const CHIP = 0.8; // half-size of the package, in model units
const THICK = 0.12;
const DIE = 0.4;

/** Traces on the top face: die edge → bend → package edge, on all four sides. */
function buildTraces(): Vec3[][] {
  const traces: Vec3[][] = [];
  const y = -THICK - 0.001;
  const lanes = [-0.6, -0.36, -0.12, 0.12, 0.36, 0.6];
  for (let side = 0; side < 4; side++) {
    for (const lane of lanes) {
      const local: [number, number][] = [
        [DIE, lane * 0.62],
        [DIE + 0.16, lane],
        [CHIP, lane],
      ];
      traces.push(
        local.map(([a, b]) => {
          // rotate the lane template onto each side of the package
          const x = side === 0 ? a : side === 1 ? -b : side === 2 ? -a : b;
          const z = side === 0 ? b : side === 1 ? a : side === 2 ? -b : -a;
          return [x, y, z];
        }),
      );
    }
  }
  return traces;
}

const TRACES = buildTraces();

function hexToRgb(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

/**
 * The hero's living core: a machined chip that floats over a dot-matrix field.
 * The cursor pulls the field and the core; clicks send ripples; switching
 * mode makes the core unfold into a blueprint of real work.
 *
 * Plain Canvas 2D. The loop pauses off-screen and in hidden tabs, cleans up
 * on unmount, and under reduced motion renders single still frames instead.
 */
export function CoreCanvas({ blueprints }: { blueprints: Record<ConsoleMode, Blueprint> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { mode } = useConsole();
  const modeRef = useRef(mode);
  const blueprintsRef = useRef(blueprints);
  const kickRef = useRef<(() => void) | null>(null);

  blueprintsRef.current = blueprints;

  useEffect(() => {
    modeRef.current = mode;
    kickRef.current?.();
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mono =
      getComputedStyle(document.body).getPropertyValue("--font-jetbrains").trim() ||
      "ui-monospace, monospace";

    let w = 0;
    let h = 0;
    let spacing = 22;
    let count = 0;
    let homeX = new Float32Array(0);
    let homeY = new Float32Array(0);
    let offX = new Float32Array(0);
    let offY = new Float32Array(0);
    let velX = new Float32Array(0);
    let velY = new Float32Array(0);

    // core body
    let ax = 0;
    let ay = 0;
    let scale = 100;
    let cx = 0;
    let cy = 0;
    let cvx = 0;
    let cvy = 0;
    let yaw = 0.6;
    let yawVel = 0.004;
    let energy = 0.4;

    // pointer
    let mx = 0;
    let my = 0;
    let pointerIn = false;

    const ripples: Ripple[] = [];
    const pulses: Pulse[] = [];
    let blueprintT = 0; // 0 → 1 unfold progress of the current blueprint
    let last = performance.now();
    let frame = 0;
    let running = false;
    let visible = true;

    function layout() {
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const wide = w >= 1024;
      spacing = w < 640 ? 26 : 22;
      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;
      count = cols * rows;
      homeX = new Float32Array(count);
      homeY = new Float32Array(count);
      offX = new Float32Array(count);
      offY = new Float32Array(count);
      velX = new Float32Array(count);
      velY = new Float32Array(count);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          homeX[i] = c * spacing + spacing / 2;
          homeY[i] = r * spacing + spacing / 2;
        }
      }

      ax = wide ? w * 0.73 : w * 0.5;
      ay = wide ? Math.min(h * 0.46, 420) : Math.min(window.innerHeight * 0.22, 210);
      scale = wide ? Math.min(w, h) * 0.17 : Math.min(w * 0.24, 120);
      if (cx === 0 && cy === 0) {
        cx = ax;
        cy = ay;
      }
    }

    function project([x, y, z]: Vec3, pitch: number): [number, number, number] {
      const cyw = Math.cos(yaw);
      const syw = Math.sin(yaw);
      const x1 = x * cyw - z * syw;
      const z1 = x * syw + z * cyw;
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const y2 = y * cp - z1 * sp;
      const z2 = y * sp + z1 * cp;
      const persp = 4 / (4 + z2);
      return [cx + x1 * scale * persp, cy + y2 * scale * persp, z2];
    }

    function step(t: number, dt: number) {
      // core: spring to its anchor, leaning a little toward the cursor
      const tx = ax + (pointerIn ? (mx - ax) * 0.07 : 0);
      const ty = ay + (pointerIn ? (my - ay) * 0.05 : 0);
      cvx = (cvx + (tx - cx) * 0.018 * dt) * Math.pow(0.9, dt);
      cvy = (cvy + (ty - cy) * 0.018 * dt) * Math.pow(0.9, dt);
      cx += cvx * dt;
      cy += cvy * dt;
      yawVel += (0.004 + energy * 0.01 - yawVel) * 0.02 * dt;
      yaw += yawVel * dt;
      energy = Math.max(0.25, energy - 0.006 * dt);

      // the field
      const R = w < 640 ? 110 : 170;
      const well = scale * 2.1;
      for (let k = ripples.length - 1; k >= 0; k--) {
        if ((t - ripples[k].t0) * 0.6 > Math.hypot(w, h)) ripples.splice(k, 1);
      }
      for (let i = 0; i < count; i++) {
        const x = homeX[i] + offX[i];
        const y = homeY[i] + offY[i];
        let fx = -offX[i] * 0.05;
        let fy = -offY[i] * 0.05;

        if (pointerIn) {
          const dx = mx - x;
          const dy = my - y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R * R && d2 > 1) {
            const d = Math.sqrt(d2);
            const f = (1 - d / R) ** 2 * 0.55;
            fx += (dx / d) * f;
            fy += (dy / d) * f;
          }
        }

        const kx = x - cx;
        const ky = y - cy;
        const kd2 = kx * kx + ky * ky;
        if (kd2 < well * well && kd2 > 1) {
          const kd = Math.sqrt(kd2);
          const f = (1 - kd / well) * 0.5;
          fx += (kx / kd) * f;
          fy += (ky / kd) * f;
        }

        for (const rp of ripples) {
          const radius = (t - rp.t0) * 0.6;
          const rx = homeX[i] - rp.x;
          const ry = homeY[i] - rp.y;
          const d = Math.sqrt(rx * rx + ry * ry) || 1;
          const diff = Math.abs(d - radius);
          if (diff < 34) {
            const life = Math.max(0, 1 - radius / 900);
            const f = (1 - diff / 34) * rp.strength * life;
            fx += (rx / d) * f;
            fy += (ry / d) * f;
          }
        }

        velX[i] = (velX[i] + fx) * 0.82;
        velY[i] = (velY[i] + fy) * 0.82;
        offX[i] += velX[i];
        offY[i] += velY[i];
      }

      if (Math.random() < (0.06 + energy * 0.35) * dt) {
        pulses.push({
          trace: Math.floor(Math.random() * TRACES.length),
          t0: t,
          dur: 500 + Math.random() * 500,
        });
      }
      for (let k = pulses.length - 1; k >= 0; k--) {
        if (t - pulses[k].t0 > pulses[k].dur) pulses.splice(k, 1);
      }

      blueprintT += (1 - blueprintT) * 0.05 * dt;
    }

    function drawField(accent: string, active: boolean) {
      const amber = "255,181,71";
      const accentRgb = hexToRgb(accent);
      const styles = [
        "rgba(232,230,225,0.09)",
        "rgba(232,230,225,0.18)",
        `rgba(${amber},0.38)`,
        `rgba(${amber},0.62)`,
        `rgba(${accentRgb},0.95)`,
      ];
      const paths = styles.map(() => new Path2D());
      for (let i = 0; i < count; i++) {
        const disp = Math.abs(offX[i]) + Math.abs(offY[i]);
        const bucket = disp < 1.2 ? 0 : disp < 4 ? 1 : disp < 9 ? 2 : disp < 16 ? 3 : 4;
        const s = 1.3 + bucket * 0.3;
        paths[bucket].rect(homeX[i] + offX[i] - s / 2, homeY[i] + offY[i] - s / 2, s, s);
      }
      paths.forEach((p, i) => {
        ctx!.fillStyle = styles[i];
        ctx!.fill(p);
      });

      if (active) {
        // blueprint rulings every fourth row/column, fading in with the unfold
        ctx!.strokeStyle = `rgba(${accentRgb},${0.05 * blueprintT})`;
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        for (let x = spacing / 2; x < w; x += spacing * 4) {
          ctx!.moveTo(x, 0);
          ctx!.lineTo(x, h);
        }
        for (let y = spacing / 2; y < h; y += spacing * 4) {
          ctx!.moveTo(0, y);
          ctx!.lineTo(w, y);
        }
        ctx!.stroke();
      }
    }

    function drawCore(t: number, accent: string) {
      const accentRgb = hexToRgb(accent);
      const pitch = 0.95 + Math.max(-0.25, Math.min(0.25, cvy * 0.02));

      // a soft halo so the chip reads as lit, scaled by its energy
      const halo = ctx!.createRadialGradient(cx, cy, 0, cx, cy, scale * 2);
      halo.addColorStop(0, `rgba(${accentRgb},${0.1 + energy * 0.12})`);
      halo.addColorStop(1, `rgba(${accentRgb},0)`);
      ctx!.fillStyle = halo;
      ctx!.fillRect(cx - scale * 2, cy - scale * 2, scale * 4, scale * 4);

      // package: a box, faces drawn far → near, back faces skipped
      const corners: Vec3[] = [
        [-CHIP, -THICK, -CHIP], [CHIP, -THICK, -CHIP], [CHIP, -THICK, CHIP], [-CHIP, -THICK, CHIP],
        [-CHIP, THICK, -CHIP], [CHIP, THICK, -CHIP], [CHIP, THICK, CHIP], [-CHIP, THICK, CHIP],
      ];
      const p = corners.map((c) => project(c, pitch));
      const faces = [
        { idx: [0, 1, 2, 3], fill: "#10141a" }, // top
        { idx: [7, 6, 5, 4], fill: "#08090c" },
        { idx: [3, 2, 6, 7], fill: "#0b0d11" },
        { idx: [1, 0, 4, 5], fill: "#0b0d11" },
        { idx: [2, 1, 5, 6], fill: "#0d1015" },
        { idx: [0, 3, 7, 4], fill: "#0d1015" },
      ]
        .map((f) => ({ ...f, z: f.idx.reduce((s, i) => s + p[i][2], 0) / 4 }))
        .sort((a, b) => b.z - a.z);

      // pins: short legs hanging off each edge
      ctx!.strokeStyle = `rgba(${accentRgb},0.45)`;
      ctx!.lineWidth = 1.2;
      ctx!.beginPath();
      for (let k = -5; k <= 5; k++) {
        const o = (k / 5) * (CHIP - 0.1);
        const legs: [Vec3, Vec3][] = [
          [[CHIP, 0, o], [CHIP + 0.1, THICK + 0.1, o]],
          [[-CHIP, 0, o], [-CHIP - 0.1, THICK + 0.1, o]],
          [[o, 0, CHIP], [o, THICK + 0.1, CHIP + 0.1]],
          [[o, 0, -CHIP], [o, THICK + 0.1, -CHIP - 0.1]],
        ];
        for (const [a, b] of legs) {
          const pa = project(a, pitch);
          const pb = project(b, pitch);
          ctx!.moveTo(pa[0], pa[1]);
          ctx!.lineTo(pb[0], pb[1]);
        }
      }
      ctx!.stroke();

      for (const face of faces) {
        const pts = face.idx.map((i) => p[i]);
        const cross =
          (pts[1][0] - pts[0][0]) * (pts[2][1] - pts[0][1]) -
          (pts[1][1] - pts[0][1]) * (pts[2][0] - pts[0][0]);
        if (cross > 0) continue;
        ctx!.beginPath();
        pts.forEach(([x, y], i) => (i ? ctx!.lineTo(x, y) : ctx!.moveTo(x, y)));
        ctx!.closePath();
        ctx!.fillStyle = face.fill;
        ctx!.fill();
        ctx!.strokeStyle = `rgba(${accentRgb},0.75)`;
        ctx!.lineWidth = 1;
        ctx!.stroke();
      }

      // top face: traces, the die, and the pulses running through them
      ctx!.strokeStyle = "rgba(232,230,225,0.16)";
      ctx!.beginPath();
      for (const trace of TRACES) {
        trace.forEach((pt, i) => {
          const [x, y] = project(pt, pitch);
          if (i) ctx!.lineTo(x, y);
          else ctx!.moveTo(x, y);
        });
      }
      ctx!.stroke();

      const top = -THICK - 0.002;
      const die = [
        [-DIE, top, -DIE], [DIE, top, -DIE], [DIE, top, DIE], [-DIE, top, DIE],
      ].map((c) => project(c as Vec3, pitch));
      ctx!.beginPath();
      die.forEach(([x, y], i) => (i ? ctx!.lineTo(x, y) : ctx!.moveTo(x, y)));
      ctx!.closePath();
      ctx!.fillStyle = "#151a21";
      ctx!.fill();
      ctx!.strokeStyle = `rgba(${accentRgb},0.9)`;
      ctx!.stroke();

      // die cells breathe with the core's energy
      const cells = 4;
      for (let a = 0; a < cells; a++) {
        for (let b = 0; b < cells; b++) {
          const u0 = -DIE + 0.06 + (a * (2 * DIE - 0.12)) / cells;
          const v0 = -DIE + 0.06 + (b * (2 * DIE - 0.12)) / cells;
          const s = (2 * DIE - 0.12) / cells - 0.04;
          const glow = 0.5 + 0.5 * Math.sin(t * 0.002 + a * 1.7 + b * 2.3);
          const quad = [
            [u0, top, v0], [u0 + s, top, v0], [u0 + s, top, v0 + s], [u0, top, v0 + s],
          ].map((c) => project(c as Vec3, pitch));
          ctx!.beginPath();
          quad.forEach(([x, y], i) => (i ? ctx!.lineTo(x, y) : ctx!.moveTo(x, y)));
          ctx!.closePath();
          ctx!.fillStyle = `rgba(${accentRgb},${0.06 + glow * energy * 0.4})`;
          ctx!.fill();
        }
      }

      for (const pulse of pulses) {
        const trace = TRACES[pulse.trace];
        const prog = (t - pulse.t0) / pulse.dur;
        const seg = Math.min(trace.length - 2, Math.floor(prog * (trace.length - 1)));
        const local = prog * (trace.length - 1) - seg;
        const a = trace[seg];
        const b = trace[seg + 1];
        const pt: Vec3 = [
          a[0] + (b[0] - a[0]) * local,
          a[1],
          a[2] + (b[2] - a[2]) * local,
        ];
        const [x, y] = project(pt, pitch);
        ctx!.fillStyle = "rgba(92,242,155,0.95)";
        ctx!.fillRect(x - 1.5, y - 1.5, 3, 3);
        ctx!.fillStyle = "rgba(92,242,155,0.18)";
        ctx!.fillRect(x - 4, y - 4, 8, 8);
      }
    }

    function drawBlueprint(t: number, accent: string, blueprint: Blueprint, active: boolean) {
      const accentRgb = hexToRgb(accent);
      const wide = w >= 1024;
      ctx!.font = `500 ${wide ? 11 : 10}px ${mono}`;
      ctx!.textBaseline = "middle";

      if (active) {
        const n = blueprint.nodes.length;
        const rx = wide ? scale * 2.5 : Math.min(w * 0.4, scale * 2.6);
        const ry = wide ? scale * 1.85 : scale * 1.15;
        // on wide screens the left half belongs to the copy and the command bar
        const minX = wide ? w * 0.5 : 0;
        blueprint.nodes.forEach((label, i) => {
          const angle = -Math.PI / 2 + (i / n) * Math.PI * 2 + 0.35;
          const tw = ctx!.measureText(label).width + 26;
          let nx = cx + Math.cos(angle) * rx * blueprintT;
          let ny = cy + Math.sin(angle) * ry * blueprintT;
          nx = Math.max(minX + tw / 2 + 8, Math.min(w - tw / 2 - 8, nx));
          ny = Math.max(16, Math.min(h - 16, ny));

          // beam: a wide faint stroke under a thin bright dashed one
          ctx!.lineWidth = 4;
          ctx!.strokeStyle = `rgba(${accentRgb},${0.08 * blueprintT})`;
          ctx!.beginPath();
          ctx!.moveTo(cx, cy);
          ctx!.lineTo(nx, ny);
          ctx!.stroke();
          ctx!.lineWidth = 1;
          ctx!.setLineDash([4, 6]);
          ctx!.lineDashOffset = -t * 0.03;
          ctx!.strokeStyle = `rgba(${accentRgb},${0.7 * blueprintT})`;
          ctx!.stroke();
          ctx!.setLineDash([]);

          // a packet riding the beam outward
          const q = ((t * 0.0005 + i / n) % 1) * blueprintT;
          ctx!.fillStyle = `rgba(${accentRgb},0.95)`;
          ctx!.fillRect(cx + (nx - cx) * q - 2, cy + (ny - cy) * q - 2, 4, 4);

          // node label in a bracketed box
          const bh = 24;
          const bx = nx - tw / 2;
          const by = ny - bh / 2;
          ctx!.globalAlpha = blueprintT;
          ctx!.fillStyle = "rgba(6,7,9,0.88)";
          ctx!.fillRect(bx, by, tw, bh);
          ctx!.strokeStyle = `rgba(${accentRgb},0.8)`;
          ctx!.strokeRect(bx + 0.5, by + 0.5, tw - 1, bh - 1);
          ctx!.fillStyle = `rgba(${accentRgb},1)`;
          ctx!.fillText(String(i + 1).padStart(2, "0"), bx + 6, ny);
          ctx!.fillStyle = "#e8e6e1";
          ctx!.fillText(label, bx + 22, ny);
          ctx!.globalAlpha = 1;
        });
      }

      // caption under the core, clear of the lowest blueprint node
      const captionY = active
        ? cy + (wide ? scale * 1.85 : scale * 1.15) * blueprintT + 34
        : cy + scale * 1.55;
      ctx!.textAlign = "center";
      ctx!.fillStyle = `rgba(${accentRgb},0.95)`;
      ctx!.fillText(blueprint.title.toUpperCase(), cx, captionY);
      ctx!.fillStyle = "rgba(138,143,152,0.9)";
      ctx!.fillText(blueprint.caption, cx, captionY + 16);
      ctx!.textAlign = "start";
    }

    function render(t: number) {
      const current = modeRef.current;
      const accent = MODE_ACCENT[current];
      const blueprint = blueprintsRef.current[current];
      const active = current !== "idle";
      ctx!.clearRect(0, 0, w, h);
      drawField(accent, active);
      drawBlueprint(t, accent, blueprint, active);
      drawCore(t, accent);
    }

    function loop(t: number) {
      const dt = Math.min(2, (t - last) / 16.667);
      last = t;
      step(t, dt);
      render(t);
      frame = requestAnimationFrame(loop);
    }

    function start() {
      if (reduced || running || !visible || document.hidden) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(frame);
    }

    function still() {
      blueprintT = 1;
      render(performance.now());
    }

    kickRef.current = () => {
      blueprintT = 0;
      energy = 1;
      yawVel += 0.05;
      ripples.push({ x: cx, y: cy, t0: performance.now(), strength: 2.4 });
      if (ripples.length > 6) ripples.shift();
      if (reduced) still();
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
      pointerIn = mx >= 0 && my >= 0 && mx <= rect.width && my <= rect.height;
    };
    const onLeave = () => {
      pointerIn = false;
    };
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("input, button, a, [data-no-ripple]")) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      ripples.push({ x, y, t0: performance.now(), strength: 1.8 });
      if (ripples.length > 6) ripples.shift();
      const d = Math.hypot(cx - x, cy - y) || 1;
      const push = Math.max(0, 1 - d / 600) * 14;
      cvx += ((cx - x) / d) * push;
      cvy += ((cy - y) / d) * push;
      yawVel += (x < cx ? -1 : 1) * 0.06;
      energy = Math.min(1, energy + 0.4);
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    layout();
    if (reduced) still();
    else start();

    const resizeObserver = new ResizeObserver(() => {
      layout();
      if (reduced) still();
    });
    resizeObserver.observe(canvas);

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    intersection.observe(canvas);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      kickRef.current = null;
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
