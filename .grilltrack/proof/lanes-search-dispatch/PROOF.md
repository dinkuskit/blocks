# Gallery Lanes, Search Board, and Dispatch proof

Date: 2026-09-25

Decision: `lanes-search-dispatch`

## Source and scope

- Baseline: `git:2566c3524b78c54c894e6da4c59225a7350888c6`
- Worktree: `/Users/bobbybones/.openclaw-bobby/worktrees/0611c93398389372/ledger-cards`
- Bobby directed these three blocks behind `src/features/` in one move, preserving each stored shape and renderer.
- Each block now owns `contract.ts`, `fields.ts`, `index.ts`, and `renderer.astro`.
- The package root and `@dinkuskit/blocks/astro` still export the same public names.
- `src/astro/GalleryLanes.astro`, `src/astro/SearchBoard.astro`, and `src/astro/Dispatch.astro` were removed.
- Service Area Map and Project Record stay at `src/astro/`.
- Renderer markup and CSS after the frontmatter are byte-identical to the baseline. The only renderer edits are the type import to `./contract` and the link import from `../links` to `../../shared/links`.
- Field arrays match the baseline text.
- The working tree also still contains the already-reviewed Ledger Cards move. This proof's product identity covers both, because they are uncommitted together.
- Product-diff identity: `sha256:1df13e7116729e5a31d4a98eca8ce1cbf48f496b61a413efa14ad376d9217099`.
- That digest is SHA-256 over `git diff HEAD` for the shared facades, `FEATURE_MAP.md`, `scripts/architecture-rules.mjs`, the theming path test, and the deleted Astro renderers, then the Ledger Cards, Gallery Lanes, Search Board, and Dispatch feature files in path order as path, NUL, bytes.
- No commit, push, pull request, proof publication, merge, or deploy.

## Verification

1. `git diff --check` passed.
2. `bin/verify-blocks quick` passed in 12.98 seconds. Typechecks, 29 unit tests, architecture workflow tests, and the architecture all-check passed.
3. Focused Chromium, with `NO_PROXY=127.0.0.1,localhost,::1` and `DINKUS_E2E_RUN_ID=grilltrack-three-features-proof-20260925`:
   - `tests/e2e/gallery-lanes.spec.ts`, `tests/e2e/search-board.spec.ts`, and `tests/e2e/dispatch.spec.ts` passed together in 51.0 seconds.
4. Direct inspection of the focused captures:
   - Gallery Lanes admin edit shows label, meta, link URL `/land`, and image URL `/media/fixture/lane-land.jpg`. The public page shows the persisted label and meta, `Kitchen & bath`, and the inserted lane. The fixture image URLs do not resolve, so the browser shows a broken-image icon. The `<img>` markup is unchanged.
   - Search Board public page shows `LOC`, `COMPATIBILITY FIXTURE`, the persisted title and intro, and the two links. The insert dialog shows title, intro, link label, and `/inserted-phrase`.
   - Dispatch public page shows both bands: kicker, title, body, phone, email, and CTA. The insert dialog shows those seven fields. The phone and email values are the disposable fixture, not a customer record.
   - Each public capture also shows the EmDash edit chip because the existing specs stay authenticated.
   - No credentials or production data appear.
   - Screenshot byte sizes and SHA-256 digests are recorded below.
5. `bin/verify-blocks full` with `DINKUS_E2E_RUN_ID=grilltrack-three-features-full-20260925b` passed in 202.51 seconds. All 12 Chromium scenarios passed, including CTA Band, Page Hero, Section Header, Fact Rail, Gallery Hero, Ledger Cards, and the three moved blocks. Service Area Map and Project Record passed in place.
   - An earlier full attempt was killed before it finished, then rerun on the same run id. That rerun saw the already-edited home page and failed the CTA assertion. That run is not proof. The database for that id was removed, and the `20260925b` run is the one that passed.

## Screenshot digests

- Gallery Lanes admin edit: 80956 bytes, `949ff46c19e9ca1bcfac9f016d9dec2cc1d8a656372647d3697eed0574c2622b`
- Gallery Lanes admin insert: 79320 bytes, `eab1dac3e27355a025fd9a9d50d39670286e17975bf9cb7bd694bfd92e899838`
- Gallery Lanes public: 28407 bytes, `ba071eca57d5cdd9e3965756dc30b1c56aac5b84e21a6abdf1e79922e498692e`
- Search Board admin: 79473 bytes, `4c8ca117bc55691e6971b73038639fbce76c2bd7e9421037af156b25596d7949`
- Search Board public: 50191 bytes, `ad3b6934599e5f19fcb55b2ad34a2227cb770c5d75632e48aeed56c6a02dbbaf`
- Dispatch admin: 129996 bytes, `af42c27e62c89bcb4f941bc7a613ec4b0035606a506222c63dbf972b59510ca6`
- Dispatch public: 55551 bytes, `4be6a05075c8be4a7e44415f1fe42743746db2e8d3aa7e067eb04fef2fcbcbb4`

Captures stay in the ignored e2e artifact directory. They were not copied into Git and were not published.
