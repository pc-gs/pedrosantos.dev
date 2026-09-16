import { NextRequest } from "next/server";
import { profile } from "@/content/profile";
import { nowItems, nowKindLabel, nowUpdated } from "@/content/now";
import { getFeaturedProjects } from "@/content/projects";
import { getAllLogEntries } from "@/lib/log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ── Naive in-memory rate limit: 10 requests / minute / IP ─────────────── */
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_REQUESTS;
}

/* ── System prompt built from the site's own content ──────────────────── */
const MAX_CONTEXT_CHARS = 6000;

function buildSystemPrompt(): string {
  const projects = getFeaturedProjects()
    .map(
      (p) =>
        `- ${p.title} (${p.status}, ${p.period}): ${p.summary} Stack: ${p.stack.join(", ")}.`,
    )
    .join("\n");

  const now = nowItems
    .map((i) => `- ${nowKindLabel[i.kind]}: ${i.text} (${i.date})`)
    .join("\n");

  const log = getAllLogEntries()
    .slice(0, 8)
    .map((e) => {
      const firstPara =
        e.content
          .split("\n\n")
          .find((p) => p.trim() && !p.startsWith("---") && !p.startsWith("#")) ?? "";
      return `- ${e.title} (${e.date}): ${firstPara.slice(0, 220)}`;
    })
    .join("\n");

  const parts = [
    `You are the site assistant on pedrosantos.dev — the personal site of ${profile.name}.`,
    `Answer questions about Pedro using ONLY the information below. If something isn't covered, say so honestly and point to the contact page.`,
    `Be warm, concise (2–5 sentences unless asked for detail), and answer in the language the visitor writes in.`,
    `Never invent employers, dates, or projects. Never claim to be Pedro himself — you're his site's assistant.`,
    ``,
    `PROFILE: ${profile.role} based in ${profile.location}. ${profile.tagline}`,
    `Stack: ${profile.stack.join(", ")}. Melro.io: ${profile.founded.blurb}`,
    `Availability: ${profile.availability.open ? `open — ${profile.availability.note}` : "not currently open"}.`,
    `Email: ${profile.email}`,
    ``,
    `CURRENT NOW (updated ${nowUpdated}):\n${now}`,
    ``,
    `PROJECTS:\n${projects}`,
    ``,
    `RECENT LOG ENTRIES:\n${log}`,
  ];

  const prompt = parts.join("\n");
  return prompt.length > MAX_CONTEXT_CHARS ? prompt.slice(0, MAX_CONTEXT_CHARS) : prompt;
}

/* ── POST /api/ask — { question } → text/plain stream, or JSON {mode:"offline"} */
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  if (rateLimited(ip)) {
    return new Response(JSON.stringify({ error: "rate_limited" }), {
      status: 429,
      headers: { "content-type": "application/json" },
    });
  }

  let question = "";
  try {
    const body = (await request.json()) as { question?: unknown };
    if (typeof body.question !== "string") throw new Error("bad body");
    question = body.question.trim();
  } catch {
    return new Response(JSON.stringify({ error: "bad_request" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
  if (!question || question.length > 500) {
    return new Response(JSON.stringify({ error: "bad_request" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    // No key configured → the client falls back to its scripted offline mode.
    return new Response(JSON.stringify({ mode: "offline" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  const baseUrl =
    process.env.AI_BASE_URL?.replace(/\/$/, "") ??
    "https://api.groq.com/openai/v1";
  const model = process.env.AI_MODEL ?? "llama-3.3-70b-versatile";

  const upstream = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      stream: true,
      max_tokens: 400,
      temperature: 0.4,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: question },
      ],
    }),
  });

  if (!upstream.ok || !upstream.body) {
    return new Response(JSON.stringify({ error: "upstream_error" }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }

  // Parse the upstream SSE stream and re-emit plain text chunks.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader();
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const payload = trimmed.slice(5).trim();
            if (payload === "[DONE]") continue;
            try {
              const json = JSON.parse(payload);
              const delta: string | undefined =
                json.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              // ignore malformed keep-alive fragments
            }
          }
        }
      } finally {
        controller.close();
        reader.releaseLock();
      }
    },
    cancel() {
      upstream.body?.cancel();
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
