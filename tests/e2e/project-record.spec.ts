import { expect, test } from "@playwright/test";

import {
	authenticate,
	expectBlockDeclared,
	modalField,
	submitModalAndWaitForSave,
	waitForAdmin,
} from "./helpers";

const SEEDED_PROOF = "Before: Proof headline is editable";
const EDITED_PROOF = "After: Proof headline persisted";
const EDITED_LINK = "Read persisted project proof";

type ProjectRecordRow = {
	proofHeadline?: unknown;
	links?: Array<{ label?: unknown }>;
};

function projectRecordWithProof(
	content: Array<Record<string, unknown>>,
	proofHeadline: string,
	linkLabel?: string,
) {
	return content.some((block) => {
		if (block?._type !== "dinkus.project-record") return false;
		const record = block as ProjectRecordRow;
		if (record.proofHeadline !== proofHeadline) return false;
		if (!linkLabel) return true;
		return (
			Array.isArray(record.links) &&
			record.links.some((link) => link?.label === linkLabel)
		);
	});
}

test("declares, edits, persists, inserts, and renders a project record", async (
	{ page },
	testInfo,
) => {
	await authenticate(page);

	await expectBlockDeclared(page, testInfo, {
		type: "dinkus.project-record",
		label: "Project Record",
		category: "Sections",
	});

	await page.goto("/_emdash/admin/content/pages/project-record");
	await waitForAdmin(page);

	const editor = page.locator(".ProseMirror");
	await expect(editor).toBeVisible();
	await expect(editor).toContainText("Project Record");

	await editor.getByText("Project Record", { exact: true }).hover();
	await editor.getByRole("button", { name: "Edit" }).first().click();
	const editDialog = page.getByRole("dialog", { name: "Edit Project Record" });
	await expect(editDialog).toBeVisible();
	await expect(modalField(editDialog, "Proof headline")).toHaveValue(
		SEEDED_PROOF,
	);
	await modalField(editDialog, "Proof headline").fill(EDITED_PROOF);
	await editDialog.getByText("Read project proof", { exact: true }).click();
	await modalField(editDialog, "Label").fill(EDITED_LINK);
	await modalField(editDialog, "Proof headline").scrollIntoViewIfNeeded();
	await page.screenshot({
		path: testInfo.outputPath("admin-modal-edit.png"),
		fullPage: true,
	});
	await submitModalAndWaitForSave(
		page,
		(content) => projectRecordWithProof(content, EDITED_PROOF, EDITED_LINK),
		async () => {
			await editDialog.getByRole("button", { name: "Save" }).click();
		},
	);

	await page.reload();
	await waitForAdmin(page);
	const persistedEditor = page.locator(".ProseMirror");
	await persistedEditor.getByText("Project Record", { exact: true }).hover();
	await persistedEditor.getByRole("button", { name: "Edit" }).first().click();
	const persistedDialog = page.getByRole("dialog", {
		name: "Edit Project Record",
	});
	await expect(modalField(persistedDialog, "Proof headline")).toHaveValue(
		EDITED_PROOF,
	);
	await persistedDialog.getByText(EDITED_LINK, { exact: true }).click();
	await expect(modalField(persistedDialog, "Label")).toHaveValue(EDITED_LINK);
	await modalField(persistedDialog, "Proof headline").scrollIntoViewIfNeeded();
	await page.screenshot({
		path: testInfo.outputPath("admin-modal-persisted.png"),
		fullPage: true,
	});
	await persistedDialog.getByRole("button", { name: "Cancel" }).click();

	const editorBox = await persistedEditor.boundingBox();
	await persistedEditor.click({
		position: {
			x: 12,
			y: Math.max((editorBox?.height ?? 24) - 8, 12),
		},
	});
	await page.keyboard.press("End");
	await page.keyboard.press("Enter");
	await page.keyboard.type("/project");
	const slashMenuItem = page.getByText(
		"A full project record with identity, status, evidence, and next navigation",
		{ exact: true },
	);
	await expect(slashMenuItem).toBeVisible();
	await slashMenuItem.click();

	const insertDialog = page.getByRole("dialog", {
		name: "Insert Project Record",
	});
	await modalField(insertDialog, "Record ID").fill("inserted-record");
	await modalField(insertDialog, "Title").fill("Inserted project record");
	await modalField(insertDialog, "Status").fill("Inserted through EmDash");
	await modalField(insertDialog, "Proof headline").fill(
		"Inserted project proof",
	);
	await modalField(insertDialog, "Next-project title").fill("Fixture home");
	await modalField(insertDialog, "Next-project URL").fill("/");
	await page.screenshot({
		path: testInfo.outputPath("admin-modal-insert.png"),
		fullPage: true,
	});
	await submitModalAndWaitForSave(
		page,
		(content) => projectRecordWithProof(content, "Inserted project proof"),
		async () => {
			await insertDialog.getByRole("button", { name: "Insert" }).click();
		},
	);

	await page.reload();
	await waitForAdmin(page);
	await expect(page.getByRole("button", { name: "Edit" })).toHaveCount(2);
	await page.getByRole("button", { name: "Publish changes" }).click();
	await expect(page.getByRole("button", { name: "Unpublish" })).toBeVisible({
		timeout: 15_000,
	});

	await page.goto("/project-record");
	const records = page.locator('[data-dinkus-block="project-record"]');
	await expect(records).toHaveCount(2);

	const seeded = records.nth(0);
	await expect(seeded).toHaveAttribute("data-project-record", "field-notes");
	await expect(seeded.getByRole("heading", { level: 1 })).toHaveText(
		"Before: Project record title is editable",
	);
	await expect(seeded.getByText("Proof in progress", { exact: true })).toBeVisible();
	await expect(seeded.getByRole("heading", { name: EDITED_PROOF })).toBeVisible();
	await expect(seeded.getByRole("link", { name: EDITED_LINK })).toHaveAttribute(
		"href",
		"/proof",
	);
	await expect(seeded.getByText("Unsafe link is rejected", { exact: true })).toHaveCount(0);
	await expect(seeded.getByRole("link", { name: "Dispatch fixture" })).toHaveAttribute(
		"href",
		"/dispatch",
	);
	const identity = seeded.locator(".dinkus-project-record__identity img");
	await expect(identity).toHaveAttribute("alt", "Abstract project identity");
	await expect
		.poll(async () => identity.evaluate((image) => (image as HTMLImageElement).naturalWidth))
		.toBeGreaterThan(0);

	const inserted = records.nth(1);
	await expect(inserted).toHaveAttribute("data-project-record", "inserted-record");
	await expect(inserted.getByRole("heading", { level: 1 })).toHaveText(
		"Inserted project record",
	);
	await expect(inserted.getByText("Inserted through EmDash", { exact: true })).toBeVisible();
	await expect(inserted.getByRole("link", { name: "Fixture home" })).toHaveAttribute(
		"href",
		"/",
	);

	await page.screenshot({
		path: testInfo.outputPath("rendered-project-record-desktop.png"),
		fullPage: true,
	});

	await seeded.evaluate((element) => {
		const root = element as HTMLElement;
		root.style.setProperty(
			"--dinkus-action-background",
			"linear-gradient(90deg, rgb(1, 2, 3), rgb(4, 5, 6))",
		);
		root.style.setProperty(
			"--dinkus-panel-surface",
			"linear-gradient(90deg, rgb(7, 8, 9), rgb(10, 11, 12))",
		);
	});
	const sheet = seeded.locator(".dinkus-project-record__sheet");
	const evidenceLink = seeded.getByRole("link", { name: EDITED_LINK });
	await expect
		.poll(() =>
			evidenceLink.evaluate(
				(element) => getComputedStyle(element).backgroundImage,
			),
		)
		.toContain("linear-gradient");
	await expect
		.poll(() =>
			sheet.evaluate((element) => getComputedStyle(element).backgroundImage),
		)
		.toContain("linear-gradient");
	await expect(sheet).toHaveCSS("border-top-style", "solid");
	await expect
		.poll(() => sheet.evaluate((element) => getComputedStyle(element).boxShadow))
		.not.toBe("none");
	await seeded.evaluate((element) => {
		const root = element as HTMLElement;
		root.style.removeProperty("--dinkus-action-background");
		root.style.removeProperty("--dinkus-panel-surface");
	});

	await page.setViewportSize({ width: 390, height: 844 });
	await expect
		.poll(async () =>
			page.evaluate(() => ({
				scrollWidth: document.documentElement.scrollWidth,
				viewportWidth: window.innerWidth,
			})),
		)
		.toEqual({ scrollWidth: 390, viewportWidth: 390 });
	await page.screenshot({
		path: testInfo.outputPath("rendered-project-record-mobile.png"),
		fullPage: true,
	});

	await page.goto("/project-record-slots");
	await expect(page.locator("body")).toHaveAttribute(
		"data-portable-type",
		"dinkus.project-record",
	);
	await expect(page.locator('[data-project-record="slotted-record"]')).toBeVisible();
	await expect(
		page.locator('[data-project-record="slotted-record"]').getByRole("heading", { level: 1 }),
	).toHaveText("Slotted project title");
	await expect(page.locator('[data-slot="identity"]')).toHaveText("PR");
	for (const slot of [
		"category-icon",
		"status-icon",
		"role-icon",
		"evidence-icon",
		"link-icon",
		"next-icon",
	]) {
		await expect(page.locator(`[data-slot="${slot}"]`)).toBeVisible();
	}
	await expect(page.getByRole("link", { name: "Read slotted proof" })).toHaveAttribute(
		"href",
		"/proof",
	);

	const absoluteRecord = page.locator('[data-project-record="absolute-slot-record"]');
	await expect(absoluteRecord).toBeVisible();
	const absoluteIdentity = absoluteRecord.locator(".dinkus-project-record__identity");
	const absoluteArt = absoluteRecord.locator('[data-slot="identity-absolute"]');
	const identityBox = await absoluteIdentity.boundingBox();
	const artBox = await absoluteArt.boundingBox();
	expect(identityBox).not.toBeNull();
	expect(artBox).not.toBeNull();
	expect(artBox!.width).toBeGreaterThan(250);
	expect(Math.abs(artBox!.width - identityBox!.width)).toBeLessThanOrEqual(2);
	const layerBox = await absoluteRecord.locator('[data-slot-layer="b"]').boundingBox();
	expect(layerBox).not.toBeNull();
	expect(layerBox!.width).toBeGreaterThan(200);
	expect(layerBox!.height).toBeGreaterThan(100);
});
