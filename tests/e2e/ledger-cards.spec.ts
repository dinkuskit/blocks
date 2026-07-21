import { expect, test } from "@playwright/test";

import {
	authenticate,
	expectBlockDeclared,
	modalField,
	submitModalAndWaitForSave,
	waitForAdmin,
} from "./helpers";

const SEEDED_TITLE = "Before: Ledger card title is editable";
const EDITED_TITLE = "After: Ledger card title persisted";

type CardRow = { title?: unknown };

function ledgerWithTitle(
	content: Array<Record<string, unknown>>,
	title: string,
) {
	return content.some(
		(block) =>
			block?._type === "dinkus.ledger-cards" &&
			Array.isArray(block.cards) &&
			(block.cards as CardRow[]).some((card) => card?.title === title),
	);
}

test("declares, inserts, edits, persists, and renders ledger cards", async (
	{ page },
	testInfo,
) => {
	await authenticate(page);

	await expectBlockDeclared(page, testInfo, {
		type: "dinkus.ledger-cards",
		label: "Ledger Cards",
		category: "Sections",
	});

	await page.goto("/_emdash/admin/content/pages/ledger-cards");
	await waitForAdmin(page);

	const editor = page.locator(".ProseMirror");
	await expect(editor).toBeVisible();
	await expect(editor).toContainText("Ledger Cards");

	await editor.getByText("Ledger Cards", { exact: true }).hover();
	await editor.getByRole("button", { name: "Edit" }).first().click();
	const editDialog = page.getByRole("dialog", { name: "Edit Ledger Cards" });
	await expect(editDialog).toBeVisible();

	// Seeded repeater cards are titled by their first text sub-field (code).
	await editDialog.getByText("field", { exact: true }).click();
	await expect(modalField(editDialog, "Title")).toHaveValue(SEEDED_TITLE);
	await modalField(editDialog, "Title").fill(EDITED_TITLE);
	await page.screenshot({
		path: testInfo.outputPath("admin-modal-edit.png"),
		fullPage: true,
	});
	await submitModalAndWaitForSave(
		page,
		(content) => ledgerWithTitle(content, EDITED_TITLE),
		async () => {
			await editDialog.getByRole("button", { name: "Save" }).click();
		},
	);

	await page.reload();
	await waitForAdmin(page);
	const persistedEditor = page.locator(".ProseMirror");
	await persistedEditor.getByText("Ledger Cards", { exact: true }).hover();
	await persistedEditor.getByRole("button", { name: "Edit" }).first().click();
	const persistedDialog = page.getByRole("dialog", {
		name: "Edit Ledger Cards",
	});
	await persistedDialog.getByText("field", { exact: true }).click();
	await expect(modalField(persistedDialog, "Title")).toHaveValue(EDITED_TITLE);
	await persistedDialog.getByRole("button", { name: "Cancel" }).click();

	await editor.click();
	await page.keyboard.press("End");
	await page.keyboard.press("ArrowRight");
	await page.keyboard.press("Enter");
	await page.keyboard.type("/ledger");

	const slashMenuItem = page.getByText(
		"A grid of record cards with code, title, and body",
		{ exact: true },
	);
	await expect(slashMenuItem).toBeVisible();
	await slashMenuItem.click();

	const insertDialog = page.getByRole("dialog", {
		name: "Insert Ledger Cards",
	});
	await insertDialog.getByRole("button", { name: "Add Card" }).first().click();
	await modalField(insertDialog, "Record code").fill("metal");
	await modalField(insertDialog, "Title").fill("Inserted ledger card");
	await modalField(insertDialog, "Body").fill(
		"This card was inserted through the slash menu.",
	);
	await page.screenshot({
		path: testInfo.outputPath("admin-modal-insert.png"),
		fullPage: true,
	});
	await submitModalAndWaitForSave(
		page,
		(content) => ledgerWithTitle(content, "Inserted ledger card"),
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

	await page.goto("/ledger-cards");
	const rendered = page.locator('[data-dinkus-block="ledger-cards"]');
	await expect(rendered).toHaveCount(2);

	const seededCards = rendered.nth(0).locator(".dinkus-ledger-cards__card");
	await expect(seededCards).toHaveCount(2);
	await expect(seededCards.nth(0).getByRole("heading")).toHaveText(
		EDITED_TITLE,
	);
	await expect(
		seededCards.nth(0).locator(".dinkus-ledger-cards__code"),
	).toHaveText("field");
	await expect(
		seededCards.nth(0).getByRole("link", { name: "Review field work" }),
	).toHaveAttribute("href", "/field");

	const insertedCards = rendered.nth(1).locator(".dinkus-ledger-cards__card");
	await expect(insertedCards).toHaveCount(1);
	await expect(insertedCards.nth(0).getByRole("heading")).toHaveText(
		"Inserted ledger card",
	);
	await page.screenshot({
		path: testInfo.outputPath("rendered-blocks.png"),
		fullPage: true,
	});
});
