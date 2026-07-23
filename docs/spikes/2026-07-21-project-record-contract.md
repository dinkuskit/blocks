# Project Record composed-block contract

Date: 2026-07-21

Base: `c9c9e20167165c9c6907bff7205d3a94a2d6ee4d`

Branch: `codex/project-record-template-20260721`

## Scope

Add one thin, reusable EmDash Project Record composed block. This is a block
contract and neutral renderer, not a full-site template product, package
release, registry listing, or deployment.

## Contract

`dinkus.project-record` extends the package's existing `PortableTextNode` base
and carries:

- stable record ID, category, title, and summary;
- top-level identity artwork and alternative text;
- status-ticket kicker and value;
- project-role kicker, headline, and body;
- evidence kicker, proof headline, and evidence body;
- a typed `ProjectRecordLink[]` repeater; and
- next-project kicker, title, and safe URL.

`ProjectRecordNode` and `ProjectRecordLink` are exported from
`@dinkuskit/blocks`. The renderer imports those types and `safeCtaHref` from the
package root. The public-entrypoint regression assigns the new node to the
root-exported `PortableTextNode` base and the link to the public repeater-item
union; no consumer contract is forked or redeclared.

## Renderer boundary

The automatic Astro renderer provides a neutral Raised Ticket structure with
desktop and mobile layouts. Named slots admit consumer-owned identity art,
deliberate title breaks, and icons without moving the typed data contract into
site code. Default styles live in the low-priority `dinkus-blocks` cascade
layer, so an established site's ordinary styles remain authoritative for
pixel-locked overrides.

The fixture includes both paths:

1. automatic Portable Text dispatch using the media-picker identity field; and
2. direct `ProjectRecord` consumption using root-imported types, safe URL
   handling, and every named override slot.

## Verification

- Fresh-base `pnpm check` passed before implementation: 24 unit assertions,
  fixture typecheck/build, and package dry-run.
- `pnpm typecheck` passes with six fixture pages and no Astro diagnostics.
- `pnpm test` passes with 25 assertions across the plugin and package-root
  consumer contract.
- Targeted Project Record browser acceptance passes admin declaration, seeded
  edit, repeater edit, persistence, slash-menu insertion, publish, public SSR,
  unsafe-link rejection, loaded identity media, desktop render, 390 px render,
  horizontal containment, and direct named-slot consumption.
- Full `pnpm test:e2e` passes all 12 serial browser tests. The known EmDash
  save-race canary remains an expected-failure sentinel while the suite closes
  green.
- `pnpm check` passes after implementation, including fixture production build
  and package dry-run containing `src/astro/ProjectRecord.astro`.
- `git diff --check` passes.

Generated browser output remains ignored under
`tests/fixture-site/.artifacts/e2e/`; the full run ID is
`project-record-closeout-20260721`.

## Inspectable live proof

The fixture is a real EmDash 0.29.0 editor and Astro SSR setup using an isolated
throwaway database and uploads root. It contains no customer data, credentials,
Smoky branding, or production configuration. The Project Record acceptance run
captures four redacted screenshots:

1. `admin-modal-edit.png` — the seeded record edited in the EmDash modal;
2. `admin-modal-persisted.png` — the same values present after save, full page
   reload, and reopening the editor;
3. `rendered-project-record-desktop.png` — the published values rendered by
   Astro SSR at desktop width; and
4. `rendered-project-record-mobile.png` — the same published record at 390 px
   with horizontal containment verified.

CI uploads those four screenshots separately as the bounded
`project-record-live-proof` artifact. This small artifact is the inspectable
editor-to-persistence-to-public-render proof; the broader ignored browser bundle
remains available only for deeper trace debugging.

Local proof rerun `project-record-clawsweeper-full-20260722` passed all 12
serial browser tests after the persisted-state capture was added.

## Dogfood findings

- The existing EmDash 0.29.0 block-modal double-save race tracked in
  `dinkuskit/blocks#2` is still exercised by this block. The existing bounded
  fixture heal and expected-failure canary cover it; no duplicate issue was
  filed.
- No new package defect was found in the isolated fixture leg.
- Consumer-specific findings must be filed when the approved portfolio site
  actually swaps to this contract; they must not be hidden in site-only
  workarounds.

## Sequencing gate

The portfolio consumer swap remains blocked on human review and merge of its
existing baseline PR and this blocks PR. This branch does not modify the
consumer repository. No merge, publish, registry release, deploy, production
mutation, commerce work, or crypto work occurred.

This blocks PR requires OpenClaw review plus ClawSweeper before Bobby's merge
gate. Neither review rail authorizes an automated or agent-owned merge.
