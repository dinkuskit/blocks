import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import { dinkusBlocks } from "@dinkuskit/blocks";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";

const databaseUrl =
	process.env.DINKUS_FIXTURE_DB_URL ?? "file:./.artifacts/dev/data.db";
const uploadsDirectory =
	process.env.DINKUS_FIXTURE_UPLOADS_DIR ?? "./.artifacts/dev/uploads";

export default defineConfig({
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
	integrations: [
		react(),
		emdash({
			database: sqlite({ url: databaseUrl }),
			storage: local({
				directory: uploadsDirectory,
				baseUrl: "/_emdash/api/media/file",
			}),
			plugins: [dinkusBlocks()],
		}),
	],
	devToolbar: { enabled: false },
});
