# Agent Contract

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
- Routine proof media belongs in immutable `saari-co/swarm-pr-assets` release
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

## Review delivery

GitHub `CI` must succeed on the exact pull-request head before the external
review rails begin. A successful head proceeds through OpenClaw and then one
ClawSweeper verdict. An accepted finding returns to the source owner, and the
resulting new head restarts CI and both rails. Two review-triggered repair
cycles are the automatic limit; reaching that limit requires Bobby's attention.

The Review Conductor publishes rail status and the existing maintainer-look
label without agents polling CI. A Platinum Hermit-or-better verdict with
sufficient proof is a merge-candidate signal, not merge authority. Bobby still
approves every merge explicitly.

## Gates

Do not publish to npm, list in an EmDash marketplace or registry, deploy,
merge, or mutate a production site without Bobby's explicit approval.
Upstream issue comments and pull requests require a separate approved route
with a minimal reproducer, proof, and review.

Keep EmDash pre-1.0 fixture versions exact. Widen the package's tested peer
range only after compatibility proof.
