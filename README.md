# pedrosantos.dev

Personal site of **Pedro Santos** — software engineer (React / Next.js) and founder of
[Melro.io](https://melro.io). Version **2027.2 — “Tinta & papel”**.

An editorial, light-first site: warm paper, ink text, a fountain-pen-blue accent.
One thing carries it:

1. **The log** — a public learning log co-written with AI, where marked entries (✦)
   disclose the actual prompt that started them.

The contrast with previous iterations is deliberate: not dark-minimal (v1), not
flashy (v3), not sidebar/coral (redesign), not pure editorial (v2).

## The idea

Most portfolio sites only show finished work. Finished work hides the interesting
part — the confusion, the dead ends, the thing you learned on a Tuesday. So this
site keeps a **log** instead: short entries about what I just learned, marked ✦ when
an AI model helped draft them, prompt included. Longer thinking lives in **Writing**,
where each essay carries a “how this post was made” box: my notes → the prompt(s) →
the AI draft → my edit.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Hero, Now strip, the log (signature section), featured work, latest writing, CTA |
| `/log`, `/log/[slug]` | Learning log — filter by tag or by co-authorship; per-entry prompt disclosure |
| `/blog`, `/blog/[slug]` | Essays, each with the co-authorship process box |
| `/projects`, `/projects/[slug]` | Case studies — problem → approach → outcome → learnings |
| `/about` | Narrative background, working principles, experience as stories |
| `/now` | nownownow-style snapshot of current focus |
| `/uses` | Tools, stack and typefaces |
| `/contact` | Contact form (Resend) + channels |
| `/rss.xml`, `/log/feed.xml` | Two feeds, because two collections |
| `/llms.txt` | Plain-text digest for LLMs and agents |
| `/sitemap.xml`, `/robots.txt` | SEO plumbing |
| `/opengraph-image` (+ per-entry) | Dynamic OG cards, prerendered for every post, log entry and project |

## Design system

- **Type** — `Instrument Serif` (display headlines), `Newsreader` (long-form reading),
  `JetBrains Mono` (labels, metadata, log entries, code); Geist Sans remains for UI
  chrome (form controls, toasts). All loaded with `next/font` — self-hosted, no CLS.
- **Tokens** — CSS variables in `app/globals.css` (`:root` = paper, `.dark` = night),
  wired into Tailwind v4 through `@theme inline`. Paper `#faf6f0`, ink `#171412`,
  accent “ink blue” `#284e95`, and violet `--ai` reserved **exclusively** for AI
  co-authorship marks (the ✦ chip).
- **Layout** — 1px hairlines, small radii, generous whitespace, `clamp()` display
  sizes, `.measure` / `.measure-narrow` reading widths, `.label` / `.label-brand`
  for mono metadata.
- **Motion** — cross-page view transitions, a single `.fade-up` entrance, hover colour
  transitions. `prefers-reduced-motion` disables Lenis smooth scroll, ping/pulse
  and the palette animation.
- **Theme** — real light/dark via `next-themes`: system preference first, manual
  toggle in the header. No forced-dark class.

## Environment

Copy `.env.example` to `.env.local` and fill in what you need:

```
RESEND_API_KEY=...            # contact form
RESEND_FROM_EMAIL=...         # verified Resend domain
RESEND_TO_EMAIL=...           # where submissions land

NEXT_PUBLIC_SITE_URL=https://pedrosantos.dev
```

Nothing here is required to build: without any of it the site prerenders fully; only
the contact form needs Resend to deliver.

## Getting started

```bash
git clone git@github.com:pc-gs/pedrosantos.dev.git
cd pedrosantos.dev
bun install          # bun is the package manager (see packageManager in package.json)
cp .env.example .env.local
bun dev              # http://localhost:3000
```

### Scripts

| Command | What it does |
| --- | --- |
| `bun dev` | Dev server (Turbopack) |
| `bun run build` | Production build — everything prerendered |
| `bun start` | Serve the production build |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run lint` | ESLint (`next/core-web-vitals` + `next/typescript`) |
| `bun format` | Prettier |
| `bun clean` | Drop `.next` and the node cache |

## Project structure

```
app/                      routes (App Router)
├── api/send-email/       contact form (Resend)
├── blog/, log/, projects/, about/, now/, uses/, contact/
├── opengraph-image.tsx   root OG card (+ per-content cards next to each route)
├── llms.txt/, rss.xml/, sitemap.ts, robots.ts
└── globals.css           tokens, utilities, prose, motion
components/
├── layout/               site header (theme + ⌘K), footer, ask panel,
│                         command palette, section headings, JsonLd
├── log/                  entry rows, filterable feed, ✦ AI badge
├── blog/                 ProcessBox — “how this post was made”
├── now/                  NowList (shared by home + /now)
├── sections/             contact form, project status meta
└── ui/                   sonner toaster, X icon
content/                  ← edit here for routine updates
lib/                      content loaders (blog, log), feed builder, palette,
                          structured data, OG card, date + classname helpers
```

## Content — what to edit

| To change… | Edit this |
| --- | --- |
| Bio, tagline, socials, availability | `content/profile.ts` |
| The Now snapshot + its updated date | `content/now.ts` |
| Projects & case studies | `content/projects.ts` |
| Work history / education | `content/experience.ts`, `content/education.ts` |
| `/uses` groups | `content/uses.ts` |
| Log entries | add a `*.md` in `content/log/` |
| Essays | add a `*.md` in `content/blog/` |
| Shapes of any of the above | `lib/types.ts` |

### Adding a log entry

```md
---
title: "TIL: something I just learned"
description: "One line for the feed, the RSS item and the OG card."
date: "2026-09-16"
tags: ["typescript", "til"]
aiAssisted: true          # shows the violet ✦ badge
model: "GLM"              # optional, shown in the disclosure
prompt: "The actual prompt that started this entry."
---

Two or three paragraphs. Unfinished is fine — that is the format.
```

`draft: true` shows an entry in dev and hides it in production. Reading time is computed.

### Adding a co-written essay

```md
---
title: "Post title"
description: "One-line summary."
date: "2026-09-14"
tags: ["meta", "ai"]
coWritten: true            # shows the ✦ badge and the process box
process:
  notes: >-
    What I actually knew/believed before drafting.
  prompts:
    - The first prompt.
    - The follow-up that fixed the draft.
  humanEdit: >-
    What I changed by hand: cut, rewrote, fact-checked, reordered.
---
```

The process box renders in `components/blog/process-box.tsx` (notes → prompt → first
draft → edit). Never set `coWritten` on a piece a model didn't help draft — the whole
point of the disclosure is that it means something.

## Conventions

- **Marking AI, always.** Violet `--ai` + ✦ mean one thing only: a model helped draft
  this and a person edited it. Never use it as decoration.
- **Type has jobs.** Display serif for headlines, `Newsreader` for reading, mono for
  metadata (dates, tags, status, prompts, code), sans for UI chrome.
- **Metadata is mono, prose is serif.** Use `.label` / `.label-brand` rather than
  re-styling mono by hand.
- **No decoration pretending to be design** — no gradients-for-gradients, orbs,
  parallax, stat walls or tech-logo walls. Hairlines and whitespace do the work.
- **Motion explains, never decorates.** Anything animated must be disabled under
  `prefers-reduced-motion`.
- **Static by default.** Content is prerendered; only `/api/*` is dynamic.

## Deployment

Vercel, `main` branch. Build is `bun run build`; set the env vars from
`.env.example` in the project settings (all optional except the Resend ones if you want
the contact form to deliver).

## Credits

Next.js 15 · React 19 · Tailwind CSS v4 · bun · next-themes · next-view-transitions ·
cmdk · Lenis · marked + gray-matter · Resend · Vercel Analytics.
Typefaces: Instrument Serif, Newsreader, JetBrains Mono (Google Fonts, self-hosted via
`next/font`).

MIT licensed.
