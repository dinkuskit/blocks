import { describe, expect, it } from "vitest";

import {
	safeCtaHref,
	type CtaBandNode,
	type DispatchNode,
	type FactItem,
	type FactRailNode,
	type GalleryHeroNode,
	type GalleryLane,
	type GalleryLanesNode,
	type LedgerCard,
	type LedgerCardsNode,
	type LegendEntry,
	type PageHeroNode,
	type PortableTextNode,
	type SearchBoardNode,
	type SearchLink,
	type SectionHeaderNode,
	type ServiceAreaMapNode,
} from "@dinkuskit/blocks";

type PublicBlockNode =
	| CtaBandNode
	| DispatchNode
	| FactRailNode
	| GalleryHeroNode
	| GalleryLanesNode
	| LedgerCardsNode
	| PageHeroNode
	| SearchBoardNode
	| SectionHeaderNode
	| ServiceAreaMapNode;

type PublicRepeaterItem =
	| FactItem
	| GalleryLane
	| LedgerCard
	| LegendEntry
	| SearchLink;

describe("public package entrypoint", () => {
	it("exports safe URL handling and representative block value types", () => {
		const scalar = {
			_type: "dinkus.section-header",
			_key: "section-1",
			title: "A typed section",
		} satisfies SectionHeaderNode;
		const media = {
			_type: "dinkus.gallery-hero",
			image: "https://example.com/hero.jpg",
			imageAlt: "A typed hero",
		} satisfies GalleryHeroNode;
		const fact = {
			_key: "fact-1",
			label: "Coverage",
			value: "24/7",
		} satisfies FactItem;
		const repeater = {
			_type: "dinkus.fact-rail",
			facts: [fact],
		} satisfies FactRailNode;

		const nodes = [
			scalar,
			media,
			repeater,
		] satisfies PublicBlockNode[];
		const portableNodes: PortableTextNode[] = nodes;
		const items: PublicRepeaterItem[] = [fact];

		expect(portableNodes.map((node) => node._type)).toEqual([
			"dinkus.section-header",
			"dinkus.gallery-hero",
			"dinkus.fact-rail",
		]);
		expect(items).toEqual([fact]);
		expect(safeCtaHref("/contact")).toBe("/contact");
		expect(safeCtaHref("javascript:alert(1)")).toBeUndefined();
	});
});
