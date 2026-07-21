import type { Element } from "@emdash-cms/blocks";
import {
	definePlugin,
	type PluginDescriptor,
	type PluginDefinition,
	type ResolvedPlugin,
} from "emdash";

export { safeCtaHref } from "./links";
export type {
	CtaBandNode,
	DispatchNode,
	FactItem,
	FactRailNode,
	GalleryHeroNode,
	GalleryLane,
	GalleryLanesNode,
	LedgerCard,
	LedgerCardsNode,
	LegendEntry,
	PageHeroNode,
	PortableTextNode,
	SearchBoardNode,
	SearchLink,
	SectionHeaderNode,
	ServiceAreaMapNode,
} from "./types";

export const DINKUS_BLOCKS_PLUGIN_ID = "dinkus-blocks";
export const CTA_BAND_BLOCK_TYPE = "dinkus.cta-band";
export const PAGE_HERO_BLOCK_TYPE = "dinkus.page-hero";
export const SECTION_HEADER_BLOCK_TYPE = "dinkus.section-header";
export const FACT_RAIL_BLOCK_TYPE = "dinkus.fact-rail";
export const GALLERY_HERO_BLOCK_TYPE = "dinkus.gallery-hero";
export const LEDGER_CARDS_BLOCK_TYPE = "dinkus.ledger-cards";
export const GALLERY_LANES_BLOCK_TYPE = "dinkus.gallery-lanes";
export const SEARCH_BOARD_BLOCK_TYPE = "dinkus.search-board";
export const SERVICE_AREA_MAP_BLOCK_TYPE = "dinkus.service-area-map";
export const DISPATCH_BLOCK_TYPE = "dinkus.dispatch";

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

export const galleryHeroFields = [
	{
		type: "media_picker",
		action_id: "image",
		label: "Hero image",
	},
	{
		type: "text_input",
		action_id: "imageAlt",
		label: "Image alt text",
	},
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
		label: "Secondary link label",
	},
	{
		type: "text_input",
		action_id: "secondaryHref",
		label: "Secondary link URL",
		placeholder: "/work",
	},
] satisfies Element[];

export const ledgerCardsFields = [
	{
		type: "repeater",
		action_id: "cards",
		label: "Cards",
		item_label: "Card",
		fields: [
			{
				type: "text_input",
				action_id: "code",
				label: "Record code",
			},
			{
				type: "text_input",
				action_id: "title",
				label: "Title",
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
			},
		],
	},
] satisfies Element[];

export const galleryLanesFields = [
	{
		type: "repeater",
		action_id: "lanes",
		label: "Lanes",
		item_label: "Lane",
		fields: [
			{
				type: "text_input",
				action_id: "label",
				label: "Label",
			},
			{
				type: "text_input",
				action_id: "meta",
				label: "Meta",
			},
			{
				type: "text_input",
				action_id: "href",
				label: "Link URL",
			},
			{
				// Repeater sub-fields only support scalar element types, so
				// lane images are URL strings rather than a media picker.
				type: "text_input",
				action_id: "image",
				label: "Image URL",
			},
		],
	},
] satisfies Element[];

export const searchBoardFields = [
	{
		type: "text_input",
		action_id: "number",
		label: "Section number",
		placeholder: "LOC",
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
	{
		type: "repeater",
		action_id: "links",
		label: "Links",
		item_label: "Link",
		fields: [
			{
				type: "text_input",
				action_id: "label",
				label: "Label",
			},
			{
				type: "text_input",
				action_id: "href",
				label: "Link URL",
			},
		],
	},
] satisfies Element[];

export const serviceAreaMapFields = [
	{
		type: "media_picker",
		action_id: "image",
		label: "Map image",
	},
	{
		type: "text_input",
		action_id: "imageAlt",
		label: "Map image alt text",
	},
	{
		type: "text_input",
		action_id: "caption",
		label: "Caption",
		multiline: true,
	},
	{
		type: "repeater",
		action_id: "legend",
		label: "Legend",
		item_label: "Legend entry",
		fields: [
			{
				type: "text_input",
				action_id: "label",
				label: "Label",
			},
			{
				// Neutral swatch/icon slug for site override renderers.
				type: "text_input",
				action_id: "icon",
				label: "Icon slug",
			},
		],
	},
] satisfies Element[];

export const dispatchFields = [
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
	{
		type: "text_input",
		action_id: "phone",
		label: "Phone",
		placeholder: "tel:+15551234567",
	},
	{
		type: "text_input",
		action_id: "email",
		label: "Email",
		placeholder: "mailto:hello@example.com",
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
			{
				type: GALLERY_HERO_BLOCK_TYPE,
				label: "Gallery Hero",
				category: "Sections",
				description: "Hero with a large image, headline, deck, and calls to action",
				fields: galleryHeroFields,
			},
			{
				type: LEDGER_CARDS_BLOCK_TYPE,
				label: "Ledger Cards",
				category: "Sections",
				description: "A grid of record cards with code, title, and body",
				fields: ledgerCardsFields,
			},
			{
				type: GALLERY_LANES_BLOCK_TYPE,
				label: "Gallery Lanes",
				category: "Sections",
				description: "Linked image lanes with a label and meta line",
				fields: galleryLanesFields,
			},
			{
				type: SEARCH_BOARD_BLOCK_TYPE,
				label: "Search Board",
				category: "Sections",
				description: "A titled board of plain-language links",
				fields: searchBoardFields,
			},
			{
				type: SERVICE_AREA_MAP_BLOCK_TYPE,
				label: "Service Area Map",
				category: "Sections",
				description: "A map figure with a caption and legend",
				fields: serviceAreaMapFields,
			},
			{
				type: DISPATCH_BLOCK_TYPE,
				label: "Dispatch",
				category: "Sections",
				description: "A contact band with a call to action and contact links",
				fields: dispatchFields,
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
