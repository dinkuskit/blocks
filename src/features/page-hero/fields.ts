import type { Element } from "@emdash-cms/blocks";

export const pageHeroFields = [
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
		label: "Secondary CTA label",
	},
	{
		type: "text_input",
		action_id: "secondaryHref",
		label: "Secondary CTA URL",
		placeholder: "/about",
	},
] satisfies Element[];
