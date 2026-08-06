/**
 * URL policy for stored content, split by sink context:
 *
 * - safeNavigationHref — anchor hrefs. Same-origin paths and hash links
 *   always pass; absolute web links can be limited to an external-host
 *   allowlist and to HTTPS; mailto:/tel: stay available for contact links.
 * - safeMediaSrc — media src attributes. Same-origin paths always pass;
 *   absolute URLs must be HTTPS on an approved media host, which is
 *   deny-by-default until a site approves hosts.
 * - safeCtaHref — the historical name for the navigation policy, kept for
 *   existing consumers; it delegates to safeNavigationHref.
 *
 * Every policy rejects credentials, control characters, backslashes, and
 * protocol-relative forms, and caps length. All are pure string-in/
 * string-or-undefined-out: an unsafe value renders as no link/media, never
 * as a thrown error.
 */

export interface DinkusUrlPolicy {
	/**
	 * Hostnames (exact, case-insensitive) allowed for absolute http(s)
	 * navigation links. Undefined (the default) preserves the historical
	 * behavior of allowing any host; an empty list allows same-origin
	 * navigation only.
	 */
	navigationExternalHosts?: readonly string[];
	/**
	 * Hostnames (exact, case-insensitive) allowed for absolute HTTPS media
	 * URLs. Defaults to none: media is same-origin only until a site
	 * approves its media hosts.
	 */
	mediaHosts?: readonly string[];
	/** Reject http: navigation links — the production option. */
	httpsOnly?: boolean;
	/** Maximum stored URL length. Defaults to 2048. */
	maxLength?: number;
}

export const DINKUS_URL_MAX_LENGTH = 2_048;

let sitePolicy: DinkusUrlPolicy = {};

/**
 * Optional site-level URL policy consumed by safeNavigationHref,
 * safeMediaSrc, and safeCtaHref when no per-call policy is given. Call it
 * once from site config; keys merge over previous calls.
 */
export function configureDinkusUrlPolicy(policy: DinkusUrlPolicy): void {
	sitePolicy = { ...sitePolicy, ...policy };
}

const NAVIGATION_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);
const MEDIA_PROTOCOLS = new Set(["https:"]);

interface StoredUrlRules {
	maxLength: number;
	allowHash: boolean;
	protocols: ReadonlySet<string>;
	/** Undefined allows any host; otherwise an exact hostname allowlist. */
	hosts: readonly string[] | undefined;
	httpsOnly: boolean;
}

function checkStoredUrl(
	value: unknown,
	rules: StoredUrlRules,
): string | undefined {
	if (typeof value !== "string") return undefined;

	const href = value.trim();
	if (!href || href.length > rules.maxLength) return undefined;
	for (let index = 0; index < href.length; index += 1) {
		const code = href.charCodeAt(index);
		if (code <= 0x1f || code === 0x7f) return undefined;
	}
	// URL parsing treats "\" as "/", so backslash forms can resolve
	// protocol-relative in browsers instead of staying on the origin.
	if (href.includes("\\")) return undefined;

	if (href.startsWith("#")) return rules.allowHash ? href : undefined;
	if (href.startsWith("/")) {
		// "//host" is protocol-relative: it escapes the origin.
		return href.startsWith("//") ? undefined : href;
	}

	let url: URL;
	try {
		url = new URL(href);
	} catch {
		return undefined;
	}
	if (!rules.protocols.has(url.protocol)) return undefined;
	if (url.username || url.password) return undefined;
	if (url.protocol === "http:" || url.protocol === "https:") {
		if (rules.httpsOnly && url.protocol === "http:") return undefined;
		if (rules.hosts !== undefined) {
			const hostname = url.hostname.toLowerCase();
			const allowed = rules.hosts.some(
				(host) => host.toLowerCase() === hostname,
			);
			if (!allowed) return undefined;
		}
	}
	return href;
}

/**
 * Validate a stored navigation href (anchor targets). Returns the href
 * when safe, undefined otherwise.
 */
export function safeNavigationHref(
	value: unknown,
	policy?: DinkusUrlPolicy,
): string | undefined {
	const merged = { ...sitePolicy, ...policy };
	return checkStoredUrl(value, {
		maxLength: merged.maxLength ?? DINKUS_URL_MAX_LENGTH,
		allowHash: true,
		protocols: NAVIGATION_PROTOCOLS,
		hosts: merged.navigationExternalHosts,
		httpsOnly: merged.httpsOnly ?? false,
	});
}

/**
 * Validate a stored media URL (img/src sinks). Same-origin paths pass;
 * absolute URLs must be HTTPS on an approved media host. Returns the URL
 * when safe, undefined otherwise.
 */
export function safeMediaSrc(
	value: unknown,
	policy?: DinkusUrlPolicy,
): string | undefined {
	const merged = { ...sitePolicy, ...policy };
	return checkStoredUrl(value, {
		maxLength: merged.maxLength ?? DINKUS_URL_MAX_LENGTH,
		allowHash: false,
		protocols: MEDIA_PROTOCOLS,
		hosts: merged.mediaHosts ?? [],
		httpsOnly: true,
	});
}

/**
 * Historical name for the navigation policy, kept for existing consumers.
 * Prefer safeNavigationHref (links) and safeMediaSrc (media) in new code.
 */
export function safeCtaHref(value: unknown): string | undefined {
	return safeNavigationHref(value);
}
