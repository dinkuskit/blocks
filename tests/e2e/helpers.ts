import { expect, type Locator, type Page, type TestInfo } from "@playwright/test";

export async function authenticate(page: Page) {
	await page.goto(
		"/_emdash/api/setup/dev-bypass?redirect=/_emdash/api/auth/me",
	);
	await page.waitForURL((url) => url.pathname === "/_emdash/api/auth/me");

	const dismissed = await page.request.post("/_emdash/api/auth/me", {
		headers: { "X-EmDash-Request": "1" },
		data: { action: "dismissWelcome" },
	});
	expect(dismissed.status()).toBe(200);
}

export async function waitForAdmin(page: Page) {
	await page.waitForSelector('aside[aria-label="Admin navigation"]', {
		timeout: 30_000,
	});
	await page.waitForSelector("astro-island:not([ssr])", {
		timeout: 30_000,
	});
}

export async function expectBlockDeclared(
	page: Page,
	testInfo: TestInfo,
	block: { type: string; label: string; category: string },
) {
	const manifestResponse = await page.request.get("/_emdash/api/manifest");
	expect(manifestResponse.ok()).toBe(true);
	const manifest = await manifestResponse.json();
	const plugins = manifest.plugins ?? manifest.data?.plugins;
	const plugin = Array.isArray(plugins)
		? plugins.find((candidate) => candidate.id === "dinkus-blocks")
		: plugins?.["dinkus-blocks"];

	expect(plugin).toBeDefined();
	expect(plugin.portableTextBlocks).toEqual(
		expect.arrayContaining([expect.objectContaining(block)]),
	);
	await testInfo.attach("manifest.json", {
		body: JSON.stringify(plugin, null, 2),
		contentType: "application/json",
	});
}

function matchingContentPut(
	contentMatches: (content: Array<Record<string, unknown>>) => boolean,
) {
	return (candidate: import("@playwright/test").Response) => {
		if (candidate.request().method() !== "PUT") return false;
		if (!new URL(candidate.url()).pathname.includes("/content/pages/")) {
			return false;
		}
		const payload = candidate.request().postDataJSON();
		const content = payload?.data?.content;
		return Array.isArray(content) && contentMatches(content);
	};
}

export async function submitModalAndWaitForSave(
	page: Page,
	contentMatches: (content: Array<Record<string, unknown>>) => boolean,
	mutate: () => Promise<void>,
) {
	const responsePromise = page.waitForResponse(
		matchingContentPut(contentMatches),
		{ timeout: 15_000 },
	);
	await mutate();
	const response = await responsePromise;
	expect(response.ok()).toBe(true);
	await expect(page.getByRole("button", { name: "Saved" }).first()).toBeVisible({
		timeout: 15_000,
	});
	await forceFreshAutosaveAfterEmdashIssue2160ModalSubmitRace(
		page,
		contentMatches,
	);
}

async function forceFreshAutosaveAfterEmdashIssue2160ModalSubmitRace(
	page: Page,
	contentMatches: (content: Array<Record<string, unknown>>) => boolean,
) {
	const autosave = page.waitForResponse(matchingContentPut(contentMatches), {
		timeout: 15_000,
	});
	const editor = page.locator(".ProseMirror");
	const box = await editor.boundingBox();
	await editor.click({
		position: { x: 12, y: Math.max((box?.height ?? 24) - 8, 12) },
	});
	await page.keyboard.press("End");
	await page.keyboard.press("Enter");
	const autosaveResponse = await autosave;
	expect(autosaveResponse.ok()).toBe(true);
}

export function modalField(dialog: Locator, label: string) {
	return dialog
		.getByText(label, { exact: true })
		.locator("..")
		.getByRole("textbox");
}
