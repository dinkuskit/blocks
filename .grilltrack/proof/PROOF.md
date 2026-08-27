# Agent-contained feature architecture proof

## Accepted lock

The confirmed slice establishes a reusable feature-ownership map and deterministic architecture gates, migrates CTA Band only, preserves package and stored-content compatibility, maps the other ten blocks in place, and keeps this public repository generic. The baseline is exact `origin/main` commit `17529d477ab19a0c3fbae05e514d14029e70feda` on task-owned local branch `grilltrack/agent-contained-features`.

## Implementation references

- `FEATURE_MAP.md` records all eleven stable feature IDs, responsibilities, owned paths, public entries, shared dependencies, tests, quick verifiers, browser commands, compatibility surfaces, and structural status.
- `src/features/cta-band/` owns CTA Band's contract, field schema, renderer, and public feature index.
- `src/shared/` contains the two explicitly permitted shared dependencies used by CTA Band. Compatibility facades retain the existing package root and source layout entry behavior.
- `scripts/architecture-rules.mjs` and `scripts/check-architecture.mjs` enforce the map, import boundaries, and comment policy. `tests/workflows/architecture-rules.test.mjs` proves accepted and rejected cases.
- `bin/verify-blocks` provides executable quick and full scopes. CI calls the full scope once, which retains `pnpm check` and `pnpm test:e2e` coverage.

## Verification

The precommit `bin/verify-blocks quick` reconfirmation passed in 5.18 seconds on 2026-08-27. It completed TypeScript and fixture Astro typechecking, 28 Vitest unit tests, four architecture regression tests, feature-map validation, import-boundary enforcement, and the repository-wide governed-file comment check.

`bin/verify-blocks full` passed in 148.79 seconds on 2026-08-27. It completed the architecture gates, unchanged `pnpm check` behavior, 28 unit tests, ten workflow tests, the fixture production build, the package-content check, and all 12 Playwright scenarios in Chromium.

The CTA browser scenario passed in 12.1 seconds and exercised the real EmDash fixture through manifest registration, seeded editing, save, hard reload, slash-menu insertion, second save, second hard reload, publish, and public SSR assertions. It verified two rendered CTA Band sections, the persisted edited heading, the inserted heading, and the inserted `/inserted` link.

The EmDash 0.29.0 save canary remains an expected-failure canary for the known upstream modal-submit race and is counted as a passing expected result by Playwright. The fixture helper remains behaviorally unchanged; its name now carries the `emdash-cms/emdash#2160` rationale required after removing human-authored source comments.

The fixture build retained its existing EmDash `createCoalescingDialect` and large-chunk warnings but completed successfully. No compatibility range, dependency version, stored field, class, data attribute, theme token, or renderer behavior changed.

## Curated visible evidence

- `cta-band/slash-menu.png` shows the registered CTA Band slash-menu item. SHA-256: `77a63377b8dabd944652f5257c4911844d45af36e3f08bdbfa2c860650e22af7`.
- `cta-band/admin-modal.png` shows the real CTA Band insert form with the fixture values. SHA-256: `cfa124e23b9b53d67973a179961c2caffa0c1522673c098e01b4f97b814a54d6`.
- `cta-band/rendered-blocks.png` shows the published SSR result with both persisted CTA Band instances and unchanged public styling hooks. SHA-256: `1a3b6b2495b1c631cb9f2f2e21b3d9193b3b8d770a3caf12d0598de750824514`.

All three screenshots are 1280 by 720 pixels and were directly inspected after the run. The live browser interaction and Playwright assertions are the behavioral source of truth; the screenshots are supporting visual evidence.

## Inspection and review gate

`git diff --check` passed. The fetched `origin/main`, local `HEAD`, and merge base all remained `17529d477ab19a0c3fbae05e514d14029e70feda`. Exact comparison confirmed the moved renderer's markup and styles remained byte-for-byte identical after its frontmatter. The screenshot hashes remained unchanged.

The user separately authorized one focused local commit for immutable-source review. No push, pull request, merge, publish, deployment, upstream comment, or other external mutation is authorized. The next safe action is to create the local commit, review that full commit SHA on repository-standards and confirmed-source-intent axes, adjudicate every finding, and record the result separately.
