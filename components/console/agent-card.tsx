"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useConsole } from "./console-context";
import { ProcessCard } from "./process-card";

export type AgentSession = {
  slug: string;
  title: string;
  date: string;
  model: string;
  prompt: string;
  promptTokens: number;
  outputTokens: number;
};

type Turn = { tag: string; tone: "ink" | "dim" | "ok" | "amber"; text: string; href?: string };

function turnsFor(session: AgentSession, index: number): Turn[] {
  return [
    { tag: "session", tone: "amber", text: `${String(index + 1).padStart(2, "0")} · ${session.date} · model ${session.model}` },
    { tag: "prompt", tone: "ink", text: `“${session.prompt}”` },
    { tag: "tokens", tone: "dim", text: `≈ ${session.promptTokens} prompt · ≈ ${session.outputTokens} published` },
    { tag: "draft", tone: "dim", text: "model drafts from my notes · I edit it into my words" },
    { tag: "verify", tone: "ok", text: "human edit ✓ · disclosure set ✓ · prerendered ✓" },
    { tag: "publish", tone: "ok", text: `/log/${session.slug}`, href: `/log/${session.slug}` },
  ];
}

const TONE: Record<Turn["tone"], string> = {
  ink: "text-con-ink",
  dim: "text-con-dim",
  ok: "text-con-phosphor",
  amber: "text-con-amber",
};

/**
 * A replay of the real model-assisted sessions behind the log: the exact
 * prompt, the model, and an estimate of tokens. It streams only while it is
 * on screen; reduced motion and human mode show the full transcript.
 */
export function AgentCard({ sessions }: { sessions: AgentSession[] }) {
  const { humanMode } = useConsole();
  const transcript = useMemo(() => sessions.flatMap((s, i) => turnsFor(s, i)), [sessions]);
  const [shown, setShown] = useState(0);
  const [still, setStill] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLOListElement>(null);

  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const frozen = still || humanMode;

  useEffect(() => {
    if (frozen || !ref.current || transcript.length === 0) return;
    let timer = 0;
    let onScreen = false;
    const tick = () => {
      setShown((n) => (n >= transcript.length + 4 ? 0 : n + 1));
      timer = window.setTimeout(tick, 650);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !onScreen) {
        onScreen = true;
        tick();
      } else if (!entry.isIntersecting && onScreen) {
        onScreen = false;
        window.clearTimeout(timer);
      }
    });
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [frozen, transcript.length]);

  useEffect(() => {
    const el = scroller.current;
    if (el && !frozen) el.scrollTop = el.scrollHeight;
  }, [shown, frozen]);

  const visible = frozen ? transcript : transcript.slice(0, Math.min(shown, transcript.length));
  const tokens = sessions.reduce((sum, s) => sum + s.promptTokens + s.outputTokens, 0);

  return (
    <ProcessCard pid="003" name="agentic engineering" mode="agents" status={`${sessions.length} sessions`} className="md:col-span-3">
      <div ref={ref} className="flex flex-1 flex-col p-5 md:p-6">
        <ol
          ref={scroller}
          className="h-[260px] space-y-1.5 overflow-y-auto rounded-[8px] border border-con-line bg-black/40 p-3 font-mono text-[11px] leading-relaxed [scrollbar-width:thin]"
          aria-label="Replay of model-assisted log sessions"
        >
          {visible.map((turn, i) => (
            <li key={i} className={`grid grid-cols-[64px_1fr] gap-2 ${turn.tag === "session" && i > 0 ? "mt-3" : ""}`}>
              <span className="text-con-dim/60">{turn.tag}</span>
              {turn.href ? (
                <Link href={turn.href} className={`${TONE[turn.tone]} underline-offset-2 hover:underline`}>
                  {turn.text}
                </Link>
              ) : (
                <span className={TONE[turn.tone]}>{turn.text}</span>
              )}
            </li>
          ))}
          {!frozen && shown < transcript.length && (
            <li className="text-con-amber motion-safe:animate-pulse" aria-hidden="true">
              ▍
            </li>
          )}
        </ol>
        <div className="mt-3 flex flex-wrap justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-con-dim">
          <span>replay of real prompts from the log</span>
          <span>≈ {tokens.toLocaleString("en")} tokens · chars ÷ 4</span>
        </div>
        <p className="mt-4 max-w-[52ch] text-[0.92rem] leading-relaxed text-con-dim">
          The model drafts, I decide. Every assisted entry publishes the prompt that started it, and the
          loop only closes when a human edit and a clean build say so.
        </p>
      </div>
    </ProcessCard>
  );
}
