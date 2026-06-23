"use client";

import { cn } from "@/lib/utils";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Now", href: "#now" },
  { name: "Lab", href: "#lab" },
  { name: "Stack", href: "#stack" },
  { name: "Log", href: "#log" },
  { name: "Contact", href: "#contact" },
];

export function HeaderV2() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Only track scrolled state for backdrop style; header is always visible (no hide)
    setIsScrolled(latest > 120);
  });

  const scrollToSection = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    
    if (targetId === "now" || targetId === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        const headerHeight = 80;
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: "smooth" });
      }
    }
    setIsMobileOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: 0, opacity: 1 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled 
            ? "bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm" 
            : "bg-transparent"
        )}
      >
        <div className="container flex h-16 md:h-20 items-center justify-between px-4 md:px-6 max-w-6xl mx-auto">
          {/* Logo */}
          <Link
            href="#now"
            onClick={(e) => scrollToSection(e, "#now")}
            className="text-lg md:text-xl font-bold text-foreground hover:text-primary transition-colors tracking-tight"
          >
            pedro<span className="text-primary/70">.studio</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                  "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button - builder action */}
          <div className="hidden md:block">
            <Button
              size="sm"
              className="rounded-full px-6"
              onClick={(e) => scrollToSection(e as React.MouseEvent, "#lab")}
            >
              Open Lab
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: isMobileOpen ? 1 : 0,
          y: isMobileOpen ? 0 : -20,
          pointerEvents: isMobileOpen ? "auto" : "none"
        }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 md:hidden"
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-background/95 backdrop-blur-md"
          onClick={() => setIsMobileOpen(false)}
        />
        
        {/* Menu Content */}
        <div className="relative flex flex-col items-center justify-center h-full gap-6 p-8">
          <nav className="flex flex-col items-center gap-4">
            {navItems.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: isMobileOpen ? 1 : 0, 
                  y: isMobileOpen ? 0 : 20 
                }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
              >
                <Link
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className="text-2xl font-medium text-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isMobileOpen ? 1 : 0, 
              y: isMobileOpen ? 0 : 20 
            }}
            transition={{ delay: 0.25, duration: 0.2 }}
          >
            <Button
              size="lg"
              className="rounded-full px-8 mt-4"
              onClick={(e) => scrollToSection(e as React.MouseEvent, "#lab")}
            >
              Open Lab
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
