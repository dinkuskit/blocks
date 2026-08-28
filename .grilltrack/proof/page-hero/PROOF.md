# Page Hero feature-boundary proof

## Confirmed lock and baseline

The confirmed slice migrates only Page Hero behind `src/features/page-hero/`, preserves its package and Astro entry points, seven stored fields, renderer output and theming hooks, reuses the approved shared safe-link policy for both CTA paths, and keeps CTA Band and every cumulative architecture gate unchanged.

PR #35 merged during verification. The final baseline is `origin/main` commit `fcd539aa08fbce708761361832e4ff12fd33a761`. Its tree `e8b6473dc2f3a69ff73cca569414a937f0009d3a` is identical to repaired PR head `e8c4fd1551352955d31665ad067b6d465f7a662e`, on which the full worktree verification began.

## Implementation

- `src/features/page-hero/contract.ts` owns `PAGE_HERO_BLOCK_TYPE` and `PageHeroNode`.
- `src/features/page-hero/fields.ts` owns the unchanged seven-field schema.
- `src/features/page-hero/index.ts` is the public feature entry.
- `src/features/page-hero/renderer.astro` owns the renderer; the feature directly uses `src/shared/links.ts` and `src/shared/portable-text.ts`.
- `src/index.ts`, `src/types.ts`, and `src/astro/index.ts` preserve the package root and Astro compatibility facades.
- `FEATURE_MAP.md` and the architecture rules declare CTA Band and Page Hero as the two migrated pilots and preserve the parser-backed comment gate and two-root proof-media preflight.
- Unit, workflow, and Page Hero browser coverage prove the structural boundary and safe/unsafe handling for both CTA paths.

No CTA Band file or shared-policy file changed. No stored field, package export, renderer markup, public class, data hook, theme token, or runtime policy changed.

## Verification

- Exact renderer comparison passed: the moved renderer body after frontmatter is byte-identical to `src/astro/PageHero.astro` at `e8c4fd1551352955d31665ad067b6d465f7a662e`.
- `git diff --check` passed.
- `bin/verify-blocks quick` passed before and after the PR #35 merge. The final run on `fcd539aa08fbce708761361832e4ff12fd33a761` completed type checks, 29 unit tests, five architecture tests, feature-map validation, import boundaries, strict parser-backed comment checks, and proof-media checks.
- `pnpm exec playwright test tests/e2e/page-hero.spec.ts` passed in 20.2 seconds. It proved initial safe primary and secondary URLs, persisted unsafe values through admin edit and reload, suppressed both unsafe links in SSR, inserted and rendered both safe CTA paths, and retained public theme hooks.
- A temporary screenshot-instrumented replay of the same focused scenario passed in 19.5 seconds on exact reviewed source `2d671b86c0757879cad2b058aa1aa7722e526ed5`. The screenshot calls were then removed and `git diff --exit-code HEAD -- tests/e2e/page-hero.spec.ts` proved the test was restored exactly.
- The three captures were directly inspected and required no redaction: `unsafe-admin-modal.png` shows `javascript:alert(1)` and `data:text/plain,unsafe` in the two CTA URL fields; `safe-admin-modal.png` shows `/inserted-primary` and `/inserted-secondary`; `rendered-safe-unsafe.png` shows the persisted unsafe hero without actions and the inserted safe hero with both actions.
- The user authorized immutable publication. The captures are published outside Git in release [`blocks-pr-36-page-hero-2d671b8`](https://github.com/saari-co/swarm-pr-assets/releases/tag/blocks-pr-36-page-hero-2d671b8): [`unsafe-admin-modal.png`](https://github.com/saari-co/swarm-pr-assets/releases/download/blocks-pr-36-page-hero-2d671b8/unsafe-admin-modal.png), 124800 bytes, SHA-256 `571a1c751f40ecc44971bc88b57194243a0d5202405873812a03489a91b61cd1`; [`safe-admin-modal.png`](https://github.com/saari-co/swarm-pr-assets/releases/download/blocks-pr-36-page-hero-2d671b8/safe-admin-modal.png), 104146 bytes, SHA-256 `aef6d13e1c377536482a75c4e35ead6004c0a71f684cafa79d35481c47b32dc2`; and [`rendered-safe-unsafe.png`](https://github.com/saari-co/swarm-pr-assets/releases/download/blocks-pr-36-page-hero-2d671b8/rendered-safe-unsafe.png), 54336 bytes, SHA-256 `8a96430ddf1e0161afbfea2feb1bca4b88cfe639387e746dabde5a734093e0be`. GitHub's asset digests and sizes match the inspected local files.
- `bin/verify-blocks full` passed in 180.26 seconds on the tree-identical repaired PR head. It completed the architecture gates, package checks, 29 unit tests, 11 workflow tests, fixture build, pack validation, and all 12 Playwright scenarios. The CTA Band scenario passed cumulatively. The known EmDash modal-submit race remained the expected-failure canary.
- A final `bin/verify-blocks quick` passed after fast-forwarding to merged `origin/main`.

The fixture build retained the baseline-existing `createCoalescingDialect` and large-chunk warnings and completed successfully.

## Review and delivery boundary

The user authorized a local task-owned commit solely to establish an immutable review identity. Initial implementation commit `9a00651591570ffe240655131b79e61a9174c2a1` received a `required_fix` because this proof still described the work as uncommitted. Commit `2d671b86c0757879cad2b058aa1aa7722e526ed5` repaired that text without changing source or behavior and received a clean exact-source review. The user later authorized the focused branch push, pull request, immutable media publication, proof bookkeeping, and re-review request. Merge, package publication, deployment, and Gallery Hero remain unauthorized.
