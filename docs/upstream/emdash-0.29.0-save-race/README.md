# EmDash 0.29.0 block-modal save race — upstream packet

Prepared materials for the EmDash 0.29.0 modal-save double-dispatch that
this package's expected-fail canary (`tests/e2e/emdash-save-canary.spec.ts`)
guards, reported as finding 3 of
[dinkuskit/blocks#2](https://github.com/dinkuskit/blocks/issues/2).

**Nothing in this directory is filed anywhere by itself. Upstream issues,
comments, and pull requests stay owner-gated per `AGENTS.md`.**

## Status upstream

- The fix is merged upstream:
  [emdash-cms/emdash#2160](https://github.com/emdash-cms/emdash/pull/2160)
  (`fix(admin): isolate plugin block modal saves`), first shipped in
  `emdash@0.30.0`.
- The `emdash@0.29.0` release this package pins does **not** contain it,
  so every 0.29.0 site keeps the race until it upgrades or patches.
- This package's e2e helper heals the race per save
  (`submitModalAndWaitForSave` in `tests/e2e/helpers.ts`); the canary spec
  itself stays expected-fail against the stock pin.

## Contents

| File | What it is |
| --- | --- |
| `0001-fix-admin-isolate-plugin-block-modal-saves.patch` | Upstream #2160 rebased onto the `emdash@0.29.0` tag (clean cherry-pick, original authorship preserved): one `e.stopPropagation()` in `PluginBlockModal.handleSubmit` plus the browser regression test and changeset |
| `issue-draft.md` | Drafted upstream text asking for a 0.29.x backport release — **draft only, do not file** |
| `server-side-cas-note.md` | Why the client fix is necessary but not sufficient: the durable write contract (expectedRevision CAS + mutationId idempotency + 409) |

## How the patch was developed and tested

Developed in a local clone of `emdash-cms/emdash`: branch
`backport/0.29.0-block-modal-save` created at tag `emdash@0.29.0`; commit
`2da4a40c` cherry-picked (applies clean, no conflicts); the patch file is
`git format-patch` output of that branch.

Verified end to end against this package's own canary by applying the same
one-line change to the installed `@emdash-cms/admin@0.29.0` bundle
(`dist/index.js` ships unminified) in a throwaway step and running
`tests/e2e/emdash-save-canary.spec.ts` three times:

1. **Stock 0.29.0** — race observed; expected-fail annotation holds
   (suite reports the failure as expected).
2. **Patched 0.29.0** — `Expected to fail, but passed.`: no competing
   manual save PUTs, the edit persists across reload. The canary is the
   passing regression the moment the pin includes the fix.
3. **Stock restored** — race returns, proving the signal tracks the patch
   and the local install is left pristine.

Environment note: the upstream browser regression test added by #2160
could not be executed inside the 0.29.0-era clone on this machine — every
`vi.mock`-using admin browser test at that tag fails to boot in this local
environment, including unmodified stock tests, so the limitation is the
local test infra, not the backport. Upstream CI ran the test at merge; the
canary triple-run above is the authoritative local proof.

## Operator paths for 0.29.0 consumers

Until the package's EmDash pin moves past 0.29.0 through the compatibility
gate (`COMPAT.md`), a site that must close the race today can apply the
patch to a vendored EmDash build, or rely on the kit e2e heal pattern for
test flows. The durable fix is server-side regardless — see
`server-side-cas-note.md`.
