import { expect, test } from "@playwright/test";

import {
	authenticate,
	expectBlockDeclared,
	modalField,
	publishPendingChanges,
	submitModalAndWaitForSave,
	waitForAdmin,
} from "./helpers";

const SEEDED_LIMIT = "6";
const EDITED_LIMIT = "1";
const INSERTED_LIMIT = "6";
const ADDED_TITLE = "Added notice is on the page";
const DRAFT_TITLE = "Draft notice stays off the page";

function queryCardWithLimit(
	content: Array<Record<string, unknown>>,
	limit: string,
) {
	return content.some(
		(block) => block?._type === "dinkus.query-card" && block.limit === limit,
	);
}

test("declares, inserts, edits, publishes, and lists a new record", async (
	{ page },
	testInfo,
) => {
	await authenticate(page);

	await expectBlockDeclared(page, testInfo, {
		type: "dinkus.query-card",
		label: "Query Card",
		category: "Sections",
	});

	await page.goto("/_emdash/admin/content/pages/query-card");
	await waitForAdmin(page);

	const editor = page.locator(".ProseMirror");
	await expect(editor).toBeVisible();
	await expect(editor).toContainText("Query Card");

	await editor.getByText("Query Card", { exact: true }).hover();
	await editor.getByRole("button", { name: "Edit" }).first().click();
	const editDialog = page.getByRole("dialog", { name: "Edit Query Card" });
	await expect(editDialog).toBeVisible();
	await expect(modalField(editDialog, "Source")).toHaveValue("notices");
	await expect(modalField(editDialog, "Limit")).toHaveValue(SEEDED_LIMIT);
	await modalField(editDialog, "Limit").fill(EDITED_LIMIT);
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.screenshot({
		path: testInfo.outputPath("admin-modal-edit-desktop.png"),
		fullPage: true,
	});
	await submitModalAndWaitForSave(
		page,
		(content) => queryCardWithLimit(content, EDITED_LIMIT),
		async () => {
			await editDialog.getByRole("button", { name: "Save" }).click();
		},
	);

	await page.reload();
	await waitForAdmin(page);
	const persistedEditor = page.locator(".ProseMirror");
	await persistedEditor.getByText("Query Card", { exact: true }).hover();
	await persistedEditor.getByRole("button", { name: "Edit" }).first().click();
	const persistedDialog = page.getByRole("dialog", { name: "Edit Query Card" });
	await expect(modalField(persistedDialog, "Limit")).toHaveValue(EDITED_LIMIT);
	await persistedDialog.getByRole("button", { name: "Cancel" }).click();

	await persistedEditor.click();
	await page.keyboard.press("End");
	await page.keyboard.press("ArrowRight");
	await page.keyboard.press("Enter");
	await page.keyboard.type("/query");

	const slashMenuItem = page.getByText(
		"A list of current records from one collection",
		{ exact: true },
	);
	await expect(slashMenuItem).toBeVisible();
	await slashMenuItem.click();

	const insertDialog = page.getByRole("dialog", { name: "Insert Query Card" });
	await modalField(insertDialog, "Source").fill("notices");
	await modalField(insertDialog, "Limit").fill(INSERTED_LIMIT);
	await page.screenshot({
		path: testInfo.outputPath("admin-modal-insert-desktop.png"),
		fullPage: true,
	});
	await submitModalAndWaitForSave(
		page,
		(content) =>
			queryCardWithLimit(content, EDITED_LIMIT) &&
			queryCardWithLimit(content, INSERTED_LIMIT),
		async () => {
			await insertDialog.getByRole("button", { name: "Insert" }).click();
		},
	);

	await page.reload();
	await waitForAdmin(page);
	await expect(page.locator(".ProseMirror").getByRole("button", { name: "Edit" })).toHaveCount(
		2,
	);
	await publishPendingChanges(page);
	await expect(page.getByRole("button", { name: "Unpublish" })).toBeVisible({
		timeout: 15_000,
	});

	await page.goto("/query-card");
	const rendered = page.locator('[data-dinkus-block="query-card"]');
	await expect(rendered).toHaveCount(2);
	await expect(rendered.nth(0).locator(".dinkus-query-card__card")).toHaveCount(1);
	await expect(rendered.nth(1).locator(".dinkus-query-card__card")).toHaveCount(2);
	await expect(
		rendered.nth(1).getByRole("heading", {
			name: "Before: Notice title is current",
		}),
	).toBeVisible();
	await expect(
		rendered.nth(1).getByRole("heading", { name: "Second current notice" }),
	).toBeVisible();
	await expect(
		rendered.nth(1).getByRole("link", { name: "Before: Notice title is current" }),
	).toHaveAttribute("href", "/field");
	await expect(
		rendered.getByRole("link", { name: "Second current notice" }),
	).toHaveCount(0);
	await expect(page.locator('a[href^="javascript:"]')).toHaveCount(0);
	await expect(page.getByText(DRAFT_TITLE)).toHaveCount(0);

	const created = await page.request.post("/_emdash/api/content/notices", {
		headers: { "X-EmDash-Request": "1" },
		data: {
			slug: "added-notice",
			status: "draft",
			data: {
				title: ADDED_TITLE,
				text: "This record was added after the page was published.",
				image: "/media/fixture/project-record.svg",
				link: "/proof",
			},
		},
	});
	const createdBody = await created.json();
	expect(created.status(), JSON.stringify(createdBody)).toBe(201);
	const createdId = createdBody?.data?.item?.id;
	expect(typeof createdId).toBe("string");
	const published = await page.request.post(
		`/_emdash/api/content/notices/${createdId}/publish`,
		{
			headers: { "X-EmDash-Request": "1" },
			data: {},
		},
	);
	expect(published.status(), await published.text()).toBe(200);

	const drafted = await page.request.post("/_emdash/api/content/notices", {
		headers: { "X-EmDash-Request": "1" },
		data: {
			slug: "draft-notice",
			status: "draft",
			data: {
				title: DRAFT_TITLE,
				text: "A draft is not a current record.",
				link: "/field",
			},
		},
	});
	expect(drafted.status(), await drafted.text()).toBe(201);

	await page.reload();
	const updated = page.locator('[data-dinkus-block="query-card"]');
	await expect(updated).toHaveCount(2);
	await expect(updated.nth(0).locator(".dinkus-query-card__card")).toHaveCount(1);
	await expect(updated.nth(1).locator(".dinkus-query-card__card")).toHaveCount(3);
	await expect(
		updated.nth(1).getByRole("link", { name: ADDED_TITLE }),
	).toHaveAttribute("href", "/proof");
	await expect(page.getByText(DRAFT_TITLE)).toHaveCount(0);
	await expect(page.locator('a[href^="javascript:"]')).toHaveCount(0);

	await page.setViewportSize({ width: 1280, height: 800 });
	await page.screenshot({
		path: testInfo.outputPath("public-list-desktop.png"),
		fullPage: true,
	});
	await page.setViewportSize({ width: 390, height: 844 });
	await page.screenshot({
		path: testInfo.outputPath("public-list-mobile.png"),
		fullPage: true,
	});
});
