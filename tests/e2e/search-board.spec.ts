import { expect, test } from "@playwright/test";

import {
	authenticate,
	expectBlockDeclared,
	modalField,
	submitModalAndWaitForSave,
	waitForAdmin,
} from "./helpers";

const SEEDED_TITLE = "Before: Search board title is editable";
const EDITED_TITLE = "After: Search board title persisted";
const INSERTED_TITLE = "Inserted: Search board via slash menu";

test("declares, inserts, edits, persists, and renders a search board", async (
	{ page },
	testInfo,
) => {
	await authenticate(page);

	await expectBlockDeclared(page, testInfo, {
		type: "dinkus.search-board",
		label: "Search Board",
		category: "Sections",
	});

	await page.goto("/_emdash/admin/content/pages/search-board");
	await waitForAdmin(page);

	const editor = page.locator(".ProseMirror");
	await expect(editor).toBeVisible();
	await expect(editor).toContainText("Search Board");
	await expect(editor).toContainText(SEEDED_TITLE);

	await editor.getByText("Search Board", { exact: true }).hover();
	await editor.getByRole("button", { name: "Edit" }).first().click();
	const editDialog = page.getByRole("dialog", { name: "Edit Search Board" });
	await expect(editDialog).toBeVisible();
	await expect(modalField(editDialog, "Title")).toHaveValue(SEEDED_TITLE);
	await modalField(editDialog, "Title").fill(EDITED_TITLE);
	await submitModalAndWaitForSave(
		page,
		(content) => content.some((block) => block?.title === EDITED_TITLE),
		async () => {
			await editDialog.getByRole("button", { name: "Save" }).click();
		},
	);

	await page.reload();
	await waitForAdmin(page);
	const persistedEditor = page.locator(".ProseMirror");
	await persistedEditor.getByText("Search Board", { exact: true }).hover();
	await persistedEditor.getByRole("button", { name: "Edit" }).first().click();
	const persistedDialog = page.getByRole("dialog", {
		name: "Edit Search Board",
	});
	await expect(modalField(persistedDialog, "Title")).toHaveValue(EDITED_TITLE);
	await persistedDialog.getByRole("button", { name: "Cancel" }).click();

	await editor.click();
	await page.keyboard.press("End");
	await page.keyboard.press("ArrowRight");
	await page.keyboard.press("Enter");
	await page.keyboard.type("/search");

	const slashMenuItem = page.getByText(
		"A titled board of plain-language links",
		{ exact: true },
	);
	await expect(slashMenuItem).toBeVisible();
	await slashMenuItem.click();

	const insertDialog = page.getByRole("dialog", {
		name: "Insert Search Board",
	});
	await modalField(insertDialog, "Title").fill(INSERTED_TITLE);
	await modalField(insertDialog, "Intro").fill(
		"This board was inserted through the slash menu.",
	);
	await insertDialog.getByRole("button", { name: "Add Link" }).first().click();
	await modalField(insertDialog, "Label").fill("Inserted phrase");
	await modalField(insertDialog, "Link URL").fill("/inserted-phrase");
	await page.screenshot({
		path: testInfo.outputPath("admin-modal.png"),
		fullPage: true,
	});
	await submitModalAndWaitForSave(
		page,
		(content) => content.some((block) => block?.title === INSERTED_TITLE),
		async () => {
			await insertDialog
				.getByRole("button", { name: "Insert", exact: true })
				.click();
		},
	);

	await page.reload();
	await waitForAdmin(page);
	const reloadedEditor = page.locator(".ProseMirror");
	await expect(
		reloadedEditor.getByRole("button", { name: "Edit" }),
	).toHaveCount(2);
	await expect(reloadedEditor).toContainText(INSERTED_TITLE);
	await page.getByRole("button", { name: "Publish changes" }).click();
	await expect(page.getByRole("button", { name: "Unpublish" })).toBeVisible({
		timeout: 15_000,
	});

	await page.goto("/search-board");
	const rendered = page.locator('[data-dinkus-block="search-board"]');
	await expect(rendered).toHaveCount(2);
	await expect(rendered.nth(0).getByRole("heading", { level: 2 })).toHaveText(
		EDITED_TITLE,
	);
	await expect(
		rendered.nth(0).getByRole("link", { name: "Land clearing near me" }),
	).toHaveAttribute("href", "/land");
	await expect(rendered.nth(1).getByRole("heading", { level: 2 })).toHaveText(
		INSERTED_TITLE,
	);
	await expect(
		rendered.nth(1).getByRole("link", { name: "Inserted phrase" }),
	).toHaveAttribute("href", "/inserted-phrase");
	await page.screenshot({
		path: testInfo.outputPath("rendered-blocks.png"),
		fullPage: true,
	});
});
