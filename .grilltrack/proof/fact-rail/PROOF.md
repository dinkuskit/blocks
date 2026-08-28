# Fact Rail feature-local pilot proof

Date: 2026-08-28

Track: `gt-20260828230318-6bc31b`

Decision: `fact-rail-pilot`

## Source and scope

- Baseline: `git:0259df4a1460b0e6a429f5a4f47c5dbbd3f05224`
- Branch: `codex/grilltrack-fact-rail-20260828`
- Worktree: `/home/smoky/Developer/worktrees/blocks-codex-grilltrack-fact-rail-20260828`
- The constant, node and item contracts, field descriptor, and renderer moved into `src/features/fact-rail/`.
- The package root and Astro facades remain intact.
- `FEATURE_MAP.md`, the architecture allowlist and its tests, renderer-path coverage, and focused browser coverage were updated for the new owner.
- No field, stored-content, visual, icon, URL, media, repeater-API, EmDash-version, or other-feature behavior was redesigned.
- Merge, package publication, deployment, and production mutation remain outside this delivery.

## Renderer identity

- Baseline file: `.grilltrack/work/fact-rail-baseline/FactRail.astro`
- Baseline SHA-256: `12dcd665e6a81f9607fbb0681f7fd15587282b97ecd47b19934d7547df220eb3`
- Feature-local renderer SHA-256: `cee9efe0489b410c2096680826916bff9a31a592ecd4e82ab9889e25daabf147`
- After replacing only the baseline import `../types` with `./contract`, `cmp` returned `0` against `src/features/fact-rail/renderer.astro`.
- This proves the empty-row filter, `<dl>/<dt>/<dd>` markup, default `Quick facts` label, `tabindex="0"`, classes, data hook, horizontal overflow, CSS, and theme-token consumption are unchanged.

## Verification

1. `git diff --check`
   - Passed.
2. `bin/verify-blocks quick`
   - Passed in 23.40 seconds.
   - Root and fixture typechecks passed with zero Astro diagnostics.
   - 29 unit tests passed.
   - 5 architecture workflow tests passed.
   - Architecture validation passed.
3. `pnpm exec playwright test tests/e2e/fact-rail.spec.ts`
   - 1 focused Chromium test passed in 1.3 minutes.
   - Proved declaration, seeded repeater edit and reload persistence, new repeater insertion, multiple facts, empty-row filtering, explicit and fallback accessible labels, native definition-list semantics, focusability, icon hook preservation, and computed horizontal overflow.
   - Focused report: `tests/fixture-site/.artifacts/e2e/2026-08-28T23-09-26-806Z/report/`
4. Visual inspection
   - Inspected the rendered-block screenshot.
   - The three seeded facts and the one populated inserted fact render as expected; the empty row produces no visual item; existing layout and styling are preserved.
   - Full-suite screenshot: `tests/fixture-site/.artifacts/e2e/2026-08-28T23-11-29-541Z/report/data/96c366dc7b30830e573ef076c5ceec4ad9b3556e.png`
   - Screenshot SHA-256: `61e591a33d8e06f46da1080b12a43f49e7ec81aa1bea0b2737ccca07fc5ae65e`
5. `bin/verify-blocks full`
   - Passed in 605.26 seconds.
   - Architecture checks, root and fixture typechecks, 29 unit tests, 11 workflow tests, fixture build, package-content validation, and all 12 serial Chromium scenarios passed.
   - Full report: `tests/fixture-site/.artifacts/e2e/2026-08-28T23-11-29-541Z/report/`

## Selected immutable assets

- Capture source identity: `git:2fe1e2f66c7cc6ad7922555f59ae41f15041868e`
- Release: `https://github.com/dinkuskit/dinkus-pr-assets/releases/tag/blocks-fact-rail-2fe1e2f66c7c`
- Rendered screenshot: `https://github.com/dinkuskit/dinkus-pr-assets/releases/download/blocks-fact-rail-2fe1e2f66c7c/rendered-fact-rail.png`; 21853 bytes; SHA-256 `61e591a33d8e06f46da1080b12a43f49e7ec81aa1bea0b2737ccca07fc5ae65e`; directly inspected; no redaction required; contains only generic disposable fixture content.
- Focused verification transcript: `https://github.com/dinkuskit/dinkus-pr-assets/releases/download/blocks-fact-rail-2fe1e2f66c7c/playwright-fact-rail.txt`; 899 bytes; SHA-256 `23f94dce9bc4608e0b5ad9326accce94d111195f1478d12631e9c29e3c63b9be`.
- Published manifest: `https://github.com/dinkuskit/dinkus-pr-assets/releases/download/blocks-fact-rail-2fe1e2f66c7c/PUBLISHED_MANIFEST.md`; 1322 bytes; SHA-256 `d3c11dc1791a19b32ffabdd57cd5cfb8a17db34a286ab7a36e25a7a01b413d7f`.
- GitHub reports matching `sha256:` digests for all three release assets.

## Gate

The selected browser capture is bound to the first immutable source commit above. This retained proof and ledger-resume follow-up changes no product or test source. A terminal independent review must bind to the final head after that proof-only follow-up is committed. Merge, publication, deployment, and production mutation remain separately gated.
