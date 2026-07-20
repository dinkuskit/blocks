# S1 — EmDash #637 compatibility spike

Date: 2026-07-20  
Repo: `dinkuskit/blocks`  
Branch: `codex/s1-637-compat-spike-20260720`  
Base: `origin/main` at `439713c`

## Question

Does EmDash 0.29.0 still render plugin-declared Portable Text blocks as
opaque, non-editable entries in the normal collection admin path described
by issue #637?

## Fixture

The package declares one native, capability-free `dinkus.cta-band` block
with five scalar Block Kit fields. `tests/fixture-site` pins EmDash 0.29.0,
uses a local SQLite database, seeds one published block, and renders content
with ordinary `<PortableText>` usage. The renderer is supplied only through
the plugin's `componentsEntry`.

## Result: pass

The original #637 collection-admin case is not reproducible on EmDash
0.29.0:

1. `/_emdash/api/manifest` exposed the CTA block and all field declarations.
2. Typing `/cta` displayed the block in the slash menu.
3. The insert and edit modals rendered all declared fields.
4. Editing the seeded heading issued a successful content save containing the
   changed block and survived a hard reload.
5. A second block inserted through the slash menu survived a hard reload.
6. Publishing the local revision updated the SSR page without a rebuild.
7. Both blocks rendered through automatic plugin component registration.

This matches the editable-block behavior added upstream by EmDash PR #804
and confirms the no-data-loss outcome targeted by PR #1119. In this fixture,
submitting the block modal exercised the normal content-save request rather
than a separate `skipRevision` autosave request; the E2E waits for that exact
edited payload and response before reloading. Issue #637 remains open, but it
is not a blocker for the tested collection-admin path.

## Commands

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm exec playwright install chromium
pnpm test:e2e
```

Observed results:

- TypeScript and Astro checks: zero diagnostics.
- Vitest: 1 file, 12 tests passed, including unsafe CTA URL rejection.
- Fixture server build: passed.
- Package dry-run: only `LICENSE`, `README.md`, `package.json`, and `src/`.
- Playwright Chromium: 1 test passed.

The fixture build emits two upstream EmDash 0.29.0 warnings: an optional
`createCoalescingDialect` export is absent from the SQLite module, and the
admin bundle has chunks over 500 kB. Neither warning blocked build, local
admin behavior, persistence, publication, or SSR rendering in this spike.

## Artifacts

Local ignored proof root:

`tests/fixture-site/.artifacts/e2e/final8-20260720/`

Key artifacts:

- `results/.../slash-menu.png`
- `results/.../admin-modal.png`
- `results/.../rendered-blocks.png`
- `results/.../trace.zip`
- `report/index.html`

CI uploads the ignored E2E proof root as `dinkus-blocks-browser-proof`.
The regression test and seed are the durable, reproducible proof.

## Decision

Use native Portable Text blocks for S1. Do not open an upstream #637 fix
lane from this result.

The next slice is an isolated Smoky Works dogfood integration of this block.
That slice must separately gate production schema/content writes, deploy,
merge, and any later npm or EmDash registry release.

Out of scope here: field editing inside the public inline visual editor,
Sections admin behavior, marketplace-sandboxed plugin behavior, production
D1, and nested/repeater/media field shapes.
