import type { PortableTextNode } from "../../shared/portable-text";

export const GALLERY_LANES_BLOCK_TYPE = "dinkus.gallery-lanes";

export interface GalleryLane {
	_key?: string;
	label?: string;
	meta?: string;
	href?: string;
	image?: string;
}

export interface GalleryLanesNode extends PortableTextNode {
	_type?: "dinkus.gallery-lanes";
	lanes?: GalleryLane[];
}

