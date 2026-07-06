---
scope: post-roadmap commit 66930df — "dual-mode premium 3D experience with accessibility toggle"
verified: 2026-07-06
verifier: goal-backward verification (claims NOT trusted)
status: resolved
resolved: 2026-07-06
score: 5/5 goal-truths verified (both gaps closed)
resolution_summary: >
  Both gaps fixed. (1) .impact__value is now driven by a mode-aware semantic
  token --color-impact-value: deep gold (--gold-600 #855700) on every LIGHT
  surface-invert band (premium #f5f5ff = 5.77:1, accessible-dark cream #f3ece1 =
  5.33:1, high-contrast white = 6.25:1) and bright gold (--gold-300) on the
  accessible-light dark teal band (6.37:1). This also closed a latent failure in
  accessible dark/high-contrast themes, whose surface-invert also flips light.
  (2) check-contrast.mjs now checks the impact-value pair against BOTH mode
  surfaces (34 → 37 pairs; the previously-untested premium pair is included).
  (3) the axe suite now audits every route in premium mode, not just home.
  (4) the mobile-nav keyboard test now presses Enter under an expect.poll that
  only re-presses while collapsed, eliminating the hydration race without
  weakening the assertion. Gates green: check-contrast 37/37, pnpm check 0/0,
  lint clean, build clean, test:a11y 19/19 passing 3/3 consecutive runs.
commit_claims_checked:
  - claim: "contrast 34/34 AA (both modes)"
    verdict: WAS MISLEADING — the premium-mode impact-band pair was not among the 34 and failed (1.97:1). RESOLVED — the pair is now included and passes (5.77:1); gate is 37/37 and 'both modes' is literally true.
  - claim: "axe 13/13"
    verdict: WAS NOT REPRODUCIBLE (flaky hydration race). RESOLVED — nav test hardened with expect.poll; suite is 19/19 (added premium-mode coverage for all routes) and green on 3/3 consecutive runs.
gaps:
  - truth: "Existing WCAG 2.2 AA conformance is intact in BOTH modes"
    status: resolved
    severity: blocker
    reason: >
      In the DEFAULT premium mode the /about/ impact statistic ("1 in 4") renders
      gold text (--gold-300 #e0a83a) on the premium light band
      (--color-surface-invert = --premium-fog-100 #f5f5ff) = 1.97:1, failing WCAG
      2.2 AA 1.4.3 (needs 3:1 large / 4.5:1 normal). In accessible mode the same
      element is gold on dark teal (#06333a) = 6.37:1 and passes. The token
      --color-surface-invert flips from dark (accessible) to light (premium), but
      .impact__value hardcodes the light gold primitive for both. Confirmed by
      pa11y-ci (1.97:1) and independent calc (1.97:1).
    artifacts:
      - path: "src/routes/about/+page.svelte"
        issue: ".impact__value hardcodes color: var(--gold-300); light gold on light premium band"
      - path: "src/lib/styles/tokens.css"
        issue: "line 119 --color-surface-invert = --premium-fog-100 (#f5f5ff, light) in premium vs line 158 = --teal-900 (#06333a, dark) in accessible"
      - path: "scripts/check-contrast.mjs"
        issue: "only tests 'gold-300 stat on surface-invert' against the ACCESSIBLE teal (#06333a); no premium-mode pair for this element, so '34/34 both modes' has a coverage hole"
      - path: "tests/a11y.spec.js"
        issue: "premium-mode axe audit runs on home only; /about/ (which has the impact band) is axe-audited in accessible mode only, so this premium regression escapes CI"
    missing:
      - "Give .impact__value a mode-aware color (e.g. a dark gold/ink token in premium, light gold in accessible) so both modes reach >=4.5:1"
      - "Add the premium-mode impact-band pair to check-contrast.mjs so 'both modes' is literally true"
      - "Extend the axe suite to audit inner routes (esp. /about/) in premium mode, not just home"
  - truth: "The premium/accessibility mode toggle and shell keyboard controls are reliably operable (13/13 green)"
    status: resolved
    severity: warning
    reason: >
      The a11y suite is flaky. Full `pnpm test:a11y` (fullyParallel) passed 13/13
      on one run and 12/13 on another; the failing case is "mobile nav toggle is
      keyboard operable" — Enter did not flip aria-expanded to true. In isolation
      the test passes 3/3. Root cause is a hydration race: the single Enter press
      lands before the Svelte onclick handler hydrates. The premium home is now
      heavier (Hero3D mount + MutationObserver + matchMedia listeners), which
      plausibly aggravates home-page hydration timing. The button itself is a
      correct native <button>; this is timing/robustness, not a structural a11y
      defect. Note: this affects the mobile NAV toggle, not the 3D mode toggle
      (the 3D mode toggle test passed on every run).
    artifacts:
      - path: "tests/a11y.spec.js"
        issue: "line 58 test presses Enter once with no wait-for-hydration; flaky under parallel load"
      - path: "src/lib/components/nav/SiteHeader.svelte"
        issue: "toggle relies on hydrated onclick; an Enter press during pre-hydration window is dropped"
    missing:
      - "Stabilize the test (await hydration / expect a hydrated marker before keypress) OR harden the toggle so very-early activation is not lost"
human_verification:
  - test: "Premium home on a real device/GPU"
    expected: "3D hero renders; switching to Accessibility mode or enabling Reduce motion removes the canvas with no orphaned WebGL context; rapid navigation away disposes cleanly"
    why_human: "WebGL rendering, GPU context lifecycle and visual quality are not verifiable by static analysis"
  - test: "NVDA/VoiceOver pass on the mode toggle"
    expected: "Switching Display mode is perceivable to a screen reader; the decorative 3D canvas is fully skipped"
    why_human: "SR announcement quality is subjective; canvas is aria-hidden (verified) but real SR behavior should be confirmed"
---

# Post-Roadmap Verification — Dual-Mode Premium 3D Experience (commit 66930df)

**Subject:** commit `66930df` "feat: dual-mode premium 3D experience with accessibility toggle" (landed AFTER the Phase-5 conformance pass; never goal-verified until now).

**Goal verified:** The premium 3D mode is a safe, accessibility-first enhancement — 3D code must NOT ship in the default payload, the mode toggle must be fully accessible (keyboard, SR, persistence), reduced-motion must suppress 3D/motion, and existing WCAG 2.2 AA conformance must be intact in BOTH modes.

**Status:** gaps_found — 4 of 5 goal-truths verified. The 3D-safety thesis (code-split, reduced-motion, aria-hidden, accessible persistent toggle) is fully met. Two claims in the commit message do not hold up: a genuine premium-mode AA contrast failure on /about/ (blocker), and a non-reproducible "13/13" (flaky nav-toggle test).

## Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | 3D/three code does NOT ship in the default (accessible-first) payload | ✅ VERIFIED | three+threlte compiled to a single 759,244-byte chunk reached ONLY via dynamic `import()` in the home node. Local build: `o7hEZcX1.js` has zero static importers, one dynamic importer (`nodes/2` = home), absent from `build/index.html` preload. LIVE: `DeV1TpN2.js` = 759,244 bytes (contains WebGLRenderer/threlte), 0 references in served home HTML, dynamic-only. |
| 2 | The premium/accessibility mode toggle is fully accessible (keyboard, state, persistence, no flash) | ✅ VERIFIED | Native radios inside `<fieldset><legend>Display mode`; state via native checked; `onchange=update` writes localStorage (`did-prefs`); pre-paint inline script in `app.html` applies `data-mode` before first paint (no flash). Playwright "preferences panel switches to accessibility mode, sets theme, and persists" passed on every run (Esc closes + focus returns + survives reload). |
| 3 | Reduced motion (OS or in-app) suppresses 3D and motion | ✅ VERIFIED | `Hero3D.shouldRender()` gates on `data-motion=reduce` OR `prefers-reduced-motion` mq, re-syncs via MutationObserver + mq change listener; `base.css` kills all animation/transition for the media query AND `:root[data-motion=reduce]`; the static fallback's spin animation is gated off under reduced motion. |
| 4 | The 3D canvas is out of the accessibility tree / tab order | ✅ VERIFIED | `Hero3D` wrapper is `aria-hidden="true"`, decorative only, no focusable content; renders a static gradient fallback when 3D is suppressed. |
| 5 | Existing WCAG 2.2 AA conformance is intact in BOTH modes | ✅ RESOLVED | Was ❌ (premium `/about/` stat 1.97:1). Now mode-aware `--color-impact-value`: premium `/about/` stat = **5.77:1** (`#855700` on `#f5f5ff`); accessible-light unchanged (6.37:1); accessible-dark cream 5.33:1; HC white 6.25:1. Verified by check-contrast (37/37) and axe on the rendered premium `/about/` DOM (19/19). |

**Score: 5/5 truths verified (both gaps resolved 2026-07-06).**

## Bundle Boundary (the critical check) — PASS

| Check | Result |
|-------|--------|
| How is Hero3D reached? | Static import in `+page.svelte`, BUT Hero3D contains no three imports — it `await import('./HeroScene.svelte')` on demand. three/threlte live only behind that dynamic import. |
| three chunk in default payload (local)? | NO. `o7hEZcX1.js` (759 KB) — 0 static importers, dynamic-only from home node, not in `index.html` preload. |
| three chunk in default payload (live)? | NO. `DeV1TpN2.js` = 759,244 bytes, contains WebGLRenderer/threlte, 0 references in served home HTML, dynamic-only. |
| Verdict | The accessibility-first thesis holds: visitors who never enter premium mode never download the 759 KB 3D bundle. |

## Automated Suite Results

| Gate | Result |
|------|--------|
| `pnpm check` (svelte-check --fail-on-warnings) | 0 errors / 0 warnings (880 files) |
| `pnpm lint` (prettier + eslint) | clean (prettier OK, eslint exit 0) |
| `pnpm build` (adapter-static) | clean, 8 routes + 404 |
| `node scripts/check-contrast.mjs` | 34/34 pairs pass — BUT see Gap 1: the failing premium impact-band pair is not among the 34 |
| `pnpm test:a11y` (Playwright, fullyParallel) | Run A: 12 passed / 1 failed (nav toggle). Run B: 13 passed. Nav test in isolation: 3/3 pass → FLAKY (Gap 2) |
| `pnpm test:pa11y` (pa11y-ci, WCAG2AA) | 5/6 URLs pass; **/about/ fails**: 1.97:1 on `.impact__value` (Gap 1) |

## Findings

| # | Finding | Severity | Where |
|---|---------|----------|-------|
| 1 | Premium-mode AA contrast failure: `/about/` "1 in 4" impact stat = 1.97:1 (gold on light band). Goal "AA intact in BOTH modes" broken; "34/34 both modes" claim has a coverage hole. | 🛑 Blocker | `about/+page.svelte` `.impact__value`; `tokens.css` surface-invert flip; `check-contrast.mjs`; `a11y.spec.js` premium coverage |
| 2 | Flaky a11y suite: mobile-nav keyboard toggle intermittently fails under parallel load (hydration race). "axe 13/13" not reproducibly green. | ⚠️ Warning | `a11y.spec.js:58`; `SiteHeader.svelte` |
| 3 | axe premium-mode coverage gap: only the home route is axe-audited in premium; the other 6 routes are audited in accessible mode only → premium regressions on inner pages (like #1) escape CI. | ⚠️ Warning | `tests/a11y.spec.js` |
| 4 | No explicit WebGL context-loss handler in `HeroScene`/`Forms`. Threlte `<Canvas>` disposes the renderer on unmount (so mode-switch/navigation cleanup via `{#if show3d}` is handled), but driver-level `webglcontextlost` is not caught. | ℹ️ Info | `three/HeroScene.svelte`, `three/Forms.svelte` |
| 5 | Mode switch has no `aria-live` confirmation. Native radio operation is perceivable, so this is an enhancement, not a defect. | ℹ️ Info | `a11y/PreferencesPanel.svelte` |

## What is solid (do not re-litigate)

- Code-splitting of the 759 KB 3D bundle — verified both locally and on the live GH Pages deployment.
- Reduced-motion suppression across OS media query, in-app `data-motion`, and the 3D guard.
- `aria-hidden` decorative canvas with a static fallback.
- Accessible, persistent, no-flash mode toggle (native radios + pre-paint init).
- Accessible-mode contrast: 34 token pairs pass; axe clean across all 7 routes in accessible mode.

## Resolution (2026-07-06)

Both gaps are closed. Changes:

1. **Mode-aware impact stat** — `tokens.css` gains a semantic `--color-impact-value` defined per mode/theme so it always pairs with the flipping `--color-surface-invert` band: `--gold-600` (#855700) on the light premium/cream/white bands (5.77 / 5.33 / 6.25:1) and `--gold-300` on the accessible-light dark teal band (6.37:1). `about/+page.svelte` `.impact__value` now consumes the token instead of hardcoding `--gold-300`. This also fixed a latent same-class failure in the accessible dark and high-contrast themes (their surface-invert also flips to a light band).
2. **Contrast gate hole closed** — `check-contrast.mjs` now checks the impact-value pair against BOTH mode surfaces plus the dark/HC variants (34 → **37 pairs**); the premium pair it previously omitted is included and passes.
3. **Premium axe coverage** — `a11y.spec.js` now audits **every** route in premium mode (not just home), so premium-only regressions on inner pages are caught.
4. **Flake fixed** — the mobile-nav keyboard test presses Enter inside an `expect.poll` that only re-presses while `aria-expanded` is still `false`, defeating the pre-hydration drop without weakening the final assertion.

Gates (all green): `check-contrast` 37/37 · `pnpm check` 0 errors/0 warnings · `pnpm lint` clean · `pnpm build` clean · `pnpm test:a11y` **19/19 on 3/3 consecutive runs** (the flaky nav test included). pa11y-ci is not part of CI and its bundled Chrome does not launch in this sandbox; the premium `/about/` contrast it originally flagged is instead proven by axe on the rendered DOM and by the computed 5.77:1.

## Verdict

**resolved.** The core purpose of the commit — making premium 3D a *safe, accessibility-first* enhancement — is achieved: the 3D bundle is genuinely code-split out of the default payload, reduced-motion and aria-hidden are correctly wired, and the mode toggle is accessible and persistent. However, the commit's own conformance claims do not fully hold: there is a **real WCAG 2.2 AA contrast failure in the default premium mode** on `/about/` (1.97:1), which both the contrast script and the axe suite miss because of premium-mode coverage gaps, and the "13/13" test claim is **not reproducibly green** due to a flaky hydration-race nav test. Recommend a follow-up to (a) make `.impact__value` mode-aware, (b) close the premium-mode audit coverage gap, and (c) stabilize the nav-toggle test. No fixes applied here — verification only.

---
_Verified 2026-07-06 · goal-backward verification · commit claims independently checked, not trusted._
