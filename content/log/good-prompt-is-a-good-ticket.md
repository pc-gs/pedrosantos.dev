---
title: "A good prompt is just a good ticket"
description: "Writing requirements for an AI model and writing tickets for a teammate turn out to be the same skill."
date: "2026-09-03"
tags: ["ai", "workflow", "communication"]
aiAssisted: true
model: "GLM"
prompt: "I keep noticing that my best AI results come from prompts that look like good issue tickets. Interview me about this observation, then help me condense the pattern into a short log entry."
---

The prompts that give me great results all share a shape with the tickets I write for colleagues: context first, constraint explicit, expected output described, edge cases named. The prompts that fail are the ones I'd be embarrassed to file as a ticket — "make it better", no definition of better.

So I stopped writing "prompts" and started writing tiny tickets:

- **Context**: this component renders 500 rows, virtualization is already in place
- **Task**: add sticky column headers that respect the existing table skeleton
- **Constraints**: no new dependencies, keep the current DOM structure
- **Done when**: scrolling keeps headers visible and lighthouse stays green

The side effect surprised me: my actual tickets got better too. Explaining things to a model with zero shared context is practice for explaining things to the new hire with zero shared context.
