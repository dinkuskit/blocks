import type { PortableTextNode } from "../../shared/portable-text";

export const SECTION_HEADER_BLOCK_TYPE = "dinkus.section-header";

export interface SectionHeaderNode extends PortableTextNode {
	_type?: "dinkus.section-header";
	number?: string;
	kicker?: string;
	title?: string;
	intro?: string;
}
