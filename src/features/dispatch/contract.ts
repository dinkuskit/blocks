import type { PortableTextNode } from "../../shared/portable-text";

export const DISPATCH_BLOCK_TYPE = "dinkus.dispatch";

export interface DispatchNode extends PortableTextNode {
	_type?: "dinkus.dispatch";
	kicker?: string;
	title?: string;
	body?: string;
	ctaLabel?: string;
	ctaHref?: string;
	phone?: string;
	email?: string;
}

