import type { PortableTextNode } from "../../shared/portable-text";

export const FACT_RAIL_BLOCK_TYPE = "dinkus.fact-rail";

export interface FactItem {
	_key?: string;
	label?: string;
	value?: string;
	icon?: string;
}

export interface FactRailNode extends PortableTextNode {
	_type?: "dinkus.fact-rail";
	ariaLabel?: string;
	facts?: FactItem[];
}
