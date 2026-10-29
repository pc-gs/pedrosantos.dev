"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

/** What the core is currently showing. Each one is a blueprint of real work. */
export type ConsoleMode = "idle" | "melro" | "tauri" | "agents" | "graphql" | "stack";

export type ConsoleLine = {
  id: number;
  kind: "input" | "ok" | "info" | "error";
  text: string;
};

type ConsoleState = {
  mode: ConsoleMode;
  humanMode: boolean;
  lines: ConsoleLine[];
  setMode: (mode: ConsoleMode) => void;
  setHumanMode: (on: boolean) => void;
  print: (kind: ConsoleLine["kind"], text: string) => void;
  /** Lets cards ask the bench to run without owning its state. */
  benchSignal: number;
  triggerBench: () => void;
};

const ConsoleContext = createContext<ConsoleState | null>(null);

export function ConsoleProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ConsoleMode>("idle");
  const [humanMode, setHumanMode] = useState(false);
  const [benchSignal, setBenchSignal] = useState(0);
  const [lines, setLines] = useState<ConsoleLine[]>([
    { id: 0, kind: "info", text: "session ready · type `help` or pick an intent" },
  ]);
  const nextId = useRef(1);

  const print = useCallback((kind: ConsoleLine["kind"], text: string) => {
    const id = nextId.current++;
    setLines((prev) => [...prev.slice(-5), { id, kind, text }]);
  }, []);

  const triggerBench = useCallback(() => setBenchSignal((n) => n + 1), []);

  const value = useMemo(
    () => ({
      mode,
      humanMode,
      lines,
      setMode,
      setHumanMode,
      print,
      benchSignal,
      triggerBench,
    }),
    [mode, humanMode, lines, print, benchSignal, triggerBench],
  );

  return <ConsoleContext.Provider value={value}>{children}</ConsoleContext.Provider>;
}

export function useConsole(): ConsoleState {
  const ctx = useContext(ConsoleContext);
  if (!ctx) throw new Error("useConsole must be used inside <ConsoleProvider>");
  return ctx;
}
