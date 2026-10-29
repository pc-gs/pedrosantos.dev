"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { ProcessCard } from "./process-card";

const lisbonClock = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Lisbon",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/**
 * The founder card. Its "telemetry" is only what is true: the case study's
 * own words, the period, and the live clock where the company runs.
 */
export function MelroCard({
  tagline,
  period,
  stack,
  url,
  role,
}: {
  tagline: string;
  period: string;
  stack: string[];
  url: string;
  role: string;
}) {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setNow(lisbonClock.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const rows: [string, string][] = [
    ["role", role],
    ["uptime", period],
    ["scope", "custom software for local businesses"],
    ["growth target", "none, on purpose"],
    ["stack", stack.join(" · ")],
  ];

  return (
    <ProcessCard pid="001" name="melro.io" mode="melro" status="● running" className="md:col-span-3">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-con-melro/15 blur-3xl"
      />
      <div className="relative flex flex-1 flex-col p-5 md:p-6">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-con-melro">Founder card</p>
        <h3 className="mt-3 font-inter text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-con-ink">
          Melro.io
        </h3>
        <p className="mt-2 max-w-[46ch] text-[0.95rem] leading-relaxed text-con-dim">{tagline}</p>

        <dl className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-[8px] border border-con-line bg-con-line font-mono text-[11.5px]">
          {rows.map(([key, value]) => (
            <div key={key} className="flex items-baseline justify-between gap-4 bg-con-panel px-3 py-2">
              <dt className="text-con-dim">{key}</dt>
              <dd className="text-right text-con-ink">{value}</dd>
            </div>
          ))}
          <div className="flex items-baseline justify-between gap-4 bg-con-panel px-3 py-2">
            <dt className="text-con-dim">belmonte, pt</dt>
            <dd className="tabular-nums text-con-phosphor" suppressHydrationWarning>
              {now ?? "--:--:--"}
            </dd>
          </div>
        </dl>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1.5 pt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-con-ink transition-colors hover:text-con-melro"
        >
          melro.io
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </ProcessCard>
  );
}
