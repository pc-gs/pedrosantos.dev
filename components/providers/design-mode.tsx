"use client";

import { useEffect } from "react";

/**
 * Marks the document as a design-exploration route.
 *
 * The manuscript grain is a fixed body::before layer; variants under /design
 * need a clean canvas, so this class disables it while the route is mounted.
 */
export function DesignMode() {
  useEffect(() => {
    document.body.classList.add("design-mode");
    return () => document.body.classList.remove("design-mode");
  }, []);

  return null;
}
