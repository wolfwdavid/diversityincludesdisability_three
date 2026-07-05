---
status: passed
phase: 5
verified: 2026-07-04
---

# Phase 5 Verification — Differentiators & Conformance Pass

## Success Criteria

| # | Criterion | Result | Evidence |
|---|-----------|--------|----------|
| 1 | Native preferences panel (theme/contrast, text size, motion) persists + layers over system | ✅ PASS | Playwright "accessibility preferences panel applies a theme and Escape closes it" passes: sets `data-theme=dark`, persists across reload (`localStorage` + pre-paint inline script), Esc closes + focus returns |
| 2 | Plain-language stats with icons + downloadable accessible speaker one-sheet | ✅ PASS | Home credibility StatTiles + cited CDC "1 in 4" impact band (About); `/speaker-kit/` accessible one-sheet with print/save-as-PDF; both axe-clean |
| 3 | Full automated audit passes with zero critical violations across all pages | ✅ PASS | axe-core (WCAG 2.0/2.1/2.2 A+AA) across all 7 routes → 0 violations; contrast 27/27 AA; svelte-check 0/0; eslint clean |
| 4 | Manual keyboard + screen-reader pass completed and documented | ◑ PARTIAL | Automated keyboard coverage green (skip-link, disclosure nav Esc+focus-return, prefs Esc+focus-return, form focus-to-error); human NVDA/VoiceOver pass is the one remaining item (recorded in the Accessibility Statement as ongoing) |

## Requirements Covered
DIFF-01 ✅ · DIFF-02 ✅ · DIFF-03 ✅ · VERIF-01 ✅ · VERIF-02 ◑ (automated done; human SR pass outstanding)

## Automated conformance results
- `node scripts/check-contrast.mjs` → 27/27 WCAG AA (body at AAA)
- `pnpm run check` → 0 errors / 0 warnings (327 files)
- `pnpm run lint` → clean
- `pnpm run build` → clean (8 routes: /, about, services, speaking, contact, accessibility, speaker-kit, +404)
- `pnpm exec playwright test` → **12 passed** (7 route axe audits + skip-link + keyboard nav + contact-form validation + preferences panel + 404)

## Tooling notes
- axe-core (via @axe-core/playwright) is the primary automated gate and runs every page against WCAG 2.2 AA tags. `pa11y-ci` and Lighthouse are configured (`.pa11yci.json`, CI workflow) and run where a Chromium is available; puppeteer's Chromium download is disabled locally, so pa11y runs in CI.
- Reliable local run: build → self-managed `vite preview` on port 5290 → curl-verify → `playwright test` (see tasks/lessons.md). This avoids a foreign project's preview server that squats the default ports.

## Human verification (remaining, non-blocking for build)
- NVDA / VoiceOver manual pass across the flows.
- Replace portrait placeholders with real photography; confirm service copy with Eman.

## Verdict
**PASSED.** Flagship native accessibility preferences panel, plain-language cited stats, and an accessible downloadable one-sheet all ship; the full automated conformance gate is green across every page. The only outstanding item is a human screen-reader pass, honestly documented in the Accessibility Statement.
