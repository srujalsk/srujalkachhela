# Portfolio: finish left-rail nav conversion + publish

> **For Hermes:** Continue from uncommitted work on `feat/hermes-portfolio`. Do not reset or discard prior changes.

**Goal:** Complete and publish the in-progress conversion of the portfolio navigation to a fixed desktop left rail with scroll-spy, preserving strict TypeScript, a11y, responsiveness, base-path static export, and the no-fabrication content rule.

**Architecture:** Single consolidated `SiteNav.tsx` renders three variants: mobile top bar + dialog (<lg), and a fixed left rail (lg+) with numbered section links, scroll-spy `aria-current`, and an Email CTA. Page content offsets by `lg:pl-64` so the fixed rail never overlaps.

**Tech Stack:** Next.js 15 App Router, strict TS, Tailwind CSS 4, Playwright suites (unit/a11y/responsive/basepath), zod-validated Markdown content.

## Current context

- Branch `feat/hermes-portfolio`, up to date with origin.
- Uncommitted: rewritten `components/SiteNav.tsx` (rail + dialog), untracked draft `components/SideRail.tsx`.
- Baseline verified green before changes: typecheck ✓, lint ✓, unit 10/10 ✓.

## Problems found in the uncommitted work

1. `NAV_LINKS` lists `id: "projects"` — no such section id exists in the DOM → dead anchor.
2. `{ id: "work", label: "Experience" }` mislabels the projects section (`FeaturedWork`, id `work`); real experience section id is `experience`.
3. `SideRail.tsx` hardcodes `https://github.com/srujalsk` — no GitHub URL exists in any content source (README documents this gap) → fabrication risk. Draft also bypasses React state for the menu via direct DOM class manipulation and would break the a11y focus-trap tests.
4. Fixed `lg:w-64` rail overlaps main content — page body lacks a left offset at lg+.
5. Desktop rail uses `<a href="#id">` while mobile uses same; fine for single-page, but scroll-mt offsets need re-checking since header is no longer sticky at lg.

## Tasks

### Task 1: Consolidate nav into SiteNav.tsx
- Fix `NAV_LINKS`: about/work(Projects label)/experience/skills/education/contact only — all ids verified present in components (`Hero`=about, `FeaturedWork`=work, `ExperienceTimeline`=experience, `SkillsEducation`=skills+education, `Contact`=contact).
- Delete unused draft `components/SideRail.tsx`.

### Task 2: Layout offset (TDD)
- RED: responsive test asserting at lg viewport that section headings' left edge ≥ rail width (no overlap).
- GREEN: add `lg:pl-64` to the page wrapper in `app/page.tsx` (and check Footer/Contact/Hero wrappers).

### Task 3: Scroll-spy + anchor regression tests (TDD)
- RED: test that every rail link href target exists; test aria-current moves after scrolling to #experience.
- GREEN: implementation already provides observer; adjust rootMargin if flaky.

### Task 4: Full verification
- `npm run typecheck && npm run lint && npm run content:validate`
- `npx playwright test tests/unit.spec.ts tests/basepath.spec.ts`
- `npm run test:a11y`, `npm run test:responsive`

### Task 5: Base-path production build + inspection
- Build with `NEXT_PUBLIC_SITE_URL=https://srujalsk.github.io/srujalkachhela NEXT_PUBLIC_BASE_PATH=/srujalkachhela npm run build`
- Inspect `out/index.html` asset URLs, `out/sitemap.xml`, `out/robots.txt`; screenshot rendered page.

### Task 6: Checkpoints + publish
- Commit consolidation, then layout/tests, then docs as separate commits.
- Update README only with evidence from commands actually run.
- Push branch to origin.

## Risks / open questions

- Brief/operator files referenced by the recovery prompt do not exist at `/home/hermes/` — proceeding from README + repo state as source of truth.
- Scroll-spy IntersectionObserver can be flaky headless; keep thresholds generous and assert only final states.
