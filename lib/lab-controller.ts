// Reusable Lab controller extracted so React toggleLab + timersRef path in app/page.tsx
// and tests drive the *same* code.

import { getInitialLog, getBuildLog, applyNextBuildStep } from "./lab-sim";

export type LabListener = (log: string[], running: boolean) => void;

export class LabController {
  public running = false;
  public log: string[] = getInitialLog();
  private timers: number[] = [];
  private listeners: LabListener[] = [];

  subscribe(fn: LabListener) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify() {
    const logCopy = [...this.log];
    this.listeners.forEach((l) => l(logCopy, this.running));
  }

  clearTimers() {
    this.timers.forEach((id) => clearTimeout(id));
    this.timers = [];
  }

  // The core toggle logic (called by React onClick in page)
  toggle() {
    if (!this.running) {
      this.clearTimers();
      this.running = true;
      this.log = getBuildLog().slice(0, 3);
      this.notify();

      const remaining = getBuildLog().slice(3);
      remaining.forEach((_, i) => {
        const id = setTimeout(() => {
          if (!this.running) return; // guard against post-stop fires / rapid toggle races
          this.log = applyNextBuildStep(this.log);
          this.notify();
        }, 420 + i * 440) as unknown as number;
        this.timers.push(id);
      });
    } else {
      this.clearTimers();
      this.running = false;
      this.log = getInitialLog();
      this.notify();
    }
  }

  // For test cleanup
  destroy() {
    this.clearTimers();
    this.listeners = [];
  }
}
