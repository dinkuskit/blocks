import { expect, test, type APIResponse, type Page } from "@playwright/test";

import {
	authenticate,
	modalField,
	publishPendingChanges,
	submitModalAndWaitForSave,
	waitForAdmin,
} from "./helpers";

const ORIGINAL_HEADING = "Original: block and reference A";
const EDITED_HEADING = "Edited: block and references B, A";
const FIELD = "related_pages";

test.setTimeout(120_000);

test("preserves a Dinkus block and its reference selection when EmDash binds reference fields", async ({
	page,
	browser,
}, testInfo) => {
	await authenticate(page);
	const bound = await probeBindsReferenceFields(page);
	await testInfo.attach("reference-binding.json", {
		body: JSON.stringify({ bindsReferenceFields: bound }, null, 2),
		contentType: "application/json",
	});

	if (!bound) {
		await page.goto("/");
		await expect(page.locator('[data-dinkus-block="cta-band"]').first()).toBeVisible();
		return;
	}

	const targetA = await createPublishedPage(page, "ref-a", "Reference A");
	const targetB = await createPublishedPage(page, "ref-b", "Reference B");
	const field = await api(page, "POST", "/_emdash/api/schema/collections/pages/fields", {
		slug: FIELD,
		label: "Related pages",
		type: "reference",
		required: false,
		validation: { targetCollection: "pages", multiple: true },
	});
	expect(field.response.ok(), JSON.stringify(field.body)).toBe(true);

	const created = await api(page, "POST", "/_emdash/api/content/pages", {
		slug: "block-ref",
		data: {
			title: "Block reference",
			content: [cta(ORIGINAL_HEADING)],
		},
		references: { [FIELD]: [targetA.id] },
	});
	expect(created.response.ok(), JSON.stringify(created.body)).toBe(true);
	const id = itemOf(created.body).id as string;
	const published = await api(page, "POST", `/_emdash/api/content/pages/${id}/publish`);
	expect(published.response.ok(), JSON.stringify(published.body)).toBe(true);
	const original = await readEntry(page, id);
	const originalRevisionId = original.liveRevisionId as string;
	expect(originalRevisionId).toBeTruthy();
	expect(headingOf(original)).toBe(ORIGINAL_HEADING);
	expect(referenceIds(original)).toEqual([targetA.id]);

	const stagedReferences = await api(page, "PUT", `/_emdash/api/content/pages/${id}`, {
		references: { [FIELD]: [targetB.id, targetA.id] },
	});
	expect(stagedReferences.response.ok(), JSON.stringify(stagedReferences.body)).toBe(true);

	await page.goto(`/_emdash/admin/content/pages/${id}`);
	await waitForAdmin(page);
	const editor = page.locator(".ProseMirror");
	await editor.getByText("CTA Band", { exact: true }).hover();
	await editor.getByRole("button", { name: "Edit" }).first().click();
	const dialog = page.getByRole("dialog", { name: "Edit CTA Band" });
	await modalField(dialog, "Heading").fill(EDITED_HEADING);
	await page.screenshot({
		path: testInfo.outputPath("admin-edit.png"),
		fullPage: true,
	});
	await submitModalAndWaitForSave(
		page,
		(content) => content.some((block) => block?.heading === EDITED_HEADING),
		async () => {
			await dialog.getByRole("button", { name: "Save" }).click();
		},
	);

	const draft = await readEntry(page, id);
	expect(headingOf(draft)).toBe(EDITED_HEADING);
	expect(referenceIds(draft)).toEqual([targetB.id, targetA.id]);

	const anon = await browser.newContext();
	const publicPage = await anon.newPage();
	await publicPage.goto("/block-ref");
	await expect(publicPage.locator('[data-dinkus-block="cta-band"]').getByRole("heading")).toHaveText(ORIGINAL_HEADING);
	await publicPage.screenshot({
		path: testInfo.outputPath("public-draft-isolated.png"),
		fullPage: true,
	});
	const isolated = await readCompare(page, id);
	expect(headingOf(isolated.live)).toBe(ORIGINAL_HEADING);
	expect(referenceGroups(isolated.live)).toEqual([targetA.translationGroup]);
	expect(headingOf(isolated.draft)).toBe(EDITED_HEADING);
	expect(referenceGroups(isolated.draft)).toEqual([
		targetB.translationGroup,
		targetA.translationGroup,
	]);

	await publishPendingChanges(page);
	await expect(page.getByRole("button", { name: "Unpublish" })).toBeVisible({
		timeout: 15_000,
	});
	await publicPage.reload();
	await expect(publicPage.locator('[data-dinkus-block="cta-band"]').getByRole("heading")).toHaveText(EDITED_HEADING);
	await publicPage.screenshot({
		path: testInfo.outputPath("public-edited.png"),
		fullPage: true,
	});
	const editedLive = await readEntry(page, id);
	expect(headingOf(editedLive)).toBe(EDITED_HEADING);
	expect(referenceIds(editedLive)).toEqual([targetB.id, targetA.id]);

	const restored = await api(page, "POST", `/_emdash/api/revisions/${originalRevisionId}/restore`);
	expect(restored.response.ok(), JSON.stringify(restored.body)).toBe(true);
	const restoredDraft = await readEntry(page, id);
	expect(headingOf(restoredDraft)).toBe(ORIGINAL_HEADING);
	expect(referenceIds(restoredDraft)).toEqual([targetA.id]);
	const held = await readCompare(page, id);
	expect(headingOf(held.live)).toBe(EDITED_HEADING);
	expect(referenceGroups(held.live)).toEqual([
		targetB.translationGroup,
		targetA.translationGroup,
	]);
	expect(headingOf(held.draft)).toBe(ORIGINAL_HEADING);
	expect(referenceGroups(held.draft)).toEqual([targetA.translationGroup]);

	const republished = await api(page, "POST", `/_emdash/api/content/pages/${id}/publish`);
	expect(republished.response.ok(), JSON.stringify(republished.body)).toBe(true);
	await publicPage.reload();
	await expect(publicPage.locator('[data-dinkus-block="cta-band"]').getByRole("heading")).toHaveText(ORIGINAL_HEADING);
	await publicPage.screenshot({
		path: testInfo.outputPath("public-restored.png"),
		fullPage: true,
	});
	const restoredLive = await readEntry(page, id);
	expect(headingOf(restoredLive)).toBe(ORIGINAL_HEADING);
	expect(referenceIds(restoredLive)).toEqual([targetA.id]);
	await anon.close();
});

function cta(heading: string) {
	return {
		_type: "dinkus.cta-band",
		_key: "block-ref-cta",
		eyebrow: "Reference proof",
		heading,
		body: "The block and the reference selection have to survive the same draft.",
		ctaLabel: "Proof",
		ctaHref: "/proof",
	};
}

async function probeBindsReferenceFields(page: Page) {
	const collection = await api(page, "POST", "/_emdash/api/schema/collections", {
		slug: "refprobe",
		label: "Reference probe",
		labelSingular: "Reference probe",
	});
	expect(collection.response.ok(), JSON.stringify(collection.body)).toBe(true);
	try {
		const field = await api(page, "POST", "/_emdash/api/schema/collections/refprobe/fields", {
			slug: FIELD,
			label: "Related pages",
			type: "reference",
			required: false,
			validation: { targetCollection: "pages", multiple: true },
		});
		if (!field.response.ok()) return false;
		const validation = itemOf(field.body)?.validation;
		const record = typeof validation === "string" ? JSON.parse(validation) : validation;
		return typeof record?.relation === "string" && record.relation.length > 0;
	} finally {
		const removed = await api(page, "DELETE", "/_emdash/api/schema/collections/refprobe");
		expect(removed.response.ok(), JSON.stringify(removed.body)).toBe(true);
	}
}

async function createPublishedPage(page: Page, slug: string, title: string) {
	const created = await api(page, "POST", "/_emdash/api/content/pages", {
		slug,
		data: { title, content: [] },
	});
	expect(created.response.ok(), JSON.stringify(created.body)).toBe(true);
	const createdItem = itemOf(created.body);
	const id = createdItem.id as string;
	const published = await api(page, "POST", `/_emdash/api/content/pages/${id}/publish`);
	expect(published.response.ok(), JSON.stringify(published.body)).toBe(true);
	const translationGroup = (itemOf(published.body).translationGroup ??
		createdItem.translationGroup) as string;
	expect(translationGroup).toBeTruthy();
	return { id, translationGroup };
}

async function readCompare(page: Page, id: string) {
	const result = await api(page, "GET", `/_emdash/api/content/pages/${id}/compare`);
	expect(result.response.ok(), JSON.stringify(result.body)).toBe(true);
	const data = (result.body as { data?: { live?: Record<string, unknown>; draft?: Record<string, unknown> } })
		?.data;
	expect(data?.live).toBeTruthy();
	expect(data?.draft).toBeTruthy();
	return {
		live: data?.live as Record<string, unknown>,
		draft: data?.draft as Record<string, unknown>,
	};
}

async function readEntry(page: Page, id: string) {
	const result = await api(page, "GET", `/_emdash/api/content/pages/${id}`);
	expect(result.response.ok(), JSON.stringify(result.body)).toBe(true);
	return itemOf(result.body);
}

function itemOf(body: { data?: { item?: Record<string, unknown> }; item?: Record<string, unknown> }) {
	const item = body?.data?.item ?? body?.item;
	expect(item).toBeTruthy();
	return item as Record<string, unknown>;
}

function headingOf(item: Record<string, unknown>) {
	const data = item.data as { content?: Array<Record<string, unknown>> } | undefined;
	const content = data?.content ?? (item.content as Array<Record<string, unknown>> | undefined);
	const block = content?.find((entry) => entry._type === "dinkus.cta-band");
	return block?.heading;
}

function referenceIds(item: Record<string, unknown>) {
	const references = item.references as Record<string, { children?: Array<Record<string, unknown>> }> | undefined;
	const children = references?.[FIELD]?.children ?? [];
	return children.map((child) => child.id);
}

function referenceGroups(revision: Record<string, unknown>) {
	const references = revision._references as Record<string, string[]> | undefined;
	return references?.[FIELD] ?? [];
}

async function api(page: Page, method: string, path: string, data?: unknown) {
	const response: APIResponse = await page.request.fetch(path, {
		method,
		headers: { "X-EmDash-Request": "1" },
		data,
	});
	let body: { data?: { item?: Record<string, unknown> }; item?: Record<string, unknown> } | null = null;
	try {
		body = await response.json();
	} catch {
		body = null;
	}
	return { response, body };
}
