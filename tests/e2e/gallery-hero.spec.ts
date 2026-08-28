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
const EDITED_IMAGE_ALT = "Updated fixture hero image";
const UNSAFE_PRIMARY_HREF = "javascript:alert(1)";
const UNSAFE_SECONDARY_HREF = "data:text/plain,unsafe";

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

	await page.goto("/gallery-hero");
	const safeSeeded = page.locator('[data-dinkus-block="gallery-hero"]');
	const safeSeededImage = safeSeeded.getByRole("img", {
		name: "Fixture hero image",
	});
	await expect(safeSeededImage).toHaveAttribute(
		"src",
		"/media/fixture/project-record.svg",
	);
	await expect(safeSeededImage).toHaveAttribute("loading", "eager");
	await expect(safeSeededImage).toHaveAttribute("decoding", "async");
	await expect(
		safeSeeded.getByRole("link", { name: "Primary proof" }),
	).toHaveAttribute("href", "/proof");
	await expect(
		safeSeeded.getByRole("link", { name: "Secondary proof" }),
	).toHaveAttribute("href", "/work");

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
	await expect(modalField(editDialog, "Image alt text")).toHaveValue(
		"Fixture hero image",
	);
	await modalField(editDialog, "Image alt text").fill(EDITED_IMAGE_ALT);
	await modalField(editDialog, "Primary CTA URL").fill(UNSAFE_PRIMARY_HREF);
	await modalField(editDialog, "Secondary link URL").fill(
		UNSAFE_SECONDARY_HREF,
	);
	await submitModalAndWaitForSave(
		page,
		(content) =>
			content.some(
				(block) =>
					block?.headline === EDITED_HEADLINE &&
					block?.imageAlt === EDITED_IMAGE_ALT &&
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
	await persistedEditor.getByText("Gallery Hero", { exact: true }).hover();
	await persistedEditor.getByRole("button", { name: "Edit" }).first().click();
	const persistedDialog = page.getByRole("dialog", {
		name: "Edit Gallery Hero",
	});
	await expect(modalField(persistedDialog, "Headline")).toHaveValue(
		EDITED_HEADLINE,
	);
	await expect(modalField(persistedDialog, "Image alt text")).toHaveValue(
		EDITED_IMAGE_ALT,
	);
	await expect(modalField(persistedDialog, "Primary CTA URL")).toHaveValue(
		UNSAFE_PRIMARY_HREF,
	);
	const persistedSecondaryHref = modalField(
		persistedDialog,
		"Secondary link URL",
	);
	await expect(persistedSecondaryHref).toHaveValue(
		UNSAFE_SECONDARY_HREF,
	);
	await persistedSecondaryHref.scrollIntoViewIfNeeded();
	await page.screenshot({
		path: testInfo.outputPath("unsafe-admin-modal.png"),
		fullPage: true,
	});
	await persistedDialog.getByRole("button", { name: "Cancel" }).click();

	await persistedEditor.click();
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
	await modalField(insertDialog, "Secondary link label").fill(
		"Secondary fixture",
	);
	await modalField(insertDialog, "Secondary link URL").fill(
		"/inserted-secondary",
	);
	await page.screenshot({
		path: testInfo.outputPath("safe-admin-modal.png"),
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
	await page.getByRole("button", { name: "Publish", exact: true }).click();
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
	const persistedImage = rendered.nth(0).getByRole("img", {
		name: EDITED_IMAGE_ALT,
	});
	await expect(persistedImage).toHaveAttribute(
		"src",
		"/media/fixture/project-record.svg",
	);
	await expect(persistedImage).toHaveAttribute("loading", "eager");
	await expect(persistedImage).toHaveAttribute("decoding", "async");
	await expect(rendered.nth(0).getByRole("link")).toHaveCount(0);
	await expect(rendered.nth(1).getByRole("img")).toHaveCount(0);
	await expect(rendered.nth(1).locator(".dinkus-gallery-hero__media")).toHaveAttribute(
		"aria-hidden",
		"true",
	);
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
		path: testInfo.outputPath("rendered-safe-unsafe.png"),
		fullPage: true,
	});
});
