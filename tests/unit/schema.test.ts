import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
	DINKUS_BLOCK_SCHEMA_VERSION,
	DINKUS_REPEATER_BLOCK_MAX_BYTES,
	DINKUS_SCALAR_BLOCK_MAX_BYTES,
	DINKUS_STRING_CAPS,
	configureDinkusBlockRuntime,
	createPlugin,
	dinkusBlockSchemas,
	guardDinkusBlockNode,
	isDinkusBlockType,
	parseDinkusBlockNode,
	type DinkusBlockIssue,
	type DinkusBlockLogEvent,
	type DinkusBlockType,
} from "../../src/index";

/**
 * Fixtures are read with JSON.parse rather than imported: bundler JSON
 * transforms can silently lose an own "__proto__" key, which one fixture
 * depends on.
 */
function loadFixture<T>(name: string): T {
	return JSON.parse(
		readFileSync(
			new URL(`./fixtures/blocks/${name}`, import.meta.url),
			"utf8",
		),
	) as T;
}

interface FixtureCase {
	name: string;
	type: string;
	node: unknown;
	expect: DinkusBlockIssue;
	keptFields?: string[];
}

const validFixtures = loadFixture<Record<DinkusBlockType, unknown>>(
	"valid.json",
);
const malformed = loadFixture<{ cases: FixtureCase[] }>("malformed.json");
const oversized = loadFixture<{ cases: FixtureCase[] }>("oversized.json");
const unknownKey = loadFixture<{ cases: FixtureCase[] }>("unknown-key.json");
const unknownBlock = loadFixture<{ cases: FixtureCase[] }>(
	"unknown-block.json",
);

describe("runtime block schemas", () => {
	const declaredBlocks = createPlugin().admin?.portableTextBlocks ?? [];

	it("covers every registered block type with a versioned schema", () => {
		const declaredTypes = declaredBlocks.map((block) => block.type).sort();
		expect(declaredTypes).toEqual(Object.keys(dinkusBlockSchemas).sort());
		for (const schema of Object.values(dinkusBlockSchemas)) {
			expect(schema.schemaVersion).toBe(DINKUS_BLOCK_SCHEMA_VERSION);
			expect([
				DINKUS_SCALAR_BLOCK_MAX_BYTES,
				DINKUS_REPEATER_BLOCK_MAX_BYTES,
			]).toContain(schema.maxBytes);
		}
	});

	it("matches every schema field to the registered admin fields", () => {
		for (const block of declaredBlocks) {
			const schema = dinkusBlockSchemas[block.type as DinkusBlockType];
			const scalarIds: string[] = [];
			const repeaterIds: string[] = [];
			for (const field of block.fields ?? []) {
				if (field.type === "repeater") {
					repeaterIds.push(field.action_id);
					const repeaterSchema = schema.repeaters[field.action_id];
					expect(repeaterSchema, `${block.type}.${field.action_id}`).toBeDefined();
					expect(
						Object.keys(repeaterSchema.fields).sort(),
						`${block.type}.${field.action_id} sub-fields`,
					).toEqual(field.fields.map((sub) => sub.action_id).sort());
					expect(repeaterSchema.maxItems).toBeGreaterThan(0);
				} else {
					scalarIds.push(field.action_id);
				}
			}
			expect(
				Object.keys(schema.fields).sort(),
				`${block.type} scalar fields`,
			).toEqual(scalarIds.sort());
			expect(
				Object.keys(schema.repeaters).sort(),
				`${block.type} repeaters`,
			).toEqual(repeaterIds.sort());
		}
	});

	it("recognizes exactly the registered types", () => {
		expect(isDinkusBlockType("dinkus.cta-band")).toBe(true);
		expect(isDinkusBlockType("dinkus.testimonial")).toBe(false);
		expect(isDinkusBlockType("block")).toBe(false);
		expect(isDinkusBlockType(undefined)).toBe(false);
	});
});

describe("parseDinkusBlockNode", () => {
	it.each(Object.entries(validFixtures))(
		"round-trips the valid %s fixture",
		(type, node) => {
			const result = parseDinkusBlockNode(type, node);
			expect(result.ok).toBe(true);
			expect(result.issues).toEqual([]);
			expect(result.value).toEqual(node);
		},
	);

	it.each(malformed.cases.map((c) => [c.name, c] as const))(
		"fails closed: %s",
		(_name, testCase) => {
			const result = parseDinkusBlockNode(testCase.type, testCase.node);
			expect(result.ok).toBe(false);
			expect(result.issues).toContainEqual(
				expect.objectContaining(testCase.expect),
			);
		},
	);

	it.each(oversized.cases.map((c) => [c.name, c] as const))(
		"enforces caps: %s",
		(_name, testCase) => {
			const result = parseDinkusBlockNode(testCase.type, testCase.node);
			expect(result.ok).toBe(false);
			expect(result.issues).toContainEqual(
				expect.objectContaining(testCase.expect),
			);
		},
	);

	it.each(unknownBlock.cases.map((c) => [c.name, c] as const))(
		"rejects unknown blocks: %s",
		(_name, testCase) => {
			const result = parseDinkusBlockNode(testCase.type, testCase.node);
			expect(result.ok).toBe(false);
			expect(result.issues).toEqual([
				expect.objectContaining(testCase.expect),
			]);
		},
	);

	it.each(unknownKey.cases.map((c) => [c.name, c] as const))(
		"rejects unknown keys at the strict boundary: %s",
		(_name, testCase) => {
			const result = parseDinkusBlockNode(testCase.type, testCase.node);
			expect(result.ok).toBe(false);
			expect(result.issues).toContainEqual(
				expect.objectContaining(testCase.expect),
			);
		},
	);

	it.each(unknownKey.cases.map((c) => [c.name, c] as const))(
		"strips unknown keys at the render boundary: %s",
		(_name, testCase) => {
			const result = parseDinkusBlockNode(testCase.type, testCase.node, {
				unknownKeys: "strip",
			});
			expect(result.ok).toBe(true);
			expect(result.issues).toContainEqual(
				expect.objectContaining(testCase.expect),
			);
			const value = result.value as Record<string, unknown>;
			expect(Object.keys(value).sort()).toEqual(
				[...(testCase.keptFields ?? [])].sort(),
			);
		},
	);

	it("never pollutes Object.prototype through a __proto__ key", () => {
		const testCase = unknownKey.cases.find((c) => c.name.includes("__proto__"));
		expect(testCase).toBeDefined();
		const result = parseDinkusBlockNode(testCase!.type, testCase!.node, {
			unknownKeys: "strip",
		});
		expect(result.ok).toBe(true);
		expect(Object.getPrototypeOf(result.value)).toBe(Object.prototype);
		expect(({} as { polluted?: boolean }).polluted).toBeUndefined();
	});

	it("normalizes null fields to absent instead of failing the block", () => {
		const result = parseDinkusBlockNode("dinkus.cta-band", {
			_type: "dinkus.cta-band",
			_key: "null-fields",
			heading: "Kept",
			body: null,
			facts: null,
		});
		// "facts" is unknown on cta-band; only "body" exercises null handling.
		const stripped = parseDinkusBlockNode(
			"dinkus.cta-band",
			{ _type: "dinkus.cta-band", _key: "null-fields", heading: "Kept", body: null },
		);
		expect(result.ok).toBe(false);
		expect(stripped.ok).toBe(true);
		expect(stripped.value).toEqual({
			_type: "dinkus.cta-band",
			_key: "null-fields",
			heading: "Kept",
		});
	});

	it("checks the byte cap before per-field parsing", () => {
		const node = {
			_type: "dinkus.cta-band",
			_key: "bytes-first",
			heading: "x".repeat(321),
			_smuggled: "s".repeat(17_000),
		};
		const result = parseDinkusBlockNode("dinkus.cta-band", node);
		expect(result.ok).toBe(false);
		expect(result.issues).toEqual([
			expect.objectContaining({
				code: "max-bytes",
				path: "$",
				limit: DINKUS_SCALAR_BLOCK_MAX_BYTES,
			}),
		]);
	});

	it("rejects unserializable nodes", () => {
		const circular: Record<string, unknown> = { _type: "dinkus.cta-band" };
		circular.self = circular;
		const result = parseDinkusBlockNode("dinkus.cta-band", circular);
		expect(result.ok).toBe(false);
		expect(result.issues).toEqual([
			expect.objectContaining({ code: "unserializable", path: "$" }),
		]);
	});

	it("keeps string caps aligned with the exported table", () => {
		expect(DINKUS_STRING_CAPS.token).toBe(160);
		expect(DINKUS_STRING_CAPS.short).toBe(320);
		expect(DINKUS_STRING_CAPS.long).toBe(8_192);
		expect(DINKUS_STRING_CAPS.itemLong).toBe(2_048);
		expect(DINKUS_STRING_CAPS.url).toBe(2_048);
	});
});

describe("guardDinkusBlockNode", () => {
	function withCapturedEvents(
		run: () => void,
	): DinkusBlockLogEvent[] {
		const events: DinkusBlockLogEvent[] = [];
		configureDinkusBlockRuntime({ logger: (event) => events.push(event) });
		try {
			run();
		} finally {
			configureDinkusBlockRuntime({ logger: undefined, siteId: undefined });
		}
		return events;
	}

	it("returns the parsed value for valid nodes without logging", () => {
		const events = withCapturedEvents(() => {
			const value = guardDinkusBlockNode(
				"dinkus.cta-band",
				validFixtures["dinkus.cta-band"],
			);
			expect(value).toEqual(validFixtures["dinkus.cta-band"]);
		});
		expect(events).toEqual([]);
	});

	it("omits malformed blocks with a structured log and no content dump", () => {
		const hostile = "javascript:alert(document.cookie)";
		const events = withCapturedEvents(() => {
			configureDinkusBlockRuntime({ siteId: "fixture-site" });
			const value = guardDinkusBlockNode(
				"dinkus.cta-band",
				{
					_type: "dinkus.cta-band",
					_key: "hostile-key",
					heading: 42,
					body: hostile,
				},
				{ entryId: "home" },
			);
			expect(value).toBeUndefined();
		});
		expect(events).toHaveLength(1);
		const event = events[0];
		expect(event.event).toBe("dinkus-block-omitted");
		expect(event.schemaVersion).toBe(DINKUS_BLOCK_SCHEMA_VERSION);
		expect(event.blockType).toBe("dinkus.cta-band");
		expect(event.blockKey).toBe("hostile-key");
		expect(event.siteId).toBe("fixture-site");
		expect(event.entryId).toBe("home");
		expect(event.issues).toContainEqual(
			expect.objectContaining({ code: "invalid-value", path: "heading" }),
		);
		expect(JSON.stringify(event)).not.toContain(hostile);
		expect(JSON.stringify(event)).not.toContain("42");
	});

	it("strips unknown keys at render with a structured log", () => {
		const events = withCapturedEvents(() => {
			const value = guardDinkusBlockNode("dinkus.cta-band", {
				_type: "dinkus.cta-band",
				_key: "stripped",
				heading: "Kept heading",
				onclick: "alert(1)",
			});
			expect(value).toEqual({
				_type: "dinkus.cta-band",
				_key: "stripped",
				heading: "Kept heading",
			});
		});
		expect(events).toHaveLength(1);
		expect(events[0].event).toBe("dinkus-block-keys-stripped");
		expect(events[0].issues).toEqual([
			expect.objectContaining({ code: "unknown-key", path: "onclick" }),
		]);
		expect(JSON.stringify(events[0])).not.toContain("alert(1)");
	});

	it("omits unknown block types", () => {
		const events = withCapturedEvents(() => {
			const value = guardDinkusBlockNode("dinkus.testimonial", {
				_type: "dinkus.testimonial",
				_key: "unknown",
			});
			expect(value).toBeUndefined();
		});
		expect(events).toHaveLength(1);
		expect(events[0].event).toBe("dinkus-block-omitted");
		expect(events[0].issues).toEqual([
			expect.objectContaining({ code: "unknown-block" }),
		]);
	});

	it("never lets a throwing log sink break the render", () => {
		configureDinkusBlockRuntime({
			logger: () => {
				throw new Error("sink down");
			},
		});
		try {
			expect(
				guardDinkusBlockNode("dinkus.cta-band", { _type: "dinkus.page-hero" }),
			).toBeUndefined();
			expect(
				guardDinkusBlockNode(
					"dinkus.cta-band",
					validFixtures["dinkus.cta-band"],
				),
			).toEqual(validFixtures["dinkus.cta-band"]);
		} finally {
			configureDinkusBlockRuntime({ logger: undefined });
		}
	});
});
