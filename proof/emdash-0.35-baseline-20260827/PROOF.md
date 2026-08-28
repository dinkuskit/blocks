# EmDash 0.35 baseline proof

- Source base: `60a9ec1157336e486cffed8b00183a206b1e03aa`
- Owner branch: `codex/emdash-0.35-baseline-20260827`
- Scope: exact EmDash 0.35 dependency baseline, editor compatibility updates, and save-canary promotion.

## Verification

- `pnpm peers check` — passed with no peer dependency issues.
- `pnpm check` — passed: Astro/TypeScript checks, 29 unit tests, 11 workflow tests, fixture build, and package-content check.
- `DINKUS_E2E_RUN_ID=emdash-035-rebase-36-final pnpm test:e2e` — passed: 12 of 12 serial Chromium tests in 9.4 minutes.
- `git diff --check` — passed.

## Findings

- EmDash 0.35 exposes the publish action as `Publish`; the workflow selectors now match that exact accessible name.
- The previously expected save-canary failure now passes and asserts one manual write plus persisted content.
- TipTap subscript and superscript are held to the fixture's 3.28 cohort so peer resolution remains coherent.
- The first post-rebase full run passed 11 scenarios before the final Service Area Map PUT remained pending past 15 seconds. Its trace showed the request was sent without a response; the scenario then passed alone on a fresh fixture and passed again in the same final position during the fresh 12-scenario run. No retry policy or timeout was changed.

## Gates

- No package publication, deployment, merge, secret, account, or production mutation was performed.
- Merge and any downstream release remain human-gated.
