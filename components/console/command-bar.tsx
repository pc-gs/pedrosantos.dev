"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useConsole, type ConsoleMode } from "./console-context";
import { MODE_ACCENT } from "./core-canvas";

type Command = {
  name: string;
  hint: string;
  run: (api: ReturnType<typeof useConsole>, router: ReturnType<typeof useRouter>) => string;
};

function inspect(mode: ConsoleMode, label: string): Command["run"] {
  return ({ setMode, setHumanMode }) => {
    setHumanMode(false);
    setMode(mode);
    return `${label} · blueprint mounted`;
  };
}

const COMMANDS: Command[] = [
  { name: "inspect:melro", hint: "the company I'm building", run: inspect("melro", "melro.io") },
  {
    name: "run:tauri-check",
    hint: "IPC round-trip bench, in your browser",
    run: ({ setMode, setHumanMode, triggerBench }) => {
      setHumanMode(false);
      setMode("tauri");
      triggerBench();
      return "tauri-check · bench running → see the Tauri window below";
    },
  },
  { name: "inspect:agents", hint: "how I work with models", run: inspect("agents", "agent loop") },
  { name: "inspect:graphql", hint: "fragments and schema boundaries", run: inspect("graphql", "graphql") },
  { name: "reveal:stack", hint: "what I ship with", run: inspect("stack", "stack") },
  {
    name: "toggle:human-mode",
    hint: "no canvas, just the words",
    run: ({ humanMode, setHumanMode }) => {
      setHumanMode(!humanMode);
      return humanMode ? "human-mode off · core back online" : "human-mode on · plain text, zero motion";
    },
  },
  {
    name: "reset",
    hint: "fold the blueprint back up",
    run: ({ setMode }) => {
      setMode("idle");
      return "core idle";
    },
  },
  {
    name: "open:log",
    hint: "the learning log",
    run: (_, router) => {
      router.push("/log");
      return "opening /log";
    },
  },
  {
    name: "open:work",
    hint: "case studies",
    run: (_, router) => {
      router.push("/work");
      return "opening /work";
    },
  },
  {
    name: "open:contact",
    hint: "say hello",
    run: (_, router) => {
      router.push("/contact");
      return "opening /contact";
    },
  },
];

const CHIPS = [
  "inspect:melro",
  "run:tauri-check",
  "inspect:agents",
  "inspect:graphql",
  "reveal:stack",
  "toggle:human-mode",
];

/**
 * The floating intent bar. Typed or clicked intents drive the core, the
 * cards and the human-mode switch through the console context.
 */
export function CommandBar() {
  const api = useConsole();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);

  const query = value.trim().toLowerCase();
  const suggestion = query ? COMMANDS.find((c) => c.name.startsWith(query)) : undefined;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement).closest("input, textarea, [contenteditable]");
      if ((e.key === "/" && !typing) || (e.key === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function execute(raw: string) {
    const input = raw.trim().toLowerCase();
    if (!input) return;
    api.print("input", input);
    setHistory((prev) => [input, ...prev.filter((h) => h !== input)].slice(0, 20));
    setCursor(-1);
    setValue("");

    if (input === "help" || input === "?") {
      api.print("info", COMMANDS.map((c) => c.name).join("  "));
      return;
    }
    if (input === "clear") {
      api.setMode("idle");
      api.print("info", "cleared");
      return;
    }
    const command = COMMANDS.find((c) => c.name === input);
    if (!command) {
      const verb = input.split(":")[1] ?? input;
      const near = COMMANDS.find((c) => c.name.includes(verb.slice(0, 3)));
      api.print(
        "error",
        `unknown intent \`${input}\`${near ? ` · did you mean \`${near.name}\`?` : " · try `help`"}`,
      );
      return;
    }
    api.print("ok", command.run(api, router));
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      execute(value);
    } else if (e.key === "Tab" && suggestion && value !== suggestion.name) {
      e.preventDefault();
      setValue(suggestion.name);
    } else if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const next = Math.min(cursor + 1, history.length - 1);
      setCursor(next);
      setValue(history[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = cursor - 1;
      setCursor(Math.max(-1, next));
      setValue(next < 0 ? "" : history[next]);
    } else if (e.key === "Escape") {
      setValue("");
      inputRef.current?.blur();
    }
  }

  const accent = MODE_ACCENT[api.mode];

  return (
    <div
      data-no-ripple
      className="relative w-full max-w-[640px] rounded-[10px] border border-con-line bg-con-panel/85 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.9)] backdrop-blur-md"
    >
      <ol
        aria-live="polite"
        className="max-h-[132px] space-y-1 overflow-hidden px-4 pt-3 font-mono text-[11.5px] leading-relaxed"
      >
        {api.lines.slice(-4).map((line) => (
          <li
            key={line.id}
            className={
              line.kind === "input"
                ? "text-con-ink"
                : line.kind === "ok"
                  ? "text-con-phosphor"
                  : line.kind === "error"
                    ? "text-con-amber"
                    : "text-con-dim"
            }
          >
            {line.kind === "input" ? "› " : line.kind === "ok" ? "✓ " : line.kind === "error" ? "! " : "· "}
            {line.text}
          </li>
        ))}
      </ol>

      <label className="relative mt-2 flex items-center gap-3 border-t border-con-line px-4 py-3">
        <span className="font-mono text-[13px]" style={{ color: accent }} aria-hidden="true">
          ›
        </span>
        <span className="sr-only">Run an intent</span>
        <span className="relative flex-1">
          {suggestion && value && suggestion.name !== value && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 font-mono text-[14px] text-con-dim/50"
            >
              <span className="invisible">{value}</span>
              {suggestion.name.slice(value.length)}
            </span>
          )}
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setCursor(-1);
            }}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            placeholder="type an intent, or `help`"
            className="relative w-full bg-transparent font-mono text-[14px] text-con-ink caret-con-amber outline-none placeholder:text-con-dim/60"
          />
        </span>
        <kbd className="hidden rounded border border-con-line px-1.5 py-0.5 font-mono text-[10px] text-con-dim sm:inline">
          /
        </kbd>
      </label>

      <div className="flex flex-wrap gap-1.5 border-t border-con-line px-3 py-2.5">
        {CHIPS.map((name) => {
          const command = COMMANDS.find((c) => c.name === name)!;
          return (
            <button
              key={name}
              type="button"
              title={command.hint}
              onClick={() => execute(name)}
              className="rounded-[6px] border border-con-line px-2 py-1 font-mono text-[11px] text-con-dim transition-colors hover:border-con-amber/60 hover:text-con-ink focus-visible:border-con-amber focus-visible:text-con-ink focus-visible:outline-none"
            >
              {name}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-4 rounded-b-[10px] border-t border-con-line bg-black/30 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-con-dim">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} aria-hidden="true" />
          mode: {api.humanMode ? "human" : api.mode}
        </span>
        <span className="hidden sm:inline">⏎ run · tab complete · ↑ history</span>
      </div>
    </div>
  );
}
