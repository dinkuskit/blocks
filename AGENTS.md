# Agent Contract

> **Retired project — historical reference only.** This experimental package is
> no longer an active product direction. The current Template Store direction
> uses upstream EmDash 1.0.1 native page/content Blocks fields and local
> renderers instead of depending on this package. Retained legacy `dinkus.*`
> Portable Text data uses local compatibility renderers. Native page/content
> Blocks are distinct from EmDash admin Block Kit, an admin UI composition
> system. See the [Template Store transition record](https://github.com/dinkuskit/template-store/blob/bd997144517242e0a70596e15de20bbfc3314df8/docs/implementation/upstream-blocks-transition.md),
> [EmDash native Blocks guide](https://docs.emdashcms.com/guides/blocks/),
> [Portable Text rendering documentation](https://docs.emdashcms.com/plugins/creating-native-plugins/portable-text-components/),
> and [admin Block Kit documentation](https://docs.emdashcms.com/plugins/creating-plugins/block-kit/).
>
> Source, history, releases, and issues are preserved. Archive metadata is
> pending owner closeout; this notice does not claim that GitHub has already
> archived the repository or that all consumers have migrated. The contract
> below is retained as historical project guidance and does not authorize new
> features, dependencies, imports, adoption, or active contribution.

This public repository owns the reusable Dinkus section-block plugin for
EmDash. Keep the package generic: site copy, customer data, Smoky branding,
credentials, and production configuration do not belong here.

## Layout

- `src/` contains the publishable plugin and Astro renderers.
- `patterns/` owns copied-composition pattern catalog entries and their
  admission contract.
- `tests/fixture-site/` is a disposable local acceptance harness, not a
  supported starter template.
- `tests/unit/` and `tests/e2e/` contain deterministic regression coverage.
- `docs/spikes/` records durable compatibility verdicts.
- Generated databases, uploads, traces, reports, and package archives stay
  ignored.
- Routine proof media belongs in immutable `dinkuskit/dinkus-pr-assets` release
  assets, not Git. Retained text proof records each asset URL, byte size,
  SHA-256 digest, provenance, redaction status, and source head.

## Architecture

Keep the block vocabulary small. Visual variety and named page sections belong
in copied patterns composed from existing blocks. A new block must first
document why composition cannot express its reusable data, behavior,
accessibility, or runtime contract; site-specific layout is not sufficient.
Follow `docs/architecture.md`.

Treat stored field contracts and documented theming hooks as public API. Every
renderer stays in the low-priority `dinkus-blocks` cascade layer and consumes
documented `--dinkus-*` tokens while preserving its root `data-dinkus-block`
and public `dinkus-*` class hooks. Follow `COMPAT.md` for schema changes; do not
merge a breaking stored-content change without its migration and fixtures.

## Required checks

Run `pnpm check` before closeout. Browser acceptance additionally requires
`pnpm test:e2e`.

## Gates

Do not publish to npm, list in an EmDash marketplace or registry, deploy,
merge, or mutate a production site without Bobby's explicit approval.
Upstream issue comments and pull requests require a separate approved route
with a minimal reproducer, proof, and review.

Keep EmDash pre-1.0 fixture versions exact. Widen the package's tested peer
range only after compatibility proof.
