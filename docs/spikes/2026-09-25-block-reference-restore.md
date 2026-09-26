# Block and reference restore

Date: 2026-09-25
Base: `origin/main` `f197c810` (merged PR #50)

## Decision

The public pin stays exact `emdash@0.40.1`. Relations from
[emdash-cms/emdash#1928](https://github.com/emdash-cms/emdash/pull/1928) are on
EmDash `main` (`21afcb9a5` contains the merge `a5b45049`) and are not in
`emdash@0.40.1`. This package does not move its peer pin to unreleased `main`.

`tests/e2e/block-reference.spec.ts` is the consumer proof. On `emdash@0.40.1`
it creates a throwaway reference field, observes that EmDash does not bind it
to a relation, deletes that probe, and still renders a Dinkus block. Against
EmDash `main` packs from `21afcb9a5`, the same test publishes a CTA band with
reference `[A]`, edits the band through Block Kit and the selection to
`[B, A]`, checks the public page still shows the original band, publishes,
restores the first revision, and publishes that restore. The restored public
page shows the original band, and the live selection is `[A]` again.

## Verification

- `DINKUS_E2E_RUN_ID=block-ref-release-0401 pnpm exec playwright test tests/e2e/block-reference.spec.ts` passed on stock `emdash@0.40.1`. The run took the unbound-field branch.
- `DINKUS_E2E_RUN_ID=block-ref-main-21afcb9-c pnpm exec playwright test tests/e2e/block-reference.spec.ts` passed in 9.2 seconds against local packs of EmDash `21afcb9a5`. Those packs are not committed. The public page was unauthenticated. The admin capture shows Reference B then Reference A while the draft is still unpublished.

No npm publish, no production pin, and no template-store pin change.
