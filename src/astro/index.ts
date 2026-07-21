import CtaBandComponent from "./CtaBand.astro";
import FactRailComponent from "./FactRail.astro";
import PageHeroComponent from "./PageHero.astro";
import SectionHeaderComponent from "./SectionHeader.astro";

export { CtaBandComponent as CtaBand };
export { FactRailComponent as FactRail };
export { PageHeroComponent as PageHero };
export { SectionHeaderComponent as SectionHeader };

export const blockComponents = {
	"dinkus.cta-band": CtaBandComponent,
	"dinkus.page-hero": PageHeroComponent,
	"dinkus.section-header": SectionHeaderComponent,
	"dinkus.fact-rail": FactRailComponent,
} as const;
