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
	type ProjectRecordLink,
	type ProjectRecordNode,
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
	| ProjectRecordNode
	| SearchBoardNode
	| SectionHeaderNode
	| ServiceAreaMapNode;

type PublicRepeaterItem =
	| FactItem
	| GalleryLane
	| LedgerCard
	| LegendEntry
	| ProjectRecordLink
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
		const projectLink = {
			_key: "project-proof",
			label: "Read the proof",
			href: "/proof",
		} satisfies ProjectRecordLink;
		const projectRecord = {
			_type: "dinkus.project-record",
			recordId: "typed-record",
			title: "A typed project record",
			proofHeadline: "The contract is public.",
			links: [projectLink],
			nextTitle: "Next typed project",
			nextHref: "/next",
		} satisfies ProjectRecordNode;

		const nodes = [
			scalar,
			media,
			repeater,
			projectRecord,
		] satisfies PublicBlockNode[];
		const portableNodes: PortableTextNode[] = nodes;
		const items: PublicRepeaterItem[] = [fact, projectLink];

		expect(portableNodes.map((node) => node._type)).toEqual([
			"dinkus.section-header",
			"dinkus.gallery-hero",
			"dinkus.fact-rail",
			"dinkus.project-record",
		]);
		expect(items).toEqual([fact, projectLink]);
		expect(safeCtaHref("/contact")).toBe("/contact");
		expect(safeCtaHref("javascript:alert(1)")).toBeUndefined();
	});
});
