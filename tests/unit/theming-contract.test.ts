import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { DINKUS_THEME_TOKENS } from "@dinkuskit/blocks";

const rendererFiles = [
	["CtaBand.astro", "../../src/features/cta-band/renderer.astro"],
	["Dispatch.astro", "../../src/astro/Dispatch.astro"],
	["FactRail.astro", "../../src/features/fact-rail/renderer.astro"],
	["GalleryHero.astro", "../../src/features/gallery-hero/renderer.astro"],
	["GalleryLanes.astro", "../../src/astro/GalleryLanes.astro"],
	["LedgerCards.astro", "../../src/astro/LedgerCards.astro"],
	["PageHero.astro", "../../src/features/page-hero/renderer.astro"],
	["ProjectRecord.astro", "../../src/astro/ProjectRecord.astro"],
	["SearchBoard.astro", "../../src/astro/SearchBoard.astro"],
	["SectionHeader.astro", "../../src/astro/SectionHeader.astro"],
	["ServiceAreaMap.astro", "../../src/astro/ServiceAreaMap.astro"],
] as const;

const documentedTokens = Object.values(DINKUS_THEME_TOKENS);
const rendererSources = rendererFiles.map(([file, path]) => ({
	file,
	source: readFileSync(new URL(path, import.meta.url), "utf8"),
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

	it("keeps both hero action pairs on the approved shared URL policy", () => {
		for (const file of ["GalleryHero.astro", "PageHero.astro"]) {
			const source = rendererSources.find(
				(candidate) => candidate.file === file,
			)?.source;

			expect(source, file).toContain(
				'import { safeCtaHref } from "../../shared/links";',
			);
			expect(
				source?.match(/safeCtaHref\(node\.(?:primary|secondary)Href\)/g),
				file,
			).toEqual([
				"safeCtaHref(node.primaryHref)",
				"safeCtaHref(node.secondaryHref)",
			]);
			expect(source, file).not.toContain("features/cta-band");
		}
	});

	it("keeps Project Record color-only palette values independent", () => {
		const projectRecord = rendererSources.find(
			({ file }) => file === "ProjectRecord.astro",
		)?.source;

		expect(projectRecord).toContain(
			"--dinkus-project-record-ink: CanvasText",
		);
		expect(projectRecord).toContain(
			"--dinkus-project-record-signal: color-mix(",
		);
		expect(projectRecord).not.toContain(
			"--dinkus-project-record-ink: var(",
		);
		expect(projectRecord).not.toContain(
			"--dinkus-project-record-signal: var(",
		);
	});
});
