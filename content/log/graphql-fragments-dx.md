---
title: "GraphQL fragments are a DX superpower I underused"
description: "At the day job I finally leaned into colocated fragments — and deleted a pile of hand-maintained query types."
date: "2026-08-18"
tags: ["graphql", "react", "frontend"]
aiAssisted: false
---

I knew about fragments for years the way you know about a keyboard shortcut someone told you about once: technically. Then a refactor at the day job forced the issue — six components each declaring near-identical fields, and one schema change breaking all of them in different ways.

Moving each component's fields into a colocated fragment meant:

- components declare what they need, right next to where they need it
- the query at the page level just spreads fragments
- generated types flow down automatically — I deleted a folder of hand-written prop types

The lesson I keep relearning: the tooling around a technology usually matters more than the technology. Fragments were never the bottleneck; my habits were.
