import type { Element } from "@emdash-cms/blocks";

export const galleryHeroFields = [
	{
		type: "media_picker",
		action_id: "image",
		label: "Hero image",
	},
	{
		type: "text_input",
		action_id: "imageAlt",
		label: "Image alt text",
	},
	{
		type: "text_input",
		action_id: "eyebrow",
		label: "Eyebrow",
	},
	{
		type: "text_input",
		action_id: "headline",
		label: "Headline",
	},
	{
		type: "text_input",
		action_id: "deck",
		label: "Deck",
		multiline: true,
	},
	{
		type: "text_input",
		action_id: "primaryLabel",
		label: "Primary CTA label",
	},
	{
		type: "text_input",
		action_id: "primaryHref",
		label: "Primary CTA URL",
		placeholder: "/contact",
	},
	{
		type: "text_input",
		action_id: "secondaryLabel",
		label: "Secondary link label",
	},
	{
		type: "text_input",
		action_id: "secondaryHref",
		label: "Secondary link URL",
		placeholder: "/work",
	},
] satisfies Element[];
