import { safeCtaHref } from "../../shared/links";
import type { QueryCardEntry, QueryCardRecord } from "./contract";

const SOURCE_PATTERN = /^[A-Za-z][A-Za-z0-9_-]{0,63}$/;
const LIMIT_MAX = 24;

export function queryCardSource(value: unknown): string | undefined {
	if (typeof value !== "string") return undefined;
	const source = value.trim();
	return SOURCE_PATTERN.test(source) ? source : undefined;
}

export function queryCardLimit(value: unknown): number | undefined {
	if (typeof value === "number" && Number.isInteger(value)) {
		return value >= 1 && value <= LIMIT_MAX ? value : undefined;
	}
	if (typeof value !== "string") return undefined;
	if (!/^[1-9]\d*$/.test(value.trim())) return undefined;
	const limit = Number(value.trim());
	return limit >= 1 && limit <= LIMIT_MAX ? limit : undefined;
}

function readString(data: Record<string, unknown>, key: string): string | undefined {
	const value = data[key];
	return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readImage(value: unknown): { src?: string; alt?: string } {
	if (typeof value === "string") {
		return { src: safeImageSrc(value) };
	}
	if (!value || typeof value !== "object" || Array.isArray(value)) return {};
	const record = value as Record<string, unknown>;
	const alt = readString(record, "alt");
	const direct = safeImageSrc(record.src) ?? safeImageSrc(record.url);
	if (direct) return { src: direct, alt };
	const media = record.$media;
	if (!media || typeof media !== "object" || Array.isArray(media)) {
		return { alt };
	}
	return { src: safeImageSrc((media as Record<string, unknown>).url), alt };
}

function safeImageSrc(value: unknown): string | undefined {
	const href = safeCtaHref(value);
	if (!href) return undefined;
	if (href.startsWith("mailto:") || href.startsWith("tel:")) return undefined;
	return href;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function readQueryCardRecords(
	entries: readonly QueryCardEntry[],
): QueryCardRecord[] {
	const records: QueryCardRecord[] = [];
	for (const entry of entries) {
		if (!entry || typeof entry.id !== "string" || !entry.id.trim()) continue;
		if (!isRecord(entry.data)) continue;
		const title = readString(entry.data, "title");
		const text = readString(entry.data, "text");
		if (!title && !text) continue;
		const image = readImage(entry.data.image);
		records.push({
			id: entry.id,
			title,
			text,
			imageSrc: image.src,
			imageAlt: image.alt,
			href: title ? safeCtaHref(entry.data.link) : undefined,
		});
	}
	return records;
}
