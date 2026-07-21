import { expect, test } from "@playwright/test";

import {
	authenticate,
	expectBlockDeclared,
	modalField,
	submitModalAndWaitForSave,
	waitForAdmin,
} from "./helpers";

const SEEDED_TITLE = "Before: Dispatch title is editable";
const EDITED_TITLE = "After: Dispatch title persisted";
const INSERTED_TITLE = "Inserted: Dispatch via slash menu";

test("declares, inserts, edits, persists, and renders a dispatch band", async (
	{ page },
	testInfo,
) => {
	await authenticate(page);

	await expectBlockDeclared(page, testInfo, {
		type: "dinkus.dispatch",
		label: "Dispatch",
		category: "Sections",
	});

	await page.goto("/_emdash/admin/content/pages/dispatch");
	await waitForAdmin(page);

	const editor = page.locator(".ProseMirror");
	await expect(editor).toBeVisible();
	await expect(editor).toContainText("Dispatch");
	await expect(editor).toContainText(SEEDED_TITLE);

	await editor.getByText("Dispatch", { exact: true }).hover();
	await editor.getByRole("button", { name: "Edit" }).first().click();
	const editDialog = page.getByRole("dialog", { name: "Edit Dispatch" });
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
	await persistedEditor.getByText("Dispatch", { exact: true }).hover();
	await persistedEditor.getByRole("button", { name: "Edit" }).first().click();
	const persistedDialog = page.getByRole("dialog", { name: "Edit Dispatch" });
	await expect(modalField(persistedDialog, "Title")).toHaveValue(EDITED_TITLE);
	await persistedDialog.getByRole("button", { name: "Cancel" }).click();

	await editor.click();
	await page.keyboard.press("End");
	await page.keyboard.press("ArrowRight");
	await page.keyboard.press("Enter");
	await page.keyboard.type("/dispatch");

	const slashMenuItem = page.getByText(
		"A contact band with a call to action and contact links",
		{ exact: true },
	);
	await expect(slashMenuItem).toBeVisible();
	await slashMenuItem.click();

	const insertDialog = page.getByRole("dialog", { name: "Insert Dispatch" });
	await modalField(insertDialog, "Kicker").fill("Slash-menu fixture");
	await modalField(insertDialog, "Title").fill(INSERTED_TITLE);
	await modalField(insertDialog, "Body").fill(
		"This dispatch band was inserted through the slash menu.",
	);
	await modalField(insertDialog, "CTA label").fill("Inserted CTA");
	await modalField(insertDialog, "CTA URL").fill("/inserted-cta");
	await modalField(insertDialog, "Phone").fill("tel:+15559990000");
	await modalField(insertDialog, "Email").fill("mailto:crew@example.com");
	await page.screenshot({
		path: testInfo.outputPath("admin-modal.png"),
		fullPage: true,
	});
	await submitModalAndWaitForSave(
		page,
		(content) => content.some((block) => block?.title === INSERTED_TITLE),
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
	await expect(reloadedEditor).toContainText(INSERTED_TITLE);
	await page.getByRole("button", { name: "Publish changes" }).click();
	await expect(page.getByRole("button", { name: "Unpublish" })).toBeVisible({
		timeout: 15_000,
	});

	await page.goto("/dispatch");
	const rendered = page.locator('[data-dinkus-block="dispatch"]');
	await expect(rendered).toHaveCount(2);
	await expect(rendered.nth(0).getByRole("heading", { level: 2 })).toHaveText(
		EDITED_TITLE,
	);
	await expect(
		rendered.nth(0).getByRole("link", { name: "tel:+15551234567" }),
	).toHaveAttribute("href", "tel:+15551234567");
	await expect(rendered.nth(1).getByRole("heading", { level: 2 })).toHaveText(
		INSERTED_TITLE,
	);
	await expect(
		rendered.nth(1).getByRole("link", { name: "Inserted CTA" }),
	).toHaveAttribute("href", "/inserted-cta");
	await expect(
		rendered.nth(1).getByRole("link", { name: "mailto:crew@example.com" }),
	).toHaveAttribute("href", "mailto:crew@example.com");
	await page.screenshot({
		path: testInfo.outputPath("rendered-blocks.png"),
		fullPage: true,
	});
});
