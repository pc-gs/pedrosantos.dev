"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useConsole } from "./console-context";
import { ProcessCard } from "./process-card";

type Lane = { id: string; label: string; note: string; ms: number | null };

const RECORDS = 4000;
const ROUNDS = 25;

const INITIAL: Lane[] = [
  { id: "ref", label: "same-heap call", note: "plain function call, no boundary", ms: null },
  { id: "clone", label: "structuredClone", note: "what postMessage does to a worker", ms: null },
  { id: "json", label: "JSON round-trip", note: "what a Tauri invoke() payload pays", ms: null },
];

function makePayload() {
  return Array.from({ length: RECORDS }, (_, i) => ({
    id: i,
    path: `/Users/pedro/melro/files/${i}.json`,
    size: (i * 7919) % 65536,
    tags: ["invoice", "client", i % 3 ? "paid" : "due"],
  }));
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

const pause = () => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * A native-window mockup that runs a real micro-benchmark on the visitor's
 * machine: the cost of moving a payload across a serialization boundary.
 * Nothing here is a canned number.
 */
export function TauriCard() {
  const { benchSignal } = useConsole();
  const [lanes, setLanes] = useState<Lane[]>(INITIAL);
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const alive = useRef(true);
  const busy = useRef(false);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const run = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    setState("running");
    setLanes(INITIAL);
    const payload = makePayload();
    const sink: unknown[] = [];
    const kernels: Record<string, () => unknown> = {
      ref: () => payload,
      clone: () => structuredClone(payload),
      json: () => JSON.parse(JSON.stringify(payload)),
    };

    for (const lane of INITIAL) {
      const samples: number[] = [];
      for (let r = 0; r < ROUNDS; r++) {
        const t0 = performance.now();
        sink.push(kernels[lane.id]());
        samples.push(performance.now() - t0);
        sink.length = 0;
        if (r % 5 === 4) await pause(); // keep the page responsive
        if (!alive.current) return;
      }
      const ms = median(samples);
      setLanes((prev) => prev.map((l) => (l.id === lane.id ? { ...l, ms } : l)));
    }
    busy.current = false;
    setState("done");
  }, []);

  useEffect(() => {
    if (benchSignal > 0) void run();
  }, [benchSignal, run]);

  const max = Math.max(0.01, ...lanes.map((l) => l.ms ?? 0));

  return (
    <ProcessCard pid="002" name="tauri v2 + rust" mode="tauri" status="desktop" className="md:col-span-3">
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="overflow-hidden rounded-[10px] border border-con-line bg-[#0a0b0e]">
          <div className="flex items-center gap-2 border-b border-con-line bg-[#111318] px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" aria-hidden="true" />
            <span className="ml-2 truncate font-mono text-[10.5px] text-con-dim">
              tauri-check: ipc boundary · {RECORDS.toLocaleString("en")} records
            </span>
          </div>

          <div className="space-y-3 p-4">
            {lanes.map((lane) => (
              <div key={lane.id}>
                <div className="flex items-baseline justify-between gap-3 font-mono text-[11px]">
                  <span className="text-con-ink">{lane.label}</span>
                  <span className="tabular-nums text-con-amber">
                    {lane.ms === null ? (state === "running" ? "…" : "–") : `${lane.ms.toFixed(2)} ms`}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-con-line">
                  <div
                    className="h-full rounded-full bg-con-amber transition-[width] duration-500 ease-out motion-reduce:transition-none"
                    style={{ width: lane.ms === null ? "0%" : `${Math.max(2, (lane.ms / max) * 100)}%` }}
                  />
                </div>
                <p className="mt-1 font-mono text-[10px] text-con-dim">{lane.note}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-con-line px-4 py-2.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-con-dim">
              {state === "done" ? "median of 25 · measured on your machine" : "measured live, nothing canned"}
            </span>
            <button
              type="button"
              onClick={() => void run()}
              disabled={state === "running"}
              className="rounded-[6px] border border-con-amber/50 px-2.5 py-1 font-mono text-[11px] text-con-amber transition-colors hover:bg-con-amber/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-con-amber disabled:opacity-50"
            >
              {state === "running" ? "running…" : state === "done" ? "run again" : "run bench"}
            </button>
          </div>
        </div>

        <p className="mt-5 max-w-[52ch] text-[0.92rem] leading-relaxed text-con-dim">
          A Tauri app is a Rust core wrapped around the OS webview (WKWebView, WebView2), not a bundled
          Chromium. That keeps binaries small. The price is that every <code className="font-mono text-con-ink">invoke()</code>{" "}
          serializes across a boundary, so I keep payloads small and calls few.
        </p>
      </div>
    </ProcessCard>
  );
}
