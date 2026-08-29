# AGENTS.md — Srujal Kachhela Portfolio

## What this repo is

Personal portfolio website for Srujal Kachhela (Full Stack Developer / Technical Lead, Bangkok).
Next.js 15 (App Router) with `output: "export"` static export, strict TypeScript, Tailwind CSS 4.
Deployed to GitHub Pages via `.github/workflows/deploy.yml` on push to `main`.
Live: https://srujalsk.github.io/srujalkachhela/

## Commands

```bash
npm install                 # setup
npm run dev                 # dev server
npm run build               # content:validate + static export to out/
npm run typecheck           # tsc --noEmit
npm run lint                # ESLint over app/, components/, lib/
npm run content:validate    # zod-validate all content/*.md
npm test                    # build + unit/rendering Playwright suite
npm run test:a11y           # build + axe-core + keyboard-nav suite
npm run test:responsive     # responsive viewport matrix (320–1440px)
npm run test:basepath       # base-path regression suite
npm run verify              # test + a11y + responsive + basepath
npm run lighthouse          # Lighthouse mobile/desktop, reports in lighthouse-report/
```

GitHub Pages project-site build (CI uses this):

```bash
NEXT_PUBLIC_SITE_URL=https://srujalsk.github.io/srujalkachhela \
NEXT_PUBLIC_BASE_PATH=/srujalkachhela npm run build
```

## Architecture

- `app/` — App Router root. Single-page site (`page.tsx`), plus `layout.tsx` (Inter + JetBrains Mono, full metadata/JSON-LD), `sitemap.ts`, `robots.ts`, `manifest.ts`, `not-found.tsx`.
- `components/` — Presentational sections (Hero, AboutSidebar, ExperienceTabs, ExperienceTimeline, FeaturedWork, SkillsEducation, Contact, Footer) and utilities (SiteNav, MobileNav, CopyEmailButton, Reveal).
- `lib/`
  - `content-schema.ts` — zod schemas for all content front matter.
  - `content.ts` — loads `content/*.md` with gray-matter, zod-validates, **strips raw HTML tags from Markdown bodies at load time** (security).
  - `site.ts` / `site-config.ts` — site URL/basePath from env, `withBasePath()` and `absoluteUrl()` helpers. Never hard-code URLs; always use these helpers.
- `content/` — all public copy as Markdown: `profile.md`, `skills.md`, `education.md`, `experience/{agoda,vconstruct,persistent-systems,atos}.md`, `projects/{construction-technology,moviebooker,simpleconnect}.md`.
- `tests/` — Playwright: `unit.spec.ts`, `a11y.spec.ts`, `responsive.spec.ts`, `basepath.spec.ts`, `rail.spec.ts`. Suites run against a served export via `scripts/serve-and-test.ts`.
- `scripts/` — `validate-content.ts`, `serve-and-test.ts`, `lighthouse-ci.mjs`.
- `docs/content-review.md` — CV vs LinkedIn conflict log (documentation only, not rendered).

## Content policy (important)

- **All public copy lives in `content/*.md`.** Edit Markdown, not components, to change site content. Components render whatever the Markdown provides.
- The **CV is the canonical baseline** for facts. Known conflicts and safe-title policy are tracked in `docs/content-review.md` — do not "resolve" titles/dates without updating that file.
- Do not fabricate content: no invented metrics, no confidential company info, no recruiter-only data. Phone is disabled by default (`showPhone: false`).
- `cvPath` in `profile.md` is intentionally empty → no Download CV button renders. Project `source`/`demo` links are hidden while empty.
- Zod schemas will fail the build on missing required front-matter fields.

## Base-path rules

The same source builds for project Pages (subpath) and root user sites. Consequences:

- All URLs/asset paths must go through `withBasePath()`/`absoluteUrl()` from `lib/site.ts`.
- `absoluteUrl()` avoids doubling the subpath when `siteUrl` already ends with `basePath`.
- `basepath.spec.ts` guards sitemap/robots/JSON-LD/canonical/og:url — run it after touching URL generation.

## Conventions

- Strict TypeScript; no ESLint warnings tolerated (`npm run lint` must pass clean).
- Tailwind 4 with `@theme` design tokens and custom `@utility` classes (`container-site`, `reveal`) in `app/globals.css` — prefer tokens over ad-hoc values.
- Dark theme default (`#0a0e12` theme color).
- Images unoptimized (static export); no runtime deps beyond React/Next/gray-matter/zod — avoid adding client-side libraries.
- `prefers-reduced-motion` is respected for reveal animations.
- `trailingSlash: true` in next config — link with trailing slashes.

## Verification expectations

Before declaring work done: `npm run typecheck`, `npm run lint`, and `npm run content:validate` (or full `npm test`) must pass. For UI changes, run the relevant Playwright suite (`npm test` / `test:a11y` / `test:responsive` / `test:basepath`). Deploy happens automatically on push to `main` via GitHub Actions — verify the live site afterward if content changed.
