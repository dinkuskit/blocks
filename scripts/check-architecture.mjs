import { resolve } from "node:path";
import {
	repositoryCommentViolations,
	repositoryImportViolations,
	repositoryProofMediaViolations,
	validateFeatureMap,
} from "./architecture-rules.mjs";

const root = resolve(import.meta.dirname, "..");
const requested = process.argv[2] ?? "all";
const supported = new Set(["all", "comments", "imports", "map", "media"]);

if (!supported.has(requested)) {
	console.error(`Unknown architecture check: ${requested}`);
	process.exit(2);
}

const failures = [];
if (requested === "all" || requested === "map") {
	for (const error of validateFeatureMap(root)) failures.push(`FEATURE_MAP.md: ${error}`);
}
if (requested === "all" || requested === "imports") {
	for (const violation of repositoryImportViolations(root)) {
		failures.push(`${violation.path}: ${violation.specifier}: ${violation.reason}`);
	}
}
if (requested === "all" || requested === "comments") {
	for (const violation of repositoryCommentViolations(root)) {
		failures.push(`${violation.path}:${violation.line}: human-authored comment ${JSON.stringify(violation.text)}`);
	}
}
if (requested === "all" || requested === "media") {
	for (const violation of repositoryProofMediaViolations(root)) {
		failures.push(`${violation.path}: ${violation.reason}`);
	}
}

if (failures.length > 0) {
	console.error(failures.join("\n"));
	process.exit(1);
}

console.log(`architecture ${requested} check passed`);
