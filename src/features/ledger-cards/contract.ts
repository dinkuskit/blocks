import type { PortableTextNode } from "../../shared/portable-text";

export const LEDGER_CARDS_BLOCK_TYPE = "dinkus.ledger-cards";

export interface LedgerCard {
	_key?: string;
	code?: string;
	title?: string;
	body?: string;
	ctaLabel?: string;
	ctaHref?: string;
}

export interface LedgerCardsNode extends PortableTextNode {
	_type?: "dinkus.ledger-cards";
	cards?: LedgerCard[];
}
