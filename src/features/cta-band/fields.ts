import type { Element } from "@emdash-cms/blocks";

export const ctaBandFields = [
	{
		type: "text_input",
		action_id: "eyebrow",
		label: "Eyebrow",
	},
	{
		type: "text_input",
		action_id: "heading",
		label: "Heading",
	},
	{
		type: "text_input",
		action_id: "body",
		label: "Body",
		multiline: true,
	},
	{
		type: "text_input",
		action_id: "ctaLabel",
		label: "CTA label",
	},
	{
		type: "text_input",
		action_id: "ctaHref",
		label: "CTA URL",
		placeholder: "/contact",
	},
] satisfies Element[];
