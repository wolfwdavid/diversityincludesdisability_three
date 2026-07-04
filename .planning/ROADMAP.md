# Roadmap: Diversity Includes Disability — Accessible Rebuild (v3)

## Overview

This roadmap rebuilds diversityincludesdisability.org as a WCAG 2.2 AA (aspiring AAA) exemplar that also converts organizations into booking Eman Rimawi-Doster. It follows a strict inside-out sequence dictated by the research: solve deploy plumbing and lock the accessibility/contrast token substrate first, build the single accessible layout shell and reusable component kit second, compose the real-content marketing pages third, wire the backend-free conversion path and write the honest Accessibility Statement fourth, then ship the flagship differentiators and run the final automated + manual conformance audit last. Building content before tokens and the shell would guarantee rework and retrofit contrast/focus failures, so ordering is load-bearing, not cosmetic.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation — Scaffold, Deploy Plumbing & Design Tokens** - Live base-path-correct SvelteKit site on GitHub Pages with an enforced AA contrast/focus/motion token substrate and CI a11y gate ✅
- [ ] **Phase 2: Accessible Layout Shell & Component Kit** - One accessible shell (skip link, landmarks, route-change focus, keyboard nav) plus the reusable a11y component kit every page consumes
- [ ] **Phase 3: Content Data Modules & Core Pages** - Real-content Home, About, Services (four offerings), and Speaking/Portfolio with correct alt text, heading hierarchy, and a repeated booking CTA
- [ ] **Phase 4: Contact & Accessibility Statement** - Backend-free accessible contact form with announced errors and multiple pathways, plus a dated Accessibility Statement in nav and footer
- [ ] **Phase 5: Differentiators & Conformance Pass** - Native accessibility preferences panel, plain-language stats, downloadable media kit, and the final automated + manual keyboard/screen-reader audit

## Phase Details

### Phase 1: Foundation — Scaffold, Deploy Plumbing & Design Tokens
**Goal**: A prerendered, base-path-correct SvelteKit site skeleton deploys automatically to GitHub Pages, standing on an accessibility token substrate (AA contrast, visible focus, reduced-motion, forced-colors, self-hosted fonts) that every later component inherits.
**Depends on**: Nothing (first phase)
**Requirements**: FND-01, FND-02, FND-03, FND-04, FND-05, FND-06, FND-07, FND-08, FND-09
**Success Criteria** (what must be TRUE):
  1. The site is reachable live on GitHub Pages at the project subpath with CSS, fonts, and the `_app/` bundle all loading — no blank page and no 404'd assets or links.
  2. Pushing to the default branch triggers a GitHub Actions Pages workflow that rebuilds and redeploys the site automatically, and every route is prerendered to HTML with no production 404s.
  3. Every text/background color pair used passes WCAG 2.2 AA contrast (7:1 for body where feasible) when checked by automated tooling, driven from a primitive→semantic design-token system.
  4. Accessibility-designed fonts render immediately with no visible layout shift and make no third-party network request.
  5. The layered a11y gate (svelte-check, eslint-plugin-svelte, axe-core, pa11y-ci) runs locally and in CI and reports zero violations on the skeleton.
**Plans**: TBD

Plans:
- [ ] 01-01: TBD (refined during planning)

### Phase 2: Accessible Layout Shell & Component Kit
**Goal**: A single `+layout.svelte` owns the document skeleton, landmark regions, and route-change focus authority, and a reusable accessible component kit (SkipLink, Button, Field, Nav disclosure, Card, Footer) exists so pages are thin, consistent composition.
**Depends on**: Phase 1
**Requirements**: SHELL-01, SHELL-02, SHELL-03, SHELL-04, SHELL-05, SHELL-06, SHELL-07, SHELL-08
**Success Criteria** (what must be TRUE):
  1. Pressing Tab on page load reveals a visible "skip to main content" link that is the first focusable element and moves focus into `<main>`; every page exposes semantic landmark regions with accessible names.
  2. A keyboard-only user can open and close the mobile navigation menu (Esc closes it, `aria-expanded` reflects state) with focus returning to the toggle, and every interactive element shows a clearly visible `:focus-visible` indicator.
  3. Navigating between pages moves focus to the main content region and the new page's unique descriptive `<title>` is announced, so keyboard and screen-reader users are never stranded at the top.
  4. Every tap/click target is at least 24×24 CSS px, and the site stays usable with `prefers-reduced-motion` and `forced-colors` (high-contrast) enabled.
**Plans**: TBD

Plans:
- [ ] 02-01: TBD (refined during planning)

### Phase 3: Content Data Modules & Core Pages
**Goal**: Typed content modules feed real-content marketing pages — Home, About, Services, Speaking/Portfolio — that establish Eman's intersectional authority, present the four offerings as outcome-led sections, and surface a persistent booking CTA.
**Depends on**: Phase 2
**Requirements**: PAGE-01, PAGE-02, PAGE-03, PAGE-04, PAGE-05, PAGE-06, PAGE-07
**Success Criteria** (what must be TRUE):
  1. A visitor lands on a Home page presenting Eman's intersectional positioning, a clear value proposition, and a primary "Work with me" CTA.
  2. The Services page presents all four offerings (Training/Facilitation, Consulting, Modeling, Speaking & Panels) as outcome-led, plain-language sections, while About and Speaking/Portfolio show her real bio and credibility (e.g. the Manhattan Borough President training).
  3. A "Work with me / Book Eman" call-to-action is reachable from every page.
  4. Every image has correct alt text (meaningful images described, decorative images empty-alt) and each page uses a single correct `<h1>` heading hierarchy.
  5. Any testimonials or social proof shown carry real attribution — none are fabricated (omitted if unavailable).
**Plans**: TBD

Plans:
- [ ] 03-01: TBD (refined during planning)

### Phase 4: Contact & Accessibility Statement
**Goal**: Organizations can reach Eman through an accessible, backend-free contact flow with announced validation and multiple pathways, and a dated Accessibility Statement — written against the actual built site — honestly documents conformance in both nav and footer.
**Depends on**: Phase 3
**Requirements**: CONV-01, CONV-02, CONV-03, CONV-04, CONV-05, A11Y-01, A11Y-02
**Success Criteria** (what must be TRUE):
  1. A visitor can submit the contact form (real `<label>`s, `aria-describedby` hints) without a backend via a static form service and land on an accessible confirmation/thanks state.
  2. Submitting invalid input announces the errors to assistive tech (`role="alert"`/`aria-live`), marks fields `aria-invalid`, and moves focus to the first error.
  3. Multiple contact pathways are offered (accessible form + `mailto:` fallback + social links) and spam is mitigated by a honeypot rather than a CAPTCHA.
  4. A dedicated, dated Accessibility Statement — linked from both primary nav and footer — states the WCAG 2.2 AA target, testing method, known limitations, and an accessibility-feedback contact route.
**Plans**: TBD

Plans:
- [ ] 04-01: TBD (refined during planning)

### Phase 5: Differentiators & Conformance Pass
**Goal**: The flagship native accessibility preferences panel, plain-language impact stats, and a downloadable accessible media kit ship, and a full automated plus manual keyboard/screen-reader audit certifies the WCAG 2.2 AA/AAA claim end-to-end.
**Depends on**: Phase 4
**Requirements**: DIFF-01, DIFF-02, DIFF-03, VERIF-01, VERIF-02
**Success Criteria** (what must be TRUE):
  1. A user can adjust theme/contrast, text size, and motion via a native preferences panel whose choices persist across visits (`localStorage`) and layer over their system `prefers-*` settings.
  2. Key statistics/impact are presented in plain language paired with icons, and a downloadable, accessible (tagged PDF) speaker one-sheet/media kit is available.
  3. A full automated audit (axe + pa11y-ci + Lighthouse a11y) passes with zero critical violations across all pages.
  4. A manual keyboard-only pass and a screen-reader pass (NVDA/VoiceOver) are completed and documented as acceptance criteria (recorded in the Accessibility Statement).
**Plans**: TBD

Plans:
- [ ] 05-01: TBD (refined during planning)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation — Scaffold, Deploy Plumbing & Design Tokens | 1/1 | ✅ Complete | 2026-07-04 |
| 2. Accessible Layout Shell & Component Kit | 0/TBD | Not started | - |
| 3. Content Data Modules & Core Pages | 0/TBD | Not started | - |
| 4. Contact & Accessibility Statement | 0/TBD | Not started | - |
| 5. Differentiators & Conformance Pass | 0/TBD | Not started | - |
