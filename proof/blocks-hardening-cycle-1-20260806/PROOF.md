# Proof — Blocks hardening cycle 1 (2026-08-06)

Repo `dinkuskit/blocks`, branch `claude/wizardly-khayyam-d143b6`, isolated
worktree `wizardly-khayyam-d143b6` off `origin/main` @ `17529d4` (merge of
PR #30). One owner, one branch, this proof trail. Environment: macOS,
Node 22, pnpm 11.9.0, Playwright 1.61.1 (chromium), EmDash pin 0.29.0.

Three bounded parts in one review-ready PR:

1. **Runtime schemas + bounds** for all 11 registered block types, enforced
   at the render boundary by every shipped renderer and exported for write
   boundaries (`src/schema.ts`).
2. **Navigation vs media URL policy split** (`src/links.ts`:
   `safeNavigationHref` / `safeMediaSrc` / `configureDinkusUrlPolicy`,
   `safeCtaHref` kept as the historical alias) applied across renderers,
   plus the latent-sink CI gate (`tests/unit/dangerous-sinks.test.ts`).
3. **Save-race upstream packet** (`docs/upstream/emdash-0.29.0-save-race/`):
   the merged upstream fix rebased onto the pinned 0.29.0 tag, a draft
   backport-release ask (not filed), and the server-side CAS companion
   note. Context: blocks#2 finding 3; upstream emdash-cms/emdash#2160.

## Commands and results

```
pnpm check          → exit 0
  tsc --noEmit                          0 errors
  astro check (fixture site)            0 errors, 0 warnings, 0 hints
  vitest run                            6 files, 115 tests passed
  node --test tests/workflows           6 pass, 0 fail
  astro build (fixture site)            built
  check:pack                            file list verified

DINKUS_E2E_PORT=46381 DINKUS_E2E_RUN_ID=hardening-c1-final pnpm test:e2e
                    → exit 0, 13 passed (2.2m)
```

The full e2e run includes the new `runtime-guard.spec.ts` and emits
exactly two structured guard events, both from the intentional seed page
(ids and issue codes only — no stored content in logs):

```
[dinkus-blocks] dinkus-block-omitted {"schemaVersion":1,"blockType":"dinkus.cta-band","blockKey":"hardening-malformed","siteId":"blocks-fixture","event":"dinkus-block-omitted","issues":[{"code":"invalid-value","path":"heading"}]}
[dinkus-blocks] dinkus-block-keys-stripped {"schemaVersion":1,"blockType":"dinkus.cta-band","blockKey":"hardening-unknown-key","siteId":"blocks-fixture","event":"dinkus-block-keys-stripped","issues":[{"code":"unknown-key","path":"onclick"}]}
```

Visible evidence: `runtime-guard-public.png` (immutable release asset,
bound in "Visible evidence" below) — the public `/hardening` page renders
the valid section header, exactly one CTA band (the malformed sibling is
omitted), the approved-host lane with its `img` + external link, and the
unapproved-host lane degraded to the neutral placeholder with no anchor.

## Part 1+2 artifacts

- `src/schema.ts` — schema version 1; caps: token 160, short 320,
  long 8192, repeater-item long 2048, url 2048; repeater items 24–32;
  serialized bytes 16 KiB (scalar blocks) / 128 KiB (repeater blocks).
  `parseDinkusBlockNode` (strict, unknown keys reject) and
  `guardDinkusBlockNode` (render: malformed → omit + one structured
  event; unknown keys → strip + log; never throws).
- All 11 renderers guard their node and route link fields through
  `safeNavigationHref` and media fields (`GalleryHero`, `GalleryLanes`,
  `ServiceAreaMap`, `ProjectRecord` identity) through `safeMediaSrc`.
- Unit fixtures (`tests/unit/fixtures/blocks/`): `valid.json` (all 11
  types), `malformed.json` (10 cases), `oversized.json` (7 cases:
  string/item/byte caps), `unknown-key.json` (4 cases incl. `__proto__`),
  `unknown-block.json` (3 cases).
- Latent-sink gate scans `src/`, `patterns/`, `tests/fixture-site/src/`
  for `set:html`, `is:raw`, `innerHTML`, `outerHTML`,
  `insertAdjacentHTML`, `document.write`, `dangerouslySetInnerHTML`;
  reviewed-sanitizer allowlist is deliberately empty; runs inside
  `pnpm test`, so CI (`pnpm check`) fails on any hit.
- e2e: seed page `hardening` + `tests/e2e/runtime-guard.spec.ts` prove
  omit/strip/media-policy against real EmDash SSR; fixture site sets
  policy in `tests/fixture-site/src/dinkus-policy.ts`.

Discovery made by the guard on its first full run: the EmDash 0.29.0
editor stamps an `id` property onto every block node it saves. Strip mode
kept every page rendering (by design) while logging the drift; `id` is
now a declared system key (validated, preserved, not logged) so strict
boundaries accept editor-saved content. This is the runtime-schema thesis
demonstrating itself: typed contracts drift at runtime, and the boundary
has to see it.

## Part 3 — save-race packet proof

Patch developed in a local clone of `emdash-cms/emdash`: branch
`backport/0.29.0-block-modal-save` at tag `emdash@0.29.0`; upstream
commit `2da4a40c` (#2160) cherry-picks clean. Canary triple-run against
this repo's fixture (run ids under `tests/fixture-site/.artifacts/e2e/`):

| Run id | EmDash 0.29.0 state | Canary result |
| --- | --- | --- |
| `canary-stock-0290` | stock | race observed; expected-fail holds — suite `1 passed` |
| `canary-patched-0290-v2` | one-line `stopPropagation()` applied to installed `@emdash-cms/admin` dist | **`Expected to fail, but passed.`** — no competing manual saves, edit persists (screenshot `canary-patched-0290-passed-unexpectedly.png`, release asset bound below) |
| `canary-restored-0290` | stock restored | race returns; expected-fail holds |

The Vite dep-optimizer cache (`tests/fixture-site/node_modules/.vite`)
must be cleared between dist swaps or the stale admin bundle keeps
serving; both patched/restored runs above were after a cache clear. The
canary spec itself stays expected-fail in-repo because the pin stays
0.29.0; it becomes the passing regression the moment the pin includes the
fix. Local-environment note: the 0.29.0-era admin browser tests that use
`vi.mock` (including unmodified stock ones) do not boot on this machine,
so the upstream regression test ran in upstream CI only; the canary
triple-run is the local verification instrument.

## Visible evidence — immutable release assets

Screenshot binaries are retained **only** as immutable
`saari-co/swarm-pr-assets` release assets, never as Git blobs in this
repository (review-rail policy: binary changes whose contents cannot be
reviewed are refused as Git blobs). This `PROOF.md` is authoritative for
filenames, byte sizes, SHA-256 hashes, URLs, and redaction status.

Release (tied to proof-run head `46e1dff825db`):
<https://github.com/saari-co/swarm-pr-assets/releases/tag/blocks-hardening-cycle-1-46e1dff825db>

- <https://github.com/saari-co/swarm-pr-assets/releases/download/blocks-hardening-cycle-1-46e1dff825db/runtime-guard-public.png>
- <https://github.com/saari-co/swarm-pr-assets/releases/download/blocks-hardening-cycle-1-46e1dff825db/canary-patched-0290-passed-unexpectedly.png>

| File | Bytes | SHA-256 | Redaction |
| --- | --- | --- | --- |
| `runtime-guard-public.png` | 39335 | `55bf48de1ce3fae9e75fe873df82c70b99ee24b9704becc8c54e2cb9cd818bba` | local fixture public page; seeded generic content; no PII |
| `canary-patched-0290-passed-unexpectedly.png` | 97900 | `17157209edb78238e7f6ed7949fd3030ece9743b3c5b48357f37eef9d9789af7` | local dev-bypass admin only; fixture content; no secrets |

Capture provenance: the runtime-guard screenshot comes from e2e run
`hardening-c1-final` at code head `46e1dff`; the canary screenshot from
run `canary-patched-0290-v2` at code head `87bcb61` (pre-id-fix — the
admin surface that run exercises is unchanged by `46e1dff`).

## Gates honored

- **No upstream filing**: nothing opened, commented, or pushed against
  emdash-cms/emdash; the issue text is a committed draft marked
  DO NOT FILE; the clone work stayed local.
- **No npm/version changes**: package remains `private: true`, version
  `0.0.0`; no publish, no registry or marketplace activity; `emdash`
  peer/dev pins remain exactly `0.29.0`; lockfile untouched.
- **No merges**: work ends at a review-ready PR; merge authority is the
  owner's.
- **Consumers untouched**: no changes in smokyworks/smokyproductco;
  their pins are unaffected. Upgrade note for later bumps: external
  media hosts must be approved via `mediaHosts` (README documents it).
- **Local environment left pristine**: the installed EmDash dist was
  restored byte-for-byte after the patched canary run (verified by the
  restored-run race returning), and the parallel e2e port override
  (`DINKUS_E2E_PORT`) avoided touching the concurrently running
  fixture on the default port.

## Commits under proof

- `87bcb61` feat: runtime block schemas and navigation/media URL policy split
- `704671e` docs: prepare EmDash 0.29.0 save-race upstream packet
- `46e1dff` fix: declare the editor-stamped id as a block system key
