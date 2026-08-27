import assert from "node:assert/strict";
import { test } from "node:test";
import {
	findCommentViolations,
	findImportViolations,
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
			"src/features/page-hero/renderer.ts",
			'import { CTA_BAND_BLOCK_TYPE } from "../cta-band";',
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
			"src/features/page-hero/renderer.ts",
			'import { CTA_BAND_BLOCK_TYPE } from "../cta-band/contract";',
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
});

test("rejects line, block, documentation, HTML, and configuration comments", () => {
	assert.equal(findCommentViolations("src/example.ts", "// rationale\nexport {};").length, 1);
	assert.equal(findCommentViolations("src/example.ts", "/** rationale */\nexport {};").length, 1);
	assert.equal(findCommentViolations("src/example.astro", "<!-- rationale -->").length, 1);
	assert.equal(findCommentViolations("src/example.astro", "<style>/* rationale */</style>").length, 1);
	assert.equal(findCommentViolations("config.yml", "key: value # rationale").length, 1);
});
