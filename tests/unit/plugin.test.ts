import { describe, expect, it } from "vitest";

import {
	CTA_BAND_BLOCK_TYPE,
	DINKUS_BLOCKS_PLUGIN_ID,
	FACT_RAIL_BLOCK_TYPE,
	GALLERY_HERO_BLOCK_TYPE,
	GALLERY_LANES_BLOCK_TYPE,
	LEDGER_CARDS_BLOCK_TYPE,
	PAGE_HERO_BLOCK_TYPE,
	SECTION_HEADER_BLOCK_TYPE,
	createPlugin,
	ctaBandFields,
	dinkusBlocks,
	factRailFields,
	galleryHeroFields,
	galleryLanesFields,
	ledgerCardsFields,
	pageHeroFields,
	sectionHeaderFields,
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

	it("declares the capability-free editable section blocks", () => {
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
					{
						type: PAGE_HERO_BLOCK_TYPE,
						label: "Page Hero",
						category: "Sections",
						fields: pageHeroFields,
					},
					{
						type: SECTION_HEADER_BLOCK_TYPE,
						label: "Section Header",
						category: "Sections",
						fields: sectionHeaderFields,
					},
					{
						type: FACT_RAIL_BLOCK_TYPE,
						label: "Fact Rail",
						category: "Sections",
						fields: factRailFields,
					},
					{
						type: GALLERY_HERO_BLOCK_TYPE,
						label: "Gallery Hero",
						category: "Sections",
						fields: galleryHeroFields,
					},
					{
						type: LEDGER_CARDS_BLOCK_TYPE,
						label: "Ledger Cards",
						category: "Sections",
						fields: ledgerCardsFields,
					},
					{
						type: GALLERY_LANES_BLOCK_TYPE,
						label: "Gallery Lanes",
						category: "Sections",
						fields: galleryLanesFields,
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

	it("locks the page-hero field contract", () => {
		expect(pageHeroFields.map((field) => field.action_id)).toEqual([
			"eyebrow",
			"headline",
			"deck",
			"primaryLabel",
			"primaryHref",
			"secondaryLabel",
			"secondaryHref",
		]);
	});

	it("locks the section-header field contract", () => {
		expect(sectionHeaderFields.map((field) => field.action_id)).toEqual([
			"number",
			"kicker",
			"title",
			"intro",
		]);
	});

	it("locks the fact-rail field contract, repeater sub-fields included", () => {
		expect(factRailFields.map((field) => field.action_id)).toEqual([
			"ariaLabel",
			"facts",
		]);

		const facts = factRailFields.find((field) => field.action_id === "facts");
		if (facts?.type !== "repeater") {
			throw new Error("facts must be a repeater element");
		}
		expect(facts.fields.map((field) => field.action_id)).toEqual([
			"label",
			"value",
			"icon",
		]);
		// Repeater sub-fields only support scalar element types; media stays a
		// top-level media_picker (URL-string) field.
		expect(facts.fields.every((field) => field.type === "text_input")).toBe(
			true,
		);
	});

	it("locks the gallery-hero field contract with a top-level media picker", () => {
		expect(galleryHeroFields.map((field) => field.action_id)).toEqual([
			"image",
			"imageAlt",
			"eyebrow",
			"headline",
			"deck",
			"primaryLabel",
			"primaryHref",
			"secondaryLabel",
			"secondaryHref",
		]);
		const image = galleryHeroFields.find((field) => field.action_id === "image");
		expect(image?.type).toBe("media_picker");
	});

	it("locks the ledger-cards repeater contract", () => {
		expect(ledgerCardsFields.map((field) => field.action_id)).toEqual([
			"cards",
		]);
		const cards = ledgerCardsFields.find((field) => field.action_id === "cards");
		if (cards?.type !== "repeater") {
			throw new Error("cards must be a repeater element");
		}
		expect(cards.fields.map((field) => field.action_id)).toEqual([
			"code",
			"title",
			"body",
			"ctaLabel",
			"ctaHref",
		]);
	});

	it("locks the gallery-lanes repeater contract, media as URL string", () => {
		expect(galleryLanesFields.map((field) => field.action_id)).toEqual([
			"lanes",
		]);
		const lanes = galleryLanesFields.find((field) => field.action_id === "lanes");
		if (lanes?.type !== "repeater") {
			throw new Error("lanes must be a repeater element");
		}
		expect(lanes.fields.map((field) => field.action_id)).toEqual([
			"label",
			"meta",
			"href",
			"image",
		]);
		// media_picker is not a valid repeater sub-field, so the lane image is
		// a plain URL-string text input.
		expect(lanes.fields.every((field) => field.type === "text_input")).toBe(
			true,
		);
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
