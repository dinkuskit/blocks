# blocks

`* * *`

A library of section blocks — hero, features, CTA, FAQ, and friends — so whole pages are composed and edited in the EmDash admin, not in code. Will ship as `@dinkuskit/blocks` on npm.

Part of [Dinkus](https://github.com/dinkuskit) — blocks, commerce, and templates for [EmDash](https://github.com/emdash-cms/emdash) sites. Use one, use all — none requires the others.

Under construction, dogfooding in the open. MIT.

## Compatibility spike

The first unreleased slice proves one `dinkus.cta-band` Portable Text block
end to end against EmDash 0.29.0:

- native plugin registration;
- admin slash-menu insertion and field editing;
- modal save and hard-reload persistence;
- automatic Astro renderer registration; and
- published SSR updates without a rebuild.

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

`dinkus.cta-band` currently declares `eyebrow`, `heading`, `body`,
`ctaLabel`, and `ctaHref`. Site copy stays in EmDash content; the package
contains only the field contract and neutral renderer.

## Verify

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm exec playwright install chromium
pnpm test:e2e
```

The local acceptance app lives under `tests/fixture-site/`. Its generated
database, uploads, screenshots, traces, and reports are ignored.
