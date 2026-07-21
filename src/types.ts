export interface PortableTextNode {
	_type?: string;
	_key?: string;
}

export interface CtaBandNode extends PortableTextNode {
	_type?: "dinkus.cta-band";
	eyebrow?: string;
	heading?: string;
	body?: string;
	ctaLabel?: string;
	ctaHref?: string;
}

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

export interface SectionHeaderNode extends PortableTextNode {
	_type?: "dinkus.section-header";
	number?: string;
	kicker?: string;
	title?: string;
	intro?: string;
}

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
