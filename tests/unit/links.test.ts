import { describe, expect, it } from "vitest";

import {
	DINKUS_URL_MAX_LENGTH,
	configureDinkusUrlPolicy,
	safeCtaHref,
	safeMediaSrc,
	safeNavigationHref,
} from "../../src/index";

describe("safeNavigationHref", () => {
	it.each([
		["/contact", "/contact"],
		["#details", "#details"],
		["https://example.com/contact", "https://example.com/contact"],
		["mailto:hello@example.com", "mailto:hello@example.com"],
		["tel:+15551234567", "tel:+15551234567"],
	])("keeps the historical allowlist for %s", (input, expected) => {
		expect(safeNavigationHref(input)).toBe(expected);
	});

	it.each([
		"javascript:alert(1)",
		"data:text/html,<script>alert(1)</script>",
		"//evil.example/path",
		"/\\evil.example/path",
		"\\/evil.example/path",
		"relative/path",
		"",
		42,
		null,
	])("rejects unsafe navigation value %s", (input) => {
		expect(safeNavigationHref(input)).toBeUndefined();
	});

	it("rejects credentials, control characters, and backslashes", () => {
		expect(
			safeNavigationHref("https://user:secret@example.com/path"),
		).toBeUndefined();
		expect(safeNavigationHref("https://user@example.com/")).toBeUndefined();
		expect(safeNavigationHref("/path\tname")).toBeUndefined();
		expect(safeNavigationHref("/path\nname")).toBeUndefined();
		expect(safeNavigationHref("https://example.com/a\\b")).toBeUndefined();
	});

	it("caps stored URL length", () => {
		const long = `/proof?pad=${"p".repeat(DINKUS_URL_MAX_LENGTH)}`;
		expect(safeNavigationHref(long)).toBeUndefined();
		expect(safeNavigationHref("/p", { maxLength: 1 })).toBeUndefined();
	});

	it("enforces an external-host allowlist when one is configured", () => {
		const policy = { navigationExternalHosts: ["example.com"] };
		expect(safeNavigationHref("https://example.com/x", policy)).toBe(
			"https://example.com/x",
		);
		expect(safeNavigationHref("https://EXAMPLE.com/x", policy)).toBe(
			"https://EXAMPLE.com/x",
		);
		expect(
			safeNavigationHref("https://evil.example/x", policy),
		).toBeUndefined();
		expect(
			safeNavigationHref("https://sub.example.com/x", policy),
		).toBeUndefined();
		expect(safeNavigationHref("/still-fine", policy)).toBe("/still-fine");
		expect(
			safeNavigationHref("https://anywhere.example/x", {
				navigationExternalHosts: [],
			}),
		).toBeUndefined();
	});

	it("offers an HTTPS-only production option that spares mailto and tel", () => {
		const policy = { httpsOnly: true };
		expect(safeNavigationHref("http://example.com/x", policy)).toBeUndefined();
		expect(safeNavigationHref("https://example.com/x", policy)).toBe(
			"https://example.com/x",
		);
		expect(safeNavigationHref("mailto:hello@example.com", policy)).toBe(
			"mailto:hello@example.com",
		);
		expect(safeNavigationHref("tel:+15551234567", policy)).toBe(
			"tel:+15551234567",
		);
	});
});

describe("safeMediaSrc", () => {
	it("allows same-origin media paths by default", () => {
		expect(safeMediaSrc("/media/fixture/hero.jpg")).toBe(
			"/media/fixture/hero.jpg",
		);
	});

	it("denies absolute URLs until a media host is approved", () => {
		expect(safeMediaSrc("https://cdn.example.com/x.jpg")).toBeUndefined();
		expect(
			safeMediaSrc("https://cdn.example.com/x.jpg", {
				mediaHosts: ["cdn.example.com"],
			}),
		).toBe("https://cdn.example.com/x.jpg");
		expect(
			safeMediaSrc("https://evil.example/x.jpg", {
				mediaHosts: ["cdn.example.com"],
			}),
		).toBeUndefined();
	});

	it("requires HTTPS for approved hosts", () => {
		expect(
			safeMediaSrc("http://cdn.example.com/x.jpg", {
				mediaHosts: ["cdn.example.com"],
			}),
		).toBeUndefined();
	});

	it("rejects credential, hash, data, and protocol-relative forms", () => {
		const policy = { mediaHosts: ["cdn.example.com"] };
		expect(
			safeMediaSrc("https://user:pw@cdn.example.com/x.jpg", policy),
		).toBeUndefined();
		expect(safeMediaSrc("#fragment", policy)).toBeUndefined();
		expect(
			safeMediaSrc("data:image/svg+xml,<svg onload=alert(1)>", policy),
		).toBeUndefined();
		expect(safeMediaSrc("//cdn.example.com/x.jpg", policy)).toBeUndefined();
		expect(safeMediaSrc("/\\cdn.example.com/x.jpg", policy)).toBeUndefined();
	});

	it("caps stored media URL length", () => {
		expect(
			safeMediaSrc(`/media/${"m".repeat(DINKUS_URL_MAX_LENGTH)}.jpg`),
		).toBeUndefined();
	});
});

describe("configureDinkusUrlPolicy", () => {
	it("feeds site-level defaults into every policy helper", () => {
		try {
			configureDinkusUrlPolicy({
				navigationExternalHosts: ["partner.example.com"],
				mediaHosts: ["cdn.example.com"],
			});
			expect(safeNavigationHref("https://partner.example.com/x")).toBe(
				"https://partner.example.com/x",
			);
			expect(safeNavigationHref("https://other.example.com/x")).toBeUndefined();
			expect(safeCtaHref("https://partner.example.com/x")).toBe(
				"https://partner.example.com/x",
			);
			expect(safeCtaHref("https://other.example.com/x")).toBeUndefined();
			expect(safeMediaSrc("https://cdn.example.com/x.jpg")).toBe(
				"https://cdn.example.com/x.jpg",
			);
			// A per-call policy still overrides the configured default.
			expect(
				safeNavigationHref("https://other.example.com/x", {
					navigationExternalHosts: undefined,
				}),
			).toBe("https://other.example.com/x");
		} finally {
			configureDinkusUrlPolicy({
				navigationExternalHosts: undefined,
				mediaHosts: undefined,
			});
		}
	});
});

describe("safeCtaHref (historical alias)", () => {
	it.each([
		["/contact", "/contact"],
		["#details", "#details"],
		["https://example.com/contact", "https://example.com/contact"],
		["mailto:hello@example.com", "mailto:hello@example.com"],
		["tel:+15551234567", "tel:+15551234567"],
	])("still allows supported CTA href %s", (input, expected) => {
		expect(safeCtaHref(input)).toBe(expected);
	});

	it.each([
		"javascript:alert(1)",
		"//evil.example/path",
		"relative/path",
	])("still rejects unsafe CTA href %s", (input) => {
		expect(safeCtaHref(input)).toBeUndefined();
	});
});
