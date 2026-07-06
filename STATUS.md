# Project Status — diversityincludesdisability_three

**As of:** 2026-07-06 · **State:** v1 complete, live, verified, CI-green · **HEAD:** `3fde497`

> This is an **independent** version of the DID site. It is self-contained — not a variant of,
> and not to be reconciled with, `diversityincludesdisability_one/_two/_four`. All work here stays
> in this repo.

---

## What this is

An accessibility-first website for **Eman Rimawi-Doster** (intersectional disability equity
training, consulting, speaking, modeling). The thesis: the medium proves the mission — the site
itself is a **WCAG 2.2 AA exemplar** (aspiring AAA on body text). Its distinguishing feature is a
**dual-mode** experience with a user toggle:

- **Premium mode (default):** near-black iridescent/holographic look, a lazy-loaded Threlte **3D
  hero**, glass surfaces, teal accent.
- **Accessible mode (toggle in the header preferences panel):** strict WCAG 2.2 AA — solid colors,
  no 3D, no motion, with light / dark / high-contrast sub-themes and a text-size control.

Mode/theme/text-size/motion choices persist in `localStorage` and apply pre-paint (no flash).

- **Live:** https://wolfwdavid.github.io/diversityincludesdisability_three/
- **Repo:** github.com/wolfwdavid/diversityincludesdisability_three (public, default branch `main`)
- **Local ↔ remote:** in sync (0 ahead / 0 behind at time of writing)

---

## Stack

SvelteKit 2 + Svelte 5 (runes) · `@sveltejs/adapter-static` (fully prerendered) · vanilla CSS +
semantic design tokens (no utility framework) · self-hosted Atkinson Hyperlegible (body) + Lexend
(headings) · Web3Forms (backend-free contact) · GitHub Pages via GitHub Actions.

3D layer: `three@0.185.1` + `@threlte/core@8.5` + `@threlte/extras@9.21`, **code-split behind a
dynamic import** so it never ships to accessible-mode / no-JS / reduced-motion visitors (see
Architecture below).

---

## Routes (7)

`/` (Home) · `/about` · `/services` · `/speaking` · `/speaker-kit` · `/contact` ·
`/accessibility` (Accessibility Statement) · plus a custom `+error.svelte` (404).

---

## Build history (GSD, 5 phases, 36 v1 requirements — all complete)

1. **Foundation** — scaffold, base-path deploy plumbing, enforced AA contrast/focus/motion token substrate, CI a11y gate
2. **Accessible layout shell & component kit** — skip link, landmarks, route-change focus mgmt, keyboard nav
3. **Content data modules & core pages** — Home / About / Services (4 offerings) / Speaking, correct alt text + heading hierarchy + repeated booking CTA
4. **Contact & Accessibility Statement** — backend-free accessible form (announced errors, multiple contact pathways) + dated statement in nav & footer
5. **Differentiators & conformance pass** — native accessibility preferences panel, plain-language stats, downloadable media kit, automated + manual audit

**Post-roadmap addition (commit `66930df`):** the dual-mode premium **3D** experience + accessibility toggle.

---

## Architecture notes (why it's safe)

- **3D bundle boundary (the load-bearing decision):** all `three`/`@threlte` imports live only in
  `src/lib/components/three/`. `Hero3D.svelte` is statically imported but is itself three-free — it
  lazy-loads `HeroScene.svelte` via dynamic `import()` only when premium mode is active, WebGL is
  supported, and reduced-motion is off. **Verified:** the 3D code compiles to a single ~759 KB
  chunk that is absent from `build/index.html`'s preloads and from the live served HTML.
  Accessibility-first visitors never download it.
- **Reduced motion:** guarded in `Hero3D` (`data-motion` + `prefers-reduced-motion`, re-synced via
  MutationObserver + media-query listener) plus global suppression in `base.css`. The canvas is
  `aria-hidden` and out of tab order (decorative).
- **Mode toggle:** native radios in a `fieldset`/`legend` (PreferencesPanel), `localStorage`
  persistence, pre-paint init in `app.html` (no flash), announced politely — see the 2026-07-06
  hardening note below if that item was completed.
- **Mode-flipping token rule (hard-won):** the `--color-surface-invert` band flips dark↔light
  between modes/themes. Any foreground on it must use a **mode-aware token** (e.g.
  `--color-impact-value`) — never a hardcoded color — or contrast silently breaks in one mode. The
  contrast gate now checks such pairs against **both** mode surfaces.

---

## Quality gates (all green at HEAD)

| Gate                           | Command                                             | Status                                                         |
| ------------------------------ | --------------------------------------------------- | -------------------------------------------------------------- |
| Types + a11y compiler warnings | `pnpm check` (fail-on-warnings)                     | 0 errors / 0 warnings                                          |
| Format + lint (a11y rules)     | `pnpm lint`                                         | clean                                                          |
| Static build                   | `pnpm build`                                        | clean                                                          |
| WCAG contrast (token palette)  | `node scripts/check-contrast.mjs`                   | **37/37 pairs** (both-mode)                                    |
| axe across routes × modes      | `pnpm test:a11y` (Playwright)                       | **19/19** (7 accessible + 7 premium + 5 shell), stable ×3 runs |
| WCAG2AA crawl                  | `pnpm test:pa11y` (preview running)                 | — (not in CI; local/optional)                                  |
| CI                             | `.github/workflows/*` (quality gate + Pages deploy) | both **success**                                               |

---

## Verification + fixes — 2026-07-06 (this session)

The post-roadmap 3D commit had never had a goal-backward verification. One was run; the 3D-safety
thesis held, but **two commit-message claims were false** and were fixed:

| Finding                                                                                      | Was              | Now                                                                                                                                                                                                     |
| -------------------------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **WCAG 1.4.3 fail** — premium `/about` "1 in 4" stat, gold `#e0a83a` on light band `#f5f5ff` | **1.97:1**       | Mode-aware `--color-impact-value` → premium uses `--gold-600 #855700` = **5.77:1**; accessible unchanged (6.37:1). Also caught latent same-class fails in dark/high-contrast themes (now 5.33 / 6.25:1) |
| **"axe 13/13" not reproducible** — nav-toggle keyboard test lost a hydration race            | flaky            | `expect.poll` re-press pattern; deterministic (19/19 ×3)                                                                                                                                                |
| **Gate hole** — contrast checker only tested the accessible surface                          | 34 pairs, 1-mode | **37 pairs, both-mode**                                                                                                                                                                                 |
| **Gate hole** — premium axe only covered Home                                                | 1 premium route  | **all 7 routes in premium mode**                                                                                                                                                                        |

Report: `.planning/phases/post-roadmap-3d/VERIFICATION.md` (status: resolved, 5/5).

**Two info-level items** were noted; whether they were completed is recorded in that VERIFICATION.md:

- Mode-switch `aria-live` announcement for screen readers
- Explicit `webglcontextlost` handler → fall back to the static gradient (Threlte already disposes the renderer on unmount, so this is belt-and-suspenders)

---

## What remains (all human / content-gated — no engineering blockers)

1. **Real photos** — replace portrait placeholders.
2. **Copy sign-off** — Eman to approve/adjust service and bio copy.
3. **Web3Forms key** — the contact form is wired but needs a key. Get one free at web3forms.com
   (no account; a key is emailed to the address used). Set `PUBLIC_WEB3FORMS_KEY` in `.env` (see
   `.env.example`) and in the Pages build env, then push. Until then the form degrades to the other
   listed contact pathways.
4. **Human NVDA / VoiceOver pass** — automated axe/pa11y is necessary but not sufficient; a manual
   screen-reader + keyboard-only walkthrough is on the release checklist.
5. **Testimonials / verified impact stats** — content dependencies; **omit rather than fabricate**
   (attributed + permissioned only).
6. **Custom-domain cutover** (optional) — point `diversityincludesdisability.org` (currently Wix)
   at this Pages site: custom domain + `CNAME` + DNS at the registrar; replaces the Wix site.

---

## Run recipe & gotchas

```bash
pnpm install
pnpm dev                     # http://localhost:5173
# full gate:
node scripts/check-contrast.mjs && pnpm check && pnpm lint && pnpm build && pnpm test:a11y
```

- **Test-server port:** default Vite preview ports (4173/4188/4199, and 5290) get squatted by other
  local projects' preview servers — this repo pins its Playwright preview to a dedicated port
  (see `playwright.config.js`). If axe reports bizarre failures, **curl the test server first** to
  confirm it's serving _this_ project, not a squatter.
- **CI pnpm pin:** workflows pin pnpm to `11.0.9` to match the lockfile and honor
  `pnpm-workspace.yaml` build-script approvals (pnpm 9 errored "packages field missing").
- **Prettier scope:** `tasks/` and `.planning/` are excluded from the prettier gate.
- **Never** commit private Notion/scraped content — it contains plaintext credentials. Public
  sources only.

---

## Where things live

- Project planning: `.planning/` (PROJECT.md, ROADMAP.md, REQUIREMENTS.md, STATE.md, research/)
- Verification report: `.planning/phases/post-roadmap-3d/VERIFICATION.md`
- Lessons & run notes: `tasks/lessons.md`
- Design tokens: `src/lib/styles/tokens.css` · base/global CSS: `src/lib/styles/base.css`
- 3D (quarantined): `src/lib/components/three/`
- Preferences/mode: `src/lib/components/a11y/PreferencesPanel.svelte` + `src/lib/prefs.js`
- Contact key: `PUBLIC_WEB3FORMS_KEY` (consumed in `src/routes/contact/+page.svelte`)
