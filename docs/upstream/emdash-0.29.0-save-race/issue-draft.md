# DRAFT — DO NOT FILE

Drafted upstream issue text for `emdash-cms/emdash`. Filing is owner-gated
(`AGENTS.md`); this draft exists so the ask is review-ready when the owner
says go. If upstream ships a 0.29.x patch release or the kit's pin moves
past 0.29.0 first, retire this draft instead of filing it.

---

**Title:** Backport #2160 (block-modal save isolation) to a 0.29.x patch
release

## Summary

`emdash@0.29.0` still carries the plugin block modal double-dispatch fixed
by #2160 (merged, first shipped in 0.30.0). On 0.29.0, one Save click in
the Block Kit modal dispatches the submit event to the surrounding content
form as well: React invokes the page form's submit handler in the same
tick, so two manual-save PUTs race — a pre-edit snapshot of the page and
the intended post-edit document. Whichever write commits last wins. Under
Cloudflare/workerd dev the stale snapshot consistently landed last in our
runs: the user's edit silently reverts while the UI shows "Saved", and a
subsequent Publish ships the stale revision.

Because the modal is a React descendant of the page form even when its DOM
is portaled, `e.preventDefault()` alone does not stop the synthetic event
from reaching the form's `onSubmit`; the missing call is
`e.stopPropagation()` in `PluginBlockModal.handleSubmit` — exactly what
#2160 added, along with a browser regression test.

## Reproduction (against 0.29.0)

1. Register any plugin block with at least one text field
   (`portableTextBlocks` via a plugin definition).
2. Open an entry whose Portable Text content contains that block in the
   admin, hover the block, Edit, change the text field, click Save.
3. Observe network PUTs to `/_emdash/api/content/<collection>/<id>`: two
   non-autosave writes race, one containing the pre-edit content. On
   D1/workerd the stale one reliably commits last; on the node adapter the
   order is commonly reversed, which hides the bug.

A deterministic browser reproduction lives in the DinkusKit blocks
repository as an expected-fail canary:
`tests/e2e/emdash-save-canary.spec.ts` in
[dinkuskit/blocks](https://github.com/dinkuskit/blocks) (context in
dinkuskit/blocks#2, finding 3). Against a 0.29.0 install with #2160's one
line applied, that canary flips to passing ("Expected to fail, but
passed"), confirming the backport closes the race.

## Ask

Consumers that pin released versions exactly while proving compatibility
(plugin authors, pre-1.0 integrators) have no released 0.29.x without the
race; their only escape is a minor upgrade and a full re-proof. Since the
fix is a single `stopPropagation()` call plus its regression test, would
you take a `0.29.1` patch release containing only #2160? A rebased,
clean-applying patch against the `emdash@0.29.0` tag is prepared and can
be submitted as a PR against a release branch on request. If the project's
policy is "fixes ride the next minor" we'll note that in our
compatibility docs instead — a definitive answer is the real ask.

## Environment

- emdash 0.29.0 (`@emdash-cms/admin@0.29.0`, `@emdash-cms/blocks@0.29.0`)
- Astro 7.1.x, node adapter (dev) and Cloudflare workerd (dev) both
  reproduce; commit-order bias differs by adapter
- Chromium via Playwright 1.61.x
