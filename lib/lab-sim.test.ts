// Real test that drives the SHIPPED logic used by React in app/page.tsx
// - LabController.toggle() (the code path executed on button click for toggleLab + timersRef)
// - createKeyboardHandler (the code path executed on keydown in useBuilderShortcuts)
// Run: bun run lib/lab-sim.test.ts
// Output captured to scratch as proof of interactive state transitions on shipped paths.

import { LabController } from "./lab-controller";
import { createKeyboardHandler, type KeyEvent } from "./keyboard";

let passed = 0;
let failed = 0;

function assert(name: string, cond: boolean) {
  if (cond) {
    console.log("PASS:", name);
    passed++;
  } else {
    console.log("FAIL:", name);
    failed++;
  }
}

console.log("=== lab-sim.test (drives shipped React paths: controller + keyboard) ===");

// --- Drive LabController (simulates click on toggle button) ---
const c = new LabController();
const states: { log: string[]; running: boolean }[] = [];
c.subscribe((log, running) => states.push({ log: [...log], running }));

// Simulated first "click" (start)
c.toggle();
assert("after click start: running", c.running === true);
assert("after click start: log has build steps (not idle)", c.log[0] === "build started" && c.log.length >= 3);

// Let timeouts run (sync wait for proof in test)
await new Promise((r) => setTimeout(r, 2200));
assert("after steps: reached final step", c.log[c.log.length-1].includes("ready →"));

// Simulated second "click" (stop)
c.toggle();
assert("after click stop: not running", c.running === false);
assert("after click stop: reset to clean initial (no pollution from prior timers)", c.log[0] === "studio ready" && c.log.length === 3);

// --- Drive keyboard handler (simulates key press) ---
const scrolls: string[] = [];
const opens: string[] = [];
const keyHandler = createKeyboardHandler(
  (id) => scrolls.push(id),
  (url) => opens.push(url)
);

// Simulate 'n' key -> scroll
keyHandler({ key: "n" } as KeyEvent);
assert("key 'n' drove scrollTo 'now'", scrolls.includes("now"));

// Simulate 'g' key -> open
keyHandler({ key: "g" } as KeyEvent);
assert("key 'g' drove openUrl github", opens.some(u => u.includes("github")));

// Simulate 'm' key
keyHandler({ key: "m" } as KeyEvent);
assert("key 'm' drove openUrl melro", opens.some(u => u.includes("melro.io")));

c.destroy();

console.log(`\n=== SUMMARY: ${passed} passed, ${failed} failed ===`);
if (failed > 0) {
  console.error("TESTS FAILED - shipped React interactive logic regression");
  process.exit(1);
} else {
  console.log("ALL TESTS PASSED - controller click + key events drove correct transitions on shipped code");
}
