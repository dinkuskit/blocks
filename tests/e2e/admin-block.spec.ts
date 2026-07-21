import { expect, test } from "@playwright/test";

import {
	authenticate,
	expectBlockDeclared,
	modalField,
	submitModalAndWaitForSave,
	waitForAdmin,
} from "./helpers";

const SEEDED_HEADING = "Before: Portable Text fields are editable";
const EDITED_HEADING = "After: Portable Text fields persisted";
const INSERTED_HEADING = "Inserted: Slash menu block persisted";

test("declares, inserts, edits, persists, and renders a CTA band", async (
	{ page },
	testInfo,
) => {
	await authenticate(page);

	await expectBlockDeclared(page, testInfo, {
		type: "dinkus.cta-band",
		label: "CTA Band",
		category: "Sections",
	});

	await page.goto("/_emdash/admin/content/pages/home");
	await waitForAdmin(page);

	const editor = page.locator(".ProseMirror");
	await expect(editor).toBeVisible();
	await expect(editor).toContainText("CTA Band");
	await expect(editor).toContainText(SEEDED_HEADING);

	await editor.getByText("CTA Band", { exact: true }).hover();
	await editor.getByRole("button", { name: "Edit" }).first().click();
	const editDialog = page.getByRole("dialog", { name: "Edit CTA Band" });
	await expect(editDialog).toBeVisible();
	await expect(modalField(editDialog, "Heading")).toHaveValue(SEEDED_HEADING);
	await modalField(editDialog, "Heading").fill(EDITED_HEADING);
	await submitModalAndWaitForSave(
		page,
		(content) => content.some((block) => block?.heading === EDITED_HEADING),
		async () => {
			await editDialog.getByRole("button", { name: "Save" }).click();
		},
	);

	await page.reload();
	await waitForAdmin(page);
	const persistedEditor = page.locator(".ProseMirror");
	await persistedEditor.getByText("CTA Band", { exact: true }).hover();
	await persistedEditor.getByRole("button", { name: "Edit" }).first().click();
	const persistedDialog = page.getByRole("dialog", {
		name: "Edit CTA Band",
	});
	await expect(modalField(persistedDialog, "Heading")).toHaveValue(
		EDITED_HEADING,
	);
	await persistedDialog.getByRole("button", { name: "Cancel" }).click();

	await editor.click();
	await page.keyboard.press("End");
	await page.keyboard.press("ArrowRight");
	await page.keyboard.press("Enter");
	await page.keyboard.type("/cta");

	const slashMenuItem = page.getByText(
		"A focused call-to-action section",
		{ exact: true },
	);
	await expect(slashMenuItem).toBeVisible();
	await page.screenshot({
		path: testInfo.outputPath("slash-menu.png"),
		fullPage: true,
	});
	await slashMenuItem.click();

	const insertDialog = page.getByRole("dialog", { name: "Insert CTA Band" });
	await modalField(insertDialog, "Eyebrow").fill("S1 compatibility spike");
	await modalField(insertDialog, "Heading").fill(INSERTED_HEADING);
	await modalField(insertDialog, "Body").fill(
		"This block was inserted through the slash menu.",
	);
	await modalField(insertDialog, "CTA label").fill("Fixture link");
	await modalField(insertDialog, "CTA URL").fill("/inserted");
	await page.screenshot({
		path: testInfo.outputPath("admin-modal.png"),
		fullPage: true,
	});
	await submitModalAndWaitForSave(
		page,
		(content) => content.some((block) => block?.heading === INSERTED_HEADING),
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
	await expect(reloadedEditor).toContainText(INSERTED_HEADING);
	await page.getByRole("button", { name: "Publish changes" }).click();
	await expect(page.getByRole("button", { name: "Unpublish" })).toBeVisible({
		timeout: 15_000,
	});

	await page.goto("/");
	const rendered = page.locator('[data-dinkus-block="cta-band"]');
	await expect(rendered).toHaveCount(2);
	await expect(rendered.nth(0).getByRole("heading")).toHaveText(
		EDITED_HEADING,
	);
	await expect(rendered.nth(1).getByRole("heading")).toHaveText(
		INSERTED_HEADING,
	);
	await expect(rendered.nth(1).getByRole("link")).toHaveAttribute(
		"href",
		"/inserted",
	);
	await page.screenshot({
		path: testInfo.outputPath("rendered-blocks.png"),
		fullPage: true,
	});
});
