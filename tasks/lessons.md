# Lessons — diversityincludesdisability_three

## Playwright a11y runs on this Windows setup

- **Run in the FOREGROUND**, not backgrounded through a `| grep`/`| tail` pipe — the pipe buffers and never flushes until process end, which looks like a hang. Use `pnpm exec playwright test --reporter=line` directly.
- **Free port 4173 before each run.** `playwright.config.js` has `reuseExistingServer: !CI`, so a leftover `vite preview` from a killed run gets **reused and serves a STALE build** → tests fail against old markup even after fixes. Kill it first:
  `Get-NetTCPConnection -LocalPort 4173 -State Listen | %{ Stop-Process -Id $_.OwningProcess -Force }`
- If in doubt, `CI=1 pnpm exec playwright test` forces a fresh server.
- **Root cause of the long Phase-3 port saga:** a FOREIGN project's `vite preview` (base `/Eman_dashboard`) was squatting 4173 and its auto-incremented neighbours 4188/4199. With `reuseExistingServer:true`, Playwright reused that server and ran my tests against the wrong app (missing title/lang/skip-link → 8 "failures"). Fix: probe first (`curl -s localhost:PORT | grep -i 'Diversity Includes Disability\|base URL of'`) and use a confirmed-free uncommon port. This project pins **5290**. `netstat` and `Get-CimInstance` are BOTH unavailable in this shell — use `curl` to detect what's actually serving a port.

## Reliable a11y test recipe (USE THIS)
The bulletproof way to run the axe suite here, given the flaky ports:
1. `pnpm run build`
2. Start a self-managed preview: `pnpm exec vite preview --port 5290 --strictPort` (background).
3. **Curl-verify it's YOUR current app**: `curl -s localhost:5290/speaker-kit/ | grep -i "Speaker one-sheet"` (a Phase-5-only string). If it says `Eman_dashboard` or 404s, it's the wrong/stale server.
4. `pnpm exec playwright test` (reuseExistingServer:true reuses your verified server).
5. Read the redirected `pw.log` (background+kill loses the summary line, but per-test ✓/✘ lines are all there).
6. TaskStop the preview.
This removed ALL the false failures. Every "22px/17px target-size" and missing-title failure was a wrong-server artifact — verify the server before trusting a red result.

## Svelte 5 / SvelteKit gotchas hit

- Dynamic `class={computedString}` makes Svelte's unused-CSS detector flag variant selectors under `--fail-on-warnings`. Use `class:` directives so classes are statically visible.
- Typed `resolve()` from `$app/paths` rejects data-driven string hrefs (typed route literals only). For nav arrays / component href props / mailto / hash, use `base` concatenation and disable `svelte/no-navigation-without-resolve` (build's `handleHttpError:'fail'` + svelte-check still guard broken links).
- Headings: set `color: inherit` (not a fixed token) so they stay legible on dark surfaces (footer, CTA bands). A fixed `--color-text` renders dark-on-dark inside inverted sections.

## pnpm 11 on this machine

- Blocks build scripts by default. Approve via `pnpm-workspace.yaml` `allowBuilds:` map (esbuild: true needed for builds). The package.json `pnpm.onlyBuiltDependencies` field did NOT take effect here.

## Git hygiene

- Session cwd resets to the sibling `Rimawi` repo every command. ALWAYS `cd` into the project abs path before any git/pnpm/gsd command so commits never land in the wrong repo.
