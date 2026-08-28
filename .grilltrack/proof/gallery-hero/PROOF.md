# Gallery Hero feature-boundary proof

## Confirmed lock and baseline

The user confirmed Gallery Hero as the third feature-local pilot on exact `origin/main` commit `15c3684a85a98f8717b3c5a80f1bff9034241c62`. The bounded slice migrates only Gallery Hero behind `src/features/gallery-hero/`, preserves its package and Astro entry points, unchanged nine stored fields, renderer output and theming hooks, image and image-alt behavior, no-image fallback, and both CTA paths through the approved shared safe-link policy. CTA Band, Page Hero, EmDash 0.35, and every cumulative architecture gate remain in force.

Visual redesign, imagery art direction, crop or loading-policy changes, media URL-policy changes, shared-policy redesign, other feature migrations, EmDash maintenance, commits, delivery, and external mutation are excluded.

## Implementation

- `src/features/gallery-hero/contract.ts` owns `GALLERY_HERO_BLOCK_TYPE` and `GalleryHeroNode`.
- `src/features/gallery-hero/fields.ts` owns the unchanged nine-field schema, including the top-level media picker.
- `src/features/gallery-hero/index.ts` is the public feature entry.
- `src/features/gallery-hero/renderer.astro` owns the renderer and directly uses `src/shared/links.ts` and `src/shared/portable-text.ts`.
- `src/index.ts`, `src/types.ts`, and `src/astro/index.ts` preserve the package root and Astro facades.
- `FEATURE_MAP.md` and the architecture rules now recognize CTA Band, Page Hero, and Gallery Hero as the three migrated pilots.
- Unit, workflow, theming, and focused browser coverage prove the boundary and its existing public behavior.
- The Gallery Hero fixture now uses the repository's existing deterministic SVG instead of a missing JPEG so the real browser proof exercises a loaded image without changing the stored field contract or product behavior.

No CTA Band, Page Hero, shared-policy, package metadata, dependency, CI, or unrelated feature source changed. No stored field, renderer markup, public class, data hook, theme token, image loading or decoding attribute, empty-alt behavior, fallback behavior, or runtime policy changed.

## Verification

- Exact renderer comparison passed: the moved renderer body after frontmatter is byte-identical to `src/astro/GalleryHero.astro` at baseline `15c3684a85a98f8717b3c5a80f1bff9034241c62`.
- `git diff --check` passed.
- `bin/verify-blocks quick` passed in 15.92 seconds: TypeScript and Astro checks, 29 unit tests, five architecture tests, feature-map validation, import boundaries, parser-backed comment checks, and proof-media checks.
- The initial focused Chromium run passed in 46.0 seconds. Direct inspection found that the unsafe-value screenshot framed the media fields rather than the CTA values; that candidate was rejected without changing product behavior.
- `DINKUS_E2E_RUN_ID=grilltrack-gallery-hero-proof-20260828 pnpm exec playwright test tests/e2e/gallery-hero.spec.ts` passed in 45.2 seconds after tightening only the screenshot framing. It proved the loaded seeded image and alt text, eager loading and async decoding, persisted edited alt text, persisted unsafe values on both CTA paths, unsafe-link suppression in SSR, slash-menu insertion, the no-image fallback, both safe CTA paths, and public theme hooks.
- The corrected screenshots were directly inspected: `unsafe-admin-modal.png` shows `javascript:alert(1)` and `data:text/plain,unsafe`; `safe-admin-modal.png` shows `/inserted-primary` and `/inserted-secondary`; `rendered-safe-unsafe.png` shows the image-bearing unsafe block without actions and the safe no-image fallback with both actions. Their local hashes, sizes, provenance, and redaction status are recorded in `.grilltrack/work/gallery-hero-proof-20260828/MANIFEST.md`.
- `DINKUS_E2E_RUN_ID=grilltrack-gallery-hero-full-20260828 bin/verify-blocks full` passed in 599.02 seconds. It completed architecture and package checks, 29 unit tests, 11 workflow tests, the production fixture build, package-content validation, and all 12 serialized Chromium scenarios. CTA Band and Page Hero passed cumulatively.

The fixture build retained the baseline-existing large-chunk warning and completed successfully.

## Immutable browser proof

The selected sanitized Gallery Hero proof is published outside Git in the same-organization immutable private release [`blocks-pr-40-0359ee917d4a`](https://github.com/dinkuskit/dinkus-pr-assets/releases/tag/blocks-pr-40-0359ee917d4a). The captures and terminal transcript are bound to product/test source `0359ee917d4a636258a824820ae1de7488874af6`.

- [Published manifest](https://github.com/dinkuskit/dinkus-pr-assets/releases/download/blocks-pr-40-0359ee917d4a/PUBLISHED_MANIFEST.md): 1887 bytes; SHA-256 `d6350ca5a09c2f2b147665712f3df80b949d47f172a55d53782d72a95fb7fdfb`; records provenance, claim mapping, hashes, and redaction status.
- [Focused Playwright terminal output](https://github.com/dinkuskit/dinkus-pr-assets/releases/download/blocks-pr-40-0359ee917d4a/playwright-gallery-hero.txt): 784 bytes; SHA-256 `d06ecff67f27dcb14b70ae0256664888b33ac03fe8b58f7a54b3e48927b08a9b`; exact source head, command, exit code 0, and one Chromium scenario passed in 1.2 minutes.
- [Persisted unsafe CTA values](https://github.com/dinkuskit/dinkus-pr-assets/releases/download/blocks-pr-40-0359ee917d4a/unsafe-admin-modal.png): 87804 bytes; SHA-256 `267a00d42871b8ba4d74fee12d7ee04970b11b2103ed61c8ed3a9ff36d2046ed`; both unsafe CTA values are visible in admin.
- [Inserted safe CTA values](https://github.com/dinkuskit/dinkus-pr-assets/releases/download/blocks-pr-40-0359ee917d4a/safe-admin-modal.png): 89102 bytes; SHA-256 `bcdc02e30ea8ff14d32adcb3d851305dc3d8dcd1a2d8212b87a377c917a4532f`; both safe CTA values are visible in admin.
- [Rendered safe and unsafe result](https://github.com/dinkuskit/dinkus-pr-assets/releases/download/blocks-pr-40-0359ee917d4a/rendered-safe-unsafe.png): 72006 bytes; SHA-256 `75d9334baf5806ed22483128e39175ca9d37044bda7e34f072e900c46d509288`; the unsafe image-bearing hero renders no actions while the safe no-image hero renders both actions.

All three images were directly inspected. They contain only generic disposable fixture content, with no credentials, personal identity, customer or production data, browser address bar, or device chrome; no redaction was required. Raw and rejected captures remain outside the release.

## Review and delivery boundary

The user separately authorized the local task-owned commit `0359ee917d4a636258a824820ae1de7488874af6`, then authorized its focused branch push and pull request. Exact-head `bin/verify-blocks quick` passed in 15.87 seconds, and `.grilltrack/proof/review/0359ee917d4a636258a824820ae1de7488874af6.md` records a clean review on repository-standards and confirmed-source-intent axes with no classifications.

PR `https://github.com/dinkuskit/blocks/pull/40` is open from `codex/grilltrack-gallery-hero-lock-20260828` at exact head `0359ee917d4a636258a824820ae1de7488874af6` against immutable base `15c3684a85a98f8717b3c5a80f1bff9034241c62`. The official Spark-2 OpenClaw request `req-20260828T215523Z-154861129635` completed clean with zero findings and no edits; its terminal cockpit proof is `runs/spark-openclaw-autoreview-runs/spark-openclaw-autoreview-20260828T215545Z-643211/PROOF.md` in `saari-co/x-api`. The PR closeout comment records exact-head convergence and contains the standalone `@clawsweeper review` trigger. GitHub CI `verify` passed in 10 minutes 13 seconds.

ClawSweeper's first re-review after publication could read the links but did not receive the private attachments in its isolated review bundle. That proof-availability finding is classified `required_fix` and is addressed by this retained proof-only follow-up plus inline image embeds in the PR body, matching the accepted Page Hero PR #36 pattern. Its request to delete the Page Hero GrillTrack archive is classified `reject_false_positive`: the user explicitly requested the completed predecessor track be closed; GrillTrack's `new` transition requires the immutable archive; `origin/main` already tracks CLI-managed GrillTrack archives; `.grilltrack` is outside the package `files` allowlist; and the exact-head pack check passed. The adjudication is recorded locally in `.grilltrack/proof/review/clawsweeper-pr40-0359ee917d4a.md`.

Merge, package or marketplace publication, deployment, and unrelated external mutation remain unauthorized. The only external publication authorized and performed was the selected sanitized PR proof release above.
