# Contributing

Thanks for interest in Dinkus blocks. This package is dogfooding in the open
while the field contracts stabilize. Please read this before opening a PR.

## Defaults

- EmDash-native Portable Text section blocks only (no parallel page builder).  
- Small vocabulary; **patterns** (copied compositions) are the default source of variety.  
- Copy and branding live in site content, never in this package.  
- Documented `--dinkus-*` tokens and `dinkus-*` classes are public API (`COMPAT.md`).  
- `pnpm check` must pass; browser changes also need `pnpm test:e2e`.

## Will not accept until foundation dogfood closes

Until the foundation campaign issue is closed with Smoky Works P0 proof:

| Proposal | Status |
| --- | --- |
| New one-off section types (testimonial, pricing, team, …) without an admission note proving patterns fail | **Rejected** |
| Forked renderers that abandon the token/class contract | **Rejected** |
| Breaking field renames without migration + fixtures | **Rejected** (`COMPAT.md`) |
| npm publish / marketplace listing PRs | **Rejected** (release-gated) |
| Dynamic tag language PRs | **Wait** — confirm EmDash has no native mechanism; then design review first |
| Query/Looper family | **Wait** — tracked as post-foundation follow-on |
| Display-conditions / slots package | **Wait** — use EmDash Widget Areas first |
| Commerce, cart, or checkout features | **Wrong repo** — see AICommerce / commerce extensions |

## New block admission (when foundation is open to expansion)

A PR that adds a block type must include a short admission note:

1. Which existing blocks + pattern composition were tried?  
2. What data, behavior, a11y, or runtime contract could not be expressed?  
3. Why is it reusable across unrelated sites?  
4. What stored-content migration obligation does it introduce?

Layout novelty or a single site’s mockup is not enough.

## Schema changes

Follow `COMPAT.md`. Schema-changing PRs ship migration + old/new fixtures +
idempotency coverage in the same PR or they do not merge.

## Review and merge

Maintainers may request proof packets (admin + public screenshots, commands).
Merge and release authority remains with the project owner for the dogfood
period.
