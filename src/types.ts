import type { PortableTextNode } from "./shared/portable-text";

export type { CtaBandNode } from "./features/cta-band";
export type { GalleryHeroNode } from "./features/gallery-hero";
export type { PageHeroNode } from "./features/page-hero";
export type { PortableTextNode } from "./shared/portable-text";

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

export interface ProjectRecordLink {
	_key?: string;
	label?: string;
	href?: string;
}

type FieldAnnotationValue = string | number | boolean;

export type FieldAnnotationAttributes = Partial<
	Record<`data-${string}`, FieldAnnotationValue>
> & {
	[K in `data-dinkus-${string}` | `data-astro-${string}`]?: never;
} & {
	"data-project-record"?: never;
};

export interface ProjectRecordLinkAnnotation {
	label?: FieldAnnotationAttributes;
	href?: FieldAnnotationAttributes;
}

export interface ProjectRecordAnnotations {
	category?: FieldAnnotationAttributes;
	title?: FieldAnnotationAttributes;
	summary?: FieldAnnotationAttributes;
	statusKicker?: FieldAnnotationAttributes;
	status?: FieldAnnotationAttributes;
	roleKicker?: FieldAnnotationAttributes;
	roleHeadline?: FieldAnnotationAttributes;
	roleBody?: FieldAnnotationAttributes;
	evidenceKicker?: FieldAnnotationAttributes;
	proofHeadline?: FieldAnnotationAttributes;
	evidence?: FieldAnnotationAttributes;
	nextTitle?: FieldAnnotationAttributes;
	nextKicker?: FieldAnnotationAttributes;
	links?: ProjectRecordLinkAnnotation[];
}

export interface ProjectRecordNode extends PortableTextNode {
	_type?: "dinkus.project-record";
	recordId?: string;
	category?: string;
	title?: string;
	summary?: string;
	identityImage?: string;
	identityAlt?: string;
	statusKicker?: string;
	status?: string;
	roleKicker?: string;
	roleHeadline?: string;
	roleBody?: string;
	evidenceKicker?: string;
	proofHeadline?: string;
	evidence?: string;
	links?: ProjectRecordLink[];
	nextKicker?: string;
	nextTitle?: string;
	nextHref?: string;
}
