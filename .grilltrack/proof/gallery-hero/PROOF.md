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

## Review and delivery boundary

The user separately authorized one local task-owned commit solely to establish an immutable identity for exact-source review. That authority does not include a push, pull request, merge, publication, deployment, or other external mutation. Review will be recorded only after the commit exists and proportionate exact-head checks pass; no clean review or delivery is claimed in this pre-review proof.
