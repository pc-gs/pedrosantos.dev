// Extracted keyboard handler logic (pure creator).
// The React code in app/page.tsx (useBuilderShortcuts) calls this.
// Test imports and drives it directly with simulated events + injected fns.

import { shortcuts } from "./builder-data";

export type ScrollTo = (id: string) => void;
export type OpenUrl = (url: string) => void;

export type KeyEvent = { key: string; preventDefault?: () => void; target?: { tagName?: string } | EventTarget | null };

export function createKeyboardHandler(scrollTo: ScrollTo, openUrl: OpenUrl) {
  return (e: KeyEvent) => {
    const key = (e.key || "").toLowerCase();
    const tag = (e.target as { tagName?: string } | null | undefined)?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    const entry = shortcuts.find((s) => s.key === key);
    if (!entry) return;

    if (e.preventDefault) e.preventDefault();

    if (entry.action.startsWith("#")) {
      scrollTo(entry.action.slice(1));
    } else {
      openUrl(entry.action);
    }
  };
}
