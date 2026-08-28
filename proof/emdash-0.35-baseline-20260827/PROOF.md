# EmDash 0.35 baseline proof

- Source base: `fcd539aa08fbce708761361832e4ff12fd33a761`
- Owner branch: `codex/emdash-0.35-baseline-20260827`
- Scope: exact EmDash 0.35 dependency baseline, editor compatibility updates, and save-canary promotion.

## Verification

- `pnpm peers check` — passed with no peer dependency issues.
- `pnpm check` — passed: Astro/TypeScript checks, 28 unit tests, 11 workflow tests, fixture build, and package-content check.
- `DINKUS_E2E_RUN_ID=emdash-035-final pnpm test:e2e` — passed: 12 of 12 serial Chromium tests.
- `git diff --check` — passed.

## Findings

- EmDash 0.35 exposes the publish action as `Publish`; the workflow selectors now match that exact accessible name.
- The previously expected save-canary failure now passes and asserts one manual write plus persisted content.
- TipTap subscript and superscript are held to the fixture's 3.28 cohort so peer resolution remains coherent.

## Gates

- No package publication, deployment, merge, secret, account, or production mutation was performed.
- Merge and any downstream release remain human-gated.

