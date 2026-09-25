# Service Area Map and Project Record proof

Date: 2026-09-25

Decision: `service-map-project-record`

## Source and scope

- Baseline: `git:2566c3524b78c54c894e6da4c59225a7350888c6`
- Worktree: `/Users/bobbybones/.openclaw-bobby/worktrees/0611c93398389372/ledger-cards`
- Bobby directed the last two blocks behind `src/features/`.
- Service Area Map owns `src/features/service-area-map/`. Its shared dependency is `src/shared/portable-text.ts`.
- Project Record owns `src/features/project-record/`. Its shared dependencies are `src/shared/links.ts` and `src/shared/portable-text.ts`.
- The package root and `@dinkuskit/blocks/astro` still export the same public names, including the project-record annotation types.
- `src/astro/ServiceAreaMap.astro` and `src/astro/ProjectRecord.astro` were removed. `src/astro/index.ts` remains the Astro facade.
- Service Area Map markup and CSS after the frontmatter are byte-identical to the baseline. Its type import now points at `./contract`.
- Project Record markup and CSS after the frontmatter are byte-identical to the baseline. Its old import of the package root now points at `./contract` and `../../shared/links.ts`. `safeCtaHref` is the same function.
- Field arrays match the baseline text, including the Service Area Map media picker.
- `scripts/check-pack.mjs` now requires the new feature files instead of `src/astro/ProjectRecord.astro`.
- The working tree also contains the earlier uncommitted feature moves. This identity covers that whole product tree.
- Product-diff identity: `sha256:2f16a9c2f95295e35085246d4897e916b2416487adcb183ead61ae21a2e040bf`.
- That digest is SHA-256 over `git diff HEAD` excluding `.grilltrack`, then every untracked product file in path order as path, NUL, bytes.
- No commit, push, pull request, proof publication, merge, or deploy.

## Verification

1. `git diff --check` passed.
2. `bin/verify-blocks quick` passed in 11.36 seconds. Typechecks, 29 unit tests, architecture workflow tests, and the architecture all-check passed.
3. Focused Chromium, with `NO_PROXY=127.0.0.1,localhost,::1` and `DINKUS_E2E_RUN_ID=grilltrack-last-two-proof-20260925`:
   - `tests/e2e/project-record.spec.ts` and `tests/e2e/service-area-map.spec.ts` passed in 35.2 seconds.
4. Direct inspection:
   - Service Area Map admin still has the media picker, alt text, caption, and legend label plus icon slug. The public page shows the persisted caption, `Working bases`, `Service town`, the inserted caption, and `Inserted legend`. The seeded image URL does not resolve, so the browser shows a broken-image icon. The inserted map has no image, so the existing placeholder renders.
   - Project Record desktop and mobile still show the sheet, identity, status ticket, role, evidence, safe link, and next project. The persisted admin modal shows the role body, evidence kicker, proof headline, evidence, and evidence links. The identity-slot page still replaces the image with site-owned art.
   - Public captures include the EmDash edit chip because the existing specs stay authenticated. On the project record it overlaps the role headline. That is the capture, not a contract change.
   - No credentials or production data appear.
5. `bin/verify-blocks full` with `DINKUS_E2E_RUN_ID=grilltrack-last-two-full-20260925` passed in 186.82 seconds. All 12 Chromium scenarios passed. The package listing contains every feature renderer and no block renderer under `src/astro/`.

## Screenshot digests

Directly inspected:

- Service Area Map public: 32437 bytes, `556a25ad39c5ac5312ecce2214763313ed14e9cf5c98070e902d82bf4eef073e`
- Service Area Map admin: 80365 bytes, `47976ad10dd63f0903e3e9b41168919e22c3d8cae1b3c1374270bc0d02f06bdf`
- Project Record desktop: 233534 bytes, `c19649ac0e0c17dfaf99584248ec295f1c5d64bab07ffebe54bf41e4e1989395`
- Project Record mobile: 115831 bytes, `c811296bf5f70204cbf9e01a3967f2c46944eb3d2f6effd09161d3b416756bd1`
- Project Record persisted admin: 87588 bytes, `636518f090b6291820896317e2d0ab36667ea7a768879b410546f36dbb3b9226`
- Project Record identity slot: 170522 bytes, `639854db4f7c9dc8bbe987347272a42328fd77dc2b9cd20beba31e07deae15c3`

Captured by the same focused run and not separately inspected:

- Project Record edit admin: 85820 bytes, `b3cf9833dbd7ae2fa0f410da5471534c610f30149bd48a67023fd4ccadcc7409`
- Project Record insert admin: 118408 bytes, `0b96bb672f47d18be689dc1cbfcb8df32351d1f34e16fac9cb2bbad756940492`
- Project Record identity opt-out: 167590 bytes, `776900efd9d570ab885a9a63843291534eacbbbcb20a93dadcb349384bbe7fc5`

Captures stay in the ignored e2e artifact directory. They were not copied into Git and were not published.
