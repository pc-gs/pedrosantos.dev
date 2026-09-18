"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import type { PaletteItem } from "@/lib/palette";

const KIND_LABEL: Record<PaletteItem["kind"], string> = {
  page: "Pages",
  log: "Log",
  post: "Essays",
  project: "Work",
};

export function CommandPalette({ items }: { items: PaletteItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    document.addEventListener("palette:open", onOpen);
    return () => document.removeEventListener("palette:open", onOpen);
  }, []);

  const grouped = useMemo(() => {
    const groups = new Map<PaletteItem["kind"], PaletteItem[]>();
    for (const item of items) {
      const list = groups.get(item.kind) ?? [];
      list.push(item);
      groups.set(item.kind, list);
    }
    return [...groups.entries()];
  }, [items]);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Site navigation"
      shouldFilter
      overlayClassName="fixed inset-0 z-[90] bg-foreground/20 backdrop-blur-sm animate-in fade-in-0 duration-150"
      contentClassName="fixed left-1/2 top-[18vh] z-[91] w-[min(92vw,34rem)] -translate-x-1/2 overflow-hidden rounded-md border border-border bg-card shadow-xl animate-in fade-in-0 zoom-in-95 duration-150 motion-reduce:animate-none"
    >
      <div className="flex items-center gap-2.5 border-b border-border px-4">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <Command.Input
          placeholder="Search pages, log, studies, essays, work…"
          className="h-12 w-full bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
        />
        <kbd className="shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          esc
        </kbd>
      </div>
      <Command.List className="max-h-[52vh] overflow-y-auto p-2">
        <Command.Empty className="px-3 py-8 text-center text-muted-foreground">
          Nothing found — try &ldquo;log&rdquo; or &ldquo;tauri&rdquo;.
        </Command.Empty>
        {grouped.map(([kind, list]) => (
          <Command.Group
            key={kind}
            heading={KIND_LABEL[kind]}
            className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground"
          >
            {list.map((item) => (
              <Command.Item
                key={item.id}
                value={`${item.label} ${item.hint ?? ""}`}
                onSelect={() => {
                  setOpen(false);
                  router.push(item.href);
                }}
                className="flex cursor-pointer items-baseline justify-between gap-4 rounded-md px-3 py-2.5 text-sm text-foreground data-[selected=true]:bg-muted"
              >
                <span className="truncate">{item.label}</span>
                {item.hint && (
                  <span className="shrink-0 truncate font-mono text-[11px] text-muted-foreground">
                    {item.hint}
                  </span>
                )}
              </Command.Item>
            ))}
          </Command.Group>
        ))}
      </Command.List>
    </Command.Dialog>
  );
}
