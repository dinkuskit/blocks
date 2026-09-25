# Ledger Cards feature-local pilot proof

Date: 2026-09-25

Track: `gt-20260925194716-59b7b0`

Decision: `ledger-cards-pilot`

## Source and scope

- Baseline: `git:2566c3524b78c54c894e6da4c59225a7350888c6`
- Worktree: `/Users/bobbybones/.openclaw-bobby/worktrees/0611c93398389372/ledger-cards`
- Branch: `openclaw/ledger-cards`
- The constant, `LedgerCard`, `LedgerCardsNode`, ordered repeater, renderer, and public feature entry moved into `src/features/ledger-cards/`.
- The package root and `@dinkuskit/blocks/astro` facades still export the same public names.
- `FEATURE_MAP.md`, the architecture shared-dependency allowlist, the migrated-pilot assertion, and the theming path were updated for the new owner.
- `src/astro/LedgerCards.astro` was removed after the feature renderer replaced it.
- No stored field, copy, markup, semantic, class, data-hook, theme-token, CSS, dependency, EmDash version, link policy, or other-feature behavior was redesigned.
- This local cycle does not include commit, push, pull request, hosted CI, proof publication, merge, or deploy.

## Renderer identity

- Markup and CSS after the frontmatter are byte-identical to `src/astro/LedgerCards.astro` at the baseline.
- The only renderer edits are the type import (`../types` to `./contract`) and the link import (`../links` to `../../shared/links`). `src/links.ts` re-exports `safeCtaHref` from `src/shared/links.ts`, so the called function is the same.
- `ledgerCardsFields` in `src/features/ledger-cards/fields.ts` matches the baseline array in `src/index.ts`.
- Product-diff identity, excluding `.grilltrack/`: `sha256:fe3536d289e3d7c0de9e2ca648e17054592ea95f54260a0653f24cd972d4b899`.
- That digest is SHA-256 over `git diff HEAD` for `FEATURE_MAP.md`, `scripts/architecture-rules.mjs`, `src/astro/index.ts`, `src/index.ts`, `src/types.ts`, `tests/unit/theming-contract.test.ts`, and `src/astro/LedgerCards.astro`, then the four new feature files in name order as `name`, NUL, bytes.

## Verification

1. `git diff --check`
   - Passed.
2. `corepack pnpm install --frozen-lockfile`
   - Passed. Lockfile unchanged. EmDash `0.35.0` and `@emdash-cms/blocks` `0.35.0` stayed exact.
3. `bin/verify-blocks quick`
   - Passed in 11.04 seconds.
   - Root and fixture typechecks passed with zero Astro diagnostics.
   - 29 unit tests passed.
   - Five architecture workflow tests and the architecture all-check passed.
4. `NO_PROXY=127.0.0.1,localhost,::1 DINKUS_E2E_RUN_ID=grilltrack-ledger-cards-proof-20260925 corepack pnpm exec playwright test tests/e2e/ledger-cards.spec.ts`
   - The first attempt timed out because the Gateway proxy intercepted the Playwright webServer probe to `127.0.0.1`. The rerun with `NO_PROXY` passed.
   - One focused Chromium scenario passed in 20.8 seconds.
   - It proved declaration, the five stored fields, seeded edit and reload persistence, slash-menu insertion, published rendering, the code, the heading, the body, the safe link, and omission of a link when the label and URL are empty.
   - Focused report: `tests/fixture-site/.artifacts/e2e/grilltrack-ledger-cards-proof-20260925/report/`.
5. Direct local screenshot inspection
   - `admin-modal-edit.png` shows the seeded card `field` with title `After: Ledger card title persisted`, the sentinel body, CTA label `Review field work`, and CTA URL `/field`. 79396 bytes. SHA-256 `aed674694c64806d164f7d89e233ca47da918f202120b5d1d13bedfad3ad4c83`.
   - `admin-modal-insert.png` shows inserted code `metal`, title `Inserted ledger card`, the slash-menu body, and empty CTA label and URL. 76947 bytes. SHA-256 `cb25ae7d83976d551ae31e697b70e33f4e0d07abf823ebc406a1feac2003291c`.
   - `rendered-blocks.png` shows `FIELD` with the persisted title, body, and `Review field work` link; `INTERIOR` with title and body and no link; `METAL` with title and body and no link. 39945 bytes. SHA-256 `05fc2494aea9f9d47398124a9ee4709718b8a039c1405c5b5ebaac2f8db5ff8f`.
   - All three were directly inspected. They contain only the disposable fixture. No credentials, personal identity, customer data, or production data appear. The published capture also shows the EmDash edit chip because the existing spec opens the public page from the authenticated admin session. That chip is not a card-contract change.
6. `NO_PROXY=127.0.0.1,localhost,::1 DINKUS_E2E_RUN_ID=grilltrack-ledger-cards-full-20260925 bin/verify-blocks full`
   - Passed in 191.24 seconds.
   - Architecture checks, root and fixture typechecks, 29 unit tests, 11 workflow tests, fixture build, package-content validation, and all 12 serialized Chromium scenarios passed.
   - CTA Band, Page Hero, Section Header, Fact Rail, and Gallery Hero passed with Ledger Cards.
   - Full report: `tests/fixture-site/.artifacts/e2e/grilltrack-ledger-cards-full-20260925/report/`.

Screenshots stay in the ignored e2e artifact directory. They were not copied into Git and were not published.
