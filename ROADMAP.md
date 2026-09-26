# Roadmap

This is the **Blocks-specific backlog**, reconciled on 2026-09-26 with the
canonical [kit vision](https://github.com/dinkuskit/.github/blob/main/VISION.md)
and [kit roadmap](https://github.com/dinkuskit/.github/blob/main/ROADMAP.md).
Whole-kit sequencing lives there: the first goal is a human-operable EmDash
store, with Commerce and Inventory launching side by side. Inventory is not a
post-Commerce extension. Advanced promotions and bundles can follow later.

Package remains private at `0.0.0` until its dogfood and release gates pass.
This backlog is not a release-readiness claim. Component work below does not
block or reorder the kit's approved current Store Template catalog slice.

## Foundation (current campaign — closes when done)

- [x] Small section vocabulary + patterns-for-variety rule (`docs/architecture.md`)
- [x] `--dinkus-*` theming contract + documented class hooks
- [x] `COMPAT.md` — schema changes ship with migrations
- [x] Core blocks proven in fixture e2e (hero, rails, CTA, …)
- [ ] `CONTRIBUTING.md` fences (“will not accept PRs for X until Y”)
- [ ] Smoky Works **P0** dogfood: admin-operable home thin trio (hero + mid + CTA)
- [ ] Campaign issue closed with proof links

## Follow-on candidates — Blocks scope

These preserve the component backlog, not an approved order for the whole kit:

- Home section parity and a second consumer proof on the same Blocks pin.
- `dinkus.query` family: `dinkus.query-card` is the first card (one source,
  one limit, image, title, text and link). Filters, pagination, archives and
  further cards remain candidates.
- Pattern catalog: expand real copied-composition seeds and gallery material
  in this repo under the existing admission contract.
- Dynamic tags only if EmDash has no adequate native mechanism; syntax and
  commerce integration need their own design decision.
- Slots/conditions only if EmDash Widget Areas cannot meet real template demand.
- Actual-page visual editing: [issue #41](https://github.com/dinkuskit/blocks/issues/41)
  tracks real renderers and block-level editing controls.

Templates consume Blocks, while Commerce owns product and purchase policy and
Inventory owns stock truth. Their integration, launch sequence and wider kit
assembly belong to the canonical roadmap, not this component backlog. No
private operating deadlines are product gates here.

## Will not do in this package

- Smoky branding, customer data, or production credentials  
- A parallel admin UI that abandons EmDash-native Portable Text blocks  
- One-dimensional blocks (testimonial/pricing/team) that should be patterns  
- Silent schema breaks without migrations  
