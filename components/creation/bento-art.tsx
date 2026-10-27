import { cn } from "@/lib/utils";

/**
 * Small live illustrations for the home bento. Server components, animated
 * with CSS only (keyframes in globals.css), all of it `motion-safe`.
 * Each card's group hover drives a second state.
 */

// A melro (blackbird) in the dot matrix: X body, o beak, e eye.
const BIRD = [
  "..........XXX.....",
  ".........XXXXX....",
  ".........XXeXXoo..",
  "........XXXXXX....",
  "...XXXXXXXXXXX....",
  ".XXXXXXXXXXXXX....",
  "XXXXXXXXXXXXX.....",
  "..XXXXXXXXXX......",
  "....XXXXXX........",
  "......X..X........",
  ".....XX.XX........",
];

export function MelroArt() {
  return (
    <div
      aria-hidden
      className="grid w-fit gap-[3px] [--px:9px] md:gap-1 md:[--px:13px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 motion-reduce:transition-none"
      style={{ gridTemplateColumns: `repeat(${BIRD[0].length}, var(--px))` }}
    >
      {BIRD.flatMap((row, j) =>
        [...row].map((c, i) => (
          <span
            key={`${i}-${j}`}
            className={cn(
              "aspect-square w-[var(--px)]",
              c === "X" &&
                "bg-foreground motion-safe:animate-[twinkle_4.8s_ease-in-out_infinite]",
              c === "o" && "bg-brand",
              (c === "." || c === "e") && "bg-foreground/[0.045]",
            )}
            style={
              c === "X"
                ? { animationDelay: `${((i * 7 + j * 13) % 23) * -0.21}s` }
                : undefined
            }
          />
        )),
      )}
    </div>
  );
}

export function TauriArt() {
  return (
    <div
      aria-hidden
      className="relative h-[8.75rem] w-full max-w-[17rem] [perspective:700px]"
    >
      {/* the Rust core, underneath */}
      <div className="absolute inset-x-6 top-[3.25rem] bottom-0 border border-border bg-muted px-3 pt-7 font-mono text-[9.5px] leading-[1.7] text-muted-foreground">
        <span className="text-brand-text">#[tauri::command]</span>
        <br />
        fn draw(stroke: Stroke) {"{ … }"}
      </div>
      {/* the webview, on top; lifts on hover */}
      <div className="absolute inset-x-0 top-0 h-[4.75rem] origin-bottom border border-foreground bg-card shadow-[0_1px_0_var(--border)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[transform:translateY(-10px)_rotateX(14deg)] motion-reduce:transition-none">
        <div className="flex items-center gap-1 border-b border-border px-2 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
          <span className="ml-auto font-mono text-[8.5px] uppercase tracking-[0.16em] text-muted-foreground">
            webview
          </span>
        </div>
        <div className="space-y-1.5 p-2.5">
          <span className="block h-1 w-3/4 bg-foreground/70" />
          <span className="block h-1 w-1/2 bg-foreground/25" />
          <span className="block h-1 w-2/3 bg-foreground/25" />
        </div>
      </div>
    </div>
  );
}

const TERMINAL = [
  { cmd: "plan", arg: "read the ticket, list the unknowns" },
  { cmd: "explore", arg: "components/log/*" },
  { cmd: "draft", arg: "log-feed.tsx" },
  { cmd: "verify", arg: "typecheck ✓  lint ✓  build ✓" },
];

export function AgentArt() {
  return (
    <div
      aria-hidden
      className="w-full max-w-[19rem] border border-border bg-background/70 font-mono text-[9.5px] leading-[1.75]"
    >
      <div className="flex items-center justify-between border-b border-border px-2.5 py-1 text-[8.5px] uppercase tracking-[0.16em] text-muted-foreground">
        <span>agent loop</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 bg-brand motion-safe:animate-[blink_1.2s_steps(2,jump-none)_infinite]" />
          running
        </span>
      </div>
      <div className="overflow-hidden px-2.5 py-2">
        <div className="h-[8.75em] overflow-hidden motion-safe:animate-[typeout_7s_steps(5,jump-end)_infinite]">
          {TERMINAL.map((line) => (
            <p key={line.cmd} className="truncate">
              <span className="text-muted-foreground">›</span>{" "}
              <span className="inline-block w-[8ch]">{line.cmd}</span>
              <span className="text-muted-foreground">{line.arg}</span>
            </p>
          ))}
          <p className="text-brand-text">
            ⏸ waiting for human review
            <span className="ml-1 inline-block h-[1em] w-[0.5em] translate-y-[2px] bg-brand motion-safe:animate-[blink_1s_steps(2,jump-none)_infinite]" />
          </p>
        </div>
      </div>
    </div>
  );
}

export function GraphqlArt() {
  const spread =
    "transition-colors duration-300 group-hover:text-brand-text group-hover:underline decoration-brand/50 underline-offset-2";
  return (
    <div
      aria-hidden
      className="relative w-full max-w-[22rem] font-mono text-[10.5px] leading-[1.8]"
    >
      {/* the gutter the fragment travels along */}
      <span className="absolute top-[0.9em] bottom-[2.6em] left-0 w-px bg-border">
        <span className="absolute left-[-2px] h-[5px] w-[5px] bg-brand motion-safe:animate-[travel_3.2s_cubic-bezier(0.65,0,0.35,1)_infinite]" />
      </span>
      <pre className="pl-4 whitespace-pre text-muted-foreground">
        <span className="text-foreground">query</span> LogPage {"{"}
        {"\n"} entries {"{ "}
        <span className={spread}>...EntryRow</span>
        {" }"}
        {"\n}"}
        {"\n\n"}
        <span className="text-foreground">fragment</span>{" "}
        <span className={spread}>EntryRow</span> on Entry {"{"}
        {"\n"} title date <span className="text-foreground/60">...AiMark</span>
        {"\n}"}
      </pre>
    </div>
  );
}
