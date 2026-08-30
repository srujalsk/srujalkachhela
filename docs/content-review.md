# Content Review — CV vs LinkedIn Conflicts

> This file is documentation only. It is not rendered on the website.
>
> The CV is the canonical baseline for public content until conflicts are confirmed.
> All public copy lives in `content/` Markdown files and can be edited without touching components.

## Status: UNRESOLVED — CV baseline in use

| # | Topic | CV says | LinkedIn says | Public site currently uses |
|---|-------|---------|---------------|----------------------------|
| 1 | Agoda title | Senior Software Engineer, January 2025 – Present | Lead Software Engineer (no dates shown) | **Lead Software Engineer** (resolved by Srujal, 2026-08-30) |
| 2 | vConstruct role/dates | Technical Lead, October 2019 – January 2025 | Engineering Technical Lead May 2022 – Jan 2025; Senior Software Engineer Oct 2019 – May 2022 | **Technical Lead**, Oct 2019 – Jan 2025 (CV) |
| 3 | Persistent Systems dates | August 2015 – October 2019 | October 2016 – October 2019 | **Aug 2015 – Oct 2019** (CV) |

## Safe-title policy

Resolved by Srujal on 2026-08-30: the site title is now **"Full Stack Developer"** (`safeTitle` in `content/profile.md`); the tagline and site metadata no longer mention Technical Lead. Agoda uses **Lead Software Engineer** (matches LinkedIn).
Conflict #1 (Agoda title) remains recorded below; the Agoda entry keeps the CV role for the employment record.

## How to resolve

1. Confirm with Srujal which source is correct for each row above.
2. Edit the corresponding `content/experience/*.md` front matter (`role`, `start`, `end`).
3. Update `safeTitle` in `content/profile.md` if needed.
4. Delete the resolved rows from this table; when empty, note "All conflicts resolved".

## Deliberately excluded from public site

- LinkedIn follower/connection counts
- LinkedIn recruiter-only "Open to Work" status
- Visa information
- Phone number (configurable via `showPhone`/`phone` in `content/profile.md`; disabled by default)
- LinkedIn screenshot images as website assets
- Confidential company information or invented case-study details

## Missing assets

- **CV PDF**: no CV file was accessible in this environment, so no download link was created
  (`cvPath` in `content/profile.md` is intentionally empty). To enable the Download CV button:
  place the PDF at `public/downloads/SrujalKachhela_UK_CV.pdf` and set `cvPath: "/downloads/SrujalKachhela_UK_CV.pdf"`.
- **GitHub profile URL**: not provided; no GitHub link is rendered anywhere.
- **Project demo/source URLs** for SimpleConnect and MovieBooker: not provided; buttons are hidden
  while their `links.source`/`links.demo` values are empty strings.
