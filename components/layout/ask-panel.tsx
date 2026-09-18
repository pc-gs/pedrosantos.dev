"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { nowItems, nowKindLabel, nowUpdated } from "@/content/now";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
  streaming?: boolean;
};

/* ── Offline scripted answers, built from the same content the site uses ── */
function offlineAnswer(question: string): string {
  const q = question.toLowerCase();
  const has = (...words: string[]) => words.some((w) => q.includes(w));

  if (has("hire", "hiring", "job", "available", "availability", "contract", "freelance")) {
    return `${profile.availability.note} Fastest way in: the form on /contact, or email ${profile.email}.`;
  }
  if (has("stack", "tech", "technology", "react", "next", "typescript", "tools")) {
    return `Day-to-day: ${profile.stack.join(", ")}. By day he ships React + Next.js on a GraphQL codebase; on the side it's Tauri for desktop and React Native for mobile.`;
  }
  if (has("where", "based", "location", "live", "from", "timezone")) {
    return `${profile.location} — remote-friendly, EU timezones.`;
  }
  if (has("melro")) {
    return `${profile.founded.name}: ${profile.founded.blurb}`;
  }
  if (has("now", "doing", "current", "working", "up to")) {
    const lines = nowItems
      .map((i) => `• ${nowKindLabel[i.kind]}: ${i.text}`)
      .join("\n");
    return `Here's the current snapshot (synced ${formatDate(nowUpdated, { month: "short", year: "numeric" })}):\n${lines}`;
  }
  if (has("ai", "log", "learn", "prompt", "model")) {
    return `The log is the heart of this site: short entries about things Pedro is learning, many co-written with an AI model. Every ✦ entry shows the actual prompt that started it — learn in public, credit the tooling, keep the human in the loop.`;
  }
  if (has("contact", "email", "reach", "talk", "say hi")) {
    return `Email ${profile.email} or use the form on /contact — both land in the same inbox.`;
  }
  if (has("who", "about", "yourself", "pedro")) {
    return `${profile.name}, ${profile.role} in ${profile.location}. ${profile.intro}`;
  }
  return `I'm the scripted fallback of this site (no AI key configured right now), so I only know the highlights: what Pedro is doing now, his stack, availability, and the AI-assisted log. For anything else, ${profile.email} reaches the human.`;
}

const SUGGESTIONS = [
  "What are you building now?",
  "Is Pedro open to work?",
  "What's the deal with the AI log?",
  "What's his stack?",
];

export function AskPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"unknown" | "live" | "offline">("unknown");
  const scrollRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef(true);
  const idRef = useRef(0);

  const nextId = () => ++idRef.current;

  useEffect(() => {
    const el = scrollRef.current;
    if (el && pinnedRef.current) el.scrollTop = el.scrollHeight;
  }, [messages]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    pinnedRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
  }

  async function send(question: string) {
    const trimmed = question.trim();
    if (!trimmed || busy) return;
    setInput("");
    setBusy(true);
    pinnedRef.current = true;

    const userMsg: Message = { id: nextId(), role: "user", text: trimmed };
    const replyId = nextId();
    setMessages((m) => [
      ...m,
      userMsg,
      { id: replyId, role: "assistant", text: "", streaming: true },
    ]);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });

      if (res.ok) {
        const contentType = res.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
          // Offline mode — the API answers {mode:"offline"} when no key is set.
          const data = (await res.json()) as { mode?: string };
          if (data.mode === "offline") {
            setMode("offline");
            const answer = offlineAnswer(trimmed);
            await typeLocally(replyId, answer);
            return;
          }
        } else if (res.body) {
          setMode("live");
          await streamReply(replyId, res.body);
          return;
        }
      }
      throw new Error("ask failed");
    } catch {
      setMode((m) => (m === "live" ? m : "offline"));
      await typeLocally(replyId, offlineAnswer(trimmed));
    } finally {
      setBusy(false);
    }
  }

  /** Reveal a complete answer with a typewriter effect (skipped for reduced motion). */
  async function typeLocally(id: number, text: string) {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setMessages((m) => m.map((x) => (x.id === id ? { ...x, text, streaming: false } : x)));
      return;
    }

    for (let i = 0; i <= text.length; i += 2) {
      const slice = text.slice(0, i);
      setMessages((m) =>
        m.map((x) => (x.id === id ? { ...x, text: slice, streaming: i < text.length } : x)),
      );
      await new Promise((r) => setTimeout(r, 14));
    }
    setMessages((m) => m.map((x) => (x.id === id ? { ...x, text, streaming: false } : x)));
  }

  /** Consume the /api/ask text stream into the message bubble. */
  async function streamReply(id: number, body: ReadableStream<Uint8Array>) {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let text = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
      setMessages((m) =>
        m.map((x) => (x.id === id ? { ...x, text, streaming: true } : x)),
      );
    }
    setMessages((m) => m.map((x) => (x.id === id ? { ...x, text, streaming: false } : x)));
  }

  const showSuggestions = messages.length === 0;

  return (
    <div className="sheet flex h-full min-h-[23rem] flex-col border border-border bg-card">
      {/* slip header */}
      <div className="flex items-baseline justify-between gap-3 border-b border-border px-4 py-2.5">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="text-ai" aria-hidden>
            ✦
          </span>{" "}
          ask my site
        </p>
        <p
          className={cn(
            "flex items-baseline gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em]",
            mode === "live" ? "text-brand" : "text-muted-foreground",
          )}
        >
          <span
            className={cn(
              "inline-block h-1.5 w-1.5 -translate-y-px",
              mode === "live"
                ? "bg-brand motion-safe:animate-pulse"
                : "bg-muted-foreground/50",
            )}
            aria-hidden
          />
          {mode === "live" ? "live model" : mode === "offline" ? "scripted" : "ready"}
        </p>
      </div>

      {/* transcript */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 space-y-5 overflow-y-auto px-4 py-4"
        aria-live="polite"
      >
        {showSuggestions ? (
          <div className="flex h-full flex-col justify-center gap-5">
            <p className="font-serif text-[1.0625rem] leading-relaxed text-foreground/90">
              Ask this site about Pedro — the work, the stack, what he is open to,
              or why the log is co-written with AI.
            </p>
            <ul className="space-y-2.5">
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => send(s)}
                    className="group flex items-baseline gap-2 text-left font-serif text-[0.975rem] text-muted-foreground transition-colors hover:text-brand"
                  >
                    <span
                      aria-hidden
                      className="font-mono text-[10.5px] text-muted-foreground/60 transition-colors group-hover:text-brand"
                    >
                      ▸
                    </span>
                    <span className="border-b border-border pb-[2px] transition-colors group-hover:border-brand">
                      {s}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          messages.map((msg) =>
            msg.role === "user" ? (
              <p
                key={msg.id}
                className="ml-auto max-w-[94%] border-b border-border pb-2 text-right font-mono text-[11.5px] leading-relaxed text-foreground"
              >
                <span aria-hidden className="mr-1.5 text-brand">
                  ▸
                </span>
                <span className="whitespace-pre-wrap">{msg.text}</span>
              </p>
            ) : (
              <div key={msg.id} className="border-l border-border pl-3">
                <p className="font-serif text-[1.0125rem] leading-[1.7] text-foreground/90">
                  <span className="whitespace-pre-wrap">{msg.text}</span>
                  {msg.streaming && (
                    <span
                      className="cursor-blink ml-0.5 font-mono text-brand"
                      aria-hidden
                    >
                      ▌
                    </span>
                  )}
                </p>
              </div>
            ),
          )
        )}
      </div>

      {/* input — a single ruled line, like writing on the slip */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-baseline gap-3 border-t border-border px-4 py-3"
      >
        <span aria-hidden className="font-mono text-[11.5px] text-brand">
          ▸
        </span>
        <label htmlFor="ask-input" className="sr-only">
          Ask this site a question about Pedro
        </label>
        <input
          id="ask-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ask anything…"
          maxLength={500}
          autoComplete="off"
          className="h-7 min-w-0 flex-1 border-b border-input bg-transparent pb-1 font-mono text-[11.5px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-brand"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="shrink-0 font-mono text-[13px] text-foreground transition-colors hover:text-brand disabled:opacity-30"
          aria-label="Send question"
        >
          →
        </button>
      </form>

      <p className="border-t border-border px-4 py-2.5 font-mono text-[10px] leading-relaxed text-muted-foreground/80">
        {mode === "offline"
          ? "no model key configured · answers from pedro's own content"
          : "grounded in pedro's own content · a model can still be wrong"}
      </p>
    </div>
  );
}
