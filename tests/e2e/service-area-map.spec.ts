import { expect, test } from "@playwright/test";

import {
	authenticate,
	expectBlockDeclared,
	modalField,
	submitModalAndWaitForSave,
	waitForAdmin,
} from "./helpers";

const SEEDED_CAPTION = "Before: Service area caption is editable";
const EDITED_CAPTION = "After: Service area caption persisted";
const INSERTED_CAPTION = "Inserted: Service area caption via slash menu";

test("declares, inserts, edits, persists, and renders a service area map", async (
	{ page },
	testInfo,
) => {
	await authenticate(page);

	await expectBlockDeclared(page, testInfo, {
		type: "dinkus.service-area-map",
		label: "Service Area Map",
		category: "Sections",
	});

	await page.goto("/_emdash/admin/content/pages/service-area-map");
	await waitForAdmin(page);

	const editor = page.locator(".ProseMirror");
	await expect(editor).toBeVisible();
	await expect(editor).toContainText("Service Area Map");

	await editor.getByText("Service Area Map", { exact: true }).hover();
	await editor.getByRole("button", { name: "Edit" }).first().click();
	const editDialog = page.getByRole("dialog", {
		name: "Edit Service Area Map",
	});
	await expect(editDialog).toBeVisible();
	await expect(modalField(editDialog, "Caption")).toHaveValue(SEEDED_CAPTION);
	await modalField(editDialog, "Caption").fill(EDITED_CAPTION);
	await submitModalAndWaitForSave(
		page,
		(content) => content.some((block) => block?.caption === EDITED_CAPTION),
		async () => {
			await editDialog.getByRole("button", { name: "Save" }).click();
		},
	);

	await page.reload();
	await waitForAdmin(page);
	const persistedEditor = page.locator(".ProseMirror");
	await persistedEditor.getByText("Service Area Map", { exact: true }).hover();
	await persistedEditor.getByRole("button", { name: "Edit" }).first().click();
	const persistedDialog = page.getByRole("dialog", {
		name: "Edit Service Area Map",
	});
	await expect(modalField(persistedDialog, "Caption")).toHaveValue(
		EDITED_CAPTION,
	);
	await persistedDialog.getByRole("button", { name: "Cancel" }).click();

	await editor.click();
	await page.keyboard.press("End");
	await page.keyboard.press("ArrowRight");
	await page.keyboard.press("Enter");
	await page.keyboard.type("/service");

	const slashMenuItem = page.getByText(
		"A map figure with a caption and legend",
		{ exact: true },
	);
	await expect(slashMenuItem).toBeVisible();
	await slashMenuItem.click();

	const insertDialog = page.getByRole("dialog", {
		name: "Insert Service Area Map",
	});
	await modalField(insertDialog, "Caption").fill(INSERTED_CAPTION);
	await insertDialog
		.getByRole("button", { name: "Add Legend entry" })
		.first()
		.click();
	await modalField(insertDialog, "Label").fill("Inserted legend");
	await modalField(insertDialog, "Icon slug").fill("star");
	await page.screenshot({
		path: testInfo.outputPath("admin-modal.png"),
		fullPage: true,
	});
	await submitModalAndWaitForSave(
		page,
		(content) => content.some((block) => block?.caption === INSERTED_CAPTION),
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
	await page.getByRole("button", { name: "Publish changes" }).click();
	await expect(page.getByRole("button", { name: "Unpublish" })).toBeVisible({
		timeout: 15_000,
	});

	await page.goto("/service-area-map");
	const rendered = page.locator('[data-dinkus-block="service-area-map"]');
	await expect(rendered).toHaveCount(2);

	await expect(
		rendered.nth(0).locator(".dinkus-service-area-map__caption"),
	).toHaveText(EDITED_CAPTION);
	const seededLegend = rendered.nth(0).locator(
		".dinkus-service-area-map__legend li",
	);
	await expect(seededLegend).toHaveCount(2);
	await expect(seededLegend.nth(0)).toHaveText("Working bases");
	await expect(seededLegend.nth(0)).toHaveAttribute(
		"data-dinkus-icon",
		"map-pin",
	);

	await expect(
		rendered.nth(1).locator(".dinkus-service-area-map__caption"),
	).toHaveText(INSERTED_CAPTION);
	await expect(
		rendered.nth(1).locator(".dinkus-service-area-map__legend li"),
	).toHaveText("Inserted legend");
	await page.screenshot({
		path: testInfo.outputPath("rendered-blocks.png"),
		fullPage: true,
	});
});
