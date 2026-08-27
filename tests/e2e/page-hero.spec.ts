import { expect, test } from "@playwright/test";

import {
	authenticate,
	expectBlockDeclared,
	modalField,
	submitModalAndWaitForSave,
	waitForAdmin,
} from "./helpers";

const SEEDED_HEADLINE = "Before: Page hero headline is editable";
const EDITED_HEADLINE = "After: Page hero headline persisted";
const INSERTED_HEADLINE = "Inserted: Page hero via slash menu";
const UNSAFE_PRIMARY_HREF = "javascript:alert(1)";
const UNSAFE_SECONDARY_HREF = "data:text/plain,unsafe";

test("declares, inserts, edits, persists, and renders a page hero", async (
	{ page },
	testInfo,
) => {
	await authenticate(page);

	await expectBlockDeclared(page, testInfo, {
		type: "dinkus.page-hero",
		label: "Page Hero",
		category: "Sections",
	});

	await page.goto("/page-hero");
	const safeSeeded = page.locator('[data-dinkus-block="page-hero"]');
	await expect(
		safeSeeded.getByRole("link", { name: "Primary proof" }),
	).toHaveAttribute("href", "/proof");
	await expect(
		safeSeeded.getByRole("link", { name: "Secondary proof" }),
	).toHaveAttribute("href", "/proof-secondary");

	await page.goto("/_emdash/admin/content/pages/page-hero");
	await waitForAdmin(page);

	const editor = page.locator(".ProseMirror");
	await expect(editor).toBeVisible();
	await expect(editor).toContainText("Page Hero");
	await expect(editor).toContainText(SEEDED_HEADLINE);

	await editor.getByText("Page Hero", { exact: true }).hover();
	await editor.getByRole("button", { name: "Edit" }).first().click();
	const editDialog = page.getByRole("dialog", { name: "Edit Page Hero" });
	await expect(editDialog).toBeVisible();
	await expect(modalField(editDialog, "Headline")).toHaveValue(
		SEEDED_HEADLINE,
	);
	await modalField(editDialog, "Headline").fill(EDITED_HEADLINE);
	await modalField(editDialog, "Primary CTA URL").fill(UNSAFE_PRIMARY_HREF);
	await modalField(editDialog, "Secondary CTA URL").fill(
		UNSAFE_SECONDARY_HREF,
	);
	await submitModalAndWaitForSave(
		page,
		(content) =>
			content.some(
				(block) =>
					block?.headline === EDITED_HEADLINE &&
					block?.primaryHref === UNSAFE_PRIMARY_HREF &&
					block?.secondaryHref === UNSAFE_SECONDARY_HREF,
			),
		async () => {
			await editDialog.getByRole("button", { name: "Save" }).click();
		},
	);

	await page.reload();
	await waitForAdmin(page);
	const persistedEditor = page.locator(".ProseMirror");
	await persistedEditor.getByText("Page Hero", { exact: true }).hover();
	await persistedEditor.getByRole("button", { name: "Edit" }).first().click();
	const persistedDialog = page.getByRole("dialog", {
		name: "Edit Page Hero",
	});
	await expect(modalField(persistedDialog, "Headline")).toHaveValue(
		EDITED_HEADLINE,
	);
	await expect(modalField(persistedDialog, "Primary CTA URL")).toHaveValue(
		UNSAFE_PRIMARY_HREF,
	);
	await expect(modalField(persistedDialog, "Secondary CTA URL")).toHaveValue(
		UNSAFE_SECONDARY_HREF,
	);
	await persistedDialog.getByRole("button", { name: "Cancel" }).click();

	await editor.click();
	await page.keyboard.press("End");
	await page.keyboard.press("ArrowRight");
	await page.keyboard.press("Enter");
	await page.keyboard.type("/page");

	const slashMenuItem = page.getByText(
		"Top-of-page hero with headline, deck, and calls to action",
		{ exact: true },
	);
	await expect(slashMenuItem).toBeVisible();
	await slashMenuItem.click();

	const insertDialog = page.getByRole("dialog", { name: "Insert Page Hero" });
	await modalField(insertDialog, "Eyebrow").fill("Slash-menu fixture");
	await modalField(insertDialog, "Headline").fill(INSERTED_HEADLINE);
	await modalField(insertDialog, "Deck").fill(
		"This hero was inserted through the slash menu.",
	);
	await modalField(insertDialog, "Primary CTA label").fill("Primary fixture");
	await modalField(insertDialog, "Primary CTA URL").fill("/inserted-primary");
	await modalField(insertDialog, "Secondary CTA label").fill(
		"Secondary fixture",
	);
	await modalField(insertDialog, "Secondary CTA URL").fill(
		"/inserted-secondary",
	);
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

	await page.goto("/page-hero");
	const rendered = page.locator('[data-dinkus-block="page-hero"]');
	await expect(rendered).toHaveCount(2);
	await expect(rendered.nth(0).getByRole("heading", { level: 1 })).toHaveText(
		EDITED_HEADLINE,
	);
	await expect(rendered.nth(1).getByRole("heading", { level: 1 })).toHaveText(
		INSERTED_HEADLINE,
	);
	await expect(rendered.nth(0).getByRole("link")).toHaveCount(0);
	await expect(
		rendered.nth(1).getByRole("link", { name: "Primary fixture" }),
	).toHaveAttribute("href", "/inserted-primary");
	await expect(
		rendered.nth(1).getByRole("link", { name: "Secondary fixture" }),
	).toHaveAttribute("href", "/inserted-secondary");
	await rendered.nth(1).evaluate((element) => {
		const root = element as HTMLElement;
		root.style.setProperty("--dinkus-title-size", "37px");
		root.style.setProperty("--dinkus-action-radius", "3px");
		root.style.setProperty("--dinkus-action-background", "rgb(1, 2, 3)");
		root.style.setProperty("--dinkus-action-color", "rgb(250, 251, 252)");
	});
	await expect(
		rendered.nth(1).getByRole("heading", { level: 1 }),
	).toHaveCSS("font-size", "37px");
	const themedAction = rendered.nth(1).getByRole("link", {
		name: "Primary fixture",
	});
	await expect(themedAction).toHaveCSS("border-radius", "3px");
	await expect(themedAction).toHaveCSS("background-color", "rgb(1, 2, 3)");
	await expect(themedAction).toHaveCSS("color", "rgb(250, 251, 252)");
	await page.screenshot({
		path: testInfo.outputPath("rendered-blocks.png"),
		fullPage: true,
	});
});
