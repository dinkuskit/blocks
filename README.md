# blocks

`* * *`

A library of section blocks — hero, features, CTA, FAQ, and friends — so whole pages are composed and edited in the EmDash admin, not in code. Will ship as `@dinkuskit/blocks` on npm.

Part of [Dinkus](https://github.com/dinkuskit) — blocks, commerce, and templates for [EmDash](https://github.com/emdash-cms/emdash) sites. Use one, use all — none requires the others.

Under construction, dogfooding in the open. MIT.

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

## Verify

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm exec playwright install chromium
pnpm test:e2e
```

The local acceptance app lives under `tests/fixture-site/`. Its generated
database, uploads, screenshots, traces, and reports are ignored.
