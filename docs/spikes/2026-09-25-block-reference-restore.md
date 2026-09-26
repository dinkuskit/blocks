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

## Published proof

Release: https://github.com/dinkuskit/dinkus-pr-assets/releases/tag/blocks-pr-51-41701f49c985

Source repository: `dinkuskit/blocks`. Capture head: `41701f49c985febd36cb6c3c5e2e057826f3b4e7`. Capture date: 2026-09-25. Provenance: Playwright run `block-ref-main-21afcb9-c` on that head, with the fixture installed from local packs of EmDash `21afcb9a5`. Redaction: directly inspected. Fixture content only. No credentials, customer records, or production data. The admin capture shows `Dev Admin` and the draft note that visitors still see the published version. Public captures are unauthenticated.

`public-draft-isolated.png` and `public-restored.png` are the same bytes. Both show the original band: once while the edit was still a draft, and again after the first revision was restored and published. A later commit that only adds this manifest does not change the test those captures show.

- [admin-edit.png](https://github.com/dinkuskit/dinkus-pr-assets/releases/download/blocks-pr-51-41701f49c985/admin-edit.png): 124813 bytes; SHA-256 `6116ec03ce66d364ec32fa6e9d7f46ed74e91e8c4616250c34384b646b40deba`
- [public-draft-isolated.png](https://github.com/dinkuskit/dinkus-pr-assets/releases/download/blocks-pr-51-41701f49c985/public-draft-isolated.png): 22108 bytes; SHA-256 `e061dfa7aeb2d614661a95e4dfc758d67582c56f3f92d374cf281f36252a45cd`
- [public-edited.png](https://github.com/dinkuskit/dinkus-pr-assets/releases/download/blocks-pr-51-41701f49c985/public-edited.png): 22034 bytes; SHA-256 `0121f8a5cf3ba81aaf11a8d3315cce2326b42abf5b573bc475fae754797d4bdb`
- [public-restored.png](https://github.com/dinkuskit/dinkus-pr-assets/releases/download/blocks-pr-51-41701f49c985/public-restored.png): 22108 bytes; SHA-256 `e061dfa7aeb2d614661a95e4dfc758d67582c56f3f92d374cf281f36252a45cd`

No npm publish, no production pin, and no template-store pin change.
