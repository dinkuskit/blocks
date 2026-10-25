# Tombstone-only README proof

- Source base: `694e4b4ff5ba76a04cc707a05188b164836d1a96`
- Owner branch: `codex/tombstone-readme-only-20261025`
- Scope: prune historical pre-retirement install, consumer API, and theming examples from `README.md` so only the retirement tombstone remains, and align `tests/unit/theming-contract.test.ts` with that tombstone contract.

## Verification

- `pnpm install --frozen-lockfile` — passed.
- `pnpm check` — passed: TypeScript and Astro checks (0 errors, 0 warnings), 32 Vitest unit tests across 4 test files, 11 workflow tests, fixture build, and `scripts/check-pack.mjs`.
- `bin/verify-blocks quick` — passed: `tsc --noEmit`, `astro check`, Vitest, architecture rule tests, and `node scripts/check-architecture.mjs all` (`architecture all check passed`).
- `git diff --check` — passed.
- No routine proof media was added; `scripts/check-architecture.mjs media` passed.

## Findings

- `README.md` retains `# blocks`, the retirement callout, and links to the `dinkuskit/template-store` transition record (`bd997144517242e0a70596e15de20bbfc3314df8`) and upstream EmDash native `blocks`, Portable Text, and admin Block Kit guides.
- Pre-retirement `README.md` sections (`Historical documentation`, `Block vocabulary`, `Theming contract`, `Consumer API`, `EmDash 0.41.0 compatibility baseline`, and `Verify`) were removed so contributors and coding agents do not match retired package imports or `--dinkus-*` token tables in `README.md`.
- `tests/unit/theming-contract.test.ts` continues verifying that `DINKUS_THEME_TOKENS` exports unique `--dinkus-*` token names consumed across shipped Astro renderers while asserting that `README.md` retains the retirement tombstone and omits retired package import and token examples.

## Gates

- No npm publication, registry listing, deployment, secret access, or production site mutation was performed.
- Temporary repository unarchive, pull request merge after CI and review verification, and immediate GitHub re-archive were explicitly authorized by the project owner.
