# Srujal Kachhela — Portfolio

Personal portfolio website for Srujal Kachhela, Full Stack Developer and Technical
Lead (Bangkok, Thailand). Built with Next.js (App Router, strict TypeScript) and
Tailwind CSS 4, exported as a fully static site and deployed to GitHub Pages.

**Live:** https://srujalsk.github.io/srujalkachhela/

## Stack

- Next.js 15 App Router, `output: "export"` static export, strict TypeScript
- Tailwind CSS 4 (`@theme` design tokens), no other runtime dependencies beyond React
- Content in Markdown files under `content/` (profile, skills, education,
  experience, projects), validated at build time with zod schemas
- Playwright test suites: unit/content rendering, axe-core accessibility,
  responsive viewport matrix, and base-path regression tests
- GitHub Actions workflow for verify + deploy on push to `main`

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Validate content, then static-export to `out/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint over `app/`, `components/`, `lib/` |
| `npm run content:validate` | Zod-validate every content file |
| `npm test` | typecheck + lint + content validation + unit/rendering suite against a served export |
| `npm run test:a11y` | Build, serve `out/`, run axe + keyboard-navigation suite |
| `npm run test:responsive` | Serve `out/`, run responsive viewport-matrix suite |
| `npm run lighthouse` | Lighthouse mobile/desktop runs against a local server |

The base-path build used in CI/deploy:

```bash
NEXT_PUBLIC_SITE_URL=https://srujalsk.github.io/srujalkachhela \
NEXT_PUBLIC_BASE_PATH=/srujalkachhela npm run build
```

For a root user site (`<user>.github.io`), leave both empty — see `.env.example`.

## Verification results (commands actually run in this repo)

All results below come from real executions of the commands above on this codebase.

- `npm run typecheck` — pass
- `npm run lint` — pass ("No ESLint warnings or errors")
- `npm run content:validate` — pass (10 files: profile, skills, education,
  4 experience entries, 3 projects)
- `npx playwright test tests/unit.spec.ts` — 10 passed
- `npx playwright test tests/basepath.spec.ts` — 9 passed (sitemap, robots,
  JSON-LD, canonical/og:url and asset URLs carry the base path exactly once)
- `tests/a11y.spec.ts` — 11 passed (axe WCAG A/AA ruleset with zero non-minor
  violations, keyboard navigation incl. skip link, mobile-menu focus trap,
  live-region copy feedback, heading hierarchy)
- `tests/responsive.spec.ts` — 25 passed (no horizontal overflow / clipped
  content from 320px to 1440px, landscape, zoom simulation, touch-target sizes)
- Production deploy via GitHub Actions — succeeded; live site returns 200 with
  correct `<title>`, sitemap and robots verified over HTTPS

Lighthouse scores are intentionally **not** claimed here unless produced by an
actual `npm run lighthouse` execution; reports land in `lighthouse-report/`.

## Content policy (no fabrication)

All public copy lives in `content/*.md` and comes from the CV baseline. See
[docs/content-review.md](docs/content-review.md) for:

- Known CV vs LinkedIn conflicts (CV is the canonical baseline; a neutral
  safe title is used until resolved)
- Data deliberately excluded from the public site (phone, visa details,
  recruiter-only status, follower counts)
- Missing sources: no CV PDF was available (`cvPath` intentionally empty, so
  no Download CV button renders), no GitHub profile URL, no demo/source links
  for two projects (buttons hidden while their link values are empty)

Edit the Markdown to change the site; the zod schemas in
`lib/content-schema.ts` will fail the build if a required field is missing.
