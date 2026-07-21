import { expect, test } from "@playwright/test";

import {
	authenticate,
	expectBlockDeclared,
	modalField,
	submitModalAndWaitForSave,
	waitForAdmin,
} from "./helpers";

const SEEDED_LABEL = "Before: Gallery lane label is editable";
const EDITED_LABEL = "After: Gallery lane label persisted";

type LaneRow = { label?: unknown };

function laneWithLabel(
	content: Array<Record<string, unknown>>,
	label: string,
) {
	return content.some(
		(block) =>
			block?._type === "dinkus.gallery-lanes" &&
			Array.isArray(block.lanes) &&
			(block.lanes as LaneRow[]).some((lane) => lane?.label === label),
	);
}

test("declares, inserts, edits, persists, and renders gallery lanes", async (
	{ page },
	testInfo,
) => {
	await authenticate(page);

	await expectBlockDeclared(page, testInfo, {
		type: "dinkus.gallery-lanes",
		label: "Gallery Lanes",
		category: "Sections",
	});

	await page.goto("/_emdash/admin/content/pages/gallery-lanes");
	await waitForAdmin(page);

	const editor = page.locator(".ProseMirror");
	await expect(editor).toBeVisible();
	await expect(editor).toContainText("Gallery Lanes");

	await editor.getByText("Gallery Lanes", { exact: true }).hover();
	await editor.getByRole("button", { name: "Edit" }).first().click();
	const editDialog = page.getByRole("dialog", { name: "Edit Gallery Lanes" });
	await expect(editDialog).toBeVisible();

	// Seeded repeater lanes are titled by their first text sub-field (label).
	await editDialog.getByText(SEEDED_LABEL, { exact: true }).click();
	await expect(modalField(editDialog, "Label")).toHaveValue(SEEDED_LABEL);
	await modalField(editDialog, "Label").fill(EDITED_LABEL);
	await page.screenshot({
		path: testInfo.outputPath("admin-modal-edit.png"),
		fullPage: true,
	});
	await submitModalAndWaitForSave(
		page,
		(content) => laneWithLabel(content, EDITED_LABEL),
		async () => {
			await editDialog.getByRole("button", { name: "Save" }).click();
		},
	);

	await page.reload();
	await waitForAdmin(page);
	const persistedEditor = page.locator(".ProseMirror");
	await persistedEditor.getByText("Gallery Lanes", { exact: true }).hover();
	await persistedEditor.getByRole("button", { name: "Edit" }).first().click();
	const persistedDialog = page.getByRole("dialog", {
		name: "Edit Gallery Lanes",
	});
	await persistedDialog.getByText(EDITED_LABEL, { exact: true }).click();
	await expect(modalField(persistedDialog, "Label")).toHaveValue(EDITED_LABEL);
	await persistedDialog.getByRole("button", { name: "Cancel" }).click();

	await editor.click();
	await page.keyboard.press("End");
	await page.keyboard.press("ArrowRight");
	await page.keyboard.press("Enter");
	await page.keyboard.type("/gallery");

	const slashMenuItem = page.getByText(
		"Linked image lanes with a label and meta line",
		{ exact: true },
	);
	await expect(slashMenuItem).toBeVisible();
	await slashMenuItem.click();

	const insertDialog = page.getByRole("dialog", {
		name: "Insert Gallery Lanes",
	});
	await insertDialog.getByRole("button", { name: "Add Lane" }).first().click();
	await modalField(insertDialog, "Label").fill("Inserted lane");
	await modalField(insertDialog, "Meta").fill("Measured on the property");
	await modalField(insertDialog, "Link URL").fill("/inserted-lane");
	await modalField(insertDialog, "Image URL").fill("/media/fixture/lane-new.jpg");
	await page.screenshot({
		path: testInfo.outputPath("admin-modal-insert.png"),
		fullPage: true,
	});
	await submitModalAndWaitForSave(
		page,
		(content) => laneWithLabel(content, "Inserted lane"),
		async () => {
			// exact: the new lane's collapsible card title button is named
			// "Inserted lane", whose text contains "Insert".
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
	await page.getByRole("button", { name: "Publish changes" }).click();
	await expect(page.getByRole("button", { name: "Unpublish" })).toBeVisible({
		timeout: 15_000,
	});

	await page.goto("/gallery-lanes");
	const rendered = page.locator('[data-dinkus-block="gallery-lanes"]');
	await expect(rendered).toHaveCount(2);

	const seededLanes = rendered.nth(0).locator(".dinkus-gallery-lanes__lane");
	await expect(seededLanes).toHaveCount(2);
	await expect(
		seededLanes.nth(0).locator(".dinkus-gallery-lanes__label"),
	).toHaveText(EDITED_LABEL);
	await expect(seededLanes.nth(0)).toHaveAttribute("href", "/land");
	await expect(
		seededLanes.nth(0).locator(".dinkus-gallery-lanes__img"),
	).toHaveAttribute("src", "/media/fixture/lane-land.jpg");

	const insertedLanes = rendered.nth(1).locator(".dinkus-gallery-lanes__lane");
	await expect(insertedLanes).toHaveCount(1);
	await expect(
		insertedLanes.nth(0).locator(".dinkus-gallery-lanes__label"),
	).toHaveText("Inserted lane");
	await expect(insertedLanes.nth(0)).toHaveAttribute("href", "/inserted-lane");
	await page.screenshot({
		path: testInfo.outputPath("rendered-blocks.png"),
		fullPage: true,
	});
});
