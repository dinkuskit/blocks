import {
	configureDinkusBlockRuntime,
	configureDinkusUrlPolicy,
} from "@dinkuskit/blocks";

/**
 * Site-level hardening policy for the acceptance fixture: approved external
 * hosts for navigation and media, and a site id stamped onto structured
 * render-guard logs. Imported for its side effect by the public pages.
 */
configureDinkusUrlPolicy({
	navigationExternalHosts: ["partner.dinkuskit.example"],
	mediaHosts: ["media.dinkuskit.example"],
});

configureDinkusBlockRuntime({ siteId: "blocks-fixture" });
