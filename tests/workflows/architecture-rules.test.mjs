import assert from "node:assert/strict";
import { test } from "node:test";
import {
	findCommentViolations,
	findImportViolations,
	findProofMediaViolations,
} from "../../scripts/architecture-rules.mjs";

test("accepts imports through feature and package public entries", () => {
	assert.deepEqual(
		findImportViolations(
			"src/astro/index.ts",
			'import CtaBand from "../features/cta-band/renderer.astro";',
		),
		[],
	);
	assert.deepEqual(
		findImportViolations(
			"src/astro/index.ts",
			'import SectionHeader from "../features/section-header/renderer.astro";',
		),
		[],
	);
	assert.deepEqual(
		findImportViolations(
			"tests/unit/consumer.test.ts",
			'import { CtaBandNode } from "@dinkuskit/blocks";',
		),
		[],
	);
	assert.deepEqual(
		findImportViolations(
			"src/features/cta-band/renderer.ts",
			'import { safeCtaHref } from "../../shared/links";',
		),
		[],
	);
	assert.deepEqual(
		findImportViolations(
			"src/features/gallery-hero/renderer.ts",
			'import { safeCtaHref } from "../../shared/links";',
		),
		[],
	);
	assert.deepEqual(
		findImportViolations(
			"src/features/gallery-hero/contract.ts",
			'import type { PortableTextNode } from "../../shared/portable-text";',
		),
		[],
	);
	assert.deepEqual(
		findImportViolations(
			"src/features/fact-rail/contract.ts",
			'import type { PortableTextNode } from "../../shared/portable-text";',
		),
		[],
	);
	assert.deepEqual(
		findImportViolations(
			"src/features/page-hero/renderer.ts",
			'import { CTA_BAND_BLOCK_TYPE } from "../cta-band";',
		),
		[],
	);
	assert.deepEqual(
		findImportViolations(
			"src/features/page-hero/renderer.ts",
			'import { safeCtaHref } from "../../shared/links";',
		),
		[],
	);
	assert.deepEqual(
		findImportViolations(
			"src/features/page-hero/contract.ts",
			'import type { PortableTextNode } from "../../shared/portable-text";',
		),
		[],
	);
	assert.deepEqual(
		findImportViolations(
			"src/features/section-header/contract.ts",
			'import type { PortableTextNode } from "../../shared/portable-text";',
		),
		[],
	);
});

test("rejects feature internals, deep package imports, and undeclared shared modules", () => {
	assert.equal(
		findImportViolations(
			"src/index.ts",
			'import CtaBand from "./features/cta-band/renderer.astro";',
		).length,
		1,
	);
	assert.equal(
		findImportViolations(
			"tests/unit/consumer.test.ts",
			'import { CtaBandNode } from "@dinkuskit/blocks/src/features/cta-band/contract";',
		).length,
		1,
	);
	assert.equal(
		findImportViolations(
			"src/features/cta-band/contract.ts",
			'import { DINKUS_THEME_TOKENS } from "../../theme";',
		).length,
		1,
	);
	assert.equal(
		findImportViolations(
			"src/features/gallery-hero/renderer.ts",
			'import { safeCtaHref } from "../../links";',
		).length,
		1,
	);
	assert.equal(
		findImportViolations(
			"src/features/fact-rail/contract.ts",
			'import type { FactRailNode } from "../../types";',
		).length,
		1,
	);
	assert.equal(
		findImportViolations(
			"src/features/fact-rail/renderer.ts",
			'import { safeCtaHref } from "../../shared/links";',
		).length,
		1,
	);
	assert.equal(
		findImportViolations(
			"src/features/page-hero/renderer.ts",
			'import { CTA_BAND_BLOCK_TYPE } from "../cta-band/contract";',
		).length,
		1,
	);
	assert.equal(
		findImportViolations(
			"src/features/page-hero/renderer.ts",
			'import { safeCtaHref } from "../../links";',
		).length,
		1,
	);
	assert.equal(
		findImportViolations(
			"src/features/section-header/contract.ts",
			'import type { SectionHeaderNode } from "../../types";',
		).length,
		1,
	);
	assert.equal(
		findImportViolations(
			"src/features/section-header/renderer.ts",
			'import { safeCtaHref } from "../../shared/links";',
		).length,
		1,
	);
});

test("accepts machine directives and comment-like strings, URLs, and regular expressions", () => {
	assert.deepEqual(
		findCommentViolations(
			"src/example.ts",
			'const url = "https://example.com/a//b";\nconst marker = "/* text */";\nconst pattern = /https?:\\/\\/example[.]com/;',
		),
		[],
	);
	assert.deepEqual(
		findCommentViolations("src/env.d.ts", '/// <reference types="astro/client" />'),
		[],
	);
	assert.deepEqual(
		findCommentViolations(
			"src/example.astro",
			'<a href="https://example.com/a//b">https://example.com/a//b</a>',
		),
		[],
	);
	assert.deepEqual(
		findCommentViolations(
			"src/example.astro",
			`<p>Visible // text and Quote: 'unfinished</p>`,
		),
		[],
	);
	assert.deepEqual(
		findCommentViolations(
			"src/example.astro",
			`<div data-copy="It's <!-- text -->">{(() => { return '/* text */'; })()}</div>`,
		),
		[],
	);
});

test("rejects line, block, documentation, HTML, and configuration comments", () => {
	assert.equal(findCommentViolations("src/example.ts", "// rationale\nexport {};").length, 1);
	assert.equal(findCommentViolations("src/example.ts", "/** rationale */\nexport {};").length, 1);
	assert.equal(findCommentViolations("src/example.astro", "<!-- rationale -->").length, 1);
	assert.equal(
		findCommentViolations(
			"src/example.astro",
			`<p>It's visible text.</p> <!-- rationale -->`,
		).length,
		1,
	);
	assert.equal(
		findCommentViolations(
			"src/example.astro",
			`<p>Quote: 'unfinished <!-- rationale --></p>`,
		).length,
		1,
	);
	assert.equal(
		findCommentViolations(
			"src/example.astro",
			`<div data-value={(() => { // rationale\n return "x"; })()}></div>`,
		).length,
		1,
	);
	assert.equal(findCommentViolations("src/example.astro", "<style>/* rationale */</style>").length, 1);
	assert.equal(
		findCommentViolations(
			"src/example.astro",
			`---\nconst value = 1; // rationale\n---\n<p>{value}</p>`,
		).length,
		1,
	);
	assert.equal(
		findCommentViolations(
			"src/example.astro",
			`<script>const value = 1; // rationale\n</script>`,
		).length,
		1,
	);
	assert.equal(findCommentViolations("config.yml", "key: value # rationale").length, 1);
});

test("rejects routine media under every retained proof root", () => {
	assert.deepEqual(
		findProofMediaViolations([
			"proof/browser/screenshot.jpg",
			".grilltrack/proof/cta-band/admin-modal.png",
			".grilltrack/proof/PROOF.md",
			".grilltrack/work/candidate.png",
			"tests/fixture-site/public/media/fixture/project-record.svg",
		]),
		[
			{
				path: ".grilltrack/proof/cta-band/admin-modal.png",
				reason: "routine proof media must use immutable release assets referenced from text proof",
			},
			{
				path: "proof/browser/screenshot.jpg",
				reason: "routine proof media must use immutable release assets referenced from text proof",
			},
		],
	);
});
