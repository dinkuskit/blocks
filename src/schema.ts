import type {
	CtaBandNode,
	DispatchNode,
	FactRailNode,
	GalleryHeroNode,
	GalleryLanesNode,
	LedgerCardsNode,
	PageHeroNode,
	ProjectRecordNode,
	SearchBoardNode,
	SectionHeaderNode,
	ServiceAreaMapNode,
} from "./types";

/**
 * Version of the stored-block runtime schemas below. This numbers the data
 * contract, not the package: it only increments when a schema-changing
 * release ships per COMPAT.md, alongside that release's migration artifacts.
 */
export const DINKUS_BLOCK_SCHEMA_VERSION = 1;

/**
 * Upper bounds for stored string fields, by content kind. These are abuse
 * bounds enforced at trust boundaries, not editorial guidance; every cap is
 * far above any content the admin UI produces in normal use.
 */
export const DINKUS_STRING_CAPS = {
	/** Machine-ish slugs: section numbers, record codes/ids, icon names. */
	token: 160,
	/** Single-line human text: labels, kickers, headings, titles, alt text. */
	short: 320,
	/** Top-level multiline copy: body, deck, intro, caption, evidence. */
	long: 8_192,
	/** Multiline copy stored inside a repeater item. */
	itemLong: 2_048,
	/** Stored URLs and URL-valued contact fields. */
	url: 2_048,
} as const;

export type DinkusStringKind = keyof typeof DINKUS_STRING_CAPS;

/** Serialized-byte cap for blocks whose fields are all scalar strings. */
export const DINKUS_SCALAR_BLOCK_MAX_BYTES = 16_384;
/** Serialized-byte cap for blocks that carry a repeater. */
export const DINKUS_REPEATER_BLOCK_MAX_BYTES = 131_072;

export interface DinkusBlockNodeMap {
	"dinkus.cta-band": CtaBandNode;
	"dinkus.page-hero": PageHeroNode;
	"dinkus.section-header": SectionHeaderNode;
	"dinkus.fact-rail": FactRailNode;
	"dinkus.gallery-hero": GalleryHeroNode;
	"dinkus.ledger-cards": LedgerCardsNode;
	"dinkus.gallery-lanes": GalleryLanesNode;
	"dinkus.search-board": SearchBoardNode;
	"dinkus.service-area-map": ServiceAreaMapNode;
	"dinkus.dispatch": DispatchNode;
	"dinkus.project-record": ProjectRecordNode;
}

export type DinkusBlockType = keyof DinkusBlockNodeMap;

export interface DinkusRepeaterSchema {
	maxItems: number;
	fields: Readonly<Record<string, DinkusStringKind>>;
}

export interface DinkusBlockSchema {
	type: DinkusBlockType;
	schemaVersion: typeof DINKUS_BLOCK_SCHEMA_VERSION;
	maxBytes: number;
	fields: Readonly<Record<string, DinkusStringKind>>;
	repeaters: Readonly<Record<string, DinkusRepeaterSchema>>;
}

const schema = (
	type: DinkusBlockType,
	maxBytes: number,
	fields: Record<string, DinkusStringKind>,
	repeaters: Record<string, DinkusRepeaterSchema> = {},
): DinkusBlockSchema => ({
	type,
	schemaVersion: DINKUS_BLOCK_SCHEMA_VERSION,
	maxBytes,
	fields,
	repeaters,
});

export const dinkusBlockSchemas: Readonly<
	Record<DinkusBlockType, DinkusBlockSchema>
> = {
	"dinkus.cta-band": schema("dinkus.cta-band", DINKUS_SCALAR_BLOCK_MAX_BYTES, {
		eyebrow: "short",
		heading: "short",
		body: "long",
		ctaLabel: "short",
		ctaHref: "url",
	}),
	"dinkus.page-hero": schema(
		"dinkus.page-hero",
		DINKUS_SCALAR_BLOCK_MAX_BYTES,
		{
			eyebrow: "short",
			headline: "short",
			deck: "long",
			primaryLabel: "short",
			primaryHref: "url",
			secondaryLabel: "short",
			secondaryHref: "url",
		},
	),
	"dinkus.section-header": schema(
		"dinkus.section-header",
		DINKUS_SCALAR_BLOCK_MAX_BYTES,
		{
			number: "token",
			kicker: "short",
			title: "short",
			intro: "long",
		},
	),
	"dinkus.fact-rail": schema(
		"dinkus.fact-rail",
		DINKUS_REPEATER_BLOCK_MAX_BYTES,
		{ ariaLabel: "short" },
		{
			facts: {
				maxItems: 24,
				fields: { label: "short", value: "short", icon: "token" },
			},
		},
	),
	"dinkus.gallery-hero": schema(
		"dinkus.gallery-hero",
		DINKUS_SCALAR_BLOCK_MAX_BYTES,
		{
			image: "url",
			imageAlt: "short",
			eyebrow: "short",
			headline: "short",
			deck: "long",
			primaryLabel: "short",
			primaryHref: "url",
			secondaryLabel: "short",
			secondaryHref: "url",
		},
	),
	"dinkus.ledger-cards": schema(
		"dinkus.ledger-cards",
		DINKUS_REPEATER_BLOCK_MAX_BYTES,
		{},
		{
			cards: {
				maxItems: 24,
				fields: {
					code: "token",
					title: "short",
					body: "itemLong",
					ctaLabel: "short",
					ctaHref: "url",
				},
			},
		},
	),
	"dinkus.gallery-lanes": schema(
		"dinkus.gallery-lanes",
		DINKUS_REPEATER_BLOCK_MAX_BYTES,
		{},
		{
			lanes: {
				maxItems: 24,
				fields: { label: "short", meta: "short", href: "url", image: "url" },
			},
		},
	),
	"dinkus.search-board": schema(
		"dinkus.search-board",
		DINKUS_REPEATER_BLOCK_MAX_BYTES,
		{
			number: "token",
			kicker: "short",
			title: "short",
			intro: "long",
		},
		{
			links: {
				maxItems: 32,
				fields: { label: "short", href: "url" },
			},
		},
	),
	"dinkus.service-area-map": schema(
		"dinkus.service-area-map",
		DINKUS_REPEATER_BLOCK_MAX_BYTES,
		{
			image: "url",
			imageAlt: "short",
			caption: "long",
		},
		{
			legend: {
				maxItems: 24,
				fields: { label: "short", icon: "token" },
			},
		},
	),
	"dinkus.dispatch": schema("dinkus.dispatch", DINKUS_SCALAR_BLOCK_MAX_BYTES, {
		kicker: "short",
		title: "short",
		body: "long",
		ctaLabel: "short",
		ctaHref: "url",
		phone: "url",
		email: "url",
	}),
	"dinkus.project-record": schema(
		"dinkus.project-record",
		DINKUS_REPEATER_BLOCK_MAX_BYTES,
		{
			recordId: "token",
			category: "short",
			title: "short",
			summary: "long",
			identityImage: "url",
			identityAlt: "short",
			statusKicker: "short",
			status: "short",
			roleKicker: "short",
			roleHeadline: "short",
			roleBody: "long",
			evidenceKicker: "short",
			proofHeadline: "short",
			evidence: "long",
			nextKicker: "short",
			nextTitle: "short",
			nextHref: "url",
		},
		{
			links: {
				maxItems: 24,
				fields: { label: "short", href: "url" },
			},
		},
	),
};

export function isDinkusBlockType(value: unknown): value is DinkusBlockType {
	return (
		typeof value === "string" &&
		Object.prototype.hasOwnProperty.call(dinkusBlockSchemas, value)
	);
}

export type DinkusBlockIssueCode =
	| "unknown-block"
	| "not-an-object"
	| "unserializable"
	| "max-bytes"
	| "wrong-block-type"
	| "unknown-key"
	| "invalid-value"
	| "max-length"
	| "max-items";

/**
 * One violation found while parsing a stored block. Issues carry the
 * location and the observed size, never the observed content, so they are
 * safe to log verbatim.
 */
export interface DinkusBlockIssue {
	code: DinkusBlockIssueCode;
	/** Field location, e.g. "$", "heading", or "facts[3].label". */
	path: string;
	/** The enforced bound, for cap violations. */
	limit?: number;
	/** The observed length/count/bytes, for cap violations. */
	actual?: number;
}

export type DinkusUnknownKeyPolicy = "reject" | "strip";

export interface ParseDinkusBlockNodeOptions {
	/**
	 * "reject" (default) fails the block when it carries a key the schema
	 * does not declare — the strict write/import boundary. "strip" keeps the
	 * block, drops the unknown keys from the parsed value, and reports them
	 * as non-fatal issues — the render boundary, where human content is
	 * preserved but undeclared data can never reach markup.
	 */
	unknownKeys?: DinkusUnknownKeyPolicy;
}

export type DinkusBlockParseResult<
	TType extends DinkusBlockType = DinkusBlockType,
> =
	| { ok: true; value: DinkusBlockNodeMap[TType]; issues: DinkusBlockIssue[] }
	| { ok: false; value?: undefined; issues: DinkusBlockIssue[] };

const textEncoder = new TextEncoder();

function serializedByteLength(value: unknown): number | undefined {
	try {
		const serialized = JSON.stringify(value);
		if (typeof serialized !== "string") return undefined;
		return textEncoder.encode(serialized).length;
	} catch {
		return undefined;
	}
}

function isPlainObjectLike(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Validate one stored block value against its versioned runtime schema.
 *
 * TypeScript types vanish at runtime and the admin form is only one of the
 * writers (importers, seeds, and agent writers skip it), so every trust
 * boundary re-checks shape and size here: strict key policy, string caps,
 * repeater item caps, and a per-block serialized-byte cap, checked first so
 * oversized payloads are rejected before any per-field work.
 */
export function parseDinkusBlockNode<TType extends DinkusBlockType>(
	type: TType,
	value: unknown,
	options?: ParseDinkusBlockNodeOptions,
): DinkusBlockParseResult<TType>;
export function parseDinkusBlockNode(
	type: string,
	value: unknown,
	options?: ParseDinkusBlockNodeOptions,
): DinkusBlockParseResult;
export function parseDinkusBlockNode(
	type: string,
	value: unknown,
	options: ParseDinkusBlockNodeOptions = {},
): DinkusBlockParseResult {
	const unknownKeys: DinkusUnknownKeyPolicy = options.unknownKeys ?? "reject";

	if (!isDinkusBlockType(type)) {
		return { ok: false, issues: [{ code: "unknown-block", path: "$" }] };
	}
	const blockSchema = dinkusBlockSchemas[type];

	if (!isPlainObjectLike(value)) {
		return { ok: false, issues: [{ code: "not-an-object", path: "$" }] };
	}

	const bytes = serializedByteLength(value);
	if (bytes === undefined) {
		return { ok: false, issues: [{ code: "unserializable", path: "$" }] };
	}
	if (bytes > blockSchema.maxBytes) {
		return {
			ok: false,
			issues: [
				{
					code: "max-bytes",
					path: "$",
					limit: blockSchema.maxBytes,
					actual: bytes,
				},
			],
		};
	}

	const issues: DinkusBlockIssue[] = [];
	const output: Record<string, unknown> = {};
	let fatal = false;

	const parseString = (
		raw: unknown,
		kind: DinkusStringKind,
		path: string,
	): string | undefined => {
		if (raw === undefined || raw === null) return undefined;
		if (typeof raw !== "string") {
			issues.push({ code: "invalid-value", path });
			fatal = true;
			return undefined;
		}
		const limit = DINKUS_STRING_CAPS[kind];
		if (raw.length > limit) {
			issues.push({ code: "max-length", path, limit, actual: raw.length });
			fatal = true;
			return undefined;
		}
		return raw;
	};

	const parseKey = (raw: unknown, path: string): string | undefined =>
		parseString(raw, "token", path);

	for (const [key, raw] of Object.entries(value)) {
		if (key === "_type") {
			if (raw !== type) {
				issues.push({ code: "wrong-block-type", path: "_type" });
				fatal = true;
				continue;
			}
			output._type = raw;
			continue;
		}
		if (key === "_key" || key === "id") {
			// "id" is stamped onto every block node by the EmDash 0.29.0
			// editor on save; both are system identifiers, not content.
			const parsed = parseKey(raw, key);
			if (parsed !== undefined) output[key] = parsed;
			continue;
		}
		if (Object.prototype.hasOwnProperty.call(blockSchema.fields, key)) {
			const parsed = parseString(raw, blockSchema.fields[key], key);
			if (parsed !== undefined) output[key] = parsed;
			continue;
		}
		if (Object.prototype.hasOwnProperty.call(blockSchema.repeaters, key)) {
			if (raw === undefined || raw === null) continue;
			const repeater = blockSchema.repeaters[key];
			if (!Array.isArray(raw)) {
				issues.push({ code: "invalid-value", path: key });
				fatal = true;
				continue;
			}
			if (raw.length > repeater.maxItems) {
				issues.push({
					code: "max-items",
					path: key,
					limit: repeater.maxItems,
					actual: raw.length,
				});
				fatal = true;
				continue;
			}
			const items: Record<string, unknown>[] = [];
			raw.forEach((item, index) => {
				const itemPath = `${key}[${index}]`;
				if (!isPlainObjectLike(item)) {
					issues.push({ code: "invalid-value", path: itemPath });
					fatal = true;
					return;
				}
				const parsedItem: Record<string, unknown> = {};
				for (const [itemKey, itemRaw] of Object.entries(item)) {
					const fieldPath = `${itemPath}.${itemKey}`;
					if (itemKey === "_key") {
						const parsed = parseKey(itemRaw, fieldPath);
						if (parsed !== undefined) parsedItem._key = parsed;
						continue;
					}
					if (
						Object.prototype.hasOwnProperty.call(repeater.fields, itemKey)
					) {
						const parsed = parseString(
							itemRaw,
							repeater.fields[itemKey],
							fieldPath,
						);
						if (parsed !== undefined) parsedItem[itemKey] = parsed;
						continue;
					}
					issues.push({ code: "unknown-key", path: fieldPath });
					if (unknownKeys === "reject") fatal = true;
				}
				items.push(parsedItem);
			});
			output[key] = items;
			continue;
		}
		issues.push({ code: "unknown-key", path: key });
		if (unknownKeys === "reject") fatal = true;
	}

	if (fatal) {
		return { ok: false, issues };
	}
	return { ok: true, value: output as DinkusBlockNodeMap[DinkusBlockType], issues };
}

export interface DinkusBlockGuardContext {
	siteId?: string;
	entryId?: string;
}

/**
 * Structured record of a render-boundary decision. Carries ids and issue
 * codes/paths/sizes only — never stored content — so it is safe to forward
 * to any log sink.
 */
export interface DinkusBlockLogEvent extends DinkusBlockGuardContext {
	event: "dinkus-block-omitted" | "dinkus-block-keys-stripped";
	schemaVersion: typeof DINKUS_BLOCK_SCHEMA_VERSION;
	blockType: string;
	blockKey?: string;
	issues: DinkusBlockIssue[];
}

export type DinkusBlockLogger = (event: DinkusBlockLogEvent) => void;

interface DinkusBlockRuntimeOptions extends DinkusBlockGuardContext {
	logger?: DinkusBlockLogger;
}

const defaultLogger: DinkusBlockLogger = (event) => {
	console.warn(`[dinkus-blocks] ${event.event}`, JSON.stringify(event));
};

let runtimeOptions: DinkusBlockRuntimeOptions = {};

/**
 * Optional site-level wiring for the render guard: a site id stamped onto
 * every log event and/or a custom structured-log sink. Idempotent; call it
 * once from site config. Rendering works without it (events then carry
 * block ids only and go to console.warn).
 */
export function configureDinkusBlockRuntime(
	options: DinkusBlockRuntimeOptions,
): void {
	runtimeOptions = { ...runtimeOptions, ...options };
}

function readBlockKey(value: unknown): string | undefined {
	if (!isPlainObjectLike(value)) return undefined;
	const key = value._key;
	if (typeof key !== "string" || key.length === 0) return undefined;
	return key.slice(0, DINKUS_STRING_CAPS.token);
}

function emit(event: DinkusBlockLogEvent): void {
	const logger = runtimeOptions.logger ?? defaultLogger;
	try {
		logger(event);
	} catch {
		// A failing log sink must never take down a page render.
	}
}

/**
 * Render-boundary guard: returns the parsed block value, or undefined when
 * the block must be omitted. Never throws. A malformed block is dropped
 * with a structured log — one bad block cannot take down the page, and the
 * raw invalid object is never serialized into markup or logs. Unknown keys
 * are stripped (and logged) rather than fatal here, so saved human content
 * survives editor quirks while undeclared data still cannot reach HTML.
 */
export function guardDinkusBlockNode<TType extends DinkusBlockType>(
	type: TType,
	value: unknown,
	context?: DinkusBlockGuardContext,
): DinkusBlockNodeMap[TType] | undefined;
export function guardDinkusBlockNode(
	type: string,
	value: unknown,
	context?: DinkusBlockGuardContext,
): DinkusBlockNodeMap[DinkusBlockType] | undefined;
export function guardDinkusBlockNode(
	type: string,
	value: unknown,
	context: DinkusBlockGuardContext = {},
): DinkusBlockNodeMap[DinkusBlockType] | undefined {
	const base = {
		schemaVersion: DINKUS_BLOCK_SCHEMA_VERSION,
		blockType: type,
		blockKey: readBlockKey(value),
		siteId: context.siteId ?? runtimeOptions.siteId,
		entryId: context.entryId ?? runtimeOptions.entryId,
	} as const;

	let result: DinkusBlockParseResult;
	try {
		result = parseDinkusBlockNode(type, value, { unknownKeys: "strip" });
	} catch {
		// parseDinkusBlockNode is total; this is a belt for the render path.
		emit({
			...base,
			event: "dinkus-block-omitted",
			issues: [{ code: "unserializable", path: "$" }],
		});
		return undefined;
	}

	if (!result.ok) {
		emit({ ...base, event: "dinkus-block-omitted", issues: result.issues });
		return undefined;
	}
	if (result.issues.length > 0) {
		emit({
			...base,
			event: "dinkus-block-keys-stripped",
			issues: result.issues,
		});
	}
	return result.value;
}
