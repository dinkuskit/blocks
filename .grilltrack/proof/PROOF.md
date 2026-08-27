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

The source head for all three captures is `5909c0a3b95a4d9a441ae93506726b1eaead0ccb`. The images were produced by the repository's Playwright/Chromium fixture flow on 2026-08-27 and visually inspected before publication. Redaction status for each asset is `inspected; no redaction required`: the captures contain only generic local fixture content and no credentials, personal identities, production data, browser address bar, or device chrome.

| Asset | Immutable release URL | Size | SHA-256 | Provenance and claim |
| --- | --- | ---: | --- | --- |
| Slash menu | [slash-menu.png](https://github.com/saari-co/swarm-pr-assets/releases/download/blocks-pr-35-cta-band-5909c0a3b95a/slash-menu.png) | 78,622 bytes | `77a63377b8dabd944652f5257c4911844d45af36e3f08bdbfa2c860650e22af7` | Playwright CTA Band registration flow; shows the registered slash-menu item. |
| Admin modal | [admin-modal.png](https://github.com/saari-co/swarm-pr-assets/releases/download/blocks-pr-35-cta-band-5909c0a3b95a/admin-modal.png) | 99,527 bytes | `cfa124e23b9b53d67973a179961c2caffa0c1522673c098e01b4f97b814a54d6` | Playwright CTA Band insertion flow; shows the real insert form with fixture values. |
| Published blocks | [rendered-blocks.png](https://github.com/saari-co/swarm-pr-assets/releases/download/blocks-pr-35-cta-band-5909c0a3b95a/rendered-blocks.png) | 46,592 bytes | `1a3b6b2495b1c631cb9f2f2e21b3d9193b3b8d770a3caf12d0598de750824514` | Playwright publish and SSR flow; shows both persisted CTA Band instances and unchanged public styling hooks. |

All three release assets are 1280 by 720 pixels. GitHub's release API independently reports the same byte sizes and SHA-256 digests. The live browser interaction and Playwright assertions remain the behavioral source of truth; the screenshots are supporting visual evidence.

## Inspection and review gate

`git diff --check` passed. The fetched `origin/main`, local `HEAD`, and merge base all remained `17529d477ab19a0c3fbae05e514d14029e70feda`. Exact comparison confirmed the moved renderer's markup and styles remained byte-for-byte identical after its frontmatter. The screenshot hashes remained unchanged.

The implementation was committed and reviewed at immutable source `0df43df8db053f5840d21d57ac491edab6eda39f`. Reviews of `72569a835b3bb907c993eb80642a25290a82caf2` and `ff0629c0eb637e393c04ee2e3f57fbbc4a8f101d` each produced a `required_fix`; both findings were repaired and proportionately reverified. The final review is clean on repository-standards and confirmed-source-intent axes, with no remaining `reject_false_positive`, `defer`, or `human_gate` classification.

The user then confirmed closure and authorized focused pull-request delivery. The GrillTrack CLI closed track `gt-20260827204742-2f62eb`. The retained risk is explicit: the other ten blocks are mapped but structurally unmigrated, and the known upstream EmDash modal-submit race remains an expected-failure canary. Merge, publish, deployment, account changes, and unrelated upstream mutations remain outside the authorized boundary.
