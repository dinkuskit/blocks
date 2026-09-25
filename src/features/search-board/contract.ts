import type { PortableTextNode } from "../../shared/portable-text";

export const SEARCH_BOARD_BLOCK_TYPE = "dinkus.search-board";

export interface SearchLink {
	_key?: string;
	label?: string;
	href?: string;
}

export interface SearchBoardNode extends PortableTextNode {
	_type?: "dinkus.search-board";
	number?: string;
	kicker?: string;
	title?: string;
	intro?: string;
	links?: SearchLink[];
}

