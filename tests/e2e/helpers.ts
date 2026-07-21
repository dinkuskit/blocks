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

	// Heal the upstream block-modal double-save race (dinkuskit/blocks#2; fix
	// filed upstream as emdash-cms/emdash#2160). The Block Kit modal is a React
	// descendant of the page form even when portaled, so one Save click invokes
	// the submit handler twice — a fresh PUT and a stale pre-edit PUT race, and
	// under a loaded runner the stale write can land last and silently revert
	// the edit. The upstream one-line fix (stopPropagation in the modal submit
	// handler) is not in a released version yet, so EmDash 0.29.0 that this
	// package pins is still affected. Heal it here until the pin includes the
	// fix: the debounced autosave is a single serialized writer of the live
	// ProseMirror doc, so nudging the document forces one more fresh write that
	// is scheduled after — and so lands after — both modal PUTs, deterministically
	// winning. Remove this heal once the emdash pin includes emdash-cms/emdash#2160.
	//
	// The nudge appends a throwaway empty paragraph: a guaranteed net doc change
	// (so autosave always fires) that carries no block, so it is invisible to
	// every block-count and render assertion. We click the editor's bottom
	// padding rather than its centre so the caret lands after the last block —
	// never selecting a block atom that a keypress could replace.
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
