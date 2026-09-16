"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { nowItems, nowKindLabel, nowUpdated } from "@/content/now";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import { ArrowUp, Sparkles } from "lucide-react";

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
    <div className="flex h-full min-h-[26rem] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-[0_1px_0_hsl(30_22%_10%/0.04)]">
      {/* header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-ai" aria-hidden />
          Ask my site
        </p>
        <span
          className={cn(
            "flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider",
            mode === "live" ? "text-brand" : "text-muted-foreground",
          )}
        >
          <span
            className={cn(
              "relative flex h-1.5 w-1.5",
              mode === "live" && "motion-safe:animate-ping absolute opacity-60",
            )}
            aria-hidden
          />
          <span className={cn("h-1.5 w-1.5 rounded-full", mode === "live" ? "bg-brand" : "bg-muted-foreground/60")} aria-hidden />
          {mode === "live" ? "ai · live" : mode === "offline" ? "scripted · offline" : "ready"}
        </span>
      </div>

      {/* transcript */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
        aria-live="polite"
      >
        {showSuggestions ? (
          <div className="flex h-full flex-col justify-center gap-4">
            <p className="max-w-[38ch] font-serif text-lg leading-snug text-foreground/90">
              Ask about Pedro&apos;s work, stack, availability — or why this site
              is co-written with AI.
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-border bg-background px-3 py-1.5 font-mono text-[12px] text-muted-foreground transition-colors hover:border-brand hover:text-brand"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "max-w-[85%] rounded-lg px-3.5 py-2.5 text-[0.9rem] leading-relaxed",
                msg.role === "user"
                  ? "ml-auto bg-foreground text-background"
                  : "mr-auto border border-border bg-background font-serif text-[0.95rem] text-foreground/90",
              )}
            >
              <span className="whitespace-pre-wrap">{msg.text}</span>
              {msg.streaming && <span className="cursor-blink font-mono text-brand">▌</span>}
            </div>
          ))
        )}
      </div>

      {/* input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-border p-3"
      >
        <label htmlFor="ask-input" className="sr-only">
          Ask this site a question about Pedro
        </label>
        <input
          id="ask-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything…"
          maxLength={500}
          autoComplete="off"
          className="h-9 min-w-0 flex-1 rounded-md border border-input bg-background px-3 font-mono text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-brand"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-foreground text-background transition-opacity hover:opacity-90 disabled:opacity-40"
          aria-label="Send question"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </form>

      <p className="border-t border-border/60 px-4 py-2 font-mono text-[11px] leading-relaxed text-muted-foreground/80">
        {mode === "offline"
          ? "runs locally · no llm · synced from pedro's own content"
          : "answers from pedro's own content · ai can be wrong"}
      </p>
    </div>
  );
}
