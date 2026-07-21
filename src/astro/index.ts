import CtaBandComponent from "./CtaBand.astro";
import DispatchComponent from "./Dispatch.astro";
import FactRailComponent from "./FactRail.astro";
import GalleryHeroComponent from "./GalleryHero.astro";
import GalleryLanesComponent from "./GalleryLanes.astro";
import LedgerCardsComponent from "./LedgerCards.astro";
import PageHeroComponent from "./PageHero.astro";
import ProjectRecordComponent from "./ProjectRecord.astro";
import SearchBoardComponent from "./SearchBoard.astro";
import SectionHeaderComponent from "./SectionHeader.astro";
import ServiceAreaMapComponent from "./ServiceAreaMap.astro";

export { CtaBandComponent as CtaBand };
export { DispatchComponent as Dispatch };
export { FactRailComponent as FactRail };
export { GalleryHeroComponent as GalleryHero };
export { GalleryLanesComponent as GalleryLanes };
export { LedgerCardsComponent as LedgerCards };
export { PageHeroComponent as PageHero };
export { ProjectRecordComponent as ProjectRecord };
export { SearchBoardComponent as SearchBoard };
export { SectionHeaderComponent as SectionHeader };
export { ServiceAreaMapComponent as ServiceAreaMap };

export const blockComponents = {
	"dinkus.cta-band": CtaBandComponent,
	"dinkus.page-hero": PageHeroComponent,
	"dinkus.project-record": ProjectRecordComponent,
	"dinkus.section-header": SectionHeaderComponent,
	"dinkus.fact-rail": FactRailComponent,
	"dinkus.gallery-hero": GalleryHeroComponent,
	"dinkus.ledger-cards": LedgerCardsComponent,
	"dinkus.gallery-lanes": GalleryLanesComponent,
	"dinkus.search-board": SearchBoardComponent,
	"dinkus.service-area-map": ServiceAreaMapComponent,
	"dinkus.dispatch": DispatchComponent,
} as const;
