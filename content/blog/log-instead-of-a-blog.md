---
title: "Why I built a log instead of a blog"
description: "A blog dies of friction. A log survives it. Notes on choosing short, honest entries — and on marking exactly where AI helped."
date: "2026-09-14"
tags: ["meta", "ai", "writing"]
draft: false
coWritten: true
process:
  notes: >-
    Rough voice notes dumped after a week of rebuilding: every blog I've started
    died at the draft stage, most of what I learn is too small for a post, AI
    made me learn faster but publish less, and I wanted the site to show the
    unglamorous middle. Keep it specific. Mention the ✦ marks. Don't pretend the
    model wasn't involved, and don't pretend I didn't write it either.
  prompts:
    - Take these notes and tell me which one is the actual thesis. I think it's "a blog dies of friction" but I want you to argue against it.
    - Draft a 700-word essay from those notes. First person, no marketing tone, no "in today's fast-paced world". Use my phrasing where it's already better than yours.
    - Where is this draft claiming something I can't back up? List every sentence that needs evidence from my notes.
  humanEdit: >-
    Cut the opening scene I never actually experienced, rewrote the paragraph
    about friction in my own words, deleted two tidy metaphors, replaced the AI's
    generic closing with the actual next step (ship it and see), and fixed the
    title so it doesn't sound like content marketing.
---

Four portfolio sites ago, I made myself a promise: I'd keep a blog. Not a big one — just notes when something was worth saying. In two years I published one post. The draft folder has eleven. All of them start strong and die somewhere around paragraph four, when I remember that a "post" implies structure, an arc, and a point that survives being published under my name.

Meanwhile I was learning constantly. A GraphQL fragments refactor at work taught me more than any tutorial I'd sat through. I shipped a Tauri app and discovered its webview is not Chrome. I finally internalised what `satisfies` does. None of that felt like it deserved a post. All of it was worth remembering.

## A blog dies of friction

The problem isn't discipline, it's the unit of work. A post is a heavyweight artefact: a title you're committing to, an argument, an introduction that promises something the body has to deliver. That's a research paper's problem, applied to a thought you had while debugging.

A **log entry** is a lighter unit. One thing I learned, written the day I learned it, in a few paragraphs, with no obligation to be interesting to anyone who isn't me. It can be unfinished. It can end without a conclusion — which is what actual learning looks like from the inside.

So this version of the site has both, but the log is the centrepiece: short entries, dated, tagged, published in minutes. Writing lives one level up, for the rare idea that genuinely needs 1,500 words and an ending.

## The honest part: AI is in the loop

Here's what I didn't want to do. I didn't want to write a stack of quietly generated posts and let you assume they were mine, and I didn't want to pretend that the last year of AI tooling didn't change how I work. Both options felt like a lie in a different direction.

What's true: I use AI constantly for drafting. It writes cleaner first drafts than I do, remembers more APIs than I ever will, and is confidently wrong in ways that survive spellcheck. It has not replaced the thinking — it has compressed the parts of the thinking that were never the point.

So the log marks it. Entries drafted with a model carry a violet **✦**, and every marked entry shows the actual prompt that started it. Essays get the same treatment, with a longer paper trail: my notes, the prompts, and a plain description of what I changed by hand.

The reason isn't credit — a model doesn't care. It's calibration. When you read something here, you should know how much of it came from a person's judgement and how much came from a completion engine. That distinction matters more every month, and keeping it visible is cheaper than arguing about it later.

## What this costs

More surface area to maintain: two content pipelines, two feeds, a template that has to stay honest about itself. And a small ongoing embarrassment — a log of things I *just* learned makes it obvious how much I don't know yet.

That last part is the feature. A portfolio shows finished work, which is a curated fiction: by the time something reaches a case study, the confusion is long gone. A log keeps the confusion on the page, next to the answer, which is the closest thing to showing what it's actually like to work with me.

Eleven drafts still sit in the folder. Some of them might become writing now that they don't have to be posts. If you want the shorter, faster version of the same thing, it's [in the log](/log).
