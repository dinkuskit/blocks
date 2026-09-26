import type { PortableTextNode } from "../../shared/portable-text";

export const QUERY_CARD_BLOCK_TYPE = "dinkus.query-card";

export interface QueryCardNode extends PortableTextNode {
	_type?: "dinkus.query-card";
	source?: string;
	limit?: string;
}

export interface QueryCardEntry {
	id: string;
	data?: unknown;
}

export interface QueryCardRecord {
	id: string;
	title?: string;
	text?: string;
	imageSrc?: string;
	imageAlt?: string;
	href?: string;
}
