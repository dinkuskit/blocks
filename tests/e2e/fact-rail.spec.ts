import { expect, test } from "@playwright/test";

import {
	authenticate,
	expectBlockDeclared,
	modalField,
	submitModalAndWaitForSave,
	waitForAdmin,
} from "./helpers";

const EDITED_VALUE = "After: repeater value persisted";

type FactRow = { value?: unknown };

function factRailWithValue(
	content: Array<Record<string, unknown>>,
	value: string,
) {
	return content.some(
		(block) =>
			block?._type === "dinkus.fact-rail" &&
			Array.isArray(block.facts) &&
			(block.facts as FactRow[]).some((fact) => fact?.value === value),
	);
}

test("declares, inserts, edits, persists, and renders a fact rail", async (
	{ page },
	testInfo,
) => {
	await authenticate(page);

	await expectBlockDeclared(page, testInfo, {
		type: "dinkus.fact-rail",
		label: "Fact Rail",
		category: "Sections",
	});

	await page.goto("/_emdash/admin/content/pages/fact-rail");
	await waitForAdmin(page);

	const editor = page.locator(".ProseMirror");
	await expect(editor).toBeVisible();
	await expect(editor).toContainText("Fact Rail");

	await editor.getByText("Fact Rail", { exact: true }).hover();
	await editor.getByRole("button", { name: "Edit" }).first().click();
	const editDialog = page.getByRole("dialog", { name: "Edit Fact Rail" });
	await expect(editDialog).toBeVisible();
	await expect(modalField(editDialog, "Accessible label")).toHaveValue(
		"Fixture facts",
	);

	// Seeded repeater items render as collapsed cards titled by their first
	// text sub-field; expand "Crew" and edit its value in place.
	await expect(editDialog.getByText("Crew", { exact: true })).toBeVisible();
	await expect(editDialog.getByText("Radius", { exact: true })).toBeVisible();
	await expect(editDialog.getByText("Since", { exact: true })).toBeVisible();
	await editDialog.getByText("Crew", { exact: true }).click();
	await expect(modalField(editDialog, "Value")).toHaveValue("Three on site");
	await modalField(editDialog, "Value").fill(EDITED_VALUE);
	await page.screenshot({
		path: testInfo.outputPath("admin-modal-edit.png"),
		fullPage: true,
	});
	await submitModalAndWaitForSave(
		page,
		(content) => factRailWithValue(content, EDITED_VALUE),
		async () => {
			await editDialog.getByRole("button", { name: "Save" }).click();
		},
	);

	await page.reload();
	await waitForAdmin(page);
	const persistedEditor = page.locator(".ProseMirror");
	await persistedEditor.getByText("Fact Rail", { exact: true }).hover();
	await persistedEditor.getByRole("button", { name: "Edit" }).first().click();
	const persistedDialog = page.getByRole("dialog", {
		name: "Edit Fact Rail",
	});
	await persistedDialog.getByText("Crew", { exact: true }).click();
	await expect(modalField(persistedDialog, "Value")).toHaveValue(
		EDITED_VALUE,
	);
	await persistedDialog.getByRole("button", { name: "Cancel" }).click();

	await editor.click();
	await page.keyboard.press("End");
	await page.keyboard.press("ArrowRight");
	await page.keyboard.press("Enter");
	await page.keyboard.type("/fact");

	const slashMenuItem = page.getByText(
		"A horizontal rail of short label/value facts",
		{ exact: true },
	);
	await expect(slashMenuItem).toBeVisible();
	await slashMenuItem.click();

	const insertDialog = page.getByRole("dialog", { name: "Insert Fact Rail" });
	await modalField(insertDialog, "Accessible label").fill("Inserted facts");
	// A freshly added repeater item is auto-expanded with empty sub-fields.
	// The repeater renders an "Add Fact" button in both its header row and
	// below the item list; either works.
	await insertDialog.getByRole("button", { name: "Add Fact" }).first().click();
	await modalField(insertDialog, "Label").fill("Lead time");
	await modalField(insertDialog, "Value").fill("Two weeks");
	await modalField(insertDialog, "Icon slug").fill("clock");
	await page.screenshot({
		path: testInfo.outputPath("admin-modal-insert.png"),
		fullPage: true,
	});
	await submitModalAndWaitForSave(
		page,
		(content) => factRailWithValue(content, "Two weeks"),
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
	await page.getByRole("button", { name: "Publish changes" }).click();
	await expect(page.getByRole("button", { name: "Unpublish" })).toBeVisible({
		timeout: 15_000,
	});

	await page.goto("/fact-rail");
	const rendered = page.locator('[data-dinkus-block="fact-rail"]');
	await expect(rendered).toHaveCount(2);

	const seededRail = rendered.nth(0);
	await expect(seededRail).toHaveAttribute("aria-label", "Fixture facts");
	const seededFacts = seededRail.locator(".dinkus-fact-rail__fact");
	await expect(seededFacts).toHaveCount(3);
	await expect(seededFacts.nth(0).locator("dt")).toHaveText("Crew");
	await expect(seededFacts.nth(0).locator("dd")).toHaveText(EDITED_VALUE);
	await expect(seededFacts.nth(1).locator("dd")).toHaveText("40 miles");
	await expect(seededFacts.nth(2).locator("dd")).toHaveText("2019");
	await expect(seededFacts.nth(1)).toHaveAttribute(
		"data-dinkus-icon",
		"map-pin",
	);

	const insertedRail = rendered.nth(1);
	await expect(insertedRail).toHaveAttribute("aria-label", "Inserted facts");
	const insertedFacts = insertedRail.locator(".dinkus-fact-rail__fact");
	await expect(insertedFacts).toHaveCount(1);
	await expect(insertedFacts.nth(0).locator("dt")).toHaveText("Lead time");
	await expect(insertedFacts.nth(0).locator("dd")).toHaveText("Two weeks");
	await page.screenshot({
		path: testInfo.outputPath("rendered-blocks.png"),
		fullPage: true,
	});
});
