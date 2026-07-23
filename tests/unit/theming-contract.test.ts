import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { DINKUS_THEME_TOKENS } from "@dinkuskit/blocks";

const rendererFiles = [
	"CtaBand.astro",
	"Dispatch.astro",
	"FactRail.astro",
	"GalleryHero.astro",
	"GalleryLanes.astro",
	"LedgerCards.astro",
	"PageHero.astro",
	"ProjectRecord.astro",
	"SearchBoard.astro",
	"SectionHeader.astro",
	"ServiceAreaMap.astro",
] as const;

const documentedTokens = Object.values(DINKUS_THEME_TOKENS);
const rendererSources = rendererFiles.map((file) => ({
	file,
	source: readFileSync(new URL(`../../src/astro/${file}`, import.meta.url), "utf8"),
}));

describe("renderer theming contract", () => {
	it("keeps every renderer in the public low-priority layer with token hooks", () => {
		for (const { file, source } of rendererSources) {
			expect(source, file).toContain("@layer dinkus-blocks");
			expect(source, file).toContain("data-dinkus-block=");
			expect(source, file).toContain("var(--dinkus-");
			expect(
				documentedTokens.some((token) => source.includes(token)),
				`${file} must consume at least one documented shared token`,
			).toBe(true);
		}
	});

	it("exports unique documented token names that renderers consume", () => {
		const combinedSources = rendererSources
			.map(({ source }) => source)
			.join("\n");
		const readme = readFileSync(new URL("../../README.md", import.meta.url), "utf8");

		expect(new Set(documentedTokens).size).toBe(documentedTokens.length);
		for (const token of documentedTokens) {
			expect(token).toMatch(/^--dinkus-[a-z][a-z-]+$/);
			expect(combinedSources, token).toContain(token);
			expect(readme, token).toContain(token);
		}
	});
});
