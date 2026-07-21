import { execFileSync } from "node:child_process";

const output = execFileSync("npm", ["pack", "--dry-run", "--json"], {
	encoding: "utf8",
});
const [pack] = JSON.parse(output);
const files = pack.files.map((file) => file.path).sort();
const forbidden = files.filter((file) =>
	/(^|\/)(tests|docs|scripts|node_modules|\.artifacts|uploads|test-results|playwright-report)(\/|$)/.test(
		file,
	),
);

if (forbidden.length > 0) {
	throw new Error(`Forbidden package files: ${forbidden.join(", ")}`);
}

for (const required of [
	"LICENSE",
	"README.md",
	"package.json",
	"src/index.ts",
	"src/links.ts",
	"src/types.ts",
	"src/astro/CtaBand.astro",
	"src/astro/index.ts",
]) {
	if (!files.includes(required)) {
		throw new Error(`Required package file is missing: ${required}`);
	}
}

console.log(files.join("\n"));
