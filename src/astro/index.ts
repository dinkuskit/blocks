import CtaBandComponent from "./CtaBand.astro";
import FactRailComponent from "./FactRail.astro";
import GalleryHeroComponent from "./GalleryHero.astro";
import GalleryLanesComponent from "./GalleryLanes.astro";
import LedgerCardsComponent from "./LedgerCards.astro";
import PageHeroComponent from "./PageHero.astro";
import SectionHeaderComponent from "./SectionHeader.astro";

export { CtaBandComponent as CtaBand };
export { FactRailComponent as FactRail };
export { GalleryHeroComponent as GalleryHero };
export { GalleryLanesComponent as GalleryLanes };
export { LedgerCardsComponent as LedgerCards };
export { PageHeroComponent as PageHero };
export { SectionHeaderComponent as SectionHeader };

export const blockComponents = {
	"dinkus.cta-band": CtaBandComponent,
	"dinkus.page-hero": PageHeroComponent,
	"dinkus.section-header": SectionHeaderComponent,
	"dinkus.fact-rail": FactRailComponent,
	"dinkus.gallery-hero": GalleryHeroComponent,
	"dinkus.ledger-cards": LedgerCardsComponent,
	"dinkus.gallery-lanes": GalleryLanesComponent,
} as const;
