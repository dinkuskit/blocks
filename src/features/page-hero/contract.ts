import type { PortableTextNode } from "../../shared/portable-text";

export const PAGE_HERO_BLOCK_TYPE = "dinkus.page-hero";

export interface PageHeroNode extends PortableTextNode {
	_type?: "dinkus.page-hero";
	eyebrow?: string;
	headline?: string;
	deck?: string;
	primaryLabel?: string;
	primaryHref?: string;
	secondaryLabel?: string;
	secondaryHref?: string;
}
