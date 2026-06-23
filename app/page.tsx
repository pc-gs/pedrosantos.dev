"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";

import {
  ArrowRight,
  ExternalLink,
  Play,
  Square,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { TechGrid } from "@/components/sections/v2/TechGrid";
import { V2ContactSection } from "@/components/sections/v2/ContactSection";
import { HeaderV2 } from "@/components/layout/header-v2";
import { MacbookMockup } from "@/components/devices/MacbookMockup";
import {
  siteIdentity,
  nowItems,
  activeBuilds,
  builderLog,
  type ActiveBuild,
} from "@/lib/builder-data";
import { getInitialLog } from "@/lib/lab-sim";
import { createKeyboardHandler } from "@/lib/keyboard";
import { LabController } from "@/lib/lab-controller";

// Keyboard-driven workspace shortcuts (builder affordance) - uses extracted handler
function useBuilderShortcuts() {
  useEffect(() => {
    const scrollTo = (id: string) => {
      const el = document.getElementById(id);
      if (el) {
        const headerH = 72;
        const top = el.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: "smooth" });
      }
    };
    const openUrl = (url: string) => window.open(url, "_blank", "noopener,noreferrer");
    const handler = createKeyboardHandler(scrollTo, openUrl);
    const listener = (e: KeyboardEvent) => handler(e);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
}

export default function HomePage() {
  useBuilderShortcuts();

  // Lab uses extracted controller (same code exercised by tests via LabController)
  const [labRunning, setLabRunning] = useState(false);
  const [labLog, setLabLog] = useState<string[]>(getInitialLog());
  const controllerRef = useRef<LabController | null>(null);

  if (!controllerRef.current) {
    const c = new LabController();
    c.subscribe((log, running) => {
      setLabLog(log);
      setLabRunning(running);
    });
    controllerRef.current = c;
  }

  const toggleLab = () => {
    controllerRef.current?.toggle();
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      controllerRef.current?.destroy();
    };
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const h = 72;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - h, behavior: "smooth" });
    }
  };

  return (
    <main className="relative bg-background text-foreground">
      <HeaderV2 />

      {/* Builder Hero — compact, direct, workspace entry */}
      <section className="relative pt-20 pb-12 md:pt-24 md:pb-16 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_0.6px,transparent_1px)] dark:bg-[radial-gradient(#ffffff05_0.6px,transparent_1px)] bg-[length:3px_3px]" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary border border-primary/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                LIVE — {new Date().toLocaleString("en-US", { month: "short", year: "numeric" })}
              </span>
              <span className="text-xs text-muted-foreground">pedro.studio / melro.io</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.96] mb-4">
              {siteIdentity.name}<br />
              <span className="text-muted-foreground/70">{siteIdentity.role} @ <Link href={siteIdentity.orgUrl} target="_blank" className="underline decoration-primary/30 hover:decoration-primary transition-colors">{siteIdentity.org}</Link></span>
            </h1>
            <p className="max-w-2xl text-xl md:text-2xl text-muted-foreground tracking-tight mb-8">
              {siteIdentity.tagline}
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <MagneticButton onClick={() => scrollTo("lab")} className="group">
                <span className="relative inline-flex items-center rounded-full bg-primary text-primary-foreground px-7 h-11 text-sm font-medium shadow transition">
                  Enter the Lab <Terminal className="ml-2 h-4 w-4" />
                </span>
              </MagneticButton>
              <Button variant="outline" className="rounded-full px-6 h-11" onClick={() => scrollTo("stack")}>
                See stack
              </Button>
              <Link
                href="https://github.com/pedrocarlos-ti"
                target="_blank"
                className="inline-flex items-center rounded-full border border-border px-5 h-11 text-sm hover:bg-accent transition"
              >
                GitHub <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </Link>
              <Link
                href={siteIdentity.orgUrl}
                target="_blank"
                className="inline-flex items-center rounded-full border border-border px-5 h-11 text-sm hover:bg-accent transition"
              >
                Melro.io <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Builder shortcuts hint */}
            <div className="text-[10px] uppercase tracking-[2px] text-muted-foreground/60 font-mono">
              press <kbd className="px-1 py-px bg-muted rounded">n</kbd> <kbd className="px-1 py-px bg-muted rounded">l</kbd> <kbd className="px-1 py-px bg-muted rounded">s</kbd> <kbd className="px-1 py-px bg-muted rounded">g</kbd> <kbd className="px-1 py-px bg-muted rounded">m</kbd> <kbd className="px-1 py-px bg-muted rounded">c</kbd> — keyboard workspace
            </div>
          </div>
        </div>
      </section>

      {/* NOW — leading builder home content (active focus, not static hero) */}
      <section id="now" className="py-14 md:py-20 border-b border-border/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-baseline justify-between mb-8">
              <div>
                <div className="text-xs uppercase tracking-[2px] text-primary font-medium">Current focus</div>
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Now</h2>
              </div>
              <div className="text-xs text-muted-foreground font-mono hidden sm:block">updated live from studio</div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {nowItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -2 }}
                  className="rounded-2xl border border-border/60 bg-card/60 p-6 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold tracking-tight">{item.title}</div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">{item.status}</span>
                  </div>
                  <p className="text-sm text-muted-foreground flex-1">{item.detail}</p>
                  <div className="mt-4 text-[10px] font-mono text-muted-foreground/70">{item.updated}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LAB — interactive builder affordance + device mockup (repurposed from unused) */}
      <section id="lab" className="py-16 md:py-24 bg-muted/20 border-b border-border/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <div className="text-xs uppercase tracking-[2px] text-primary font-medium">Experiments &amp; previews</div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">The Lab</h2>
              <p className="mt-2 max-w-md text-muted-foreground">Live workspace simulation. Keyboard, mock deploy, device frame. No templates.</p>
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
              {/* Live Macbook workspace preview - draws on devices/ */}
              <div className="lg:col-span-3">
                <MacbookMockup>
                  <div className="h-full w-full bg-[#0a0a0a] text-[#e2e8f0] p-4 font-mono text-[11px] leading-tight overflow-hidden relative flex flex-col">
                    <div className="flex items-center gap-2 text-emerald-400 mb-2">
                      <Terminal className="h-3.5 w-3.5" /> studio / current-session
                    </div>
                    <div className="flex-1 overflow-auto space-y-px pr-2">
                      {labLog.map((line, i) => (
                        <div key={i} className="text-emerald-300/90">{">"} {line}</div>
                      ))}
                      {labRunning && <div className="text-amber-400 animate-pulse">{"▌"}</div>}
                    </div>
                    <div className="pt-2 mt-auto border-t border-white/10 flex items-center justify-between text-[10px] text-white/50">
                      <span>next dev</span>
                      <span className={labRunning ? "text-emerald-400" : ""}>{labRunning ? "BUILDING" : "IDLE"}</span>
                    </div>
                  </div>
                </MacbookMockup>
              </div>

              {/* Lab controls & micro experiments */}
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-2xl border bg-card p-6">
                  <div className="uppercase text-xs tracking-widest text-muted-foreground mb-2">Control</div>
                  <Button onClick={toggleLab} variant={labRunning ? "destructive" : "default"} className="w-full rounded-full h-12 text-base">
                    {labRunning ? (<><Square className="mr-2 h-4 w-4" /> Stop build</>) : (<><Play className="mr-2 h-4 w-4" /> Run local build</>)}
                  </Button>
                  <p className="mt-3 text-xs text-muted-foreground">Simulates production pipeline locally. State lives in component.</p>
                </div>

                <div className="rounded-2xl border bg-card p-6 space-y-4">
                  <div className="uppercase text-xs tracking-widest text-muted-foreground">Quick links</div>
                  {activeBuilds.map((b: ActiveBuild) => (
                    <a key={b.id} href={b.href} target="_blank" rel="noopener noreferrer"
                      className="group flex items-center justify-between border border-border/60 rounded-xl px-4 py-3 hover:border-primary/40 transition">
                      <div>
                        <div className="font-medium tracking-tight">{b.title}</div>
                        <div className="text-xs text-muted-foreground">{b.stack.slice(0, 3).join(" · ")}</div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    </a>
                  ))}
                </div>

                <div className="text-[10px] text-muted-foreground/60 px-1">Use <span className="font-mono">l</span> key to jump here. Real output ships to melro.io + GH.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STACK — condensed, still technical but not dominant classic grid */}
      <section id="stack" className="py-16 md:py-20 border-b border-border/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="text-xs uppercase tracking-[2px] text-primary font-medium">In production today</div>
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Stack</h2>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full hidden md:flex" onClick={() => scrollTo("log")}>see activity ↓</Button>
            </div>
            <TechGrid />
          </div>
        </div>
      </section>

      {/* Active Builds — concrete, no placeholders, functional destinations */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <div className="text-xs uppercase tracking-[2px] text-primary font-medium">Shipped &amp; shipping</div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Active Builds</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {activeBuilds.map((build) => (
                <a
                  key={build.id}
                  href={build.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-2xl border border-border/60 bg-card p-6 hover:border-primary/30 hover:bg-card/80 transition flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] px-2 py-px rounded border ${build.status === "Active" ? "border-emerald-500/30 text-emerald-400" : build.status === "In Progress" ? "border-amber-500/30 text-amber-400" : "border-sky-500/30 text-sky-400"}`}>{build.status}</span>
                  </div>
                  <div className="font-semibold text-lg tracking-tight mb-1 group-hover:text-primary">{build.title}</div>
                  <p className="text-sm text-muted-foreground flex-1 mb-4">{build.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {build.stack.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</span>)}
                  </div>
                  <div className="inline-flex items-center text-sm text-primary font-medium">
                    {build.hrefLabel} <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                  </div>
                </a>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-8">All links are live external destinations. No /projects, no placeholders.</p>
          </div>
        </div>
      </section>

      {/* LOG — lightweight activity (replaces heavy bio tabs) */}
      <section id="log" className="py-16 md:py-24 border-t border-border/40 bg-muted/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="text-xs uppercase tracking-[2px] text-primary font-medium">Studio timeline</div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Builder Log</h2>
            </div>

            <div className="space-y-3">
              {builderLog.map((entry, i) => (
                <div key={i} className="flex gap-4 rounded-xl border border-border/40 bg-card/50 px-5 py-4">
                  <div className="w-16 shrink-0 text-xs font-mono pt-0.5 text-muted-foreground">{entry.date}</div>
                  <div>
                    <div className="font-medium">{entry.title}</div>
                    <div className="text-sm text-muted-foreground">{entry.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link href="https://github.com/pedrocarlos-ti" target="_blank" className="text-sm inline-flex items-center text-primary hover:underline">Full activity on GitHub <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact — keep functional, positioned as builder collab entry */}
      <V2ContactSection />
    </main>
  );
}
