const ALLOWED_CTA_PROTOCOLS = new Set([
	"http:",
	"https:",
	"mailto:",
	"tel:",
]);

export function safeCtaHref(value: unknown): string | undefined {
	if (typeof value !== "string") return undefined;

	const href = value.trim();
	if (!href) return undefined;
	if (href.startsWith("#")) return href;
	// Reject "/\..." too: URL parsing treats "\" as "/", so it resolves
	// protocol-relative in browsers instead of staying on the origin.
	if (
		href.startsWith("/") &&
		!href.startsWith("//") &&
		!href.startsWith("/\\")
	) {
		return href;
	}

	try {
		const url = new URL(href);
		return ALLOWED_CTA_PROTOCOLS.has(url.protocol) ? href : undefined;
	} catch {
		return undefined;
	}
}
