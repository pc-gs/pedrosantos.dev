---
title: "TIL: `satisfy` says 'check me, don't change me'"
description: "The difference between `as` and `satisfy` in TypeScript, in one sentence I finally got right."
date: "2026-08-27"
tags: ["typescript", "til"]
aiAssisted: false
---

`satisfy` validates that a value matches a type **without widening it**. That's the whole trick:

```ts
const theme = {
  brand: "#2b5aa8",
  background: "#faf6ef",
} satisfies Record<string, string>;
// theme.brand is still the literal "#2b5aa8", but a typo would be a compile error
```

With `as`, you're telling the compiler to shut up. With `satisfy`, you're asking it to check your work and then leave the value's precise type alone. Perfect for config objects, route maps, design tokens — anywhere I want both safety *and* narrow types.

Ten years of JavaScript and this one still took me embarrassingly long to internalize.
