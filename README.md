# blocks

`* * *`

A library of section blocks — hero, features, CTA, FAQ, and friends — so whole pages are composed and edited in the EmDash admin, not in code. Will ship as `@dinkuskit/blocks` on npm.

Part of [Dinkus](https://github.com/dinkuskit) — blocks, commerce, and templates for [EmDash](https://github.com/emdash-cms/emdash) sites. Use one, use all — none requires the others.

Under construction, dogfooding in the open. MIT.

See [ROADMAP.md](ROADMAP.md) for the North-Star-shaped kit trajectory,
[CONTRIBUTING.md](CONTRIBUTING.md) for what PRs we will not accept during
dogfood, and [COMPAT.md](COMPAT.md) for stored-content change rules.

## Block vocabulary

The package declares a vocabulary of recurring section blocks as native
Portable Text blocks, each proven end to end against EmDash 0.29.0:

- native plugin registration;
- admin slash-menu insertion and field editing;
- modal save and hard-reload persistence;
- automatic Astro renderer registration; and
- published SSR updates without a rebuild.

Every block ships a neutral renderer with `dinkus-*` classes and a
`data-dinkus-block` hook so sites can override the look while keeping the
same field contract. Copy always lives in EmDash content, never the
package.

The vocabulary is intentionally small. Patterns are copied compositions of
existing blocks and are the default source of variety; a new block must prove
that composition cannot express its reusable data, behavior, accessibility,
or runtime contract. See [the architecture contract](docs/architecture.md)
and [pattern catalog contract](patterns/README.md).

| Block | Type | Shape |
| --- | --- | --- |
| CTA Band | `dinkus.cta-band` | eyebrow, heading, body, single CTA |
| Page Hero | `dinkus.page-hero` | eyebrow, headline, deck, primary + secondary CTA |
| Section Header | `dinkus.section-header` | number, kicker, title, intro |
| Fact Rail | `dinkus.fact-rail` | repeater of label/value/icon facts |
| Gallery Hero | `dinkus.gallery-hero` | media picker + hero copy + two CTAs |
| Ledger Cards | `dinkus.ledger-cards` | repeater of code/title/body/CTA cards |
| Gallery Lanes | `dinkus.gallery-lanes` | repeater of linked image lanes |
| Search Board | `dinkus.search-board` | header + repeater of plain-language links |
| Service Area Map | `dinkus.service-area-map` | map image, caption, legend repeater |
| Dispatch | `dinkus.dispatch` | contact band with CTA + tel/mailto links |
| Project Record | `dinkus.project-record` | identity art, status ticket, role, evidence-link repeater, next-project navigation |

Repeater sub-fields are scalar only in Block Kit 0.29.0, so image
sub-fields (gallery lanes) carry URL strings rather than a media picker —
a gap noted for later tooling.

The package is intentionally private at `0.0.0`. It has not passed the
Smoky Works dogfood gate and is not published to npm or an EmDash registry.

```js
import { dinkusBlocks } from "@dinkuskit/blocks";
import emdash from "emdash/astro";

export default {
	integrations: [
		emdash({
			// database and storage omitted
			plugins: [dinkusBlocks()],
		}),
	],
};
```

Astro renderers register automatically via the `@dinkuskit/blocks/astro`
components entry; sites can also import a single block (for example
`import { PageHero } from "@dinkuskit/blocks/astro"`) to wrap it with a
pixel-locked override.

## Theming contract

Default renderer styles live in the low-priority `dinkus-blocks` cascade
layer. A template can set these custom properties globally or on one block,
and ordinary unlayered site CSS can override the documented class hooks:

| Token | Purpose |
| --- | --- |
| `--dinkus-section-spacing` | Major section margin or vertical padding |
| `--dinkus-content-gap` | Space between sibling content groups |
| `--dinkus-item-gap` | Space inside a repeated/card item |
| `--dinkus-panel-padding` | Panel/card inset |
| `--dinkus-panel-border` | Panel/card border |
| `--dinkus-panel-radius` | Panel/card corner radius |
| `--dinkus-panel-surface` | Neutral panel/placeholder background |
| `--dinkus-copy-max-width` | Long-form copy measure |
| `--dinkus-title-size` | Primary heading size inside a block |
| `--dinkus-title-line-height` | Primary heading line height |
| `--dinkus-action-background` | Primary action background |
| `--dinkus-action-color` | Primary action foreground |
| `--dinkus-action-radius` | Primary action corner radius |
| `--dinkus-muted-opacity` | Secondary metadata opacity |

Fallbacks preserve the current neutral rendering, so adopting the contract
does not require a theme.

The initial template insertion-point names (`before-header`, `after-header`,
`before-content`, `after-content`, `before-footer`, and `end-of-body`) are
defined in [the architecture contract](docs/architecture.md). This package
does not yet ship a display-conditions engine.

## Consumer API

The package root exports `safeCtaHref`, the shared `PortableTextNode` base,
one `*Node` type for each block, and the repeater item types `FactItem`,
`LedgerCard`, `GalleryLane`, `SearchLink`, `LegendEntry`, and
`ProjectRecordLink`.

A site-level renderer override can use the same node contract as the
shipped renderer and the same URL policy:

```astro
---
import {
	safeCtaHref,
	type CtaBandNode,
} from "@dinkuskit/blocks";

interface Props {
	node: CtaBandNode;
}

const { node } = Astro.props;
const ctaHref = safeCtaHref(node.ctaHref);
---

<section class="site-cta">
	{node.heading && <h2>{node.heading}</h2>}
	{node.ctaLabel && ctaHref && <a href={ctaHref}>{node.ctaLabel}</a>}
</section>
```

`ProjectRecordNode` is the thin composed-record contract used by portfolio
dogfood sites. It keeps project identity, status, role, proof, safe evidence
links, and next navigation in one editable block without claiming to be a
full-site starter template. The neutral renderer exposes named Astro slots for
site-owned identity art, deliberate title breaks, and icons, so a consumer can
keep an already-approved visual system while importing the node and repeater
types from the package root rather than redeclaring them. Its default CSS lives
in the low-priority `dinkus-blocks` cascade layer, leaving ordinary unlayered
site styles authoritative for pixel-locked overrides. The identity cell
keeps widthless slotted roots intrinsically sized and centered for compatibility.
An absolute-only art wrapper can opt into the cell's full width with
`data-dinkus-project-record-identity="fill"`; opted-in roots should bring their
own height because the cell only guarantees a minimum height. This explicit
hook prevents unrelated custom identity roots from changing alignment during an
upgrade.

Stored block fields and documented hooks follow the
[compatibility covenant](COMPAT.md). Breaking field changes require migration
fixtures and tooling in the same change.

## Verify

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm exec playwright install chromium
pnpm test:e2e
```

The local acceptance app lives under `tests/fixture-site/`. Its generated
database, uploads, screenshots, traces, and reports are ignored.
