# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal site of Pedro Santos (pedrosantos.dev), version 2026 “Bancada”. It is deliberately not a portfolio: the home page is a personal changelog. Next.js 15 App Router, React 19, Tailwind CSS v4, bun. Deployed as a container on Google Cloud Run. `README.md` is the source of truth for routes, design rules and content frontmatter. Read it before making product or design decisions.

## Commands

bun is the package manager (`packageManager` in `package.json`). Don't use npm, yarn or pnpm, and don't create other lockfiles.

```bash
bun install
bun dev                 # dev server with Turbopack, http://localhost:3000
bun run build           # production build; prerenders everything except /api/*
bun run typecheck       # tsc --noEmit
bun run lint            # next lint (next/core-web-vitals + next/typescript)
bun format              # prettier --write .
bun clean               # drop .next and the node cache
gcloud builds submit --config cloudbuild.yaml   # build, push and deploy to Cloud Run (europe-west1)
```

The project has no test suite. To verify a change, run `bun run typecheck`, `bun run lint` and `bun run build`. The build catches content and frontmatter problems because every page is prerendered.

## Architecture

**Content is files, not a CMS.** Content lives in two forms, and both are read at build time:
- Typed TS data in `content/*.ts`: `profile`, `now`, `studies`, `projects`, `education` and `uses`. The shapes are defined in `lib/types.ts`. `content/projects.ts` also exports query helpers (`getAllProjects`, `getProjectBySlug`, `getFeaturedProjects`). Projects can carry dated `milestones` and a real screenshot `cover` (under `public/work/<slug>/`).
- Markdown collections in `content/log/*.md` and `content/blog/*.md`, parsed by `lib/log.ts` and `lib/blog.ts`. Each one uses `gray-matter` for frontmatter and `marked` to render the body to an HTML string, computes reading time, and sorts newest first. The filename is the slug. `draft: true` shows an entry in dev and hides it when `NODE_ENV=production`.

**The changelog is derived, never hand-written.** `lib/timeline.ts` merges log entries, essays, project milestones and study tracks (`since`) into one dated stream and groups it by month. The home page renders it through the client component `components/changelog/changelog.tsx`, which only filters. The header version (`v2026.09`) comes from `getCurrentVersion()`, which is the month of the newest row. To make something show up on the home page, give it a real date in content. Don't add rows by hand.

**Every collection has many consumers.** Adding, removing or renaming a project, post or log entry affects all of these:
- the `[slug]` pages and their per-entry `opengraph-image.tsx` (both use `generateStaticParams`)
- `app/sitemap.ts`, `app/rss.xml` (essays), `app/(site)/log/feed.xml` (log) and `app/llms.txt`
- `lib/timeline.ts` (the home changelog and the header version)
- `lib/palette.ts`, which builds the ⌘K command palette index on the server and passes it to the client palette through the site layout
- `content/studies.ts`, where each study lists `logSlugs` that point to log filenames. Renaming a log file breaks that link without any error.

**Entry pages use a margin.** `/log/[slug]` and `/blog/[slug]` put the date, AI disclosure, study track and tags in `MarginLayout` (`components/site/margin.tsx`). Essays live inside the log: `/blog` redirects to `/log#essays`, and only `/blog/[slug]` pages exist.

**Route layout.** `app/layout.tsx` sets up the fonts (`next/font`), `ViewTransitions`, the theme provider, Lenis smooth scroll and the JSON-LD. Public pages live under the `app/(site)/` route group, whose layout adds the header, footer and skip link. Routes outside that group render without the site chrome. The only dynamic route is `app/api/send-email/route.ts`, the contact form, which uses Resend. It creates the Resend client at request time on purpose, so builds never need `RESEND_*` env vars.

**Site URL.** Code reads `process.env.NEXT_PUBLIC_SITE_URL` and falls back to `https://pedrosantos.dev`. Follow that pattern in new code that builds absolute URLs.

**Styling.** Tailwind v4 has no `tailwind.config` file. The design tokens are CSS variables in `app/globals.css`: `:root` holds the light “bone paper” theme and `.dark` holds the dark one. They're mapped into Tailwind with `@theme inline`, and dark mode is a `@custom-variant` on `.dark`. Use the existing tokens instead of hard-coded colours. `components/site/` holds the shared building blocks (`Wrap` for page width, `SectionHeader`, `LinkButton`, `MarginLayout`, project art, cards). `components/ui/` holds only `sonner` and an icon. Despite what `.cursorrules` says, the project doesn't use shadcn or Radix.

**Server components by default.** Only small interactive pieces are client components: the theme toggle, the header, the command palette, the log filter feed, the contact form and the providers. Keep it that way, and don't add `"use client"` for data loading. Content loaders use `node:fs` and must stay server-only.

**Deploy.** `next.config.ts` sets `output: "standalone"`. The `Dockerfile` builds with bun, then runs `node server.js` on `node:20-alpine` on port 8080. The runtime image copies `content/` because the loaders read it from `process.cwd()`. Redirects (`/projects` → `/work`, favicon) are defined in `next.config.ts`.

## Conventions that matter here

- **AI disclosure is load-bearing.** The violet `--ai` token and the ✦ glyph mean one thing only: a model helped draft this. Log entries use `aiAssisted` + `prompt` (+ optional `model`). Essays use `coWritten` + `process` (`notes`, `prompts`, `humanEdit`), which render in `components/blog/process-box.tsx`. Never set these flags on content a model didn't help draft, and never use violet or ✦ as decoration.
- **One orange, two jobs.** Use `--brand` for fills, the hero and graphics. Use `--brand-text` for small text, because it passes AA contrast on bone.
- **No portraits or stock photos, and no decorative effects** (gradients for their own sake, orbs, parallax, stat walls, tech-logo walls). Hairlines and whitespace do the work.
- **Motion must be disabled under `prefers-reduced-motion`.**
- **URLs are forever.** A route rename ships with a redirect in `next.config.ts`. So does removing a project.
- **Only real dates and facts.** Project milestones and case studies come from the actual repo history. Don't invent metrics, dates or outcomes.
- **No employer names on the site.** Work history points to LinkedIn.
- From `.cursorrules`: write functional TypeScript with named component exports, use kebab-case directories and the `function` keyword for pure functions, and minimise `"use client"`/`useEffect`.

`review/` and `.playwright-mcp/` are gitignored design-exploration artifacts. Ignore them.
