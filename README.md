# pedrosantos.dev

Personal site of **Pedro Santos** — software engineer in Belmonte, Portugal.
Shipping production React and Next.js by day, building [Melro.io](https://melro.io)
on the side. Version **2026 — “Bancada”**.

An honest, typographic site: warm bone paper, ink text, one orange accent (the
same orange as Melro). Work, studies, the log and essays, with the thinking
left in. No portrait photography, no stock, no logo walls.

The two things that carry it:

1. **The log** — a public learning log. Entries drafted with a model are marked
   ✦ and publish the actual prompt that started them; entries written by hand
   say so as well.
2. **The bench (`/studies`)** — active learning tracks, each with the log
   entries where the work actually happened.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Hero, “working on now” strip, studies, latest notes (newest one featured with its prompt), essays, work, footer with the latest log entry |
| `/work`, `/work/[slug]` | Project index with illustrated covers; case studies: problem → approach → outcome → what I took away |
| `/studies` | Learning tracks with state, why and linked notes |
| `/log`, `/log/[slug]` | The log — tag and ✦ filters, prompt disclosure on the index and on each entry |
| `/blog`, `/blog/[slug]` | Essays, each with its “how this post was made” paper trail |
| `/about` | Story, principles, experience, education |
| `/now` | nownownow-style snapshot |
| `/uses` | Tools, stack and typefaces |
| `/contact` | Form (Resend) and direct channels |
| `/rss.xml`, `/log/feed.xml` | Two feeds, because two collections |
| `/llms.txt` | Plain-text digest for LLMs and agents |
| `/sitemap.xml`, `/robots.txt` | SEO plumbing |
| `/opengraph-image` (+ per-entry) | Dynamic OG cards, prerendered for every post, log entry and project |
| `/icon.svg`, `/apple-icon.png` | The PS monogram, served by Next file conventions |

Old `/projects` URLs 308-redirect to `/work`.

## Design system

- **Type** — `Bricolage Grotesque` (display), `Geist` (body and UI),
  `JetBrains Mono` (labels, metadata, code). All self-hosted via `next/font`.
- **Tokens** — CSS variables in `app/globals.css` (`:root` = bone paper,
  `.dark` = “estúdio à noite”), wired into Tailwind v4 through `@theme inline`.
  Bone `#f4f1e9`, ink `#14161a`, Melro orange `#ff4d00`.
- **Orange rules** — `--brand` for fills, the hero and graphics; `--brand-text`
  for small text (AA contrast on bone). The violet `--ai` and the ✦ glyph mean
  one thing only: AI co-authorship.
- **Layout** — hairlines, small radii, `Wrap` as the single measure, numbered
  sections, illustrated project covers (`components/site/project-art.tsx`)
  with a typographic fallback.
- **Motion** — cross-page view transitions, hover colour transitions, one
  marquee where it earns its place. `prefers-reduced-motion` disables all of it.
- **Theme** — real light/dark via `next-themes`; `scrollbar-gutter: stable` so
  centred content never shifts between pages.

## Content — what to edit

| To change… | Edit this |
| --- | --- |
| Bio, tagline, socials, availability | `content/profile.ts` |
| The Now snapshot + its updated date | `content/now.ts` |
| Study tracks | `content/studies.ts` |
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
aiAssisted: true          # shows the violet ✦ badge and the prompt
model: "GLM"              # optional, shown in the disclosure
prompt: "The actual prompt that started this entry."
---

Two or three paragraphs. Unfinished is fine — that is the format.
```

`draft: true` shows an entry in dev and hides it in production. Reading time is
computed.

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

The process box renders in `components/blog/process-box.tsx`. Never set
`coWritten` on a piece a model didn't help draft; the disclosure only means
something if it is true.

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
| `bun run build` | Production build; prerenders everything except `/api/*` |
| `bun start` | Serve the production build |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run lint` | ESLint (`next/core-web-vitals` + `next/typescript`) |
| `bun format` | Prettier |
| `bun clean` | Drop `.next` and the node cache |

## Environment

Copy `.env.example` to `.env.local` and fill in what you need:

```
RESEND_API_KEY=...            # contact form
RESEND_FROM_EMAIL=...         # verified Resend domain
RESEND_TO_EMAIL=...           # where submissions land

NEXT_PUBLIC_SITE_URL=https://pedrosantos.dev
```

Nothing here is required to build: without any of it the site prerenders fully;
only the contact form needs Resend to deliver. The route creates the Resend
client at request time on purpose, so builds never need the key.

## Deploy — Google Cloud Run

The site ships as a container. `next.config.ts` uses `output: "standalone"`;
the `Dockerfile` builds with bun and runs on `node:20-alpine` as a non-root
user. `cloudbuild.yaml` builds, pushes and deploys in one step.

```bash
# build + push + deploy (project melro-io, region europe-west1)
gcloud builds submit --config cloudbuild.yaml

# or, step by step
gcloud builds submit --tag gcr.io/melro-io/pedrosantos-dev:latest .
gcloud run deploy pedrosantos-dev \
  --image gcr.io/melro-io/pedrosantos-dev:latest \
  --region europe-west1 --allow-unauthenticated
```

Runtime env vars on the service: `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`,
`RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`. Prefer Secret Manager with
`--set-secrets` over plain env values.

The custom domain is mapped on Cloud Run; DNS points at the Google addresses
(A/AAAA for the apex, CNAME to `ghs.googlehosted.com` for `www`). SSL is
managed automatically. Vercel is no longer part of the stack.

## Conventions

- **Marking AI, always.** Violet `--ai` + ✦ mean one thing only: a model helped
  draft this and a person edited it. Never use it as decoration.
- **One orange, two jobs.** `--brand` for fills and big display; `--brand-text`
  for small text, so it passes AA on bone.
- **No personal photos.** Identity comes from the PS monogram, the work and the
  writing. Don't add a portrait.
- **No decoration pretending to be design** — no gradients-for-gradients, orbs,
  parallax, stat walls or tech-logo walls. Hairlines and whitespace do the work.
- **Motion explains, never decorates.** Anything animated must be disabled under
  `prefers-reduced-motion`.
- **Static by default.** Content is prerendered; only `/api/*` is dynamic.
- **URLs are forever.** Renames ship with redirects (`/projects` → `/work`).

## Project structure

```
app/                      routes (App Router)
├── (site)/               public pages (chrome lives in its layout)
├── api/send-email/       contact form (Resend)
├── icon.svg, apple-icon.png
├── llms.txt/, rss.xml/, sitemap.ts, robots.ts
└── globals.css           tokens, prose, dropcap, view transitions
components/
├── site/                 Wrap, SectionHeader, LinkButton, Screen,
│                         project cards + project art, study cards,
│                         log rows, post cards, now strip
├── layout/               site header (PS wordmark + theme), footer, ⌘K palette
├── log/, blog/, now/     entry rows, process box, now list
└── sections/             contact form, project status meta
content/                  ← edit here for routine updates
lib/                      content loaders, feeds, palette, OG card, structured data
Dockerfile, cloudbuild.yaml
```

## Credits

Next.js 15 · React 19 · Tailwind CSS v4 · bun · next-themes ·
next-view-transitions · cmdk · Lenis · marked + gray-matter · Resend ·
Google Cloud Run. Typefaces: Bricolage Grotesque, Geist, JetBrains Mono
(Google Fonts, self-hosted via `next/font`).

MIT licensed.
