import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * Latent-sink gate: raw HTML sinks are forbidden outside a reviewed
 * sanitizer module. The renderers escape by construction today; this gate
 * keeps a future refactor from quietly introducing a sink that stored
 * content can reach.
 *
 * Adding a sink requires listing its module in REVIEWED_SANITIZER_MODULES
 * in the same PR that reviews it — that list is deliberately empty now.
 */
const repoRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));

const SCANNED_ROOTS = ["src", "patterns", "tests/fixture-site/src"] as const;

const SCANNED_EXTENSIONS = [
	".astro",
	".ts",
	".tsx",
	".mts",
	".js",
	".mjs",
	".jsx",
] as const;

/** Repo-relative paths allowed to contain a raw HTML sink, post-review. */
const REVIEWED_SANITIZER_MODULES: readonly string[] = [];

const FORBIDDEN_SINKS = [
	"set:html",
	"is:raw",
	"innerHTML",
	"outerHTML",
	"insertAdjacentHTML",
	"document.write",
	"dangerouslySetInnerHTML",
] as const;

function walk(dir: string, files: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		if (entry === "node_modules" || entry.startsWith(".")) continue;
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) {
			walk(full, files);
			continue;
		}
		if (SCANNED_EXTENSIONS.some((extension) => full.endsWith(extension))) {
			files.push(full);
		}
	}
	return files;
}

describe("latent-sink gate", () => {
	const files = SCANNED_ROOTS.flatMap((root) => walk(join(repoRoot, root)));

	it("scans a non-empty source surface", () => {
		expect(files.length).toBeGreaterThan(10);
	});

	it("forbids raw HTML sinks outside reviewed sanitizer modules", () => {
		const violations: string[] = [];
		for (const file of files) {
			const repoPath = relative(repoRoot, file);
			if (REVIEWED_SANITIZER_MODULES.includes(repoPath)) continue;
			const source = readFileSync(file, "utf8");
			for (const sink of FORBIDDEN_SINKS) {
				let index = source.indexOf(sink);
				while (index !== -1) {
					const line = source.slice(0, index).split("\n").length;
					violations.push(`${repoPath}:${line} uses ${sink}`);
					index = source.indexOf(sink, index + sink.length);
				}
			}
		}
		expect(
			violations,
			"Raw HTML sinks are forbidden outside REVIEWED_SANITIZER_MODULES " +
				"(see this test). Route stored content through text rendering, or " +
				"add the module to the reviewed list in the same PR that reviews it.",
		).toEqual([]);
	});
});
