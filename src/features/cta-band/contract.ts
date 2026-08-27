import type { PortableTextNode } from "../../shared/portable-text";

export const CTA_BAND_BLOCK_TYPE = "dinkus.cta-band";

export interface CtaBandNode extends PortableTextNode {
	_type?: "dinkus.cta-band";
	eyebrow?: string;
	heading?: string;
	body?: string;
	ctaLabel?: string;
	ctaHref?: string;
}
