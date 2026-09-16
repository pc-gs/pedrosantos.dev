---
title: "TIL: Tauri is a webview, not a browser"
description: "Shipping a Tauri app taught me why 'it works in Chrome' is not the same as 'it works in Tauri'."
date: "2026-09-09"
tags: ["tauri", "desktop", "rust"]
aiAssisted: false
---

I hit this last week while packaging a small Melro.io tool: a layout that was pixel-perfect in Chrome broke inside the Tauri window. Tauri doesn't ship Chromium — it uses the OS webview (WKWebView on macOS, WebView2 on Windows). Different engine, different CSS support, different default fonts.

Things that bit me:

- `backdrop-filter` behaves differently on WKWebView
- No DevTools until you explicitly enable them in dev builds
- File dialogs and drag-and-drop go through the Rust side, not the DOM

The mental shift: a Tauri app is a native shell wrapping *whatever browser the OS gives you*. That's the whole point (tiny binaries), but it means testing on each target OS isn't optional.

React Native taught me a similar lesson about never trusting the "it's all webtech" promise. Apparently I needed to learn it twice.
