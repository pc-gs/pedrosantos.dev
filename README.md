# pedrosantos.dev

Personal site of **Pedro Santos** — software engineer in Belmonte, Portugal.
Shipping production React and Next.js by day, building [Melro.io](https://melro.io)
on the side. Version **2026 — “Bancada”**.

Not a portfolio: a personal **changelog**. The home page is one stream of
everything dated on the site (project milestones, log entries, essays, study
tracks), grouped by month like release notes, with a filter for work, writing
and learning. The header carries a version (`v2026.09`), which is simply the
month of the newest row. Work history lives on LinkedIn; the site shows what I
ship, write and learn.

An honest, typographic site: warm bone paper, ink text, one orange accent (the
same orange as Melro). No portrait photography, no stock, no logo walls.

What carries it:

1. **The changelog** (`/`): status, pinned work, then the stream. Built from
   content, never written by hand (`lib/timeline.ts`).
2. **The log** (`/log`): a public learning log. Entries drafted with a model
   are marked ✦ and publish the actual prompt that started them; entries
   written by hand say so as well. Essays sit at the end of the log.
3. **Margin notes**: entry and essay pages keep date, disclosure, study track
   and tags in a margin column, like a lab notebook.

## Routes

| Route | What it is |
| --- | --- |
| `/` | The changelog: intro, status (availability + now), pinned projects, the monthly stream with filters |
| `/work`, `/work/[slug]` | Project index; case studies: problem → approach → outcome → what I took away → the project's changelog |
| `/studies` | Learning tracks with state, why and linked notes (not in the main nav; linked from the changelog and entries) |
| `/log`, `/log/[slug]` | The log — tag and ✦ filters, essays at the end, margin notes on each entry |
| `/blog/[slug]` | Essays, each with its “how this post was made” paper trail. `/blog` itself redirects to `/log#essays` |
| `/about` | Story, principles, experience, education |
| `/now` | nownownow-style snapshot |
| `/uses` | Tools, stack and typefaces |
| `/contact` | Form (Resend) and direct channels |
| `/rss.xml`, `/log/feed.xml` | Two feeds, because two collections |
| `/llms.txt` | Plain-text digest for LLMs and agents |
| `/sitemap.xml`, `/robots.txt` | SEO plumbing |
| `/opengraph-image` (+ per-entry) | Dynamic OG cards, prerendered for every post, log entry and project |
| `/icon.svg`, `/apple-icon.png` | The PS monogram, served by Next file conventions |

Old `/projects` URLs 308-redirect to `/work`; retired project pages redirect
to `/work` too (see `next.config.ts`).

## Design system

- **Type** — `Bricolage Grotesque` (display), `Geist` (body and UI),
  `JetBrains Mono` (labels, metadata, code). All self-hosted via `next/font`.
- **Tokens** — CSS variables in `app/globals.css` (`:root` = bone paper,
  `.dark` = “estúdio à noite”), wired into Tailwind v4 through `@theme inline`.
  Bone `#f4f1e9`, ink `#14161a`, Melro orange `#ff4d00`.
- **Orange rules** — `--brand` for fills, the hero and graphics; `--brand-text`
  for small text (AA contrast on bone). The violet `--ai` and the ✦ glyph mean
  one thing only: AI co-authorship.
- **Layout** — hairlines, small radii, `Wrap` as the single measure, a margin
  column on entry and essay pages (`components/site/margin.tsx`). Project
  covers use a real screenshot when the project has `cover`, otherwise a drawn
  scene (`components/site/project-art.tsx`) or the typographic fallback.
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
| Projects, case studies & milestones | `content/projects.ts` |
| Education | `content/education.ts` (work history is on LinkedIn, not here) |
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

### Adding a project milestone

Milestones are what put a project in the changelog. Add them to the project in
`content/projects.ts`, oldest first, with real dates only (use `"YYYY-MM"`
when you only know the month):

```ts
milestones: [
  { date: "2026-02-20", kind: "started", title: "First build: …" },
  { date: "2026-08-07", kind: "update", title: "What changed, in one line" },
],
```

`kind` is `started`, `shipped` or `update`. A real screenshot goes in
`public/work/<slug>/` and is referenced with `cover: "/work/<slug>/file.png"`.

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
├── changelog/            the home stream (client-side filters) + pinned project
├── site/                 Wrap, SectionHeader, LinkButton, Screen, margin notes,
│                         project art, study cards, post cards
├── layout/               site header (PS wordmark + theme), footer, ⌘K palette
├── log/, blog/, now/     entry rows, process box, now list
└── sections/             contact form, project status meta
content/                  ← edit here for routine updates
lib/                      content loaders, timeline (the changelog), feeds,
                          palette, OG card, structured data
Dockerfile, cloudbuild.yaml
```

## Credits

Next.js 15 · React 19 · Tailwind CSS v4 · bun · next-themes ·
next-view-transitions · cmdk · Lenis · marked + gray-matter · Resend ·
Google Cloud Run. Typefaces: Bricolage Grotesque, Geist, JetBrains Mono
(Google Fonts, self-hosted via `next/font`).

MIT licensed.
