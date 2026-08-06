# S1 — EmDash compatibility matrix (0.29.0 + 0.32.0)

Date: 2026-08-06
Repo: `dinkuskit/blocks`
Branch: `codex/emdash-032-compat-20260806`

## Scope

Track the repository changes required to support both the existing EmDash 0.29.0
fixture and EmDash 0.32.0 in the compatibility matrix.

## What changed

- widened package peer requirement from `emdash@0.29.0` to
  `emdash@0.29.0 || 0.32.0`;
- removed the direct dependency on `@emdash-cms/blocks` so consumers rely on
  `emdash` types;
- updated block field contracts to use
  `PortableTextBlockField` from `emdash`;
- added version-aware browser behavior for the modal-save canary so the legacy
  0.29.0 race is tolerated as expected-failure while 0.32.0 is asserted clean;
- added fixture `emdash` version detection for run-time branching in E2E tests.

## Compatibility execution plan

- `tests/fixture-site` remains pinned to `emdash@0.29.0` for default checks and
  CI parity.
- a separate 0.32.0 matrix lane is executed by temporarily setting
  `tests/fixture-site/package.json` to `emdash@0.32.0` and re-running:

  ```sh
  pnpm install
  pnpm check
  pnpm test:e2e
  ```

## Current evidence status

- 0.29.0 baseline:
  - `pnpm install --frozen-lockfile` passed with pnpm 11.9.0;
  - `pnpm check` passed: both typechecks, 28 unit tests, 6 workflow tests,
    fixture build, and package-content verification;
  - `pnpm test:e2e` completed all 12 browser contracts; the known modal race
    reproduced and was recorded as the conditional expected failure;
  - the modal canary remains conditional: a reproduced 0.29 race is an
    expected failure, while a clean 0.29 run must pass.
- 0.32.0 isolated matrix fixture:
  - `pnpm check` passed: both typechecks, 28 unit tests, 6 workflow tests,
    fixture build, and package-content verification;
  - `pnpm test:e2e` passed all 12 browser contracts, including admin
    insert/edit/save/hard-reload, publish, public SSR observation, Project
    Record rendering, and the clean modal-save canary.
- The 0.32 fixture install reports an upstream TipTap peer warning:
  `@tiptap/extension-subscript` and `@tiptap/extension-superscript` 3.29.2
  request `@tiptap/core` and `@tiptap/pm` 3.29.2 while EmDash resolves 3.28.0.
  It did not affect typecheck, build, or browser behavior in this matrix and is
  not widened into Dinkus's own dependency contract.
