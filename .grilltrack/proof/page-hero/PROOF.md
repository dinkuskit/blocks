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
- The focused screenshots were directly inspected. They showed the unsafe seeded hero without CTA links and the inserted hero with both safe actions. They remain ignored test-run artifacts and are not retained under either proof root.
- `bin/verify-blocks full` passed in 180.26 seconds on the tree-identical repaired PR head. It completed the architecture gates, package checks, 29 unit tests, 11 workflow tests, fixture build, pack validation, and all 12 Playwright scenarios. The CTA Band scenario passed cumulatively. The known EmDash modal-submit race remained the expected-failure canary.
- A final `bin/verify-blocks quick` passed after fast-forwarding to merged `origin/main`.

The fixture build retained the baseline-existing `createCoalescingDialect` and large-chunk warnings and completed successfully.

## Review and delivery boundary

The implementation is verified but uncommitted. Exact-source standards and source-intent review requires a separately authorized immutable commit identity. Commit, push, pull request, merge, publish, deployment, and external mutation remain unauthorized.
