import { expect, test } from "@playwright/test";

const CANARY_HEADING = "Canary: one modal edit, one save path";

async function authenticate(page: import("@playwright/test").Page) {
	await page.goto("/_emdash/api/setup/dev-bypass?redirect=/_emdash/api/auth/me");
	await page.waitForURL((url) => url.pathname === "/_emdash/api/auth/me");

	const dismissed = await page.request.post("/_emdash/api/auth/me", {
		headers: { "X-EmDash-Request": "1" },
		data: { action: "dismissWelcome" },
	});
	expect(dismissed.status()).toBe(200);
}

async function waitForAdmin(page: import("@playwright/test").Page) {
	await page.waitForSelector('aside[aria-label="Admin navigation"]', {
		timeout: 30_000,
	});
	await page.waitForSelector("astro-island:not([ssr])", {
		timeout: 30_000,
	});
}

function headingField(dialog: import("@playwright/test").Locator) {
	return dialog
		.getByText("Heading", { exact: true })
		.locator("..")
		.getByRole("textbox");
}

test("EmDash compatibility: a block edit does not trigger competing manual saves", async ({
	page,
}) => {
	await authenticate(page);

	const writes: Array<Record<string, unknown>> = [];
	page.on("request", (request) => {
		if (
			request.method() !== "PUT" ||
			!new URL(request.url()).pathname.includes("/content/pages/")
		) {
			return;
		}
		const payload = request.postDataJSON();
		if (payload && typeof payload === "object") {
			writes.push(payload as Record<string, unknown>);
		}
	});

	await page.goto("/_emdash/admin/content/pages/home");
	await waitForAdmin(page);

	const editor = page.locator(".ProseMirror");
	await editor.getByText("CTA Band", { exact: true }).first().hover();
	await editor.getByRole("button", { name: "Edit" }).first().click();

	const dialog = page.getByRole("dialog", { name: "Edit CTA Band" });
	await headingField(dialog).fill(CANARY_HEADING);
	const saved = page.waitForResponse(
		(response) => {
			if (
				response.request().method() !== "PUT" ||
				!new URL(response.url()).pathname.includes("/content/pages/")
			) {
				return false;
			}
			const payload = response.request().postDataJSON();
			return payload?.data?.content?.some(
				(block: { heading?: string }) => block.heading === CANARY_HEADING,
			);
		},
		{ timeout: 15_000 },
	);
	await dialog.getByRole("button", { name: "Save" }).click();
	await saved;
	await page.waitForTimeout(500);

	await page.reload();
	await waitForAdmin(page);
	await editor.getByText("CTA Band", { exact: true }).first().hover();
	await editor.getByRole("button", { name: "Edit" }).first().click();
	const persistedHeading = await headingField(
		page.getByRole("dialog", { name: "Edit CTA Band" }),
	).inputValue();

	test.fail(
		true,
		"EmDash 0.29.0 dispatches the block modal submit to the surrounding content form",
	);
	expect({
		persistedHeading,
		manualWrites: writes.filter((payload) => payload.skipRevision !== true),
	}).toEqual({
		persistedHeading: CANARY_HEADING,
		manualWrites: [],
	});
});
