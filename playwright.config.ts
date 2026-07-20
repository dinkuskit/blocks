import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, devices } from "@playwright/test";

const runId =
	process.env.DINKUS_E2E_RUN_ID ??
	new Date().toISOString().replaceAll(/[:.]/g, "-");
const runRoot = resolve(
	"tests/fixture-site/.artifacts/e2e",
	runId,
);
const runtimeRoot = resolve(
	"tests/fixture-site/.artifacts/runtime",
	runId,
);
const fixtureUrl = "http://127.0.0.1:46371";

mkdirSync(runRoot, { recursive: true });
mkdirSync(runtimeRoot, { recursive: true });

export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: false,
	workers: 1,
	forbidOnly: Boolean(process.env.CI),
	retries: 0,
	timeout: 60_000,
	outputDir: resolve(runRoot, "results"),
	reporter: [
		["list"],
		["html", { outputFolder: resolve(runRoot, "report"), open: "never" }],
	],
	use: {
		baseURL: fixtureUrl,
		screenshot: "on",
		trace: "on",
		video: "retain-on-failure",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer: {
		command:
			"pnpm --dir tests/fixture-site dev --host 127.0.0.1 --port 46371 --ignore-lock",
		url: fixtureUrl,
		reuseExistingServer: false,
		timeout: 120_000,
		env: {
			ASTRO_DEV_BACKGROUND: "0",
			DINKUS_FIXTURE_DB_URL: `file:${resolve(runtimeRoot, "data.db")}`,
			DINKUS_FIXTURE_UPLOADS_DIR: resolve(runtimeRoot, "uploads"),
		},
	},
});
