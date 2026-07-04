# Requirements: Diversity Includes Disability — Accessible Rebuild (v3)

**Defined:** 2026-07-04
**Core Value:** A WCAG 2.2 AA (aspiring AAA) exemplar that also makes it obvious and easy for an organization to hire Eman Rimawi-Doster.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation & Deployment

- [ ] **FND-01**: Site is a SvelteKit app that builds to fully static output via `@sveltejs/adapter-static`
- [ ] **FND-02**: Site deploys to GitHub Pages at the project subpath with all assets/links resolving correctly (base-path aware)
- [ ] **FND-03**: Deployment runs automatically via a GitHub Actions Pages workflow on push to the default branch
- [ ] **FND-04**: `.nojekyll` present so the `_app/` bundle is served (no blank-page failure)
- [ ] **FND-05**: All routes are prerendered to HTML; no route 404s in production due to a missed prerender entry
- [ ] **FND-06**: A design-token system (primitive → semantic CSS custom properties) governs all color, spacing, and typography
- [ ] **FND-07**: All text/background color pairs meet WCAG 2.2 AA contrast (aim 7:1 for body where feasible), verified by tooling
- [ ] **FND-08**: Accessibility-designed fonts are self-hosted with no third-party requests and no layout shift
- [ ] **FND-09**: An automated a11y gate (svelte-check, eslint-plugin-svelte a11y, axe-core, pa11y-ci) runs locally and in CI

### Accessible Shell & Navigation

- [ ] **SHELL-01**: A visible "skip to main content" link is the first focusable element and moves focus to `<main>`
- [ ] **SHELL-02**: Every page uses semantic landmark regions (`header`, `nav`, `main`, `footer`) with accessible names
- [ ] **SHELL-03**: On client-side route change, focus moves to the main content region (keyboard users are not stranded)
- [ ] **SHELL-04**: Every page has a unique, descriptive `<title>` so the route-change announcer reads it
- [ ] **SHELL-05**: All interactive elements have a clearly visible `:focus-visible` indicator meeting WCAG 2.2 Focus Appearance
- [ ] **SHELL-06**: Primary navigation is fully keyboard operable; the mobile disclosure menu uses `aria-expanded`, closes on Esc, and returns focus
- [ ] **SHELL-07**: All tap/click targets are at least 24×24 CSS px (WCAG 2.2 Target Size)
- [ ] **SHELL-08**: Motion/animation respects `prefers-reduced-motion` and the site remains usable under `forced-colors`

### Content Pages

- [ ] **PAGE-01**: Home page presents Eman's intersectional positioning, a clear value proposition, and a primary "Work with me" CTA
- [ ] **PAGE-02**: About page tells Eman's real bio and lived-experience authority (from public sources)
- [ ] **PAGE-03**: Services page presents all four offerings (Intersectional Disability Equity & Inclusion Training/Facilitation, Disability Consulting, Modeling for Representation, Speaking & Panels) as outcome-led sections with plain-language summaries
- [ ] **PAGE-04**: Speaking/Portfolio page shows credibility (past engagements, e.g. Manhattan Borough President training, media/press)
- [ ] **PAGE-05**: All images have correct alt text (decorative images empty-alt; meaningful images described); content uses a correct single-`h1` heading hierarchy
- [ ] **PAGE-06**: A persistent, repeated "Work with me / Book Eman" call-to-action is reachable from every page
- [ ] **PAGE-07**: Attributed testimonials/social proof are shown (real attribution; no fabricated quotes — omit if unavailable)

### Contact & Conversion

- [ ] **CONV-01**: Contact page has an accessible form (real `<label>`s, `aria-describedby` hints) submitting without a backend via a static form service
- [ ] **CONV-02**: Form validation errors are announced to assistive tech (`role="alert"`/`aria-live`), fields marked `aria-invalid`, focus moves to the first error
- [ ] **CONV-03**: Successful submission lands on an accessible confirmation/thanks state
- [ ] **CONV-04**: Multiple contact pathways are offered (accessible form + `mailto:` fallback + social links)
- [ ] **CONV-05**: Spam is mitigated without a CAPTCHA (honeypot field)

### Accessibility Statement

- [ ] **A11Y-01**: A dedicated, dated Accessibility Statement page exists, linked from both the primary nav and the footer
- [ ] **A11Y-02**: The statement honestly describes conformance target (WCAG 2.2 AA), testing method, known limitations, and a contact route for accessibility feedback

### Differentiators

- [ ] **DIFF-01**: A native accessibility preferences panel lets users adjust theme/contrast, text size, and motion (CSS-variable driven, layered over `prefers-*`, persisted in `localStorage`)
- [ ] **DIFF-02**: Key statistics/impact are presented in plain language paired with icons (scope.org.uk cognitive-access pattern)
- [ ] **DIFF-03**: A downloadable, accessible speaker one-sheet / media kit (tagged PDF) is available

### Conformance Verification

- [ ] **VERIF-01**: Full automated audit (axe + pa11y-ci + Lighthouse a11y) passes with zero critical violations across all pages
- [ ] **VERIF-02**: A manual keyboard-only pass and a screen-reader pass (NVDA/VoiceOver) are completed and documented as acceptance criteria

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Writing / News

- **WRITE-01**: A Markdown-driven Writing/News/Press collection with an index and per-post pages
- **WRITE-02**: RSS feed for the writing collection

### Scheduling

- **SCHED-01**: "Book a discovery call" scheduling integration on the Contact page

### Media

- **MEDIA-01**: Captioned demo/showreel video with transcript embedded accessibly

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Third-party accessibility overlay widget | WAI-rejected, fixes only 20–40% of issues, FTC $1M settlement precedent — self-discrediting for an accessibility consultant |
| Donation / fundraising flow | DID is a consultancy, not a charity soliciting donations; Scope is the a11y reference only, not the business model |
| E-commerce (adaptive clothing store) | Part of Eman's broader work, not this site's job |
| User accounts / authentication | No logged-in experience needed for a marketing/consultancy site |
| Backend / database / server-side form processing | GitHub Pages is static-only; a static form service covers contact |
| CAPTCHA | Accessibility barrier; honeypot used instead |
| Autoplaying media / focus-trapping carousels | Accessibility anti-patterns |
| DNS migration off Wix / custom-domain cutover | Deployment target is GitHub Pages; domain decision belongs to Eman, separate effort |

## Traceability

Which phases cover which requirements. Populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FND-01 | Phase 1 | Pending |
| FND-02 | Phase 1 | Pending |
| FND-03 | Phase 1 | Pending |
| FND-04 | Phase 1 | Pending |
| FND-05 | Phase 1 | Pending |
| FND-06 | Phase 1 | Pending |
| FND-07 | Phase 1 | Pending |
| FND-08 | Phase 1 | Pending |
| FND-09 | Phase 1 | Pending |
| SHELL-01 | Phase 2 | Pending |
| SHELL-02 | Phase 2 | Pending |
| SHELL-03 | Phase 2 | Pending |
| SHELL-04 | Phase 2 | Pending |
| SHELL-05 | Phase 2 | Pending |
| SHELL-06 | Phase 2 | Pending |
| SHELL-07 | Phase 2 | Pending |
| SHELL-08 | Phase 2 | Pending |
| PAGE-01 | Phase 3 | Pending |
| PAGE-02 | Phase 3 | Pending |
| PAGE-03 | Phase 3 | Pending |
| PAGE-04 | Phase 3 | Pending |
| PAGE-05 | Phase 3 | Pending |
| PAGE-06 | Phase 3 | Pending |
| PAGE-07 | Phase 3 | Pending |
| CONV-01 | Phase 4 | Pending |
| CONV-02 | Phase 4 | Pending |
| CONV-03 | Phase 4 | Pending |
| CONV-04 | Phase 4 | Pending |
| CONV-05 | Phase 4 | Pending |
| A11Y-01 | Phase 4 | Pending |
| A11Y-02 | Phase 4 | Pending |
| DIFF-01 | Phase 5 | Pending |
| DIFF-02 | Phase 5 | Pending |
| DIFF-03 | Phase 5 | Pending |
| VERIF-01 | Phase 5 | Pending |
| VERIF-02 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 36 total (note: the earlier "32 total" figure was a miscount — actual REQ-IDs are FND 9 + SHELL 8 + PAGE 7 + CONV 5 + A11Y 2 + DIFF 3 + VERIF 2 = 36)
- Mapped to phases: 36 / 36 (100%)
- Unmapped: 0

---
*Requirements defined: 2026-07-04*
*Last updated: 2026-07-04 after roadmap creation (traceability populated)*
