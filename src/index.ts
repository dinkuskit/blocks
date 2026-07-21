import type { Element } from "@emdash-cms/blocks";
import {
	definePlugin,
	type PluginDescriptor,
	type PluginDefinition,
	type ResolvedPlugin,
} from "emdash";

export const DINKUS_BLOCKS_PLUGIN_ID = "dinkus-blocks";
export const CTA_BAND_BLOCK_TYPE = "dinkus.cta-band";
export const PAGE_HERO_BLOCK_TYPE = "dinkus.page-hero";
export const SECTION_HEADER_BLOCK_TYPE = "dinkus.section-header";
export const FACT_RAIL_BLOCK_TYPE = "dinkus.fact-rail";

export const ctaBandFields = [
	{
		type: "text_input",
		action_id: "eyebrow",
		label: "Eyebrow",
	},
	{
		type: "text_input",
		action_id: "heading",
		label: "Heading",
	},
	{
		type: "text_input",
		action_id: "body",
		label: "Body",
		multiline: true,
	},
	{
		type: "text_input",
		action_id: "ctaLabel",
		label: "CTA label",
	},
	{
		type: "text_input",
		action_id: "ctaHref",
		label: "CTA URL",
		placeholder: "/contact",
	},
] satisfies Element[];

export const pageHeroFields = [
	{
		type: "text_input",
		action_id: "eyebrow",
		label: "Eyebrow",
	},
	{
		type: "text_input",
		action_id: "headline",
		label: "Headline",
	},
	{
		type: "text_input",
		action_id: "deck",
		label: "Deck",
		multiline: true,
	},
	{
		type: "text_input",
		action_id: "primaryLabel",
		label: "Primary CTA label",
	},
	{
		type: "text_input",
		action_id: "primaryHref",
		label: "Primary CTA URL",
		placeholder: "/contact",
	},
	{
		type: "text_input",
		action_id: "secondaryLabel",
		label: "Secondary CTA label",
	},
	{
		type: "text_input",
		action_id: "secondaryHref",
		label: "Secondary CTA URL",
		placeholder: "/about",
	},
] satisfies Element[];

export const sectionHeaderFields = [
	{
		type: "text_input",
		action_id: "number",
		label: "Section number",
		placeholder: "01",
	},
	{
		type: "text_input",
		action_id: "kicker",
		label: "Kicker",
	},
	{
		type: "text_input",
		action_id: "title",
		label: "Title",
	},
	{
		type: "text_input",
		action_id: "intro",
		label: "Intro",
		multiline: true,
	},
] satisfies Element[];

export const factRailFields = [
	{
		type: "text_input",
		action_id: "ariaLabel",
		label: "Accessible label",
		placeholder: "Quick facts",
	},
	{
		type: "repeater",
		action_id: "facts",
		label: "Facts",
		item_label: "Fact",
		fields: [
			{
				type: "text_input",
				action_id: "label",
				label: "Label",
			},
			{
				type: "text_input",
				action_id: "value",
				label: "Value",
			},
			{
				// Neutral icon slug (e.g. an icon-set name). The default
				// renderer ignores it; site override renderers may map it to
				// their icon system.
				type: "text_input",
				action_id: "icon",
				label: "Icon slug",
			},
		],
	},
] satisfies Element[];

const definition: PluginDefinition = {
	id: DINKUS_BLOCKS_PLUGIN_ID,
	version: "0.0.0",
	capabilities: [],
	admin: {
		portableTextBlocks: [
			{
				type: CTA_BAND_BLOCK_TYPE,
				label: "CTA Band",
				category: "Sections",
				description: "A focused call-to-action section",
				fields: ctaBandFields,
			},
			{
				type: PAGE_HERO_BLOCK_TYPE,
				label: "Page Hero",
				category: "Sections",
				description: "Top-of-page hero with headline, deck, and calls to action",
				fields: pageHeroFields,
			},
			{
				type: SECTION_HEADER_BLOCK_TYPE,
				label: "Section Header",
				category: "Sections",
				description: "Numbered section header with kicker, title, and intro",
				fields: sectionHeaderFields,
			},
			{
				type: FACT_RAIL_BLOCK_TYPE,
				label: "Fact Rail",
				category: "Sections",
				description: "A horizontal rail of short label/value facts",
				fields: factRailFields,
			},
		],
	},
};

export function dinkusBlocks(): PluginDescriptor {
	return {
		id: DINKUS_BLOCKS_PLUGIN_ID,
		version: definition.version,
		entrypoint: "@dinkuskit/blocks",
		componentsEntry: "@dinkuskit/blocks/astro",
	};
}

export function createPlugin(): ResolvedPlugin {
	return definePlugin(definition);
}

export default createPlugin;
