import { describe, expect, it } from "vitest";

import {
	CTA_BAND_BLOCK_TYPE,
	DINKUS_BLOCKS_PLUGIN_ID,
	createPlugin,
	ctaBandFields,
	dinkusBlocks,
} from "../../src/index";
import { safeCtaHref } from "../../src/links";

describe("@dinkuskit/blocks", () => {
	it("publishes a native descriptor with automatic Astro components", () => {
		expect(dinkusBlocks()).toEqual({
			id: DINKUS_BLOCKS_PLUGIN_ID,
			version: "0.0.0",
			entrypoint: "@dinkuskit/blocks",
			componentsEntry: "@dinkuskit/blocks/astro",
		});
	});

	it("declares one capability-free editable CTA block", () => {
		const plugin = createPlugin();

		expect(plugin).toMatchObject({
			id: DINKUS_BLOCKS_PLUGIN_ID,
			version: "0.0.0",
			capabilities: [],
			admin: {
				portableTextBlocks: [
					{
						type: CTA_BAND_BLOCK_TYPE,
						label: "CTA Band",
						category: "Sections",
						fields: ctaBandFields,
					},
				],
			},
		});
		expect(ctaBandFields.map((field) => field.action_id)).toEqual([
			"eyebrow",
			"heading",
			"body",
			"ctaLabel",
			"ctaHref",
		]);
	});
});

describe("safeCtaHref", () => {
	it.each([
		["/contact", "/contact"],
		["#details", "#details"],
		["https://example.com/contact", "https://example.com/contact"],
		["mailto:hello@example.com", "mailto:hello@example.com"],
		["tel:+15551234567", "tel:+15551234567"],
	])("allows supported CTA href %s", (input, expected) => {
		expect(safeCtaHref(input)).toBe(expected);
	});

	it.each([
		"javascript:alert(1)",
		"data:text/html,<script>alert(1)</script>",
		"//evil.example/path",
		"/\\evil.example/path",
		"\\/evil.example/path",
		"relative/path",
		"",
	])("rejects unsafe CTA href %s", (input) => {
		expect(safeCtaHref(input)).toBeUndefined();
	});
});
