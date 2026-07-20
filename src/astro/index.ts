import CtaBandComponent from "./CtaBand.astro";

export { CtaBandComponent as CtaBand };

export const blockComponents = {
	"dinkus.cta-band": CtaBandComponent,
} as const;
