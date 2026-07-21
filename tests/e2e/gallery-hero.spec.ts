import { expect, test } from "@playwright/test";

import {
	authenticate,
	expectBlockDeclared,
	modalField,
	submitModalAndWaitForSave,
	waitForAdmin,
} from "./helpers";

const SEEDED_HEADLINE = "Before: Gallery hero headline is editable";
const EDITED_HEADLINE = "After: Gallery hero headline persisted";
const INSERTED_HEADLINE = "Inserted: Gallery hero via slash menu";

test("declares, inserts, edits, persists, and renders a gallery hero", async (
	{ page },
	testInfo,
) => {
	await authenticate(page);

	await expectBlockDeclared(page, testInfo, {
		type: "dinkus.gallery-hero",
		label: "Gallery Hero",
		category: "Sections",
	});

	await page.goto("/_emdash/admin/content/pages/gallery-hero");
	await waitForAdmin(page);

	const editor = page.locator(".ProseMirror");
	await expect(editor).toBeVisible();
	await expect(editor).toContainText("Gallery Hero");
	await expect(editor).toContainText(SEEDED_HEADLINE);

	await editor.getByText("Gallery Hero", { exact: true }).hover();
	await editor.getByRole("button", { name: "Edit" }).first().click();
	const editDialog = page.getByRole("dialog", { name: "Edit Gallery Hero" });
	await expect(editDialog).toBeVisible();
	await expect(modalField(editDialog, "Headline")).toHaveValue(
		SEEDED_HEADLINE,
	);
	await modalField(editDialog, "Headline").fill(EDITED_HEADLINE);
	await submitModalAndWaitForSave(
		page,
		(content) => content.some((block) => block?.headline === EDITED_HEADLINE),
		async () => {
			await editDialog.getByRole("button", { name: "Save" }).click();
		},
	);

	await page.reload();
	await waitForAdmin(page);
	const persistedEditor = page.locator(".ProseMirror");
	await persistedEditor.getByText("Gallery Hero", { exact: true }).hover();
	await persistedEditor.getByRole("button", { name: "Edit" }).first().click();
	const persistedDialog = page.getByRole("dialog", {
		name: "Edit Gallery Hero",
	});
	await expect(modalField(persistedDialog, "Headline")).toHaveValue(
		EDITED_HEADLINE,
	);
	await persistedDialog.getByRole("button", { name: "Cancel" }).click();

	await editor.click();
	await page.keyboard.press("End");
	await page.keyboard.press("ArrowRight");
	await page.keyboard.press("Enter");
	await page.keyboard.type("/gallery");

	const slashMenuItem = page.getByText(
		"Hero with a large image, headline, deck, and calls to action",
		{ exact: true },
	);
	await expect(slashMenuItem).toBeVisible();
	await slashMenuItem.click();

	const insertDialog = page.getByRole("dialog", {
		name: "Insert Gallery Hero",
	});
	await modalField(insertDialog, "Eyebrow").fill("Slash-menu fixture");
	await modalField(insertDialog, "Headline").fill(INSERTED_HEADLINE);
	await modalField(insertDialog, "Deck").fill(
		"This hero was inserted through the slash menu.",
	);
	await modalField(insertDialog, "Primary CTA label").fill("Primary fixture");
	await modalField(insertDialog, "Primary CTA URL").fill("/inserted-primary");
	await page.screenshot({
		path: testInfo.outputPath("admin-modal.png"),
		fullPage: true,
	});
	await submitModalAndWaitForSave(
		page,
		(content) =>
			content.some((block) => block?.headline === INSERTED_HEADLINE),
		async () => {
			await insertDialog.getByRole("button", { name: "Insert" }).click();
		},
	);

	await page.reload();
	await waitForAdmin(page);
	const reloadedEditor = page.locator(".ProseMirror");
	await expect(
		reloadedEditor.getByRole("button", { name: "Edit" }),
	).toHaveCount(2);
	await expect(reloadedEditor).toContainText(INSERTED_HEADLINE);
	await page.getByRole("button", { name: "Publish changes" }).click();
	await expect(page.getByRole("button", { name: "Unpublish" })).toBeVisible({
		timeout: 15_000,
	});

	await page.goto("/gallery-hero");
	const rendered = page.locator('[data-dinkus-block="gallery-hero"]');
	await expect(rendered).toHaveCount(2);
	await expect(rendered.nth(0).getByRole("heading", { level: 1 })).toHaveText(
		EDITED_HEADLINE,
	);
	await expect(rendered.nth(1).getByRole("heading", { level: 1 })).toHaveText(
		INSERTED_HEADLINE,
	);
	await expect(
		rendered.nth(1).getByRole("link", { name: "Primary fixture" }),
	).toHaveAttribute("href", "/inserted-primary");
	await page.screenshot({
		path: testInfo.outputPath("rendered-blocks.png"),
		fullPage: true,
	});
});
