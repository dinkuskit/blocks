import { expect, test } from "@playwright/test";

import { authenticate } from "./helpers";

/**
 * Render-boundary acceptance for the runtime block schemas (seed page
 * "hardening"): a malformed sibling block is omitted without taking down
 * the page, unknown keys are stripped before markup, and the media/nav
 * URL policies only let approved hosts through.
 */
test("a malformed stored block is omitted while the page and policies hold", async (
	{ page },
	testInfo,
) => {
	// Seeded entry rows materialize on the first setup/auth request.
	await authenticate(page);

	const response = await page.goto("/hardening");
	expect(response?.status()).toBe(200);

	// The page renders; the valid sibling block is intact.
	const validHeader = page.locator('[data-dinkus-block="section-header"]');
	await expect(validHeader).toBeVisible();
	await expect(validHeader).toContainText("Valid blocks render");

	// The malformed cta-band (heading holds a number) is omitted; the
	// unknown-key cta-band renders with its unknown key stripped.
	const ctaBands = page.locator('[data-dinkus-block="cta-band"]');
	await expect(ctaBands).toHaveCount(1);
	await expect(ctaBands.first()).toContainText("Unknown keys are stripped");
	const html = await page.content();
	expect(html).not.toContain("Never rendered");
	expect(html).not.toContain("alert(1)");

	// Media policy: approved HTTPS media host renders, anything else is
	// dropped to the neutral placeholder; navigation policy mirrors it.
	const lanes = page.locator('[data-dinkus-block="gallery-lanes"] > *');
	await expect(lanes).toHaveCount(2);
	await expect(
		page.locator(
			'img[src="https://media.dinkuskit.example/approved.jpg"]',
		),
	).toHaveCount(1);
	await expect(
		page.locator(
			'a[href="https://partner.dinkuskit.example/case"]',
		),
	).toHaveCount(1);
	expect(html).not.toContain("evil.example");

	await page.screenshot({
		path: testInfo.outputPath("runtime-guard-public.png"),
		fullPage: true,
	});
});
