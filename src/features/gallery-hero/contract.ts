import type { PortableTextNode } from "../../shared/portable-text";

export const GALLERY_HERO_BLOCK_TYPE = "dinkus.gallery-hero";

export interface GalleryHeroNode extends PortableTextNode {
	_type?: "dinkus.gallery-hero";
	image?: string;
	imageAlt?: string;
	eyebrow?: string;
	headline?: string;
	deck?: string;
	primaryLabel?: string;
	primaryHref?: string;
	secondaryLabel?: string;
	secondaryHref?: string;
}
