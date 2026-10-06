# Contributing

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
> archived the repository or that all consumers have migrated.

## Historical contribution guidance

The material below describes the retired experiment and is retained for
historical reference. It is not an invitation for new features, dependencies,
imports, adoption, or active contribution.

Thanks for historical interest in Dinkus blocks. This package was dogfooded in
the open while its field contracts stabilized. Please read this retained record
for context; new project work is not being accepted here.

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
| Query/Looper family | **One card admitted** — `dinkus.query-card` is one source, one limit, and one card. Filters, pagination, price, stock, cart, and further query blocks still wait |
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
