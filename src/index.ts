import {
	definePlugin,
	type PluginDescriptor,
	type PluginDefinition,
	type ResolvedPlugin,
} from "emdash";
import {
	CTA_BAND_BLOCK_TYPE,
	ctaBandFields,
} from "./features/cta-band";
import {
	FACT_RAIL_BLOCK_TYPE,
	factRailFields,
} from "./features/fact-rail";
import {
	GALLERY_HERO_BLOCK_TYPE,
	galleryHeroFields,
} from "./features/gallery-hero";
import {
	PAGE_HERO_BLOCK_TYPE,
	pageHeroFields,
} from "./features/page-hero";
import {
	SECTION_HEADER_BLOCK_TYPE,
	sectionHeaderFields,
} from "./features/section-header";
import {
	LEDGER_CARDS_BLOCK_TYPE,
	ledgerCardsFields,
} from "./features/ledger-cards";
import {
	GALLERY_LANES_BLOCK_TYPE,
	galleryLanesFields,
} from "./features/gallery-lanes";
import {
	SEARCH_BOARD_BLOCK_TYPE,
	searchBoardFields,
} from "./features/search-board";
import {
	DISPATCH_BLOCK_TYPE,
	dispatchFields,
} from "./features/dispatch";
import {
	SERVICE_AREA_MAP_BLOCK_TYPE,
	serviceAreaMapFields,
} from "./features/service-area-map";
import {
	PROJECT_RECORD_BLOCK_TYPE,
	projectRecordFields,
} from "./features/project-record";

export {
	CTA_BAND_BLOCK_TYPE,
	ctaBandFields,
	type CtaBandNode,
} from "./features/cta-band";
export {
	FACT_RAIL_BLOCK_TYPE,
	factRailFields,
	type FactItem,
	type FactRailNode,
} from "./features/fact-rail";
export {
	GALLERY_HERO_BLOCK_TYPE,
	galleryHeroFields,
	type GalleryHeroNode,
} from "./features/gallery-hero";
export {
	PAGE_HERO_BLOCK_TYPE,
	pageHeroFields,
	type PageHeroNode,
} from "./features/page-hero";
export {
	SECTION_HEADER_BLOCK_TYPE,
	sectionHeaderFields,
	type SectionHeaderNode,
} from "./features/section-header";
export {
	LEDGER_CARDS_BLOCK_TYPE,
	ledgerCardsFields,
	type LedgerCard,
	type LedgerCardsNode,
} from "./features/ledger-cards";
export {
	GALLERY_LANES_BLOCK_TYPE,
	galleryLanesFields,
	type GalleryLane,
	type GalleryLanesNode,
} from "./features/gallery-lanes";
export {
	SEARCH_BOARD_BLOCK_TYPE,
	searchBoardFields,
	type SearchBoardNode,
	type SearchLink,
} from "./features/search-board";
export {
	DISPATCH_BLOCK_TYPE,
	dispatchFields,
	type DispatchNode,
} from "./features/dispatch";
export {
	SERVICE_AREA_MAP_BLOCK_TYPE,
	serviceAreaMapFields,
	type LegendEntry,
	type ServiceAreaMapNode,
} from "./features/service-area-map";
export {
	PROJECT_RECORD_BLOCK_TYPE,
	projectRecordFields,
	type FieldAnnotationAttributes,
	type ProjectRecordAnnotations,
	type ProjectRecordLink,
	type ProjectRecordLinkAnnotation,
	type ProjectRecordNode,
} from "./features/project-record";
export { safeCtaHref } from "./links";
export { DINKUS_THEME_TOKENS, type DinkusThemeToken } from "./theme";
export type { PortableTextNode } from "./types";

export const DINKUS_BLOCKS_PLUGIN_ID = "dinkus-blocks";

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
			{
				type: PROJECT_RECORD_BLOCK_TYPE,
				label: "Project Record",
				category: "Sections",
				description: "A full project record with identity, status, evidence, and next navigation",
				fields: projectRecordFields,
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
