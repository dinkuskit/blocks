import type { PortableTextNode } from "../../shared/portable-text";

export const PROJECT_RECORD_BLOCK_TYPE = "dinkus.project-record";

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
