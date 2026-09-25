import type { PortableTextNode } from "../../shared/portable-text";

export const SERVICE_AREA_MAP_BLOCK_TYPE = "dinkus.service-area-map";

export interface LegendEntry {
	_key?: string;
	label?: string;
	icon?: string;
}

export interface ServiceAreaMapNode extends PortableTextNode {
	_type?: "dinkus.service-area-map";
	image?: string;
	imageAlt?: string;
	caption?: string;
	legend?: LegendEntry[];
}

