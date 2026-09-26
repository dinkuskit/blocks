import CtaBandComponent from "../features/cta-band/renderer.astro";
import FactRailComponent from "../features/fact-rail/renderer.astro";
import GalleryHeroComponent from "../features/gallery-hero/renderer.astro";
import PageHeroComponent from "../features/page-hero/renderer.astro";
import SectionHeaderComponent from "../features/section-header/renderer.astro";
import LedgerCardsComponent from "../features/ledger-cards/renderer.astro";
import GalleryLanesComponent from "../features/gallery-lanes/renderer.astro";
import SearchBoardComponent from "../features/search-board/renderer.astro";
import DispatchComponent from "../features/dispatch/renderer.astro";
import ServiceAreaMapComponent from "../features/service-area-map/renderer.astro";
import ProjectRecordComponent from "../features/project-record/renderer.astro";
import QueryCardComponent from "../features/query-card/renderer.astro";

export { CtaBandComponent as CtaBand };
export { DispatchComponent as Dispatch };
export { FactRailComponent as FactRail };
export { GalleryHeroComponent as GalleryHero };
export { GalleryLanesComponent as GalleryLanes };
export { LedgerCardsComponent as LedgerCards };
export { PageHeroComponent as PageHero };
export { ProjectRecordComponent as ProjectRecord };
export { QueryCardComponent as QueryCard };
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
	"dinkus.query-card": QueryCardComponent,
} as const;
