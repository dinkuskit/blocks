import { describe, expect, it } from "vitest";

import {
	queryCardLimit,
	queryCardSource,
	readQueryCardRecords,
} from "@dinkuskit/blocks";

describe("query card record reading", () => {
	it("keeps one published-shaped card and drops empty rows", () => {
		expect(
			readQueryCardRecords([
				{
					id: "current",
					data: {
						title: "Current notice",
						text: "Visible text",
						image: "/media/fixture/project-record.svg",
						link: "/field",
					},
				},
				{
					id: "linked-image",
					data: {
						title: "Image object",
						text: "Uses src",
						image: { src: "https://example.com/card.jpg", alt: "Card" },
						link: "https://example.com/card",
					},
				},
				{
					id: "media-seed",
					data: {
						title: "Seed media",
						image: {
							$media: {
								url: "https://example.com/seed.jpg",
							},
							alt: "Seed",
						},
						link: "javascript:alert(1)",
					},
				},
				{
					id: "text-only",
					data: {
						text: "No title still shows",
						link: "/should-not-link",
					},
				},
				{
					id: "empty",
					data: {
						image: "/media/fixture/project-record.svg",
						link: "/field",
					},
				},
				{
					id: "blank",
					data: {},
				},
			]),
		).toEqual([
			{
				id: "current",
				title: "Current notice",
				text: "Visible text",
				imageSrc: "/media/fixture/project-record.svg",
				imageAlt: undefined,
				href: "/field",
			},
			{
				id: "linked-image",
				title: "Image object",
				text: "Uses src",
				imageSrc: "https://example.com/card.jpg",
				imageAlt: "Card",
				href: "https://example.com/card",
			},
			{
				id: "media-seed",
				title: "Seed media",
				text: undefined,
				imageSrc: "https://example.com/seed.jpg",
				imageAlt: "Seed",
				href: undefined,
			},
			{
				id: "text-only",
				title: undefined,
				text: "No title still shows",
				imageSrc: undefined,
				imageAlt: undefined,
				href: undefined,
			},
		]);
	});

	it("accepts one collection slug and one bounded limit", () => {
		expect(queryCardSource(" notices ")).toBe("notices");
		expect(queryCardSource("pages")).toBe("pages");
		expect(queryCardSource("../pages")).toBeUndefined();
		expect(queryCardSource("")).toBeUndefined();
		expect(queryCardSource("has space")).toBeUndefined();
		expect(queryCardLimit("6")).toBe(6);
		expect(queryCardLimit(1)).toBe(1);
		expect(queryCardLimit("24")).toBe(24);
		expect(queryCardLimit("0")).toBeUndefined();
		expect(queryCardLimit("25")).toBeUndefined();
		expect(queryCardLimit("6abc")).toBeUndefined();
		expect(queryCardLimit("")).toBeUndefined();
	});
});
